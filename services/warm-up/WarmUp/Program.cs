using ConfigurationApi.Configuration;
using ConfigurationApi.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

if (!builder.Environment.IsDevelopment())
{
    builder.Host.ConfigureAppConfiguration(config =>
    {
        var connectionString = builder.Configuration.GetConnectionString("AppConfig");
        config.AddAzureAppConfiguration(connectionString);
    });
}

builder.Services.Configure<ApisConfig>(builder.Configuration.GetSection(nameof(ApisConfig)));

builder.Services.AddHostedService<WarmUpService>();

builder.Services.AddHealthChecks();

builder.Services.AddCors();

var app = builder.Build();

// "https://carshare-web.vercel.app"
app.UseCors(
    options => options.WithOrigins("*").AllowAnyMethod().AllowAnyHeader()
);

app.UseHttpsRedirection();

app.MapHealthChecks("/api/healthz");

app.Run();