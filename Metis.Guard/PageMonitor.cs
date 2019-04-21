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
        private readonly Page _page;

        /// <summary>
        /// Provides the cancellation token for the monitor thread
        /// </summary>
        public CancellationTokenSource CancellationTokenSource { get; private set; }
        /// <summary>
        /// The status of the working monitor thread
        /// </summary>
        public WorkerStatus MonitorStatus { get; private set; }

        /// <summary>
        /// Initiate a page monitor.
        /// Monitoring do not start until the Start() method is invoked
        /// </summary>
        /// <param name="page">The Page to monitor</param>
        /// <param name="encoding">The charset encoding of the Html Page</param>
        public PageMonitor(Page page, Encoding encoding)
        {
            this._encoding = encoding;
            this._page = page;            
        }

        /// <summary>
        /// Starts monitoring the Html Page
        /// </summary>
        public void Start()
        {
            this.CancellationTokenSource = new CancellationTokenSource();
            Task.Factory.StartNew(() => monitor(_page, this.CancellationTokenSource.Token));            
        }

        /// <summary>
        /// Stops monitoring the Html Page
        /// </summary>
        public void Stop()
        {
            this.CancellationTokenSource.Cancel();
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
                Status = page.Status,
                Title = page.Title,
                Uri = page.Uri
            };

            return snasphot;
        }

        /// <summary>
        /// Worker thread that monitors the page content periodically
        /// </summary>
        /// <param name="page">The Page to monitor</param>
        /// <param name="token">The cancellation token</param>
        /// <returns></returns>
        private async Task monitor(Page page, CancellationToken token)
        {
            try
            {
                while (!token.IsCancellationRequested)
                {
                    this.MonitorStatus = WorkerStatus.Running;

                    var content = await parsePage(page);

                    if (string.IsNullOrEmpty(content))
                    {
                        // an exception has occured
                        // an event should already notified the watcher to safely stop the monitor
                        continue;
                    }

                    var md5 = Utilities.CreateMD5(content, _encoding);

                    //if it is a new page
                    if (string.IsNullOrEmpty(page.MD5Hash))
                    {
                        //initialize the md5 hash of the content to the current one
                        page.MD5Hash = md5;
                        var previousStatus = page.Status;
                        page.Status = Status.Ok;
                        // raise page status changed event
                        var args = new PageStatusEventArgs(page, previousStatus);
                        OnPageStatusChanged(args);
                    }

                    if (string.Equals(page.MD5Hash, md5))
                    {
                        if (page.Status != Status.Ok)
                        {
                            var previousStatus = page.Status;
                            page.Status = Status.Ok;
                            // raise page status changed event
                            var args = new PageStatusEventArgs(page, previousStatus);
                            OnPageStatusChanged(args);
                        }
                    }
                    else
                    {
                        var previousStatus = page.Status;
                        page.Status = Status.Alarm;
                        // raise page status changed event
                        var args = new PageStatusEventArgs(page, previousStatus);
                        OnPageStatusChanged(args);
                    }

                    await Task.Delay(TimeSpan.FromSeconds(MONITOR_THRESHOLD), token);
                }

                this.MonitorStatus = WorkerStatus.Stopped;
            }
            catch(Exception exception)
            {
                // raise page parse exception event
                page.Status = Status.Alarm;
                var args = new PageExceptionEventArgs(page, exception);
                OnPageParseException(args);
            }
        }

        /// <summary>
        /// Parses the html page, updates the page title and returns the content 
        /// without the exception elements as an html string
        /// </summary>
        /// <param name="page">The Page to parse</param>
        /// <returns>Page content or string.Empty on exception</returns>
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
                            node.ParentNode.RemoveChild(node);
                        }
                    }
                    else
                    {
                        Console.WriteLine($"Exception rule {path} has not been found.");
                    }
                }

                var content = doc.DocumentNode.InnerHtml;

                return content;
            }
            catch(System.Net.Http.HttpRequestException exception)
            {
                // raise page not found event
                page.Status = Status.NotFound;
                var args = new PageExceptionEventArgs(page, exception);
                OnPageNotFound(args);

                return string.Empty;
            }
            catch(Exception exception)
            {
                // raise page parse exception event
                page.Status = Status.Alarm;
                var args = new PageExceptionEventArgs(page, exception);
                OnPageParseException(args);

                return string.Empty;
            }
        }

        #region Events

        /// <summary>
        /// Raised when a page cannot be loaded from web
        /// </summary>
        public event PageNotFoundEventHandler PageNotFound;
        /// <summary>
        /// Raised when the content of the page cannot be parsed
        /// </summary>
        public event PageParseExceptionEventHandler PageParseException;
        /// <summary>
        /// Raised whenever the current status of a page changes
        /// </summary>
        public event PageStatusChangedEventHandler PageStatusChanged;

        protected void OnPageNotFound(PageExceptionEventArgs e)
        {
            PageNotFound?.Invoke(this, e);
        }

        protected void OnPageParseException(PageExceptionEventArgs e)
        {
            PageParseException?.Invoke(this, e);
        }

        protected void OnPageStatusChanged(PageStatusEventArgs e)
        {
            PageStatusChanged?.Invoke(this, e);
        }

        #endregion
    }
}
