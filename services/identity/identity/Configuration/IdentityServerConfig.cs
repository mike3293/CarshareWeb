using IdentityServer4.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.Configuration
{
    public class Certificate
    {
        public string Path { get; init; }

        public string Password { get; init; }
    }

    public class IdentityServerConfig
    {

        public IReadOnlyCollection<ApiScope> ApiScopes { get; init; }

        public IReadOnlyCollection<ApiResource> ApiResources { get; init; }

        public IReadOnlyCollection<Client> Clients { get; init; }

        public IReadOnlyCollection<IdentityResource> IdentityResources =>
            new IdentityResource[]
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile()
            };

        public Certificate Certificate { get; init; }
    }
}
