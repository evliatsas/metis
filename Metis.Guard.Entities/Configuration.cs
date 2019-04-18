using System.Collections.Generic;

namespace Metis.Guard.Entities
{
    public class Configuration
    {
        public string UiD { get; set; }
        public IEnumerable<string> Uris { get; set; }
    }
}
