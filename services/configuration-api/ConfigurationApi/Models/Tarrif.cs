using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfigurationApi.Models
{
    public class Tarrif
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public Provider Provider { get; set; }

        public IEnumerable<CarPrice> CarPrices { get; set; }
    }
}
