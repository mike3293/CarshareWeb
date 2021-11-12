using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
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
        public async Task<dynamic> GetPublicCarsAsync()
        {
            //using var httpClient = new HttpClient();

            //using var response = await httpClient.GetAsync("https://us-central1-carsharinghub.cloudfunctions.net/cachedcars");
            //var stringResponse = await response.Content.ReadAsStringAsync();

            //// reservationList = JsonConvert.DeserializeObject<List<Reservation>>(apiResponse);

            using StreamReader SourceReader = System.IO.File.OpenText("defaultResponse.json");
            var response = await SourceReader.ReadToEndAsync();

            return Content(response, "application/json");
        }
    }
}
