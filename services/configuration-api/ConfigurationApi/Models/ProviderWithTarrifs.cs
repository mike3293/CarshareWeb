using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace ConfigurationApi.Models
{
    public class ProviderWithTarrifs
    {
        [BsonId]
        new public string Id { get; set; }

        public string Name { get; set; }

        public string LogoUrl { get; set; }

        public IList<CarPrice> CarPrices { get; set; }
    }
}
