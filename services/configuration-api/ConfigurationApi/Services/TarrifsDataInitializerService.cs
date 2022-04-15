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

        private readonly DefaultTarrifsConfig _config;


        public TarrifsDataInitializerService(IOptions<DefaultTarrifsConfig> options, IServiceProvider serviceProvider, ILogger<TarrifsDataInitializerService> logger, TarrifsService tarrifsService)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
            _tarrifsService = tarrifsService;
            _config = options.Value;
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
                var providerTarrif = existingTarrifs.FirstOrDefault(t => t.Provider.Id == branding.Id);

                if (providerTarrif is not null)
                {
                    providerTarrif.CarPrices = providerTarrif.CarPrices.Where(cp => branding.Cars.Any(c => c.Model == cp.Model)).ToList();

                    foreach (var car in branding.Cars)
                    {
                        if (!providerTarrif.CarPrices.Any(cp => cp.Model == car.Model))
                        {
                            providerTarrif.CarPrices.Add(CreateCarPriceFrom(car));
                        }
                    }

                    await _tarrifsService.Update(providerTarrif);

                    _logger.LogInformation("Tarrifs for {providerId} updated.", providerTarrif.Provider.Id);
                }
                else
                {
                    // TODO add mapper
                    var tarrif = new ProviderWithTarrifs()
                    {
                        Provider = new Provider() { Id = branding.Id, Name = branding.Name, LogoUrl = branding.LogoUrl },
                        CarPrices = branding.Cars.Select(c => CreateCarPriceFrom(c)).ToList()
                    };

                    await _tarrifsService.Create(tarrif);

                    _logger.LogInformation("Tarrifs for {providerId} created.", tarrif.Provider.Id);
                }
            }

            _logger.LogInformation("{name} finished the initialization.", nameof(TarrifsDataInitializerService));
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }

        private CarPrice CreateCarPriceFrom(Car car)
        {
            return new CarPrice()
            {
                Model = car.Model,
                Brand = car.Brand,
                PackageTariffs = new List<PackageTariff>()
                {
                    new() { Name = "Стандартный", KopecksPerMinute = _config.PerMinCost, KopecksPerMinuteParking = _config.PerMinParkingCost, IsBase = true }
                },
            };
        }
    }
}
