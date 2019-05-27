using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Metis.Guard.Entities
{
    public class SiteEvent
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        [BsonElement("siteId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string SiteId { get; set; }
        [BsonElement("name")]
        public string Name { get; set; }
        [BsonElement("currentStatus")]
        public string CurrentStatus { get; set; }
        [BsonElement("previousStatus")]
        public string PreviousStatus { get; set; }
        [BsonElement("message")]
        public string Message { get; set; }
        [BsonElement("pageTitle")]
        public string PageTitle { get; set; }
        [BsonElement("pageUri")]
        public string PageUri { get; set; }
        [BsonElement("happened")]
        public DateTime Happened { get; set; }
    }
}