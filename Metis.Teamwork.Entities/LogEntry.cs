using Metis.Core.Entities;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace Metis.Teamwork.Entities
{
    public class LogEntry
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        /// <summary>
        /// The Issuer of the entry
        /// </summary>
        [BsonElement("issuer")]
        public User Issuer { get; set; }
        /// <summary>
        /// Date Time Given
        /// </summary>
        [BsonElement("dtg")]
        public DateTime DTG { get; set; }
        /// <summary>
        /// Estimated Completion Time
        /// </summary>
        [BsonElement("ect")]
        public DateTime ECT { get; set; }
        /// <summary>
        /// The action recipient
        /// </summary>
        [BsonElement("recipient")]
        public User Recipient { get; set; }
        [BsonElement("completionTime")]
        public DateTime CompletionTime { get; set; }
        [BsonElement("status")]
        public Status Status { get; set; }
        [BsonElement("priority")]
        public Priority Priority { get; set; }
        /// <summary>
        /// Description of the issue
        /// </summary>
        [BsonElement("description")]
        public string Description { get; set; }
        /// <summary>
        /// Resolve actions that has been taken
        /// </summary>
        [BsonElement("actions")]
        public string Actions { get; set; }
    }
}
