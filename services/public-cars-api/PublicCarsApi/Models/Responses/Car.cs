using PublicCarsApi.Models.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PublicCarsApi.Models.Responses
{
    public class Car
    {
        public string Id { get; set; }

        public double Lat { get; set; }

        public double Lon { get; set; }

        public int Fuel { get; set; }

        public string Reg { get; set; }

        public string Brand { get; set; }

        public string Model { get; set; }

        public string ImageUrl { get; set; }


        public Car(ExternalCar externalCar)
        {
            Id = externalCar.Id;
            Lat = externalCar.LatPrecise ?? externalCar.Lat;
            Lon = externalCar.LonPrecise ?? externalCar.Lon;
            Fuel = externalCar.Fuel;
            Reg = externalCar.Reg;
            Brand = externalCar.Brand;
            Model = externalCar.Model;
            ImageUrl = externalCar.ImageUrl;
        }
    }
}
