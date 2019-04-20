using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace Metis.Guard.Entities
{
    /// <summary>
    /// A collection of web pages that comprise a Site to be guarded
    /// </summary>
    public class Site
    {
        /// <summary>
        /// Unique Identifier
        /// </summary>
        //[BsonId(IdGenerator = typeof(StringObjectIdGenerator))]
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Name { get; set; }
        /// <summary>
        /// The charset encoding code for the pages of the site
        /// (like ISO-8859-7, ASCII etc.), default is UTF-8
        /// </summary>
        public string EncodingCode { get; set; } = "UTF-8";
        /// <summary>
        /// The overall status of the site pages
        /// </summary>
        public Status Status { get; set; }
        public IEnumerable<Page> Pages { get; set; }

        public Site()
        {
            this.Pages = new List<Page>();
        }
    }
}
