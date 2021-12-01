﻿using Microsoft.Extensions.Logging;
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
        private readonly ApisConfig _config;

        private readonly ILogger<ExternalPublicCarsApiClient> _logger;


        public ExternalPublicCarsApiClient(IOptions<ApisConfig> options, ILogger<ExternalPublicCarsApiClient> logger)
        {
            _config = options.Value;
            _logger = logger;
        }


        public async Task<List<ExternalCar>> GetExternalCarsAsync()
        {
#if DEBUG
            using var streamReader = new StreamReader("defaultResponse.json");
#else
            using var streamReader = new StreamReader("defaultResponse.json");
            //using var httpClient = new HttpClient();

            //using var response = await httpClient.GetAsync(_config.ExternalPublicCarsApiUri);
            //var contentStream = await response.Content.ReadAsStreamAsync();
            //using var streamReader = new StreamReader(contentStream);
#endif

            using var jsonReader = new JsonTextReader(streamReader);
            var serializer = new JsonSerializer();

            var cars = serializer.Deserialize<List<ExternalCar>>(jsonReader);

            return cars;
        }
    }
}