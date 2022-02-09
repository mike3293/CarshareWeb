using ConfigurationApi.Configuration;

var builder = WebApplication.CreateBuilder(args);

if (!builder.Environment.IsDevelopment())
{
    builder.Host.ConfigureAppConfiguration(config =>
    {
        var connectionString = builder.Configuration.GetConnectionString("AppConfig");
        config.AddAzureAppConfiguration(connectionString);
    });
}

var app = builder.Build();

// "https://carshare-web.vercel.app"
app.UseCors(
    options => options.WithOrigins("*").AllowAnyMethod().AllowAnyHeader()
);

app.UseHttpsRedirection();

var apisConfig = app.Configuration.GetSection(nameof(ApisConfig)).Get<ApisConfig>();

app.MapGet("/warm-up", async () =>
{
    using var httpClient = new HttpClient();

    await httpClient.GetAsync($"{apisConfig.ConfigurationApiUri}/healthz");
});

app.Run();