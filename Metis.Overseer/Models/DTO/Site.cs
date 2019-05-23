using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Metis.Overseer.Models.DTO
{
    public class Site
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Status { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public string Category { get; set; }
        public IEnumerable<Page> Pages { get; set; }

        public Site() { }

        public Site(Guard.Watcher watcher)
        {
            Id = watcher.Site.Id;
            Name = watcher.Site.Name;
            Status = watcher.Site.Status.ToString();
            Latitude = watcher.Site.Latitude;
            Longitude = watcher.Site.Longitude;
            Category = watcher.Site.Category;
            Pages = watcher.Site.Pages.Select(page =>
                new DTO.Page()
                {
                    Name = page.Title,
                    Uri = page.Uri,
                    Status = page.Status.ToString(),
                    Guard = watcher.GetPageWorkerStatus(page.Uri).ToString()
                });
        }
    }
}
