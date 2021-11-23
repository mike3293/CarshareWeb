using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.Configuration
{
    public class MongoDbConfig
    {
        public string Name { get; init; }
        public string ConnectionString { get; init; }
    }
}
