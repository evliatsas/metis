using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;
using System.Collections.Generic;

namespace Metis.Guard.Entities
{
    public class Site
    {
        [BsonId(IdGenerator = typeof(StringObjectIdGenerator))]
        public string Id { get; set; }
        public string Name { get; set; }
        public string EncodingCode { get; set; } = "UTF-8";
        public Status Status { get; set; }
        public IEnumerable<Page> Pages { get; set; }

        public Site() { }
    }
}
