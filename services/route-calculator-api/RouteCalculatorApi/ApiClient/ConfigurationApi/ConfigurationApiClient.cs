using ConfigurationApi.ApiClient.PublicCarsApi;
using ConfigurationApi.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using RouteCalculatorApi.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace RouteCalculatorApi.ApiClient.PublicCarsApi
{
    public class ConfigurationApiClient
    {
        private readonly ApisConfig _config;

        private readonly ILogger<ConfigurationApiClient> _logger;


        public ConfigurationApiClient(IOptions<ApisConfig> options, ILogger<ConfigurationApiClient> logger)
        {
            _config = options.Value;
            _logger = logger;
        }


        public async Task<CarPrice> GetCarPriceAsync(string providerId, string model)
        {
            using var httpClient = new HttpClient();

            using var response = await httpClient.GetAsync($"{_config.ConfigurationApiUri}/tarrifs/{providerId}/cars/{model}");
            var contentStream = await response.Content.ReadAsStreamAsync();
            using var streamReader = new StreamReader(contentStream);

            using var jsonReader = new JsonTextReader(streamReader);
            var serializer = new JsonSerializer();

            var carPrice = serializer.Deserialize<CarPrice>(jsonReader);

            return carPrice;
        }
    }
}
