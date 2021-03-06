using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UserDataApi.Configuration
{
    public class MongoDbConfig
    {
        public string ConnectionString { get; init; }

        public string UserDataDbName { get; init; }

        public string RoutesCollection { get; init; }

        public string FiltersCollection { get; init; }
    }
}
