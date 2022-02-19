using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RouteCalculatorApi.Models.Responses
{
    public record class PriceResponse(int Kopecks, string Name);
}
