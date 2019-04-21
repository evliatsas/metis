using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace Metis.Guard.Entities
{
    /// <summary>
    /// A single web page of a site
    /// </summary>
    public class Page
    {
        [BsonElement("title")]
        public string Title { get; set; }
        [BsonElement("uri")]
        public string Uri { get; set; }
        /// <summary>
        /// The calculated MD5 hash of the page html content
        /// without the exception elements
        /// </summary>
        [BsonElement("md5hash")]
        public string MD5Hash { get; set; }
        /// <summary>
        /// Html elements that need to be excluded from the md5 hash calculation
        /// </summary>
        [BsonElement("exceptions")]
        public IEnumerable<PageElement> Exceptions { get; set; }
        [BsonElement("status")]
        [BsonRepresentation(BsonType.String)]
        public Status Status { get; set; }
    }
}
