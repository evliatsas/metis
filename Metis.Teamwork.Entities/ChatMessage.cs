using Metis.Core.Entities;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Metis.Teamwork.Entities
{
    public class ChatMessage
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        /// <summary>
        /// The User who sent the message
        /// </summary>        
        [Required]
        [BsonElement("sender")]
        public User Sender { get; set; }

        /// <summary>
        /// Message sent Date Time
        /// </summary>
        [Required]
        [BsonElement("sent")]
        public DateTime Sent { get; set; }

        /// <summary>
        /// The id of the log book that this message belongs to
        /// </summary>
        [Required]
        [BsonElement("logBookId")]
        public string LogBookId { get; set; }

        /// <summary>
        /// The body of the message
        /// </summary>
        [BsonElement("message")]
        public string Message { get; set; }
    }
}