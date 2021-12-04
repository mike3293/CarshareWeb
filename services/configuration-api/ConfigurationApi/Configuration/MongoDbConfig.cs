using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfigurationApi.Configuration
{
    public class MongoDbConfig
    {
        public string ConnectionString { get; init; }

        public string ConfigurationDbName { get; init; }

        public string TarrifsCollection { get; init; }
    }
}
