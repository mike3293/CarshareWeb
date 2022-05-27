using Newtonsoft.Json;

namespace ConfigurationApi.Services
{
    public class WarmUpService : IHostedService, IDisposable
    {
        private readonly ILogger<WarmUpService> _logger;
        private readonly IConfiguration _config;
        private Timer _timer = null!;

        public WarmUpService(IConfiguration configuration, ILogger<WarmUpService> logger)
        {
            _config = configuration;
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

            var jsonArray = _config["WarmUpEndpoints"];
            var endpoints = JsonConvert.DeserializeObject<string[]>(jsonArray) ?? Array.Empty<string>();

            try
            {
                var requests = endpoints.Select(uri => httpClient.GetAsync(uri)).ToList();

                await Task.WhenAll(requests);

                var responses = requests.Select(task => task.Result);

                foreach (var response in responses)
                {
                    if (response.IsSuccessStatusCode)
                    {
                        _logger.LogInformation(
                            "Response status code of warmup request to '{appUri}' is {status}",
                            response.RequestMessage?.RequestUri,
                            response.StatusCode);
                    }
                    else
                    {
                        _logger.LogError(
                            "Response status code of warmup request to '{appUri}' is {status}",
                            response.RequestMessage?.RequestUri,
                            response.StatusCode);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    ex.Message);
            }
        }

        public Task StopAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Timed Warm Up Service stopping.");

            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}
