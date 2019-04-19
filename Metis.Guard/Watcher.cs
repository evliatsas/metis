using HtmlAgilityPack;
using Metis.Guard.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Metis.Guard
{
    public class Watcher
    {
        private readonly Site _site;
        private readonly Encoding _encoding;

        public Watcher(Site site)
        {
            this._site = site;
            this._encoding = Encoding.GetEncoding(_site.EncodingCode);
        }

        public async Task Start()
        {
            foreach (var page in _site.Pages)
            {
                await parsePage(page);
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
