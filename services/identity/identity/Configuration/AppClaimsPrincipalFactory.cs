using Identity.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Identity.Configuration
{
    public class AppClaimsPrincipalFactory : UserClaimsPrincipalFactory<ApplicationUser, ApplicationRole>
    {
        public AppClaimsPrincipalFactory(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager, IOptions<IdentityOptions> optionsAccessor) : base(userManager, roleManager, optionsAccessor)
        {
        }


        protected override async Task<ClaimsIdentity> GenerateClaimsAsync(ApplicationUser user)
        {
            ClaimsIdentity claims = await base.GenerateClaimsAsync(user);

            claims.AddClaim(new Claim("user_id", user.Id.ToString()));

            return claims;
        }
    }
}
