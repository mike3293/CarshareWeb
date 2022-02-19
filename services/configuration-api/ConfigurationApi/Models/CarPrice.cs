using System.Collections.Generic;

namespace ConfigurationApi.Models
{
    public class CarPrice
    {
        public string Model { get; set; }

        public string Brand { get; set; }

        public IList<PackageTariff> PackageTariffs { get; set; }
    }
}
