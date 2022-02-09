using ConfigurationApi.Configuration;
using Microsoft.Extensions.Options;

namespace ConfigurationApi.Services
{
    public class WarmUpService : IHostedService, IDisposable
    {
        private readonly ILogger<WarmUpService> _logger;
        private readonly ApisConfig _config;
        private Timer _timer = null!;

        public WarmUpService(IOptions<ApisConfig> options, ILogger<WarmUpService> logger)
        {
            _config = options.Value;
            _logger = logger;
        }

        public Task StartAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Timed Warm Up Service running.");

            _timer = new Timer(WarmUp, null, TimeSpan.Zero, TimeSpan.FromMinutes(30));

            return Task.CompletedTask;
        }

        private async void WarmUp(object? state)
        {
            using var httpClient = new HttpClient();

            var uris = new string[]
            {
                _config.IdentityServerUri + "/api",
                _config.PublicCarsApiUri,
                _config.ConfigurationApiUri,
                _config.RouteCalculatorApiUri,
                _config.UserDataApiUri
            };

            var requests = uris.Select(uri => httpClient.GetAsync($"{uri}/healthz")).ToList();

            await Task.WhenAll(requests);

            var responses = requests.Select(task => task.Result);

            foreach (var response in responses)
            {
                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation(
                        "Response status code of warmup request to '{appUri}' is {status}",
                        response.RequestMessage?.RequestUri,
                        response.StatusCode
                    );
                }
                else
                {
                    _logger.LogError(
                        "Response status code of warmup request to '{appUri}' is {status}", 
                        response.RequestMessage?.RequestUri, 
                        response.StatusCode
                    );
                }
            }
        }

        public Task StopAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Timed Warm Up Service running.");

            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}
