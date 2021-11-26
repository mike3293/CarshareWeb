using PublicCarsApi.ApiClients.PublicCarsApi;
using PublicCarsApi.Models.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PublicCarsApi.Models.Responses
{
    public class CarBranding
    {
        public string Brand { get; set; }

        public string Model { get; set; }


        public CarBranding()
        {
        }

        public CarBranding(ExternalCar externalCar)
        {
            Brand = externalCar.Brand;
            Model = externalCar.Model;
        }
    }
}
