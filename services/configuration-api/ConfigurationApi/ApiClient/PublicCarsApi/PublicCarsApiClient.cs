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

namespace ConfigurationApi.ApiClient.PublicCarsApi
{
    public class PublicCarsApiClient
    {
        private readonly ApisConfig _config;

        private readonly ILogger<PublicCarsApiClient> _logger;


        public PublicCarsApiClient(IOptions<ApisConfig> options, ILogger<PublicCarsApiClient> logger)
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
