using Metis.Core.Entities;
using Metis.Overseer.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Metis.Overseer.Controllers
{
    [ApiController]
    [AllowAnonymous]
    [Route("api/token")]
    public class AccountController : ControllerBase
    {
        private readonly UserService _budgetService;
        private readonly IConfiguration _config;

        public AccountController(UserService budgetService, IConfiguration config)
        {
            _budgetService = budgetService;
            _config = config;
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Token([FromBody] User model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Could not create token");
            }

            var dbUser = _budgetService.Login(model);
            if (!dbUser)
            {
                return Unauthorized(new Exception("Λάθος username ή password"));
            }

            var claims = new List<Claim>();
            claims.Add(new Claim("username", model.Username));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
              _config["Jwt:Issuer"],
              claims,
              expires: DateTime.UtcNow.AddHours(8),
              signingCredentials: creds);

            return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
        }
    }
}