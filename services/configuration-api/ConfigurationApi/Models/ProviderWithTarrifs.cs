using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace ConfigurationApi.Models
{
    public class ProviderWithTarrifs
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public Provider Provider { get; set; }

        public IList<CarPrice> CarPrices { get; set; }
    }
}
