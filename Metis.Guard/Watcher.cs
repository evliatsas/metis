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
                var monitor = new PageMonitor(page, _encoding);
                monitor.Start();
                // subscribe to the event handlers
                monitor.PageNotFound += Monitor_PageNotFound;
                monitor.PageParseException += Monitor_PageParseException;
                monitor.PageStatusChanged += Monitor_PageStatusChanged;
                // keep a reference to the monitor
                this._pageMonitors.Add(page.Uri, monitor);                
            }
        }

        /// <summary>
        /// Stop Watching the Pages of the Site for content changes
        /// </summary>
        public void Stop()
        {
            foreach(var monitor in this._pageMonitors.Values)
            {
                // stop running threads
                if(monitor.MonitorStatus == WorkerStatus.Running)
                {
                    monitor.Stop();
                }
               
                // unsubscribe from the event handlers
                monitor.PageNotFound -= Monitor_PageNotFound;
                monitor.PageParseException -= Monitor_PageParseException;
                monitor.PageStatusChanged -= Monitor_PageStatusChanged;
            }

            // release the reference to the monitor instances
            this._pageMonitors.Clear();
        }

        /// <summary>
        /// Stop monitoring the site pages until the complete maintenance is called
        /// Updates the site overall status to Maintenance
        /// </summary>
        /// <returns></returns>
        public async Task StartMaintenance()
        {
            foreach (var monitor in this._pageMonitors.Values)
            {
                // stop running threads
                if (monitor.MonitorStatus == WorkerStatus.Running)
                {
                    monitor.Stop();
                }
            }
            foreach (var page in _site.Pages)
            {
                page.Status = Status.Maintenance;
                await updateSitePage(page);
            }

            if (_site.Status != Status.Maintenance)
            {
                var previousStatus = _site.Status;
                _site.Status = Status.Maintenance;
                var args = new SiteStatusEventArgs(_site, previousStatus);
                OnSiteStatusChanged(args);
            }
        }

        /// <summary>
        /// Resumes monitoring the site pages after maintenance is complete
        /// </summary>
        /// <returns></returns>
        public void CompleteMaintenance()
        {            
            foreach (var monitor in this._pageMonitors.Values)
            {
                if (monitor.MonitorStatus != WorkerStatus.Running)
                {
                    monitor.Start();
                }
            }
        }

        /// <summary>
        /// Take a snapshot of the Pages of the Site and upadate the Database
        /// </summary>
        public async Task TakeSnapshot()
        {
            if(_site == null)
            {
                return;   
            }

            foreach (var page in _site.Pages)
            {
                var monitor = this._pageMonitors[page.Uri];
                var snapshot = await monitor.TakeSnapshot(page);

                await updateSitePage(snapshot);
            }
        }

        #region Data Adapters

        /// <summary>
        /// read the stored site data from the database
        /// </summary>
        /// <param name="configuration">The configration containing the connection string</param>
        private async Task readSiteFromDb(Configuration configuration)
        {
            var client = new MongoClient(configuration.ConnectionString);
            var database = client.GetDatabase("metis");
            var siteCollection = database.GetCollection<Site>("sites");
            var query = await siteCollection.FindAsync(Builders<Site>.Filter.Eq(x => x.Id, configuration.UiD));
            this._site = await query.SingleOrDefaultAsync();
        }

        /// <summary>
        /// update the site page data in the database
        /// </summary>
        /// <param name="page">The page to update</param>
        private async Task updateSitePage(Page page)
        {
            var client = new MongoClient(_connectionString);
            var database = client.GetDatabase("metis");
            var siteCollection = database.GetCollection<Site>("sites");
            await siteCollection.FindOneAndUpdateAsync(s => s.Id == _site.Id && s.Pages.Any(p => p.Uri == page.Uri),
                Builders<Site>.Update.Set(s=>s.Pages.ElementAt(-1), page));
        }

        /// <summary>
        /// update the site status in the database
        /// </summary>
        /// <param name="site">The site to update</param>
        private async Task updateSiteStatus(Site site)
        {
            var client = new MongoClient(_connectionString);
            var database = client.GetDatabase("metis");
            var siteCollection = database.GetCollection<Site>("sites");
            await siteCollection.FindOneAndUpdateAsync(s => s.Id == _site.Id, 
                Builders<Site>.Update.Set(s => s.Status, site.Status));
        }

        #endregion

        #region Events

        /// <summary>
        /// Raised whenever the site pages cannot be properly monitored
        /// </summary>
        public event SiteMonitorExceptionEventHandler SiteException;
        /// <summary>
        /// Raised when the site current overall status changed
        /// </summary>
        public event SiteStatusChangedEventHandler SiteStatusChanged;

        protected void OnSiteException(SiteExceptionEventArgs e)
        {
            SiteException?.Invoke(this, e);

            // TODO log the exception
        }

        protected void OnSiteStatusChanged(SiteStatusEventArgs e)
        {
            SiteStatusChanged?.Invoke(this, e);

            // update the page status change to the database
            Task.Run(() => updateSiteStatus(e.Site));
        }

        #endregion

        #region Event Handlers

        private void Monitor_PageStatusChanged(object sender, PageStatusEventArgs e)
        {
            // calculate overall site status
            if (e.Page.Status == Status.Alarm || e.Page.Status == Status.NotFound)
            {
                if (_site.Status != Status.Alarm)
                {
                    var previousStatus = _site.Status;
                    _site.Status = Status.Alarm;
                    var args = new SiteStatusEventArgs(_site, previousStatus);
                    OnSiteStatusChanged(args);
                }
            }
            else if (e.Page.Status == Status.Maintenance)
            {
                if (_site.Status != Status.Maintenance)
                {
                    var previousStatus = _site.Status;
                    _site.Status = Status.Maintenance;
                    var args = new SiteStatusEventArgs(_site, previousStatus);
                    OnSiteStatusChanged(args);
                }
            }
            else
            {
                if (_site.Pages.All(p => p.Status == Status.Ok) && _site.Status != Status.Ok)
                {
                    var previousStatus = _site.Status;
                    _site.Status = Status.Ok;
                    var args = new SiteStatusEventArgs(_site, previousStatus);
                    OnSiteStatusChanged(args);
                }
            }

            // update the page status change to the database
            Task.Run(() => updateSitePage(e.Page));
        }

        private void Monitor_PageParseException(object sender, PageExceptionEventArgs e)
        {
            // stop the monitoring thread until the exception is resolved
            var monitor = sender as PageMonitor;
            if (monitor.MonitorStatus == WorkerStatus.Running)
            {
                monitor.Stop();
            }

            if (_site.Status != Status.Alarm)
            {
                _site.Status = Status.Alarm;
                var args = new SiteExceptionEventArgs(_site, e.Page, e.Exception);
                OnSiteException(args);
            }

            // update the page status change to the database
            Task.Run(() => updateSitePage(e.Page));
        }

        private void Monitor_PageNotFound(object sender, PageExceptionEventArgs e)
        {
            // stop the monitoring thread until the exception is resolved
            var monitor = sender as PageMonitor;
            if (monitor.MonitorStatus == WorkerStatus.Running)
            {
                monitor.Stop();
            }

            if (_site.Status != Status.Alarm)
            {
                _site.Status = Status.Alarm;
                var args = new SiteExceptionEventArgs(_site, e.Page, e.Exception);
                OnSiteException(args);
            }

            // update the page status change to the database
            Task.Run(() => updateSitePage(e.Page));
        }

        #endregion
    }
}
