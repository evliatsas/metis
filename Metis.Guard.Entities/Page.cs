using System.Collections.Generic;

namespace Metis.Guard.Entities
{
    public class Page
    {
        public string Title { get; set; }
        public string Uri { get; set; }
        public string Hash { get; set; }
        public IEnumerable<PageElement> Exceptions { get; set; }
    }
}
