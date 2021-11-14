using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using PublicCarsApi.Models.Requests;
using PublicCarsApi.Models.Responses;
using System;
using System.Collections.Generic;
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

        public PublicCarsController(ILogger<PublicCarsController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public async Task<IEnumerable<ProviderWithCars>> GetProvidersWithCarsAsync([FromQuery] FilterOptions filters)
        {
#if DEBUG
            using var streamReader = new StreamReader("defaultResponse.json");
#else
            using var httpClient = new HttpClient();

            using var response = await httpClient.GetAsync("https://us-central1-carsharinghub.cloudfunctions.net/cachedcars");
            var contentStream = await response.Content.ReadAsStreamAsync();
            using var streamReader = new StreamReader(contentStream);
#endif
            using var jsonReader = new JsonTextReader(streamReader);
            var serializer = new JsonSerializer();

            IEnumerable<ExternalCar> cars = serializer.Deserialize<List<ExternalCar>>(jsonReader);

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
        public async Task<IEnumerable<Provider>> GetProvidersSummaryAsync()
        {
#if DEBUG
            using var streamReader = new StreamReader("defaultResponse.json");
#else
            using var httpClient = new HttpClient();

            using var response = await httpClient.GetAsync("https://us-central1-carsharinghub.cloudfunctions.net/cachedcars");
            var contentStream = await response.Content.ReadAsStreamAsync();
            using var streamReader = new StreamReader(contentStream);
#endif
            using var jsonReader = new JsonTextReader(streamReader);
            var serializer = new JsonSerializer();

            var cars = serializer.Deserialize<List<ExternalCar>>(jsonReader);

            var providers = cars.Select(c => c.Provider).Distinct().Select(p => new Provider(p));

            return providers;
        }
    }
}
