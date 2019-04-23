using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace Metis.Teamwork.Entities
{
    public class Member
    {
        [Required]
        [BsonElement("userId")]
        public string UserId { get; set; }
        [BsonElement("name")]
        public string Name { get; set; }
        [BsonElement("email")]
        public string Email { get; set; }
    }
}
