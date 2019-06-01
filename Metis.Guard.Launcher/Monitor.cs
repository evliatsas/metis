using Metis.Guard.Entities;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Metis.Guard.Launcher
{
    public class Monitor : IDisposable
    {

        private Timer _timer;
        private readonly string _siteId;
        private readonly int _refreshInterval;
        private readonly MongoClient _mongoClient;

        public Monitor(string siteId, int refreshInterval, MongoClient client)
        {
            _siteId = siteId;
            _refreshInterval = refreshInterval;
            _mongoClient = client;
        }

        public void Start()
        {
            _timer = new Timer(Execute, null, TimeSpan.Zero,
               TimeSpan.FromSeconds(_refreshInterval));
        }

        public void Stop()
        {
            _timer?.Change(Timeout.Infinite, 0);
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }

        private void Execute(object state)
        {
            var site = getSite(_siteId);
            var monitorTasks = new List<Task>();
            foreach (var page in site.Pages)
            {
                monitorTasks.Add(monitor(site, page));
            }
            Task.WaitAll(monitorTasks.ToArray());

            if (site.Pages.All(x => x.Status == Status.Ok))
                site.Status = Status.Ok;
            else
                site.Status = Status.Alarm;

            var updateTask = updateSiteStatus(site);
            updateTask.Wait();
            Console.WriteLine($"Site {site.Name} status is {site.Status}");
        }

        private Site getSite(string siteId)
        {
            var database = _mongoClient.GetDatabase("metis");
            var siteCollection = database.GetCollection<Site>("sites");
            var task = siteCollection.Find(x => x.Id == siteId)
                .SingleOrDefaultAsync();
            task.Wait();
            var site = task.Result;

            return site;
        }

        private async Task updateSitePage(string siteId, Page page)
        {
            var filter = Builders<Site>.Filter;
            var siteIdAndPageIdFilter = filter.And(
              filter.Eq(x => x.Id, siteId),
              filter.ElemMatch(x => x.Pages, c => c.Uri == page.Uri));

            var update = Builders<Site>.Update;
            var pageStatusSetter = update.Set("pages.$", page);

            var database = _mongoClient.GetDatabase("metis");
            var siteCollection = database.GetCollection<Site>("sites");
            await siteCollection.UpdateOneAsync(siteIdAndPageIdFilter, pageStatusSetter);
        }

        private async Task updateSiteStatus(Site site)
        {
            var database = _mongoClient.GetDatabase("metis");
            var siteCollection = database.GetCollection<Site>("sites");
            await siteCollection.FindOneAndUpdateAsync(s => s.Id == site.Id,
                Builders<Site>.Update.Set(s => s.Status, site.Status));
        }

        private async Task monitor(Site site, Page page)
        {
            var encoding = Encoding.GetEncoding(site.EncodingCode);
            var pageMonitor = new Metis.Guard.PageMonitor();
            var content = await pageMonitor.ParsePage(site, page);

            if (string.IsNullOrEmpty(content))
            {
                return;
            }

            var md5 = Metis.Guard.Utilities.CreateMD5(content, encoding);

            //if it is a new page
            if (string.IsNullOrEmpty(page.MD5Hash))
            {
                //initialize the md5 hash of the content to the current one
                page.MD5Hash = md5;
                page.Status = Status.Ok;
                await updateSitePage(_siteId, page);
            }
            else if (string.Equals(page.MD5Hash, md5))
            {
                if (page.Status != Status.Ok)
                {
                    page.Status = Status.Ok;
                    await updateSitePage(_siteId, page);
                }
            }
            else
            {
                if (page.Status != Status.Alarm)
                {
                    page.Status = Status.Alarm;
                    await updateSitePage(_siteId, page);
                }
            }

            Console.WriteLine($"Page {page.Uri} status is {page.Status}");
        }
    }
}
