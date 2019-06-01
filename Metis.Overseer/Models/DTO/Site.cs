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

        public Site(Metis.Guard.Entities.Site site)
        {
            Id = site.Id;
            Name = site.Name;
            Status = site.Status.ToString();
            Latitude = site.Latitude;
            Longitude = site.Longitude;
            Category = site.Category;
            Pages = site.Pages.Select(page =>
                new DTO.Page()
                {
                    Name = page.Title,
                    Uri = page.Uri,
                    Status = page.Status.ToString()
                });
        }
    }
}
