using System.Linq;
using Metis.Core.Entities;
using Metis.Guard.Entities;
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
using Metis.Overseer.Extensions;

namespace Metis.Overseer.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly SiteService _siteService;
        private readonly IConfiguration _config;

        public AdminController(UserService userService, SiteService siteService, IConfiguration config)
        {
            _userService = userService;
            _siteService = siteService;
            _config = config;
        }

        [Route("users")]
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var data = await _userService.GetAll();

            return Ok(data.OrderBy(u => u.Title));
        }

        [Route("users/{id}")]
        [HttpGet]
        public async Task<IActionResult> GetUser(string id)
        {
            var data = await _userService.Get(id);

            return Ok(data);
        }

        [Route("users")]
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] User model)
        {
            var data = await _userService.Create(model);

            return Ok(data);
        }

        [Route("users/{id}")]
        [HttpPut]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] User model)
        {
            await _userService.Update(id, model);

            return Ok();
        }

        [Route("users/{id}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteUser(string id)
        {
            await _userService.Remove(id);

            return Ok();
        }

        [Route("sites")]
        [HttpGet]
        public async Task<IActionResult> GetSites()
        {
            var userId = User.Identity.GetUserId();

            var data = await _siteService.GetAll();

            var user = await _userService.Get(userId);
            if (user.Role != UserRole.Administrator)
            {
                data = data.Where(s => user.Sites.Contains(s.Id)).ToList();
            }

            return Ok(data.OrderBy(p => p.Name));
        }

        [Route("sites/{id}")]
        [HttpGet]
        public async Task<IActionResult> GetSite(string id)
        {
            var data = await _siteService.Get(id);

            return Ok(data);
        }

        [Route("sites")]
        [HttpPost]
        public async Task<IActionResult> CreateSite([FromBody] Site model)
        {
            var data = await _siteService.Create(model);

            return Ok(data);
        }

        [Route("sites/{id}")]
        [HttpPut]
        public async Task<IActionResult> UpdateSite(string id, [FromBody] Site model)
        {
            await _siteService.Update(id, model);

            return Ok();
        }

        [Route("sites/{id}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteSite(string id)
        {
            await _siteService.Remove(id);

            return Ok();
        }

    }
}