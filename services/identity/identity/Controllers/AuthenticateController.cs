using Identity.Models;
using Identity.Models.Requests;
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

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var context = await _interaction.GetAuthorizationContextAsync(request.ReturnUrl);
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user is not null && context is not null)
            {
                await _userSignInManager.SignInAsync(user, true);

                return Ok(new { RedirectUrl = request.ReturnUrl, IsOk = true });
            }

            return Unauthorized();
        }

        [HttpPost("sign-up")]
        public async Task<IActionResult> Register([FromBody] LoginRequest request)
        {
            var context = await _interaction.GetAuthorizationContextAsync(request.ReturnUrl);

            if (context is null)
            {
                return Unauthorized();
            }

            var appUser = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email
            };

            var result = await _userManager.CreateAsync(appUser, request.Password);
            // TODO: Move role to config
            await _userManager.AddToRoleAsync(appUser, "User");

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user is not null)
            {
                await _userSignInManager.SignInAsync(user, true);

                return Ok(new { RedirectUrl = request.ReturnUrl, IsOk = true });
            }

            return Unauthorized();
        }

        [HttpGet("logout")]
        public async Task<IActionResult> Logout(string logoutId)
        {
            var context = await _interaction.GetLogoutContextAsync(logoutId);
            bool showSignoutPrompt = true;

            if (context?.ShowSignoutPrompt == false)
            {
                showSignoutPrompt = false;
            }

            if (User?.Identity.IsAuthenticated == true)
            {
                await _userSignInManager.SignOutAsync();
            }

            return Ok(new
            {
                showSignoutPrompt,
                ClientName = string.IsNullOrEmpty(context?.ClientName) ? context?.ClientId : context?.ClientName,
                context?.PostLogoutRedirectUri,
                context?.SignOutIFrameUrl,
                logoutId
            });
        }

        [HttpGet("error")]
        public async Task<IActionResult> Error(string errorId)
        {
            var message = await _interaction.GetErrorContextAsync(errorId);

            if (message != null)
            {
                if (!_environment.IsDevelopment())
                {
                    message.ErrorDescription = null;
                }
            }

            return Ok(message);
        }
    }
}
