namespace Metis.Core.Entities
{
    public class EmailAddress
    {
        public string Name { get; private set; }
        public string Address { get; private set; }

        public EmailAddress(string name, string address)
        {
            this.Name = name;
            this.Address = address;
        }

        public EmailAddress(User user)
        {
            this.Name = user.Title;
            this.Address = user.Email;
        }
    }
}
