using Metis.Guard.Entities;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Metis.Guard
{
    /// <summary>
    /// Watcher is responsible for guarding each individual Page
    /// in the Site and report any Incidents
    /// </summary>
    public class Watcher
    {
        private Site _site;
        private readonly string _connectionString;
        private readonly Encoding _encoding;
        private readonly Dictionary<string, PageMonitor> _pageMonitors; 
                
        public Watcher(Configuration configuration)
        {           
            var task = Task.Run(async () => await readSiteFromDb(configuration));
            task.Wait();
            if (this._site == null)
            {
                //throw site not found in db exception
            }

            this._connectionString = configuration.ConnectionString;
            this._encoding = Encoding.GetEncoding(_site.EncodingCode);
            this._pageMonitors = new Dictionary<string, PageMonitor>();
        }

        /// <summary>
        /// Start Watching the Pages of the Site for content changes
        /// </summary>
        public void Start()
        {
            foreach (var page in _site.Pages)
            {
                var pageMonitor = new PageMonitor(page, _encoding);
                this._pageMonitors.Add(page.Uri, pageMonitor);                
            }
        }

        /// <summary>
        /// Stop Watching the Pages of the Site for content changes
        /// </summary>
        public void Stop()
        {
            foreach(var monitor in this._pageMonitors.Values)
            {
                monitor.CancellationTokenSource.Cancel();
            }

            this._pageMonitors.Clear();
        }

        /// <summary>
        /// Take a snapshot of the Pages of the Site and upadate the Database
        /// </summary>
        public async Task TakeSnapshot()
        {
            foreach (var page in _site.Pages)
            {
                var monitor = this._pageMonitors[page.Uri];
                var snapshot = await monitor.TakeSnapshot(page);

                await writeLastKnownImage(snapshot);
            }
        }

        // read the stored site data from the database
        private async Task readSiteFromDb(Configuration configuration)
        {
            var client = new MongoClient(configuration.ConnectionString);
            var database = client.GetDatabase("metis");
            var siteCollection = database.GetCollection<Site>("sites");
            var query = await siteCollection.FindAsync(Builders<Site>.Filter.Eq(x => x.Id, configuration.UiD));
            this._site = await query.SingleOrDefaultAsync();
        }

        // update the site page data in the database
        private async Task writeLastKnownImage(Page page)
        {
            var client = new MongoClient(_connectionString);
            var database = client.GetDatabase("metis");
            var siteCollection = database.GetCollection<Site>("sites");
            await siteCollection.FindOneAndUpdateAsync(s => s.Id == _site.Id && s.Pages.Any(p => p.Uri == page.Uri),
                Builders<Site>.Update.Set(s=>s.Pages.ElementAt(-1), page));
        }
    }
}
