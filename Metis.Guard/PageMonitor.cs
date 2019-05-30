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
        const int MONITOR_THRESHOLD = 600;

        private HtmlWeb web;
        private readonly Encoding _encoding;
        private Page _page;

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
            web = null;
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

        internal void UpdatePage(Page snapshot)
        {
            _page.Exceptions = snapshot.Exceptions;
            _page.MD5Hash = snapshot.MD5Hash;
            _page.Status = snapshot.Status;
            _page.Title = snapshot.Title;
            _page.Uri = snapshot.Uri;
        }

        private async Task monitor(Page page, CancellationToken token)
        {
            try
            {
                while (!token.IsCancellationRequested)
                {
                    web = new HtmlWeb();
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
                        var args = new PageStatusEventArgs(page, previousStatus, content);
                        OnPageStatusChanged(args);
                    }
                    else if (string.Equals(page.MD5Hash, md5))
                    {
                        if (page.Status != Status.Ok)
                        {
                            var previousStatus = page.Status;
                            page.Status = Status.Ok;
                            // raise page status changed event
                            var args = new PageStatusEventArgs(page, previousStatus, content);
                            OnPageStatusChanged(args);
                        }
                    }
                    else
                    {
                        if (page.Status != Status.Alarm)
                        {
                            var previousStatus = page.Status;
                            page.Status = Status.Alarm;
                            // raise page status changed event
                            var args = new PageStatusEventArgs(page, previousStatus, content);
                            OnPageStatusChanged(args);
                        }
                    }

                    await Task.Delay(TimeSpan.FromSeconds(MONITOR_THRESHOLD), token);
                }

                this.MonitorStatus = WorkerStatus.Stopped;
                web = null;
            }
            catch (Exception exception)
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
            try
            {
                var doc = await web.LoadFromWebAsync(page.Uri, _encoding);

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
                            Console.WriteLine($"Exception rule {path} has not been found in page {page.Uri}.");
                        }
                    }
                }

                var content = doc.DocumentNode.InnerHtml;

                return content;
            }
            catch (System.Net.Http.HttpRequestException exception)
            {
                // raise page not found event
                page.Status = Status.NotFound;
                var args = new PageExceptionEventArgs(page, exception);
                OnPageNotFound(args);

                return string.Empty;
            }
            catch (Exception exception)
            {
                // raise page parse exception event
                page.Status = Status.Alarm;
                var args = new PageExceptionEventArgs(page, exception);
                OnPageParseException(args);

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
