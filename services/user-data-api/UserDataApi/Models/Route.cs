using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UserDataApi.Models
{
    public class Route
    {
        [BsonId]
        public string UserId { get; set; }

        public IList<Waypoint> Waypoints { get; set; }
    }
}
