using Metis.Guard.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Metis.Overseer.Hubs
{
    [Authorize]
    public class GuardHub : Hub
    {
        public async Task SendStatusChangedMessage(SiteStatusEventArgs args)
        {
            var message = new
            {
                id = args.Site.Id,
                name = args.Site.Name,
                currentStatus = args.Site.Status.ToString(),
                previousStatus = args.PreviousStatus.ToString()  ,
                message = args.Reason
            };
            await Clients.All.SendAsync("SiteStatusChanged", message);
        }

        public async Task SendExceptionMessage(SiteExceptionEventArgs args)
        {
            var message = new
            {
                id = args.Site.Id,
                name = args.Site.Name,
                currentStatus = args.Site.Status.ToString(),
                pageTitle = args.Page.Title,
                pageUri = args.Page.Uri,
                message = args.Exception.Message
            };
            await Clients.All.SendAsync("SiteGuardingException", message);
        }
    }
}
