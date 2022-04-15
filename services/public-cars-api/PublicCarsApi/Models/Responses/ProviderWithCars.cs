using PublicCarsApi.ApiClients.PublicCarsApi;
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
            var pinUrlGetted = _pinsMap.TryGetValue(groupedCars.Key.Id, out var pinUrl);
            PinUrl = pinUrlGetted ? pinUrl : groupedCars.Key.PinUrl;
            Cars = groupedCars;
        }


        // Temporary mapping
        private static IDictionary<string, string> _pinsMap = new Dictionary<string, string>()
        {
            { "Hellominsk", "https://firebasestorage.googleapis.com/v0/b/carsharinghub.appspot.com/o/Hello%2Fpicker_hello.png?alt=media&token=82accb2b-91cd-44dc-9b3a-f8667a4c9a25" },
            { "DriveTime", "https://firebasestorage.googleapis.com/v0/b/carsharinghub.appspot.com/o/Anytime%2Fpicker_anytime.png?alt=media&token=cd9b1f57-924a-4f43-bec4-55e319ddcb40" },
            { "MultiMotors", "https://firebasestorage.googleapis.com/v0/b/carsharinghub.appspot.com/o/MultiMotors%2FmultimotorsPin.png?alt=media&token=6be9b67d-ecec-4f84-8b70-451e608ccc74" }
        };
    }
}
