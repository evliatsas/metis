using System.Collections.Generic;
using System.Linq;

namespace Metis.Guard.Entities
{
    public class Site
    {
        public string Name { get; set; }        
        public Status Status { get; set; }
        public IEnumerable<Page> Pages { get; set; }

        public Site() { }

        public Site(Configuration configuration)
        {
            this.Name = configuration.UiD;
            this.Pages = configuration.Uris.Select(uri => new Page() { Uri = uri });
        }
    }
}
