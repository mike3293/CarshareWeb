using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using PublicCarsApi.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace PublicCarsApi.ApiClients.PublicCarsApi
{
    public class ExternalPublicCarsApiClient
    {
        private readonly ExternalCarsConfig _config;


        public ExternalPublicCarsApiClient(IOptions<ExternalCarsConfig> options)
        {
            _config = options.Value;
        }


        virtual public async Task<List<ExternalCar>> GetExternalCarsAsync()
        {
            if (_config.Enabled)
            {
                using var httpClient = new HttpClient();

                using var response = await httpClient.GetAsync(_config.ExternalPublicCarsApiUri);
                var contentStream = await response.Content.ReadAsStreamAsync();
                using var streamReader = new StreamReader(contentStream);

                return DeserializeCars(streamReader);
            }
            else
            {
                using var streamReader = new StreamReader("defaultResponse.json");

                return DeserializeCars(streamReader);
            }
        }

        private static List<ExternalCar> DeserializeCars(StreamReader streamReader)
        {
            using var jsonReader = new JsonTextReader(streamReader);
            var serializer = new JsonSerializer();

            var cars = serializer.Deserialize<List<ExternalCar>>(jsonReader);

            return cars;
        }
    }
}
