using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RouteCalculatorApi.Models.Requests
{
    public record RouteInfoRequest
    {
        public CarSummary Car { get; init; }

        /// In meters
        public int Distance { get; init; }

        /// In minutes
        public int TravelTime { get; init; }

        /// In minutes
        public int ParkingTime { get; init; }
    }
}
