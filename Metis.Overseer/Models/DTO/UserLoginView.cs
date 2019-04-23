using System.ComponentModel.DataAnnotations;

namespace Metis.Overseer.Models.DTO
{
    public class UserLoginView
    {
        [Required]      
        public string Username { get; set; }

        [Required]      
        public string Password { get; set; }
    }
}
