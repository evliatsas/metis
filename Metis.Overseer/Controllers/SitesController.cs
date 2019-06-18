using Metis.Core.Entities;
using Metis.Overseer.Extensions;
using Metis.Overseer.Services;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace Metis.Overseer.Controllers
{
    [ApiController]
    [Route("api/sites")]
    public class SitesController : ControllerBase
    {
        private readonly GuardService _guardService;
        private readonly UserService _userService;

        public SitesController(GuardService guardService, UserService userService)
        {
            _guardService = guardService;
            _userService = userService;
        }

        [Route("")]
        [HttpGet]
        public async Task<IActionResult> GetSites()
        {
            var userId = User.Identity.GetUserId();

            var sites = await _guardService.GetSitesFromDb();
            var dto = sites
                .Select(w => new Models.DTO.Site(w))
                .OrderBy(o => o.Name).ToList();

            var user = await _userService.Get(userId);
            if (user.Role != UserRole.Administrator)
            {
                dto = dto.Where(s => user.Sites.Contains(s.Id)).ToList();
            }

            return Ok(dto);
        }

        [Route("{id}/refresh")]
        [HttpGet]
        public async Task<IActionResult> RefreshSite(string id)
        {
            await _guardService.RefreshSite(id);

            return Ok();
        }

        [Route("{id}/maintenance/start")]
        [HttpGet]
        public async Task<IActionResult> StartSiteMaintenance(string id)
        {
            await _guardService.StartMaintenance(id);

            return Ok();
        }

        [Route("{id}/maintenance/stop")]
        [HttpGet]
        public async Task<IActionResult> StopSiteMaintenance(string id)
        {
            await _guardService.EndMaintenance(id);

            return Ok();
        }
    }
}