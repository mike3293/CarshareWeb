using Identity.Models;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using System.Linq;
using System.Threading.Tasks;

namespace IdentityServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class AuthenticateController : Controller
    {
        private readonly IIdentityServerInteractionService _interaction;
        private readonly IWebHostEnvironment _environment;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _userSignInManager;

        public AuthenticateController(
            SignInManager<ApplicationUser> userSignInManager,
            UserManager<ApplicationUser> userManager,
            IIdentityServerInteractionService interaction,
            IWebHostEnvironment environment)
        {
            _userSignInManager = userSignInManager;
            _userManager = userManager;
            _interaction = interaction;
            _environment = environment;
        }

        public class LoginRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
            public string ReturnUrl { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody]LoginRequest request)
        {
            var context = await _interaction.GetAuthorizationContextAsync(request.ReturnUrl);
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user != null && context != null)
            {
                await _userSignInManager.SignInAsync(user, true);

                return new JsonResult(new { RedirectUrl = request.ReturnUrl, IsOk = true });
            }

            return Unauthorized();
        }

        [HttpGet]
		[Route("Logout")]
        public async Task<IActionResult> Logout(string logoutId)
        {
            var context = await _interaction.GetLogoutContextAsync(logoutId);
            bool showSignoutPrompt = true;

            if (context?.ShowSignoutPrompt == false)
            {
                // it's safe to automatically sign-out
                showSignoutPrompt = false;
            }

            if (User?.Identity.IsAuthenticated == true)
            {
                // delete local authentication cookie
                await _userSignInManager.SignOutAsync();
            }

            // no external signout supported for now (see \Quickstart\Account\AccountController.cs TriggerExternalSignout)
            return Ok(new
            {
                showSignoutPrompt,
                ClientName = string.IsNullOrEmpty(context?.ClientName) ? context?.ClientId : context?.ClientName,
                context?.PostLogoutRedirectUri,
                context?.SignOutIFrameUrl,
                logoutId
            });
        }

        [HttpGet]
        [Route("Error")]
        public async Task<IActionResult> Error(string errorId)
        {
            // retrieve error details from identityserver
            var message = await _interaction.GetErrorContextAsync(errorId);

            if (message != null)
            {
                if (!_environment.IsDevelopment())
                {
                    // only show in development
                    message.ErrorDescription = null;
                }
            }

            return Ok(message);
        }
    }
}
