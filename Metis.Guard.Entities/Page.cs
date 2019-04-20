using System.Collections.Generic;

namespace Metis.Guard.Entities
{
    /// <summary>
    /// A single web page of a site
    /// </summary>
    public class Page
    {        
        public string Title { get; set; }
        public string Uri { get; set; }
        /// <summary>
        /// The calculated MD5 hash of the page html content
        /// without the exception elements
        /// </summary>
        public string MD5Hash { get; set; }
        /// <summary>
        /// Html elements that need to be excluded from the md5 hash calculation
        /// </summary>
        public IEnumerable<PageElement> Exceptions { get; set; }
        public Status Status { get; set; }
    }
}
