using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using RouteCalculatorApi.ApiClient.ConfigurationApi;
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

            var baseTariff = carPrice.PackageTariffs.Single(t => t.IsBase);

            var prices = carPrice.PackageTariffs.Select(t =>
            {
                int cost = 0;

                cost += t.KopecksCost ?? 0;


                if (t.ParkingMinutesIncluded > 0)
                {
                    var exceedingParkingMinutes = (int)(route.MinutesParking - t.ParkingMinutesIncluded);
                    if (exceedingParkingMinutes > 0)
                    {
                        cost += exceedingParkingMinutes * (t.KopecksPerMinuteParking ?? baseTariff.KopecksPerMinuteParking ?? 0);
                    }

                    var exceedingMinutes = route.MinutesDriving - (t.MinutesIncluded ?? 0);
                    if (exceedingMinutes > 0)
                    {
                        cost += exceedingMinutes * (t.KopecksPerMinute ?? baseTariff.KopecksPerMinute ?? 0);
                    }
                } 
                else
                {
                    var exceedingMinutes = route.MinutesDriving + route.MinutesParking - (t.MinutesIncluded ?? 0);
                    if (exceedingMinutes > 0)
                    {
                        cost += exceedingMinutes * (t.KopecksPerMinute ?? baseTariff.KopecksPerMinute ?? 0);
                    }
                }

                // TODO: vezuha after package exeeded
                var exceedingKilometers = (int)Math.Ceiling((double)route.Meters / 1000) - (t.KilometersIncluded ?? 0);
                if (exceedingKilometers > 0)
                {
                    cost += exceedingKilometers * (t.KopecksPerKilometer ?? baseTariff.KopecksPerKilometer ?? 0);
                }

                return new PriceResponse(cost, t.Name);
            });

            return Ok(prices);
        }
    }
}
