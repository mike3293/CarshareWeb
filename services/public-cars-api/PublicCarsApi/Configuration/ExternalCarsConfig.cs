using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PublicCarsApi.Configuration
{
    public class ExternalCarsConfig
    {
        public bool Enabled { get; init; }

        public string ExternalPublicCarsApiUri { get; init; }
    }
}
