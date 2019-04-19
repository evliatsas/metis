using System.Collections.Generic;

namespace Metis.Guard.Entities
{
    public class Page
    {
        public string Title { get; set; }
        public string Uri { get; set; }
        public string MD5Hash { get; set; }
        public IEnumerable<PageElement> Exceptions { get; set; }

        public Status Status { get; set; }
    }
}
