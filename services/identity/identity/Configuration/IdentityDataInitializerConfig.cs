using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.Configuration
{
    public class UserConfig
    {
        public string Email { get; init; }

        public string Password { get; init; }

        public string Role { get; init; }

        public bool? IsMainAdmin { get; init; }
    }

    public class IdentityDataInitializerConfig
    {
        public string[] Roles { get; init; }

        public UserConfig[] Users { get; init; }
    }
}
