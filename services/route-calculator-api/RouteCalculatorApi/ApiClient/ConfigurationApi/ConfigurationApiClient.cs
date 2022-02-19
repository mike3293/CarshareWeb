using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using RouteCalculatorApi.Configuration;
using RouteCalculatorApi.Extensions;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

namespace RouteCalculatorApi.ApiClient.ConfigurationApi
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

            var errorMessage = await httpClient.ApplyAuthAsync(_config.IdentityServerUri);

            if(errorMessage is not null)
            {
                _logger.LogError("'{error}' error appears on auth.", errorMessage);
            }

            using var response = await httpClient.GetAsync($"{_config.ConfigurationApiUri}/tarrifs/providers/{providerId}/cars/{model}");

            var contentStream = await response.Content.ReadAsStreamAsync();
            using var streamReader = new StreamReader(contentStream);

            using var jsonReader = new JsonTextReader(streamReader);
            var serializer = new JsonSerializer();

            var carPrice = serializer.Deserialize<CarPrice>(jsonReader);

            return carPrice;
        }
    }
}
