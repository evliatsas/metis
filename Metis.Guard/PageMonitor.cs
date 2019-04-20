using HtmlAgilityPack;
using Metis.Guard.Entities;
using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Metis.Guard
{
    /// <summary>
    /// Responsible to monitor a single page in a seperate thread
    /// and report any changes to the page content
    /// </summary>
    public class PageMonitor
    {
        /// <summary>
        /// The page refresh time in seconds
        /// </summary>
        const int MONITOR_THRESHOLD = 60; 

        private readonly Encoding _encoding;

        /// <summary>
        /// Provides the cancellation token for the monitor thread
        /// </summary>
        public CancellationTokenSource CancellationTokenSource { get; private set; }

        /// <summary>
        /// Starts monitoring an Html Page
        /// </summary>
        /// <param name="page">The Page to monitor</param>
        /// <param name="encoding">The charset encoding of the Html Page</param>
        public PageMonitor(Page page, Encoding encoding)
        {
            this.CancellationTokenSource = new CancellationTokenSource();
            this._encoding = encoding;
            Task.Factory.StartNew(() => monitor(page, this.CancellationTokenSource.Token));
        }

        /// <summary>
        /// Capture a Snapshot of the Page content
        /// </summary>
        /// <param name="page">The Page to capture</param>
        /// <returns>The current data of the Page</returns>
        internal async Task<Page> TakeSnapshot(Page page)
        {
            var content = await parsePage(page);
            var md5 = Utilities.CreateMD5(content, _encoding);

            var snasphot = new Page()
            {
                Exceptions = page.Exceptions,
                MD5Hash = md5,
                Status = Status.Ok,
                Title = page.Title,
                Uri = page.Uri
            };

            return snasphot;
        }

        // worker thread that monitors the page content periodically
        private async Task monitor(Page page, CancellationToken token)
        {
            while(!token.IsCancellationRequested)
            {
                var content = await parsePage(page);                

                if(string.IsNullOrEmpty(content))
                {
                    //an exception has occured
                    //an event should already notified the watcher
                    //to safely cancel the monitor
                    continue;
                }

                var md5 = Utilities.CreateMD5(content, _encoding);

                ////if it is a new page
                //if(string.IsNullOrEmpty(page.MD5Hash))
                //{
                //    //initialize the md5 hash of the content to the current one
                //    page.MD5Hash = md5;
                //    page.Status = Status.Ok;
                //    //todo raise 
                //}

                if (string.Equals(page.MD5Hash, md5))
                {
                    if(page.Status != Status.Ok)
                    {
                        page.Status = Status.Ok;
                        //todo raise status changed event
                    }
                }
                else
                {
                    page.Status = Status.Alarm;
                    //todo raise status alarm event
                }

                await Task.Delay(TimeSpan.FromSeconds(MONITOR_THRESHOLD), token);
            }
        }

        // parses the html page, updates the page title and returns the content
        // without the exception elements as an html string
        private async Task<string> parsePage(Page page)
        {
            var web = new HtmlWeb();
            try
            {
                var doc = await web.LoadFromWebAsync(page.Uri, _encoding);

                var title = doc.DocumentNode.SelectSingleNode("//title");
                page.Title = string.IsNullOrEmpty(title?.InnerText) ? "no title" : title.InnerText;

                foreach (var exception in page.Exceptions)
                {
                    var path = $"//{exception.Type}[@{exception.Attribute}='{exception.Value}']";
                    var nodes = doc.DocumentNode.SelectNodes(path);
                    if (nodes != null)
                    {
                        foreach (HtmlNode node in nodes)
                        {
                            node.Remove();
                        }
                    }
                    else
                    {
                        Console.WriteLine($"Exception rule {path} has not been found.");
                    }
                }

                var content = doc.ParsedText;

                return content;
            }
            catch(System.Net.Http.HttpRequestException exception)
            {
                //todo raise page not found event
                //log exception

                return string.Empty;
            }
            catch(Exception exception)
            {
                //todo raise exception event
                //log exception

                return string.Empty;
            }
        }
    }
}
