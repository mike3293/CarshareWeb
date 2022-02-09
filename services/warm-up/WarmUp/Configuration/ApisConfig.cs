using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfigurationApi.Configuration
{
    public record class ApisConfig(string IdentityServerUri, string PublicCarsApiUri, string ConfigurationApiUri, string RouteCalculatorApiUri, string UserDataApiUri);
}
