using System;
using Metis.Guard.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Metis.Overseer.Hubs
{
    [Authorize]
    public class GuardHub : Hub
    {
        internal static SiteEvent _CreateMessage(SiteStatusEventArgs args)
        {
            var message = new SiteEvent
            {
                SiteId = args.Site.Id,
                Name = args.Site.Name,
                CurrentStatus = args.Site.Status.ToString(),
                PreviousStatus = args.PreviousStatus.ToString(),
                Message = args.Reason,
                Happened = DateTime.Now
            };

            return message;
        }

        internal static SiteEvent _CreateMessage(SiteExceptionEventArgs args)
        {
            var message = new SiteEvent
            {
                SiteId = args.Site.Id,
                Name = args.Site.Name,
                CurrentStatus = args.Site.Status.ToString(),
                PageTitle = args.Page.Title,
                PageUri = args.Page.Uri,
                Message = args.Exception.Message,
                Happened = DateTime.Now
            };

            return message;
        }
    }
}
