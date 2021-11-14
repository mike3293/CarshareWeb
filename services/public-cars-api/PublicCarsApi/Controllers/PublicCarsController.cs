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
        public async Task<IEnumerable<ProviderWithCars>> GetPublicCarsAsync([FromQuery] FilterOptions filters)
        {
            //using var httpClient = new HttpClient();

            //using var response = await httpClient.GetAsync("https://us-central1-carsharinghub.cloudfunctions.net/cachedcars");
            //var contentStream = await response.Content.ReadAsStreamAsync();

            using StreamReader contentStream = System.IO.File.OpenText("defaultResponse.json");

            using var jsonReader = new JsonTextReader(contentStream);
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
    }
}
