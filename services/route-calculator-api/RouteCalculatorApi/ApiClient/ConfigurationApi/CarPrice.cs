using System.Collections.Generic;

namespace RouteCalculatorApi.ApiClient.ConfigurationApi
{
    public class CarPrice
    {
        public string Model { get; set; }

        public string Brand { get; set; }

        public IList<PackageTariff> PackageTariffs { get; set; }
    }
}
