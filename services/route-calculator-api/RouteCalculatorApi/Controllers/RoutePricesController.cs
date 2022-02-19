using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using RouteCalculatorApi.ApiClient.ConfigurationApi;
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
    [Route("api/[controller]")]
    public class RoutePricesController : ControllerBase
    {
        private readonly ConfigurationApiClient _configurationApiClient;

        private readonly ILogger<RoutePricesController> _logger;


        public RoutePricesController(ILogger<RoutePricesController> logger, ConfigurationApiClient configurationApiClient)
        {
            _logger = logger;
            _configurationApiClient = configurationApiClient;
        }


        [HttpPost]
        public async Task<ActionResult<IEnumerable<PriceResponse>>> CalculatePrices(RouteInfoRequest route)
        {
            var carPrice = await _configurationApiClient.GetCarPriceAsync(route.Car.ProviderId, route.Car.Model);

            if (carPrice is null)
            {
                return NotFound();
            }

            var prices = carPrice.PackageTariffs.Select(t =>
            {
                int cost = 0;

                cost += t.KopecksCost;

                // TODO: vezuha after package exeeded
                var exceedingKilometers = (int)Math.Ceiling((double)route.Meters / 1000) - t.KilometersIncluded;
                if (exceedingKilometers > 0)
                {
                    cost += exceedingKilometers * t.KopecksPerKilometer;
                }

                if (t.ParkingMinutesIncluded > 0)
                {
                    var exceedingParkingMinutes = route.MinutesParking - t.ParkingMinutesIncluded;
                    if (exceedingParkingMinutes > 0)
                    {
                        cost += exceedingParkingMinutes * t.KopecksPerMinuteParking;
                    }

                    var exceedingMinutes = route.MinutesDriving - t.MinutesIncluded;
                    if (exceedingMinutes > 0)
                    {
                        cost += exceedingMinutes * t.KopecksPerMinute;
                    }
                } 
                else
                {
                    var exceedingMinutes = route.MinutesDriving + route.MinutesParking - t.MinutesIncluded;
                    if (exceedingMinutes > 0)
                    {
                        cost += exceedingMinutes * t.KopecksPerMinute;
                    }
                }

                return new PriceResponse(cost, t.Name);
            });

            return Ok(prices);
        }
    }
}
