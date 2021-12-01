using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using RouteCalculatorApi.ApiClient.PublicCarsApi;
using RouteCalculatorApi.Models;
using RouteCalculatorApi.Models.Requests;
using RouteCalculatorApi.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RouteCalculatorApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RoutePricesController : ControllerBase
    {
        private readonly ConfigurationApiClient _configurationApiClient;

        private readonly ILogger<RoutePricesController> _logger;


        public RoutePricesController(ILogger<RoutePricesController> logger, ConfigurationApiClient configurationApiClient)
        {
            _logger = logger;
            _configurationApiClient = configurationApiClient;
        }


        [HttpGet]
        public async Task<ActionResult<PriceResponse>> GetPrice(RouteInfoRequest route)
        {
            var carPrice = await _configurationApiClient.GetCarPriceAsync(route.Car.ProviderId, route.Car.Model);

            if (carPrice is null)
            {
                return NotFound();
            }

            var price = carPrice.PerMinCost * route.TravelTime + carPrice.PerMinParkingCost * route.ParkingTime;

            return new PriceResponse(price, TariffType.Minute);
        }
    }
}
