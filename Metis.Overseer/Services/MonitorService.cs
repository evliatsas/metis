using System.Linq;
using System;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using HtmlAgilityPack;
using Metis.Guard.Entities;
using Metis.Overseer.Hubs;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;
using Serilog;
using Metis.Core.Entities;
using System.Collections.Generic;

namespace Metis.Overseer.Services
{
    public class MonitorService
    {
        private readonly IMongoCollection<Site> _sites;
        private readonly IMongoCollection<SiteEvent> _siteEvents;
        private readonly IMongoCollection<PageContent> _pagesContent;
        private readonly IHubContext<GuardHub> _guardHubContext;
        private readonly IEmailService _emailService;

        public MonitorService(IMongoClient mongoClient, IHubContext<GuardHub> guardHubContext, IEmailService emailService)
        {
            var db = mongoClient.GetDatabase("metis");
            _sites = db.GetCollection<Site>("sites");
            _siteEvents = db.GetCollection<SiteEvent>("siteEvents");
            _pagesContent = db.GetCollection<PageContent>("pagesContent");

            _guardHubContext = guardHubContext;
            _emailService = emailService;
        }

        public void Execute()
        {
            var builder = Builders<Site>.Filter;
            var filter = builder.Ne(t => t.Status, Status.Maintenance);
            using (var cursor = _sites.Find(filter).ToCursor())
            {
                while (cursor.MoveNext())
                {
                    foreach (var site in cursor.Current)
                    {
                        foreach (var page in site.Pages)
                        {
                            monitor(site, page);
                        }
                    }
                }
            }
        }

        private async Task monitor(Site site, Page page)
        {
            var encoding = Encoding.GetEncoding(site.EncodingCode);
            var content = await parsePage(site, page);

            if (string.IsNullOrEmpty(content))
            {
                return;
            }

            var md5 = createMD5(content, encoding);

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
                var encoding = Encoding.GetEncoding(site.EncodingCode);
                var web = new HtmlWeb();
                var doc = await web.LoadFromWebAsync(page.Uri, encoding);

                var title = doc.DocumentNode.SelectSingleNode("//title");
                page.Title = string.IsNullOrEmpty(title?.InnerText) ? "no title" : title.InnerText;

                removeComments(doc.DocumentNode);

                foreach (var exception in page.Exceptions)
                {
                    if (exception.Type == "script" && exception.Attribute == "text()")
                    {
                        removeScriptText(doc.DocumentNode, exception.Value);
                    }
                    else if (string.IsNullOrEmpty(exception.Type))
                    {
                        removeByAttribute(doc.DocumentNode, exception.Attribute);
                    }
                    else if (exception.Attribute.EndsWith("()"))
                    {
                        var attr = exception.Attribute.Replace("()", string.Empty);
                        removePartialMatch(doc.DocumentNode, exception.Type, attr, exception.Value);
                    }
                    else if (exception.Value == "remove_all")
                    {
                        removeAllAttributeValues(doc.DocumentNode, exception.Type, exception.Attribute);
                    }
                    else
                    {
                        var path = $"//{exception.Type}[@{exception.Attribute}='{exception.Value}']";
                        var nodes = doc.DocumentNode.SelectNodes(path);
                        if (nodes != null)
                        {
                            foreach (HtmlNode node in nodes)
                            {
                                node.ParentNode.RemoveChild(node);
                            }
                        }
                        else
                        {
                            // TODO: commented out to avoid console spam, what to do with it?
                            Log.Warning($"Exception rule {path} has not been found in page {page.Uri}.");
                        }
                    }
                }

                var content = doc.DocumentNode.InnerHtml;

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

        private void removeScriptText(HtmlNode node, string contains)
        {
            var path = "//script/text()";
            var nodes = node.SelectNodes(path);
            foreach (var scriptNode in nodes)
            {
                if (scriptNode.InnerText.Contains(contains))
                {
                    scriptNode.ParentNode.RemoveChild(scriptNode);
                }
            }
        }

        private void removePartialMatch(HtmlNode node, string elementType, string attribute, string contains)
        {
            var path = $"//{elementType}[contains(@{attribute}, '{contains}')]";
            var nodes = node.SelectNodes(path);
            foreach (var elementNode in nodes)
            {
                elementNode.ParentNode.RemoveChild(elementNode);
            }
        }

        private void removeByAttribute(HtmlNode node, string attribute)
        {
            var path = $"//*[@{attribute}]";
            var nodes = node.SelectNodes(path);
            foreach (var elementNode in nodes)
            {
                elementNode.ParentNode.RemoveChild(elementNode);
            }
        }

        private void removeAllAttributeValues(HtmlNode node, string elementType, string attribute)
        {
            var path = $"//{elementType}[@{attribute}]";
            var nodes = node.SelectNodes(path);
            foreach (var elementNode in nodes)
            {
                elementNode.Attributes[attribute].Value = string.Empty;
            }
        }

        private void removeComments(HtmlNode node)
        {
            var path = "//comment()";
            var nodes = node.SelectNodes(path);
            foreach (var elementNode in nodes)
            {
                elementNode.ParentNode.RemoveChild(elementNode);
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

        private string createMD5(string input, Encoding encoding = null)
        {
            if (encoding == null)
            {
                encoding = Encoding.UTF8;
            }

            // remove all white spaces and new lines
            input = Regex.Replace(input, @"\s+", "");

            // Use input string to calculate MD5 hash
            using (System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create())
            {
                byte[] inputBytes = encoding.GetBytes(input);
                byte[] hashBytes = md5.ComputeHash(inputBytes);

                // Convert the byte array to hexadecimal string
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < hashBytes.Length; i++)
                {
                    sb.Append(hashBytes[i].ToString("X2"));
                }
                return sb.ToString();
            }
        }
    }
}