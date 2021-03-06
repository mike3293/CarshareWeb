using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace ConfigurationApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.ConfigureAppConfiguration((hostingContext, config) =>
                    {
                        if (!hostingContext.HostingEnvironment.IsDevelopment())
                        {
                            var settings = config.Build();
                            var connection = settings.GetConnectionString("AppConfig");
                            config.AddAzureAppConfiguration(connection);
                        }
                    }).UseStartup<Startup>();
                });
    }
}
