using Metis.Core.Entities;
using Metis.Guard.Entities;
using Metis.Overseer.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using MongoDB.Driver;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Metis.Overseer.Services
{
    internal class MonitorService : IHostedService, IDisposable
    {
        private readonly IMongoCollection<Site> _sites;
        private readonly IMongoCollection<SiteEvent> _siteEvents;
        private readonly IMongoCollection<PageContent> _pagesContent;
        private readonly IHubContext<GuardHub> _guardHubContext;
        private readonly IEmailService _emailService;
        private readonly IGuardConfiguration _guardConfiguration;

        private Timer _timer;

        public MonitorService(IMongoClient mongoClient, IHubContext<GuardHub> guardHubContext, IEmailService emailService, IGuardConfiguration guardConfiguration)
        {
            var db = mongoClient.GetDatabase("metis");
            _sites = db.GetCollection<Site>("sites");
            _siteEvents = db.GetCollection<SiteEvent>("siteEvents");
            _pagesContent = db.GetCollection<PageContent>("pagesContent");

            _guardHubContext = guardHubContext;
            _emailService = emailService;
            _guardConfiguration = guardConfiguration;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            Log.Debug("Timed Background Monitoring is starting.");

            _timer = new Timer(Execute, null, TimeSpan.Zero,
                TimeSpan.FromSeconds(_guardConfiguration.RefreshInterval));

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            Log.Debug("Timed Background Monitoring is stopping.");

            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }

        private void Execute(object state)
        {
            var builder = Builders<Site>.Filter;
            var filter = builder.Ne(t => t.Status, Status.Maintenance);
            var monitorTasks = new List<Task>();
            using (var cursor = _sites.Find(filter).ToCursor())
            {
                while (cursor.MoveNext())
                {
                    foreach (var site in cursor.Current)
                    {
                        foreach (var page in site.Pages)
                        {
                            monitorTasks.Add(monitor(site, page));
                        }
                    }
                }
            }
            Task.WaitAll(monitorTasks.ToArray());
        }

        private async Task monitor(Site site, Page page)
        {
            var encoding = Encoding.GetEncoding(site.EncodingCode);
            var content = await parsePage(site, page);

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
                await statusChanged(site, page, content, Status.Ok);
            }
            else if (string.Equals(page.MD5Hash, md5))
            {
                if (page.Status != Status.Ok)
                {
                    await statusChanged(site, page, content, Status.Ok);
                }
            }
            else
            {
                if (page.Status != Status.Alarm)
                {
                    await statusChanged(site, page, content, Status.Alarm);
                }
            }
        }

        private async Task<string> parsePage(Site site, Page page)
        {
            try
            {
                var pageMonitor = new Metis.Guard.PageMonitor();
                var content = await pageMonitor.ParsePage(site, page);

                return content;
            }
            catch (System.Net.Http.HttpRequestException exception)
            {
                site.Status = Status.Alarm;
                page.Status = Status.NotFound;
                await siteException(site, page, exception);
                return string.Empty;
            }
            catch (Exception exception)
            {
                site.Status = Status.Alarm;
                page.Status = Status.Alarm;
                await siteException(site, page, exception);
                return string.Empty;
            }
        }

        private async Task updateSitePage(string siteId, Page page)
        {
            var filter = Builders<Site>.Filter;
            var siteIdAndPageIdFilter = filter.And(
              filter.Eq(x => x.Id, siteId),
              filter.ElemMatch(x => x.Pages, c => c.Uri == page.Uri));

            var update = Builders<Site>.Update;
            var pageStatusSetter = update.Set("pages.$", page);
            await _sites.UpdateOneAsync(siteIdAndPageIdFilter, pageStatusSetter);
        }

        private async Task siteException(Site site, Page page, Exception exception)
        {
            Log.Error(exception, "Exception while watching site {@name} {@id} page {@title} {@uri}",
                site.Name, site.Id, page.Title, page.Uri);

            var message = new SiteEvent
            {
                SiteId = site.Id,
                Name = site.Name,
                CurrentStatus = site.Status.ToString(),
                PageTitle = page.Title,
                PageUri = page.Uri,
                Message = exception.Message,
                Happened = DateTime.Now
            };

            await _guardHubContext.Clients.All.SendAsync("SiteGuardingException", message);
            await _siteEvents.InsertOneAsync(message);
        }

        private async Task statusChanged(Site site, Page page, string html, Status newStatus)
        {
            var previousSiteStatus = site.Status;
            var previousPageStatus = page.Status;

            page.Status = newStatus;

            // calculate overall site status
            string reason = string.Empty;
            if (page.Status == Status.Alarm || page.Status == Status.NotFound)
            {
                site.Status = Status.Alarm;
                reason = $"Page {page.Title} {page.Uri} content has been changed";
            }
            else if (page.Status == Status.Maintenance)
            {
                site.Status = Status.Maintenance;
                reason = $"Page {page.Title} {page.Uri} has gone to maintenance";
            }
            else
            {
                if (site.Pages.ToList().All(p => p.Status == Status.Ok))
                {
                    site.Status = Status.Ok;
                }
                reason = $"Page {page.Title} {page.Uri} status is now {page.Status.ToString()}";
            }

            Log.Information("Status changed for site {@name} {@id} from {@previous} to {@status}",
                site.Name, site.Id, previousSiteStatus, site.Status);

            // update the page content changes to the database
            await updateSitePageContent(site, page, html);
            // update the page status change to the database
            await updateSitePage(site.Id, page);
            // update the status of the site
            await updateSiteStatus(site);

            var message = new SiteEvent
            {
                SiteId = site.Id,
                Name = site.Name,
                CurrentStatus = site.Status.ToString(),
                PreviousStatus = previousSiteStatus.ToString(),
                Message = reason,
                Happened = DateTime.Now
            };

            await _guardHubContext.Clients.All.SendAsync("SiteStatusChanged", message);
            await _siteEvents.InsertOneAsync(message);

            if (site.Status != previousSiteStatus)
            {
                _emailService.Send(new EmailMessage()
                {
                    Content = $"Status changed for site {site.Name} {site.Id} from {previousSiteStatus} to {site.Status}",
                    FromAddress = new EmailAddress("metis", "metis@ypes.gr"),
                    ToAddresses = site.EmailAddresses,
                    Subject = "Κατάσταση Ιστοσελίδας"
                });
            }
        }

        private async Task updateSitePageContent(Site site, Page page, string content)
        {
            var pageContent = await _pagesContent.Find(Builders<PageContent>.Filter.Eq(x => x.PageUri, page.Uri))
                .FirstOrDefaultAsync();

            if (pageContent == null)
            {
                pageContent = new PageContent()
                {
                    SiteId = site.Id,
                    PageUri = page.Uri,
                    Differences = new List<PageDifference>()
                };
                await _pagesContent.InsertOneAsync(pageContent);
            }

            switch (page.Status)
            {
                case Status.Alarm:
                    pageContent.HtmlRead = content;
                    var items = new Diff().DiffText(pageContent.HtmlKnown, content);
                    pageContent.Differences = items.Select(i => new PageDifference(i));
                    break;
                case Status.Maintenance:
                    pageContent.HtmlKnown = string.Empty;
                    pageContent.HtmlRead = string.Empty;
                    pageContent.Differences = new List<PageDifference>();
                    break;
                case Status.NotFound:
                    pageContent.HtmlRead = string.Empty;
                    pageContent.Differences = new List<PageDifference>();
                    break;
                case Status.Ok:
                    pageContent.HtmlKnown = content;
                    pageContent.HtmlRead = string.Empty;
                    pageContent.Differences = new List<PageDifference>();
                    break;
            }

            await _pagesContent.ReplaceOneAsync(s => s.Id == pageContent.Id, pageContent);
        }

        /// <summary>
        /// update the site status in the database
        /// </summary>
        /// <param name="site">The site to update</param>
        private async Task updateSiteStatus(Site site)
        {
            await _sites.FindOneAndUpdateAsync(s => s.Id == site.Id,
                Builders<Site>.Update.Set(s => s.Status, site.Status));
        }
    }
}