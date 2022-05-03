using System.Collections.Generic;

namespace RouteCalculatorApi.Models.Requests
{
    public record RouteInfoRequest
    {
        public CarSummary Car { get; init; }

        public IList<Section> RouteSections { get; init; }
    }
}
