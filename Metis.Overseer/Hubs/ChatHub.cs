using Metis.Core.Entities;
using Metis.Overseer.Extensions;
using Metis.Overseer.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Metis.Overseer.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private UserService db;
        private LogService lgb;
        private static readonly ConcurrentDictionary<string, User> Users
            = new ConcurrentDictionary<string, User>(StringComparer.InvariantCultureIgnoreCase);

        public ChatHub(UserService ctx, LogService logService)
        {
            db = ctx;
            lgb = logService;
        }

        public async Task Send(string logBookId, string message)
        {
            string sender = Context.User.Identity.Name;

            var book = await lgb.GetBook(logBookId);

            foreach (var u in book.Members)
            {
                await SendTo(message, u.UserId);
            }
        }

        public async Task SendTo(string message, string to)
        {
            string userName = Context.User.Identity.GetUserName();
            string title = Context.User.Identity.GetTitle();
            string email = Context.User.Identity.GetEmail();
            string userId = Context.User.Identity.GetUserId();

            User receiver;
            if (Users.TryGetValue(to, out receiver))
            {
                User sender = GetUser(userId);

                IEnumerable<string> allReceivers;
                lock (receiver.ConnectionIds)
                {
                    lock (sender.ConnectionIds)
                    {
                        allReceivers = receiver.ConnectionIds.Concat(sender.ConnectionIds);
                    }
                }

                foreach (var cid in allReceivers)
                {
                    await Clients.Client(cid).SendAsync("received", userName, message);
                }
            }
        }

        public IEnumerable<dynamic> GetConnectedUsers()
        {
            // return Users.Where(x =>
            // {
            //     lock (x.Value.ConnectionIds)
            //     {
            //         return !x.Value.ConnectionIds.Contains(Context.ConnectionId, StringComparer.InvariantCultureIgnoreCase);
            //     }
            // }).Select(x => x.Value);
            return Users
                .Select(x => new
                {
                    Title = x.Value.Title,
                    UserName = x.Value.Username,
                    Id = x.Value.Id,
                    Email = x.Value.Email
                })
                .OrderBy(t => t.Title);
        }

        public override async Task OnConnectedAsync()
        {
            string userName = Context.User.Identity.GetUserName();
            string title = Context.User.Identity.GetTitle();
            string email = Context.User.Identity.GetEmail();
            string userId = Context.User.Identity.GetUserId();
            string connectionId = Context.ConnectionId;

            var user = Users.GetOrAdd(userId, _ => new User
            {
                Id = userId,
                Username = userName,
                Title = title,
                Email = email,
                ConnectionIds = new HashSet<string>()
            });

            if (user.ConnectionIds.Count == 0)
            {
                await Clients.Others.SendAsync("userConnected", userName, title, email);
            }

            lock (user.ConnectionIds)
            {
                user.ConnectionIds.Add(connectionId);
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            string userName = Context.User.Identity.GetUserName();
            string title = Context.User.Identity.GetTitle();
            string email = Context.User.Identity.GetEmail();
            string userId = Context.User.Identity.GetUserId();
            string connectionId = Context.ConnectionId;

            User user;
            Users.TryGetValue(userId, out user);

            if (user != null)
            {
                lock (user.ConnectionIds)
                {
                    user.ConnectionIds.RemoveWhere(cid => cid.Equals(connectionId));

                    if (!user.ConnectionIds.Any())
                    {
                        User removedUser;
                        Users.TryRemove(userId, out removedUser);
                    }
                }
            }

            if (!user.ConnectionIds.Any())
            {
                await Clients.Others.SendAsync("userDisconnected", userName, title, email);
            }

            await base.OnDisconnectedAsync(exception);
        }

        private User GetUser(string userId)
        {
            User user;
            Users.TryGetValue(userId, out user);

            return user;
        }
    }
}