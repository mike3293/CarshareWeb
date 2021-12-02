using IdentityModel.Client;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace RouteCalculatorApi.Extensions
{
    public static class HttpClientAuthExtension
    {
        public static async Task<string> ApplyAuthAsync(this HttpClient httpClient, string serverUri)
        {
            var disco = await httpClient.GetDiscoveryDocumentAsync(serverUri);

            if (disco.IsError)
            {
                return disco.Error;
            }

            var tokenResponse = await httpClient.RequestClientCredentialsTokenAsync(new ClientCredentialsTokenRequest
            {
                Address = disco.TokenEndpoint,

                ClientId = "route-calculator-api",
                ClientSecret = "carshare",
                Scope = "configuration.read"
            });

            if (tokenResponse.IsError)
            {
                return tokenResponse.Error;
            }
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = tokenHandler.ReadJwtToken(tokenResponse.AccessToken);

            httpClient.SetBearerToken(tokenResponse.AccessToken);

            return null;
        }
    }
}
