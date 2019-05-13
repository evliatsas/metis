using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Metis.Overseer.Models.DTO
{
    public class Site
    {
        public string id { get; set; }
        public string name { get; set; }
        public string status { get; set; }
        public decimal latitude { get; set; }
        public decimal longitude { get; set; }
        public string category { get; set; }
        public IEnumerable<Page> pages { get; set; }

        public Site() { }

        public Site(Guard.Watcher watcher)
        {
            id = watcher.Site.Id;
            name = watcher.Site.Name;
            status = watcher.Site.Status.ToString();
            latitude = watcher.Site.Latitude;
            longitude = watcher.Site.Longitude;
            category = watcher.Site.Category;
            pages = watcher.Site.Pages.Select(page =>
                new DTO.Page()
                {
                    name = page.Title,
                    uri = page.Uri,
                    status = page.Status.ToString(),
                    guard = watcher.GetPageWorkerStatus(page.Uri).ToString()
                });
        }
    }
}
