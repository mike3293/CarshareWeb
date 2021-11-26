using Identity.Configuration;
using Identity.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace Identity.Services
{
    public class IdentityDataInitializerService : IHostedService
    {
        private readonly IServiceProvider _serviceProvider;

        private readonly IdentityDataInitializerConfig _config;

        private readonly ILogger<IdentityDataInitializerService> _logger;


        public IdentityDataInitializerService(IServiceProvider serviceProvider, IOptions<IdentityDataInitializerConfig> options, ILogger<IdentityDataInitializerService> logger)
        {
            _serviceProvider = serviceProvider;
            _config = options.Value;
            _logger = logger;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("{name} is running.", nameof(IdentityDataInitializerService));

            using var scope = _serviceProvider.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();

            foreach (var roleName in _config.Roles)
            {
                var roleExist = await roleManager.RoleExistsAsync(roleName);
                if (!roleExist)
                {
                    await roleManager.CreateAsync(new ApplicationRole(roleName));
                    _logger.LogInformation("Role '{role}' created.", roleName);
                }
            }

            foreach (var user in _config.Users)
            {
                var userExist = await userManager.FindByEmailAsync(user.Email);
                if (userExist is null)
                {
                    var appUser = new ApplicationUser
                    {
                        UserName = user.Email,
                        Email = user.Email,
                        EmailConfirmed = true
                    };

                    await userManager.CreateAsync(appUser, user.Password);
                    await userManager.AddToRoleAsync(appUser, user.Role);
                    _logger.LogInformation("User '{user}' created.", appUser.Email);

                    if (user?.IsMainAdmin ?? false)
                    {
                        await userManager.AddClaimAsync(appUser, new Claim("is_main_admin", "true"));
                        _logger.LogInformation("is_main_admin claim added to {user}.", appUser.Email);
                    }
                }
            }

            _logger.LogInformation("{name} finished the initialization.", nameof(IdentityDataInitializerService));
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}
