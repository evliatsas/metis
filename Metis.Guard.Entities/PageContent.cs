using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace Metis.Guard.Entities
{
    public class PageContent
    {
        /// <summary>
        /// Unique Identifier
        /// </summary>
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        /// <summary>
        /// The Id of the Site where the page belongs to
        /// </summary>
        [BsonElement("siteId")]
        public string SiteId { get; set; }
        /// <summary>
        /// The Uri of the web page
        /// </summary>
        [BsonElement("pageUri")]
        public string PageUri { get; set; }
        /// <summary>
        /// The last known Html text
        /// </summary>
        [BsonElement("htmlKnown")]
        public string HtmlKnown { get; set; }
        /// <summary>
        /// The currently read Html text
        /// </summary>
        [BsonElement("htmlRead")]
        public string HtmlRead { get; set; }
        [BsonElement("differences")]
        public IEnumerable<PageDifference> Differences { get; set; }
    }

    public class PageDifference
    {
        [BsonElement("startA")]
        public int StartA { get; set; }
        [BsonElement("startB")]
        /// <summary>Start Line number in Data B.</summary>
        public int StartB { get; set; }
        [BsonElement("deletedA")]
        /// <summary>Number of changes in Data A.</summary>
        public int deletedA { get; set; }
        [BsonElement("insertedB")]
        /// <summary>Number of changes in Data A.</summary>
        public int insertedB { get; set; }

        public PageDifference() { }
        public PageDifference(Diff.Item item)
        {
            this.deletedA = item.deletedA;
            this.insertedB = item.insertedB;
            this.StartA = item.StartA;
            this.StartB = item.StartB;
        }
    }
}
