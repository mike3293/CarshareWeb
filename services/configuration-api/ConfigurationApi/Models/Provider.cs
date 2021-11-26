using ConfigurationApi.ApiClient.PublicCarsApi;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfigurationApi.Models
{
    public class Provider
    {
        public string Id { get; set; }

        public string Name { get; set; }
    }
}
