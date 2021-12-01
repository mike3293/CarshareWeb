using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfigurationApi.ApiClient.PublicCarsApi
{
    public class CarPrice
    {
        public string Model { get; set; }

        public string Brand { get; set; }

        public int PerMinCost { get; set; }

        public int PerMinParkingCost { get; set; }
    }
}
