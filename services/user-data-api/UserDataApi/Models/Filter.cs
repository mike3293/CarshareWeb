using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UserDataApi.Models
{
    public class Filter
    {
        [BsonId]
        public string UserId { get; set; }

        public IList<string> ProviderIds { get; set; }
    }
}
