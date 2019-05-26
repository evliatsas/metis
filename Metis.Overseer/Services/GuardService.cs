﻿using Metis.Core.Entities;
using Metis.Guard;
using Metis.Guard.Entities;
using Metis.Overseer.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using MongoDB.Driver;
using Serilog;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Metis.Overseer.Services
{
    public class GuardService : IHostedService, IDisposable
    {
        private readonly IMongoClient _mongoClient;
        private readonly IEmailService _emailService;
        private readonly IHubContext<GuardHub> _guardHubContext;
        private readonly string _connectionString;
        private readonly ConcurrentDictionary<string, Watcher> _guards;

        public IEnumerable<Watcher> Watchers { get { return _guards.Values; } }

        public GuardService(IMongoClient mongoClient, IHubContext<GuardHub> guardHubContext, IConfiguration config, IEmailService emailService)
        {
            _mongoClient = mongoClient;
            _guardHubContext = guardHubContext;
            _connectionString = config.GetConnectionString("Metis");
            _guards = new ConcurrentDictionary<string, Watcher>();
            _emailService = emailService;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            Task.Run(() => startGuards());
            Log.Debug("guard service successfully started");
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            Dispose();
            return Task.CompletedTask;
        }

        public void StartGuard(string siteId)
        {
            var exists = _guards.ContainsKey(siteId);
            if (exists)
            {
                Watcher watcher;
                _guards.TryGetValue(siteId, out watcher);
                watcher.Start();
            }
            else
            {
                var config = new Configuration() { UiD = siteId, ConnectionString = _connectionString };
                var watcher = new Watcher(config, _mongoClient);
                watcher.SiteStatusChanged += Watcher_SiteStatusChanged;
                watcher.SiteException += Watcher_SiteException;
                watcher.Start();

                _guards.TryAdd(siteId, watcher);
            }
        }

        public void StopGuard(string siteId)
        {
            var exists = _guards.ContainsKey(siteId);
            if (exists)
            {
                Watcher watcher;
                _guards.TryGetValue(siteId, out watcher);
                watcher.Stop();
            }
            else
            {
                throw new KeyNotFoundException("This site is not being watched by the guard service.");
            }
        }

        public async Task RefreshSite(string siteId)
        {
            var exists = _guards.ContainsKey(siteId);
            if (exists)
            {
                Watcher watcher;
                _guards.TryGetValue(siteId, out watcher);
                watcher.Stop();
                await watcher.TakeSnapshot();
                watcher.Start();
            }
            else
            {
                throw new KeyNotFoundException("This site is not being watched by the guard service.");
            }
        }

        public async Task StartMaintenance(string siteId)
        {
            var exists = _guards.ContainsKey(siteId);
            if (exists)
            {
                Watcher watcher;
                _guards.TryGetValue(siteId, out watcher);
                await watcher.StartMaintenance();
            }
            else
            {
                throw new KeyNotFoundException("This site is not being watched by the guard service.");
            }
        }

        public async Task EndMaintenance(string siteId)
        {
            var exists = _guards.ContainsKey(siteId);
            if (exists)
            {
                Watcher watcher;
                _guards.TryGetValue(siteId, out watcher);
                await watcher.CompleteMaintenance();
            }
            else
            {
                throw new KeyNotFoundException("This site is not being watched by the guard service.");
            }
        }

        private async Task startGuards()
        {
            var siteIds = await getSitesFromDb();

            Parallel.ForEach(siteIds, (siteId) =>
            {
                var config = new Configuration() { UiD = siteId, ConnectionString = _connectionString };
                var watcher = new Watcher(config, _mongoClient);
                watcher.SiteStatusChanged += Watcher_SiteStatusChanged;
                watcher.SiteException += Watcher_SiteException;
                watcher.Start();

                _guards.TryAdd(siteId, watcher);

                Log.Debug("watcher of site {name} started.", watcher.Site.Name);
            });
        }

        private void Watcher_SiteException(object sender, SiteExceptionEventArgs e)
        {
            Log.Error(e.Exception, "Exception while watching site {@name} {@id} page {@title} {@uri}",
                e.Site.Name, e.Site.Id, e.Page.Title, e.Page.Uri);

            var message = GuardHub._CreateMessage(e);
            Task.Run(() => _guardHubContext.Clients.All.SendAsync("SiteGuardingException", message));
        }

        private void Watcher_SiteStatusChanged(object sender, SiteStatusEventArgs e)
        {
            Log.Information("Status changed for site {@name} {@id} from {@previous} to {@status}",
                e.Site.Name, e.Site.Id, e.PreviousStatus, e.Site.Status);

            var message = GuardHub._CreateMessage(e);

            Task.Run(() => _guardHubContext.Clients.All.SendAsync("SiteStatusChanged", message));

            if (e.Site.Status != e.PreviousStatus)
            {
                _emailService.Send(new EmailMessage()
                {
                    Content = $"Status changed for site {e.Site.Name} {e.Site.Id} from {e.PreviousStatus} to {e.Site.Status}",
                    FromAddress = new EmailAddress("metis", "metis@ypes.gr"),
                    ToAddresses = e.Site.EmailAddresses,
                    Subject = "Κατάσταση Ιστοσελίδας"
                });
            }
        }

        private async Task<IEnumerable<string>> getSitesFromDb()
        {
            var database = _mongoClient.GetDatabase("metis");
            var siteCollection = database.GetCollection<Site>("sites");
            var sites = await siteCollection.Find(x => true)
                .Project<Site>(Builders<Site>.Projection.Include(x => x.Id))
                .ToListAsync();

            return sites.Select(x => x.Id);
        }

        public void Dispose()
        {
            // cleanup statements...
            foreach (var watcher in _guards.Values)
            {
                watcher.Stop();
                watcher.SiteStatusChanged -= Watcher_SiteStatusChanged;
                watcher.SiteException -= Watcher_SiteException;

                Log.Debug("watcher of site {id} safely stopped.", watcher.Site.Id);
            }
            Log.Debug("guard service safely disposed");
        }
    }
}
