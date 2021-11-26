using PublicCarsApi.ApiClients.PublicCarsApi;
using PublicCarsApi.Models.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PublicCarsApi.Models.Responses
{
    public class Provider
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string LogoUrl { get; set; }


        public Provider()
        {
        }

        public Provider(ExternalProvider externalProvider)
        {
            Id = externalProvider.Id;
            Name = externalProvider.Name;
            LogoUrl = externalProvider.LogoUrl;
        }
    }
}
