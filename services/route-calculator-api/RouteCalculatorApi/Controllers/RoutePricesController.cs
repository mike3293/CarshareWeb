using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RouteCalculatorApi.ApiClient.ConfigurationApi;
using RouteCalculatorApi.Extensions;
using RouteCalculatorApi.Models.Requests;
using RouteCalculatorApi.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace RouteCalculatorApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoutePricesController : ControllerBase
    {
        private readonly ConfigurationApiClient _configurationApiClient;


        public RoutePricesController(ConfigurationApiClient configurationApiClient)
        {
            _configurationApiClient = configurationApiClient;
        }


        [HttpPost]
        public async Task<ActionResult<IEnumerable<PriceResponse>>> CalculatePrices(RouteInfoRequest route)
        {
            var userId = User.GetUserId();

            var carPrice = await _configurationApiClient.GetCarPriceAsync(route.Car.ProviderId, route.Car.Model, userId);

            if (carPrice is null)
            {
                return NotFound();
            }

            var baseTariff = carPrice.PackageTariffs.Single(t => t.IsBase);

            var kilometers = DivideWithRoundUp(route.RouteSections.Aggregate(0m, (acc, s) => acc + s.Meters), 1000);
            var minutesParking = route.RouteSections.Aggregate(0, (acc, s) => acc + s.ParkingMinutes);
            var minutesDriving = DivideWithRoundUp(route.RouteSections.Aggregate(0m, (acc, s) => acc + s.Seconds), 60);
            var summaryMinutes = minutesParking + minutesDriving;

            var prices = carPrice.PackageTariffs.Select(t =>
            {
                int cost = 0;

                cost += t.KopecksCost ?? 0;

                if (t.ParkingMinutesIncluded > 0)
                {
                    var exceedingParkingMinutes = (int)(minutesParking - t.ParkingMinutesIncluded);
                    if (exceedingParkingMinutes > 0)
                    {
                        cost += exceedingParkingMinutes * (t.KopecksPerMinuteParking ?? baseTariff.KopecksPerMinuteParking ?? 0);
                    }

                    var exceedingMinutes = minutesDriving - (t.MinutesIncluded ?? 0);
                    if (exceedingMinutes > 0)
                    {
                        cost += exceedingMinutes * (t.KopecksPerMinute ?? baseTariff.KopecksPerMinute ?? 0);
                    }
                }
                else
                {
                    var exceededMinutes = minutesDriving + minutesParking - (t.MinutesIncluded ?? 0);

                    var exceeded = route.RouteSections.Reverse().AggregateWhile(
                        new ExceededAccumulator(),
                        (acc, s) =>
                        {
                            acc.Meters += s.Meters;
                            acc.DrivingMinutes += s.Seconds / 60;
                            acc.ParkingMinutes += s.ParkingMinutes;

                            return acc;
                        },
                        acc => acc.SummaryMinutes <= exceededMinutes,
                        (acc, s) =>
                        {
                            var minutesLeft = exceededMinutes - acc.SummaryMinutes;
                            var hasDrivingSeconds = s.Seconds > 0;
                            var metersLeft = hasDrivingSeconds ? minutesLeft * s.Meters / (s.Seconds / 60) : 0;

                            acc.Meters += metersLeft;

                            if(hasDrivingSeconds)
                            {
                                acc.DrivingMinutes += minutesLeft;
                            }
                            else
                            {
                                acc.ParkingMinutes += minutesLeft;
                            }

                            return acc;
                        });

                    if (exceeded.ParkingMinutes > 0)
                    {
                        cost += (int)Math.Ceiling(exceeded.ParkingMinutes) * (baseTariff.KopecksPerMinuteParking ?? 0);
                    }

                    if (exceeded.DrivingMinutes > 0)
                    {
                        cost += (int)Math.Ceiling(exceeded.DrivingMinutes) * (baseTariff.KopecksPerMinute ?? 0);
                    }

                    var kilometersOutOfTariff = DivideWithRoundUp(exceeded.Meters, 1000);
                    var kilometersInTariff = kilometers - kilometersOutOfTariff;
                    var exceedingKilometersInTariff = kilometersInTariff - (t.KilometersIncluded ?? 0);

                    if (exceedingKilometersInTariff > 0)
                    {
                        cost += exceedingKilometersInTariff * (t.KopecksPerKilometer ?? baseTariff.KopecksPerKilometer ?? 0);
                    }

                    if (kilometersOutOfTariff > 0)
                    {
                        cost += kilometersOutOfTariff * (baseTariff.KopecksPerKilometer ?? 0);
                    }
                }

                return new PriceResponse(cost, t.Name);
            });

            return Ok(prices);
        }

        private int DivideWithRoundUp(decimal dividend, int divider) => (int)(Math.Ceiling(dividend) + divider - 1) / divider;

        private class ExceededAccumulator
        {
            public decimal Meters { get; set; }

            public decimal DrivingMinutes { get; set; }

            public decimal ParkingMinutes { get; set; }

            public decimal SummaryMinutes { get => ParkingMinutes + DrivingMinutes; }

            public ExceededAccumulator()
            {
                Meters = 0;
                DrivingMinutes = 0;
                ParkingMinutes = 0;
            }
        }
    }
}
