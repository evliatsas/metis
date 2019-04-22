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
        private static readonly ConcurrentDictionary<string, User> Users
            = new ConcurrentDictionary<string, User>(StringComparer.InvariantCultureIgnoreCase);

        public ChatHub(UserService ctx)
        {
            db = ctx;
        }

        public async Task Send(string message)
        {
            string sender = Context.User.Identity.Name;

            // So, broadcast the sender, too.
            await Clients.All.SendAsync("received", Context.User.Identity.Name, message);
        }

        public async Task SendTo(string message, string to)
        {
            User receiver;
            if (Users.TryGetValue(to, out receiver))
            {
                User sender = GetUser(Context.User.Identity.Name);

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
                    await Clients.Client(cid).SendAsync("received", Context.User.Identity.Name, message);
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
                .Select(x => new {
                    Title = x.Value.Title,
                    UserName = x.Value.Username,
                    Key = x.Value.Username
                })
                .OrderBy(t => t.Title);
        }

        public override async Task OnConnectedAsync()
        {
            string userName = Context.User.Identity.GetUserName();
            string title = Context.User.Identity.GetTitle();
            string connectionId = Context.ConnectionId;

            var user = Users.GetOrAdd(userName, _ => new User
            {
                Username = userName,
                Title = title,
                ConnectionIds = new HashSet<string>()
            });

            if (user.ConnectionIds.Count == 0)
            {
                await Clients.Others.SendAsync("userConnected", userName, title);
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
            string connectionId = Context.ConnectionId;

            User user;
            Users.TryGetValue(userName, out user);

            if (user != null)
            {
                lock (user.ConnectionIds)
                {
                    user.ConnectionIds.RemoveWhere(cid => cid.Equals(connectionId));

                    if (!user.ConnectionIds.Any())
                    {
                        User removedUser;
                        Users.TryRemove(userName, out removedUser);
                    }
                }
            }

            if (!user.ConnectionIds.Any())
            {
                await Clients.Others.SendAsync("userDisconnected", userName);
            }

            await base.OnDisconnectedAsync(exception);
        }

        private User GetUser(string username)
        {
            User user;
            Users.TryGetValue(username, out user);

            return user;
        }
    }
}