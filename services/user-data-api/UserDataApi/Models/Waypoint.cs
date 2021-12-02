using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UserDataApi.Models
{
    public class Waypoint
    {
        public string Id { get; set; }

        public Address Address { get; set; }

        public int? ResidenceTimeMins { get; set; }
    }
}
