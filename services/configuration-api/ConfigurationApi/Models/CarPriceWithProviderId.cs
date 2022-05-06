using System.Collections.Generic;

namespace ConfigurationApi.Models
{
    public class CarPriceWithProviderId
    {
        public string Model { get; set; }

        public string ProviderId { get; set; }

        public IList<PackageTariff> PackageTariffs { get; set; }


        public CarPriceWithProviderId()
        {
            PackageTariffs = new List<PackageTariff>();
        }

        public CarPriceWithProviderId(string model, string providerId, IList<PackageTariff> packageTariffs)
        {
            Model = model;
            ProviderId = providerId;
            PackageTariffs = packageTariffs;
        }
    }
}
