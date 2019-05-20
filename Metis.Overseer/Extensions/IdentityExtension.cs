using System;
using System.Security.Claims;
using System.Security.Principal;

namespace Metis.Overseer.Extensions
{
    public static class IdentityExtension
    {
        public static string GetUserId(this IIdentity identity)
        {
            return ((ClaimsIdentity)identity).FindFirst("userid").Value;
        }

        public static string GetUserName(this IIdentity identity)
        {
            return ((ClaimsIdentity)identity).FindFirst("username").Value;
        }

        public static string GetEmail(this IIdentity identity)
        {
            return ((ClaimsIdentity)identity).FindFirst(ClaimTypes.Email).Value;
        }

        public static string GetTitle(this IIdentity identity)
        {
            return ((ClaimsIdentity)identity).FindFirst("title").Value;
        }
    }
}