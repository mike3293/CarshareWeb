using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using PublicCarsApi.ApiClients.PublicCarsApi;
using PublicCarsApi.Helpers;
using PublicCarsApi.Models.Requests;
using PublicCarsApi.Models.Responses;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace PublicCarsApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PublicCarsController : ControllerBase
    {
        private readonly ILogger<PublicCarsController> _logger;

        private readonly ExternalPublicCarsApiClient _externalPublicCarsApiClient;


        public PublicCarsController(ILogger<PublicCarsController> logger, ExternalPublicCarsApiClient externalPublicCarsApiClient)
        {
            _logger = logger;
            _externalPublicCarsApiClient = externalPublicCarsApiClient;
        }


        [HttpGet]
        public async Task<IEnumerable<ProviderWithCars>> GetProvidersWithCarsAsync([FromQuery] FilterOptions filters)
        {
            IEnumerable<ExternalCar> cars = await _externalPublicCarsApiClient.GetExternalCarsAsync();

            if (filters.ProviderIds is not null && filters.ProviderIds.Length != 0)
            {
                cars = cars.Where(c => filters.ProviderIds.Any(pid => pid == c.Provider.Id));
            }

            if (filters.FuelLevel is not null)
            {
                cars = cars.Where(c => c.Fuel >= filters.FuelLevel);
            }

            var groupedCars = cars.GroupBy(c => c.Provider, c => new Car(c));

            var resonse = groupedCars.Select(g => new ProviderWithCars(g));

            return resonse;
        }

        [HttpGet("providersSummary")]
        [ResponseCache(Duration = 86400, Location = ResponseCacheLocation.Any, NoStore = false)]
        public async Task<IEnumerable<Provider>> GetProvidersSummaryAsync()
        {
            var cars = await _externalPublicCarsApiClient.GetExternalCarsAsync();

            var providers = cars.Select(c => c.Provider).Distinct().Select(p => new Provider(p));

            return providers;
        }

        [HttpGet("branding")]
        [ResponseCache(Duration = 86400, Location = ResponseCacheLocation.Any, NoStore = false)]
        public async Task<IEnumerable<Provider>> GetProvidersCarTypes()
        {
            var cars = await _externalPublicCarsApiClient.GetExternalCarsAsync();

            var dist = cars.Distinct(new CarForBrandingComparer()).ToList();

            var groupedCars = dist.GroupBy(c => c.Provider, c => new CarBranding(c)).ToList();

            var resonse = groupedCars.Select(g => new ProviderWithCarBrandings(g)).ToList();

            return resonse;
        }
    }
}
