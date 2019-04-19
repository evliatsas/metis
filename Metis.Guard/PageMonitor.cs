using HtmlAgilityPack;
using Metis.Guard.Entities;
using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Metis.Guard
{
    public class PageMonitor
    {
        /// <summary>
        /// The page refresh time in minutes
        /// </summary>
        const int MONITOR_THRESHOLD = 20; 

        private readonly Encoding _encoding;

        public CancellationTokenSource CancellationToken { get; private set; }

        public PageMonitor(Page page, Encoding encoding)
        {
            this.CancellationToken = new CancellationTokenSource();
            this._encoding = encoding;
            Task.Factory.StartNew(() => Monitor(page, this.CancellationToken.Token));
        }

        public async Task Monitor(Page page, CancellationToken token)
        {
            while(!token.IsCancellationRequested)
            {
                var content = await parsePage(page);
                var md5 = Utilities.CreateMD5(content, _encoding);

                if(string.Equals(page.MD5Hash, md5))
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

        private async Task<string> parsePage(Page page)
        {
            var web = new HtmlWeb();
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
    }
}
