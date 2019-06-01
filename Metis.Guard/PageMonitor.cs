using HtmlAgilityPack;
using Metis.Guard.Entities;
using Serilog;
using System.Text;
using System.Threading.Tasks;

namespace Metis.Guard
{
    /// <summary>
    /// Responsible to parse the content of a single page
    /// </summary>
    public class PageMonitor
    {    
        /// <summary>
        /// Parses the html page, updates the page title and returns the content
        /// without the exception elements as an html string
        /// </summary>
        /// <param name="site">The Site that the page belongs to</param>
        /// <param name="page">The Page to parse</param>
        /// <returns>Page content or string.Empty on exception</returns>
        public async Task<string> ParsePage(Site site, Page page)
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
                    removeByAttribute(doc.DocumentNode, exception.Attribute, page.Uri);
                }
                else if (exception.Attribute.EndsWith("()"))
                {
                    var attr = exception.Attribute.Replace("()", string.Empty);
                    removePartialMatch(doc.DocumentNode, exception.Type, attr, exception.Value, page.Uri);
                }
                else if (exception.Value == "remove_all")
                {
                    removeAllAttributeValues(doc.DocumentNode, exception.Type, exception.Attribute, page.Uri);
                }
                else
                {
                    removeElement(doc.DocumentNode, exception, page.Uri);
                }
            }

            var content = doc.DocumentNode.InnerHtml;

            return content;
        }

        private void removeElement(HtmlNode node, PageElement element, string pageUri)
        {
            var path = $"//{element.Type}[@{element.Attribute}='{element.Value}']";
            var nodes = node.SelectNodes(path);
            if (nodes != null)
            {
                foreach (HtmlNode childNode in nodes)
                {
                    childNode.ParentNode.RemoveChild(childNode);
                }
            }
            else if (!string.IsNullOrEmpty(pageUri))
            {
                Log.Debug($"Exception rule {path} has not been found in page {pageUri}.");
            }
        }

        private void removeScriptText(HtmlNode node, string contains)
        {
            var path = "//script/text()";
            var nodes = node.SelectNodes(path);
            if (nodes != null)
            {
                foreach (var scriptNode in nodes)
                {
                    if (scriptNode.InnerText.Contains(contains))
                    {
                        scriptNode.ParentNode.RemoveChild(scriptNode);
                    }
                }
            }
        }

        private void removePartialMatch(HtmlNode node, string elementType, string attribute, string contains, string pageUri)
        {
            var path = $"//{elementType}[contains(@{attribute}, '{contains}')]";
            var nodes = node.SelectNodes(path);
            if (nodes != null)
            {
                foreach (var elementNode in nodes)
                {
                    elementNode.ParentNode.RemoveChild(elementNode);
                }
            }
            else if (!string.IsNullOrEmpty(pageUri))
            {
                Log.Debug($"Exception rule {path} has not been found in page {pageUri}.");
            }
        }

        private void removeByAttribute(HtmlNode node, string attribute, string pageUri)
        {
            var path = $"//*[@{attribute}]";
            var nodes = node.SelectNodes(path);
            if (nodes != null)
            {
                foreach (var elementNode in nodes)
                {
                    elementNode.ParentNode.RemoveChild(elementNode);
                }
            }
            else if (!string.IsNullOrEmpty(pageUri))
            {
                Log.Debug($"Exception rule {path} has not been found in page {pageUri}.");
            }
        }

        private void removeAllAttributeValues(HtmlNode node, string elementType, string attribute, string pageUri)
        {
            var path = $"//{elementType}[@{attribute}]";
            var nodes = node.SelectNodes(path);
            if (nodes != null)
            {
                foreach (var elementNode in nodes)
                {
                    elementNode.Attributes[attribute].Value = string.Empty;
                }
            }
            else if (!string.IsNullOrEmpty(pageUri))
            {
                Log.Debug($"Exception rule {path} has not been found in page {pageUri}.");
            }
        }

        private void removeComments(HtmlNode node)
        {
            var path = "//comment()";
            var nodes = node.SelectNodes(path);
            if (nodes != null)
            {
                foreach (var elementNode in nodes)
                {
                    elementNode.ParentNode.RemoveChild(elementNode);
                }
            }
        }
    }
}
