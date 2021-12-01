using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RouteCalculatorApi.Models.Requests
{
    public record RouteInfoRequest
    {
        public CarSummary Car { get; init; }

        public int Distance { get; init; }

        public int TravelTime { get; init; }

        public int ParkingTime { get; init; }
    }
}
