using ConfigurationApi.ApiClient.PublicCarsApi;
using ConfigurationApi.Configuration;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using ConfigurationApi.Models;

namespace ConfigurationApi.Services
{
    public class TarrifsDataInitializerService : IHostedService
    {
        private readonly IServiceProvider _serviceProvider;

        private readonly ILogger<TarrifsDataInitializerService> _logger;

        private readonly TarrifsService _tarrifsService;


        public TarrifsDataInitializerService(IOptions<ApisConfig> options, IServiceProvider serviceProvider, ILogger<TarrifsDataInitializerService> logger, TarrifsService tarrifsService)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
            _tarrifsService = tarrifsService;
        }


        public async Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("{name} is running.", nameof(TarrifsDataInitializerService));

            using var scope = _serviceProvider.CreateScope();
            var publicCarsApiClient = scope.ServiceProvider.GetRequiredService<PublicCarsApiClient>();

            var brandings = await publicCarsApiClient.GetCarBrandingsAsync();

            var existingTarrifs = await _tarrifsService.GetAll();

            foreach (var branding in brandings)
            {
                if (!existingTarrifs.Any(t => t.Provider.Id == branding.Id))
                {
                    // TODO add mapper
                    var tarrif = new ProviderWithTarrifs()
                    {
                        Provider = new Provider() { Id = branding.Id, Name = branding.Name, LogoUrl = branding.LogoUrl },
                        CarPrices = branding.Cars.Select(c => new CarPrice() { Model = c.Model, Brand = c.Brand })
                    };

                    await _tarrifsService.Create(tarrif);

                    _logger.LogInformation("Tarrif for {providerId} created.", tarrif.Provider.Id);
                }
            }

            // TODO: add new cars initialization

            _logger.LogInformation("{name} finished the initialization.", nameof(TarrifsDataInitializerService));
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}
