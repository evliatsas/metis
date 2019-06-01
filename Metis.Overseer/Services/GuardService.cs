using Metis.Guard;
using Metis.Guard.Entities;
using Metis.Overseer.Hubs;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;
using Serilog;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Metis.Overseer.Services
{
    public class GuardService
    {
        private readonly IMongoClient _mongoClient;
        private readonly IHubContext<GuardHub> _guardHubContext;

        public GuardService(IMongoClient mongoClient, IHubContext<GuardHub> guardHubContext)
        {
            _mongoClient = mongoClient;
            _guardHubContext = guardHubContext;
        }

        /// <summary>
        /// Capture a Snapshot of the Page content
        /// </summary>
        /// <param name="siteId">The Id of the site to refresh page content</param>
        /// <returns></returns>
        public async Task RefreshSite(string siteId)
        {
            try
            {
                var site = await getSite(siteId);
                if (site != null)
                {
                    var previousSiteStatus = site.Status;
                    await takeSnapshot(site);

                    var message = new SiteEvent
                    {
                        SiteId = site.Id,
                        Name = site.Name,
                        CurrentStatus = site.Status.ToString(),
                        PreviousStatus = previousSiteStatus.ToString(),
                        Message = $"Site {site.Name} refresh has been requested",
                        Happened = DateTime.Now
                    };

                    await sendMessage(message);
                }
                else
                {
                    Log.Error("This site {@id} is not being watched by the guard service.", siteId);
                }
            }
            catch(Exception exception)
            {
                Log.Error(exception, "Exception while refreshing site {@id}", siteId);
            }
        }

        public async Task StartMaintenance(string siteId)
        {
            try
            {
                var site = await getSite(siteId);                
                if (site != null)
                {
                    var previousSiteStatus = site.Status;
                    foreach (var page in site.Pages)
                    {
                        page.MD5Hash = string.Empty;
                        page.Status = Status.Maintenance;
                    }
                    site.Status = Status.Maintenance;

                    await updateSite(site);

                    var message = new SiteEvent
                    {
                        SiteId = site.Id,
                        Name = site.Name,
                        CurrentStatus = site.Status.ToString(),
                        PreviousStatus = previousSiteStatus.ToString(),
                        Message = $"Start maintenance for Site {site.Name} has been requested",
                        Happened = DateTime.Now
                    };

                    await sendMessage(message);
                }
                else
                {
                    Log.Error("This site {@id} is not being watched by the guard service.", siteId);
                }
            }
            catch (Exception exception)
            {
                Log.Error(exception, "Exception while starting maintenance for site {@id}", siteId);
            }
        }

        public async Task EndMaintenance(string siteId)
        {
            try
            {
                var site = await getSite(siteId);
                if (site != null)
                {
                    var previousSiteStatus = site.Status;
                    await takeSnapshot(site);

                    var message = new SiteEvent
                    {
                        SiteId = site.Id,
                        Name = site.Name,
                        CurrentStatus = site.Status.ToString(),
                        PreviousStatus = previousSiteStatus.ToString(),
                        Message = $"End of maintenance for Site {site.Name} has been requested",
                        Happened = DateTime.Now
                    };

                    await sendMessage(message);
                }
                else
                {
                    Log.Error("This site {@id} is not being watched by the guard service.", siteId);
                }
            }
            catch (Exception exception)
            {
                Log.Error(exception, "Exception while ending maintenance for site {@id}", siteId);
            }
        }

        public async Task<IEnumerable<Site>> GetSitesFromDb()
        {
            var database = _mongoClient.GetDatabase("metis");
            var siteCollection = database.GetCollection<Site>("sites");
            var sites = await siteCollection.Find(x => true)
                .ToListAsync();

            return sites;
        }

        private async Task<Site> getSite(string siteId)
        {
            var database = _mongoClient.GetDatabase("metis");
            var siteCollection = database.GetCollection<Site>("sites");
            var site = await siteCollection.Find(x => x.Id == siteId)
                .SingleOrDefaultAsync();

            return site;
        }

        private async Task updateSite(Site site)
        {
            var database = _mongoClient.GetDatabase("metis");
            var siteCollection = database.GetCollection<Site>("sites");
            await siteCollection.ReplaceOneAsync<Site>(x => x.Id == site.Id, site);
        }

        private async Task sendMessage(SiteEvent message)
        {
            await _guardHubContext.Clients.All.SendAsync("SiteStatusChanged", message);
            var db = _mongoClient.GetDatabase("metis");
            var siteEvents = db.GetCollection<SiteEvent>("siteEvents");
            await siteEvents.InsertOneAsync(message);
        }

        private async Task takeSnapshot(Site site)
        {
            var pageMonitor = new PageMonitor();
            foreach (var page in site.Pages)
            {
                var content = await pageMonitor.ParsePage(site, page);
                var encoding = Encoding.GetEncoding(site.EncodingCode);
                var md5 = Metis.Guard.Utilities.CreateMD5(content, encoding);

                page.MD5Hash = md5;
                page.Status = Status.Ok;
            }
            site.Status = Status.Ok;

            await updateSite(site);
        }
    }
}
