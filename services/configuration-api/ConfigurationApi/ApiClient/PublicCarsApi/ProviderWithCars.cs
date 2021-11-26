using ConfigurationApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfigurationApi.ApiClient.PublicCarsApi
{
    public class ProviderWithCars : Provider
    {
        public IEnumerable<Car> Cars { get; set; }
    }
}
