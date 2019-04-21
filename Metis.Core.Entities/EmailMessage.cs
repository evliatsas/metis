using System;
using System.Collections.Generic;
using System.Text;

namespace Metis.Core.Entities
{
    public class EmailMessage
    {        
        public EmailAddress FromAddress { get; set; }
        public List<EmailAddress> ToAddresses { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }

        public EmailMessage()
        {
            this.ToAddresses = new List<EmailAddress>();
            this.Subject = "Metis Overseer";
        }
    }
}
