﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Metis.Core.Entities
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        [Required]
        [BsonElement("username")]
        public string Username { get; set; }
        [Required]
        [BsonElement("password")]
        public string Password { get; set; }
        [Required]
        [BsonElement("email")]
        public string Email { get; set; }
        [BsonElement("title")]
        public string Title { get; set; }
        [BsonElement("role")]
        [BsonRepresentation(BsonType.String)]
        public UserRole Role { get; set; }
        [BsonElement("sites")]
        public IEnumerable<string> Sites { get; set; }

        [BsonIgnore]
        public HashSet<string> ConnectionIds { get; set; }
    }

    public enum UserRole
    {
        Viewer,
        Manager,
        Administrator
    }
}
