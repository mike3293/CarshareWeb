using Identity.Configuration;
using Identity.Models;
using Identity.Services;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;

namespace Identity
{
    public class Startup
    {
        public IWebHostEnvironment Environment { get; }
        public IConfiguration Configuration { get; }


        public Startup(IWebHostEnvironment environment, IConfiguration configuration)
        {
            Environment = environment;
            Configuration = configuration;
        }


        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();

            services.AddSingleton<ICorsPolicyService>((container) =>
            {
                var logger = container.GetRequiredService<ILogger<DefaultCorsPolicyService>>();
                return new DefaultCorsPolicyService(logger)
                {
                    // TODO: adjust
                    AllowAll = true
                };
            });

            var mongoDbSettings = Configuration.GetSection(nameof(MongoDbConfig)).Get<MongoDbConfig>();

            services.AddIdentity<ApplicationUser, ApplicationRole>()
                .AddClaimsPrincipalFactory<AppClaimsPrincipalFactory>()
                .AddMongoDbStores<ApplicationUser, ApplicationRole, Guid>(mongoDbSettings.ConnectionString, mongoDbSettings.Name);

            services.Configure<IdentityOptions>(options =>
            {
                // Password settings.
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 6;
                options.Password.RequiredUniqueChars = 1;

                options.User.RequireUniqueEmail = true;
            });

            var identityServerSettings = Configuration.GetSection(nameof(IdentityServerConfig)).Get<IdentityServerConfig>();

            var identityServerBuilder = services.AddIdentityServer(options =>
            {
                options.Events.RaiseFailureEvents = true;
                options.Events.RaiseErrorEvents = true;
                options.Authentication.CookieSlidingExpiration = true;
                options.UserInteraction.LoginUrl = "/index.html";
                options.UserInteraction.LogoutUrl = "/logout.html";
                options.UserInteraction.ErrorUrl = "/error.html";
            })
            .AddAspNetIdentity<ApplicationUser>()
            .AddInMemoryApiResources(identityServerSettings.ApiResources)
            .AddInMemoryApiScopes(identityServerSettings.ApiScopes)
            .AddInMemoryClients(identityServerSettings.Clients)
            .AddInMemoryIdentityResources(identityServerSettings.IdentityResources)
            .AddProfileService<ProfileService>();

            var certificate = X509Certificate2.CreateFromEncryptedPemFile("Cert/cert.pem", identityServerSettings.Certificate.Password, "Cert/cert-key.pem");

            identityServerBuilder.AddSigningCredential(certificate);

            services.AddControllers();

            services.Configure<IdentityDataInitializerConfig>(Configuration.GetSection(nameof(IdentityDataInitializerConfig)));

            services.AddHostedService<IdentityDataInitializerService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (!env.IsDevelopment())
            {
                app.Use(async (ctx, next) =>
                {
                    ctx.Request.Scheme = "https";

                    await next();
                });
            }

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // "https://carshare-web.vercel.app"
            app.UseCors(
                options => options.WithOrigins("*").AllowAnyMethod().AllowAnyHeader()
            );

            app.UseHttpsRedirection();

            app.UseStaticFiles();

            app.UseRouting();

            app.UseIdentityServer();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
