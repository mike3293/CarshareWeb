using IdentityServer4.Models;
using IdentityServer4.Services;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Identity.Services
{
    public class ProfileService : DefaultProfileService
    {
        // TODO: find better way to include them
        private static string[] _claimsToInclude = { "is_main_admin", "role", "email", "user_id" };


        public ProfileService(ILogger<ProfileService> logger) : base(logger)
        {
        }


        public override Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            var claims = context.Subject.Claims;
            context.IssuedClaims.AddRange(claims.Where(c => _claimsToInclude.Any(ci => ci == c.Type)));

            return Task.CompletedTask;
        }
    }
}
