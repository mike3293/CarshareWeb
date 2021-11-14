using PublicCarsApi.Models.Requests;
using System.Collections.Generic;
using System.Linq;

namespace PublicCarsApi.Models.Responses
{
    public class ProviderWithCars : Provider
    {
        public string PinUrl { get; set; }

        public IEnumerable<Car> Cars { get; set; }


        public ProviderWithCars(IGrouping<ExternalProvider, Car> groupedCars) : base(groupedCars.Key)
        {
            PinUrl = groupedCars.Key.PinUrl;
            Cars = groupedCars;
        }
    }
}
