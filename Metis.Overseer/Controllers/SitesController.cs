using Metis.Overseer.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Metis.Overseer.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/sites")]
    public class SitesController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly GuardService _guardService;

        public SitesController(IConfiguration config, GuardService guardService)
        {
            _config = config;
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
            var guard = _guardService.Watchers.FirstOrDefault(w => w.Site.Id == id);
                
            if(guard == null)
            {
                return this.BadRequest(new Exception($"Το Site {id} που ζητήσατε δεν παρακολουθείται."));
            }

            guard.Start();

            return Ok();
        }

        [Route("{id}/stop")]
        [HttpGet]
        public IActionResult StopSiteGuard(string id)
        {
            var guard = _guardService.Watchers.FirstOrDefault(w => w.Site.Id == id);

            if (guard == null)
            {
                return this.BadRequest(new Exception($"Το Site {id} που ζητήσατε δεν παρακολουθείται."));
            }

            guard.Stop();

            return Ok();
        }

        [Route("{id}/refresh")]
        [HttpGet]
        public async Task<IActionResult> RefreshSite(string id)
        {
            var guard = _guardService.Watchers.FirstOrDefault(w => w.Site.Id == id);

            if (guard == null)
            {
                return this.BadRequest(new Exception($"Το Site {id} που ζητήσατε δεν παρακολουθείται."));
            }

            guard.Stop();
            await guard.TakeSnapshot();
            guard.Start();

            return Ok();
        }

        [Route("{id}/maintenance/start")]
        [HttpGet]
        public async Task<IActionResult> StartSiteMaintenance(string id)
        {
            var guard = _guardService.Watchers.FirstOrDefault(w => w.Site.Id == id);

            if (guard == null)
            {
                return this.BadRequest(new Exception($"Το Site {id} που ζητήσατε δεν παρακολουθείται."));
            }

            await guard.StartMaintenance();

            return Ok();
        }

        [Route("{id}/maintenance/stop")]
        [HttpGet]
        public async Task<IActionResult> StopSiteMaintenance(string id)
        {
            var guard = _guardService.Watchers.FirstOrDefault(w => w.Site.Id == id);

            if (guard == null)
            {
                return this.BadRequest(new Exception($"Το Site {id} που ζητήσατε δεν παρακολουθείται."));
            }

            await guard.CompleteMaintenance();

            return Ok();
        }
    }
}