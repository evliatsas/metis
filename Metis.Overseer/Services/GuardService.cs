using Metis.Guard;
using Metis.Guard.Entities;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using Serilog;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Metis.Overseer.Services
{
    public class GuardService
    {
        private readonly string _connectionString;
        private readonly ConcurrentDictionary<string, Watcher> _guards;

        public IEnumerable<Watcher> Watchers { get { return _guards.Values; } }

        public GuardService(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("Metis");
            _guards = new ConcurrentDictionary<string, Watcher>();

            Task.Run(() => startGuards());
        }

        ~GuardService()  // finalizer
        {
            // cleanup statements...
            foreach(var watcher in _guards.Values)
            {
                watcher.Stop();
                watcher.SiteStatusChanged -= Watcher_SiteStatusChanged;
                watcher.SiteException -= Watcher_SiteException;
            }
        }

        public void StartGuard(string siteId)
        {
            var exists = _guards.ContainsKey(siteId);
            if(exists)
            {
                Watcher watcher;
                _guards.TryGetValue(siteId, out watcher);
                watcher.Start();
            }
            else
            {
                var config = new Configuration() { UiD = siteId, ConnectionString = _connectionString };
                var watcher = new Watcher(config);
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

        public void StartMaintenance(string siteId)
        {
            var exists = _guards.ContainsKey(siteId);
            if (exists)
            {
                Watcher watcher;
                _guards.TryGetValue(siteId, out watcher);
                var tasks = new List<Task>() { Task.Run(() => watcher.StartMaintenance()) };
                Task.WaitAll(tasks.ToArray());
            }
            else
            {
                throw new KeyNotFoundException("This site is not being watched by the guard service.");
            }
        }

        public void EndMaintenance(string siteId)
        {
            var exists = _guards.ContainsKey(siteId);
            if (exists)
            {
                Watcher watcher;
                _guards.TryGetValue(siteId, out watcher);
                watcher.CompleteMaintenance();
            }
            else
            {
                throw new KeyNotFoundException("This site is not being watched by the guard service.");
            }
        }

        private async Task startGuards()
        {
            var siteIds = await getSitesFromDb();

            Parallel.ForEach(siteIds, (siteId) => {
                var config = new Configuration() { UiD = siteId, ConnectionString = _connectionString };
                var watcher = new Watcher(config);
                watcher.SiteStatusChanged += Watcher_SiteStatusChanged;
                watcher.SiteException += Watcher_SiteException;
                watcher.Start();

                _guards.TryAdd(siteId, watcher);
            });
        }

        private void Watcher_SiteException(object sender, SiteExceptionEventArgs e)
        {
            Log.Error(e.Exception, "Exception while watching site {@name} {@id} page {@title} {@uri}", 
                e.Site.Name, e.Site.Id, e.Page.Title, e.Page.Uri);
        }

        private void Watcher_SiteStatusChanged(object sender, SiteStatusEventArgs e)
        {
            var site = e.Site;
            var s = e.PreviousStatus;

            Log.Information("Status changed for site {@name} {@id} from {@previous} to {@status}", e.Site.Name, e.Site.Id, e.PreviousStatus, e.Site.Status);
        }

        private async Task<IEnumerable<string>> getSitesFromDb()
        {
            var client = new MongoClient(_connectionString);
            var database = client.GetDatabase("metis");
            var siteCollection = database.GetCollection<Site>("sites");
            var sites = await siteCollection.Find(x=>true)
                .Project<Site>(Builders<Site>.Projection.Include(x=>x.Id))
                .ToListAsync();

            return sites.Select(x => x.Id);
        }
    }
}
