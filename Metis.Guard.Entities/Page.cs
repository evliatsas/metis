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
        /// <summary>
        /// The Html title of the page
        /// </summary>
        [BsonElement("title")]
        public string Title { get; set; }
        /// <summary>
        /// The page unique Uniform Resource Identifier
        /// </summary>
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
        /// <summary>
        /// The current status of a guarded page
        /// </summary>
        [BsonElement("status")]
        [BsonRepresentation(BsonType.String)]
        public Status Status { get; set; }
    }
}
