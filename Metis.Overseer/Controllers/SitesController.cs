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

        public SitesController(GuardService guardService)
        {
            _guardService = guardService;
        }

        [Route("")]
        [HttpGet]
        public IActionResult GetSites()
        {
            var sites = _guardService.Watchers
                .Select(w => new Models.DTO.Site(w))
                .OrderBy(o => o.name);

            return Ok(sites);
        }

        [Route("{id}/start")]
        [HttpGet]
        public IActionResult StartSiteGuard(string id)
        {
            _guardService.StartGuard(id);

            return Ok();
        }

        [Route("{id}/stop")]
        [HttpGet]
        public IActionResult StopSiteGuard(string id)
        {
            _guardService.StopGuard(id);

            return Ok();
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