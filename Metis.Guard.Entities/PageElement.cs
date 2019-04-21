using MongoDB.Bson.Serialization.Attributes;

namespace Metis.Guard.Entities
{
    /// <summary>
    /// Represent a specific Html element within a web page
    /// </summary>
    public class PageElement
    {
        /// <summary>
        /// The type of the element (div, span etc.)
        /// </summary>
        [BsonElement("type")]
        public string Type { get; set; }
        /// <summary>
        /// The attribute to read the value from (id, class etc.)
        /// </summary>
        [BsonElement("attribute")]
        public string Attribute { get; set; }
        /// <summary>
        /// The specific value of the attribute that we need to find (slider-wrapper, facebook-RSS etc.)
        /// </summary>
        [BsonElement("value")]
        public string Value { get; set; }
    }
}
