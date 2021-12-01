using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RouteCalculatorApi.Models.Requests
{
    public record CarSummary
    {
        public string Model { get; init; }

        public string ProviderId { get; init; }
    }
}
