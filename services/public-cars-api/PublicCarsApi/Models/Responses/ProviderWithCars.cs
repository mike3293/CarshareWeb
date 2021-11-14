using PublicCarsApi.Models.Requests;
using System.Collections.Generic;
using System.Linq;

namespace PublicCarsApi.Models.Responses
{
    public class ProviderWithCars
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string PinUrl { get; set; }

        public string LogoUrl { get; set; }

        public IEnumerable<Car> Cars { get; set; }


        public ProviderWithCars(IGrouping<ExternalProvider, Car> groupedCars)
        {
            Id = groupedCars.Key.Id;
            Name = groupedCars.Key.Name;
            PinUrl = groupedCars.Key.PinUrl;
            LogoUrl = groupedCars.Key.LogoUrl;
            Cars = groupedCars;
        }
    }
}
