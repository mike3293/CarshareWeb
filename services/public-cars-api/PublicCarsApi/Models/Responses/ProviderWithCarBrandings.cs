using PublicCarsApi.ApiClients.PublicCarsApi;
using PublicCarsApi.Models.Requests;
using System.Collections.Generic;
using System.Linq;

namespace PublicCarsApi.Models.Responses
{
    public class ProviderWithCarBrandings : Provider
    {
        public IEnumerable<CarBranding> Cars { get; set; }


        public ProviderWithCarBrandings(IGrouping<ExternalProvider, CarBranding> groupedCars) : base(groupedCars.Key)
        {
            Cars = groupedCars;
        }
    }
}
