using ConfigurationApi.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
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


        public async Task<List<ProviderWithCars>> GetCarBrandingsAsync()
        {
            using var httpClient = new HttpClient();

            using var response = await httpClient.GetAsync($"{_config.PublicCarsApiUri}/publicCars/branding");
            var contentStream = await response.Content.ReadAsStreamAsync();
            using var streamReader = new StreamReader(contentStream);

            using var jsonReader = new JsonTextReader(streamReader);
            var serializer = new JsonSerializer();

            var brandings = serializer.Deserialize<List<ProviderWithCars>>(jsonReader);

            return brandings;
        }
    }
}
