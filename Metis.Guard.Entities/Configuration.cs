namespace Metis.Guard.Entities
{
    /// <summary>
    /// Configuration Payload to start watching the pages of a web site
    /// </summary>
    public class Configuration
    {
        /// <summary>
        /// The Unique Identifier of the Site in the Database
        /// </summary>
        public string UiD { get; set; }
        /// <summary>
        /// The connection string of the database
        /// </summary>
        public string ConnectionString { get; set; }
    }
}
