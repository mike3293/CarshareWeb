using ConfigurationApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHostedService<WarmUpService>();

builder.Services.AddHealthChecks();

builder.Services.AddCors();

var app = builder.Build();

app.UseCors(
    options => options.WithOrigins("*").AllowAnyMethod().AllowAnyHeader()
);

app.UseHttpsRedirection();

app.MapHealthChecks("/api/healthz");

app.Run();