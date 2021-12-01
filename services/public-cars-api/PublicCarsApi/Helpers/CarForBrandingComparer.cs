using PublicCarsApi.ApiClients.PublicCarsApi;
using PublicCarsApi.Models.Requests;
using PublicCarsApi.Models.Responses;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace PublicCarsApi.Helpers
{
    public class CarForBrandingComparer : IEqualityComparer<ExternalCar>
    {
        public bool Equals(ExternalCar x, ExternalCar y)
        {
            return x is not null && y is not null && x.Model == y.Model && x.Provider.Id == y.Provider.Id;
        }

        public int GetHashCode(ExternalCar obj)
        {
            return HashCode.Combine(obj.Model, obj.Provider.Id);
        }
    }
}
