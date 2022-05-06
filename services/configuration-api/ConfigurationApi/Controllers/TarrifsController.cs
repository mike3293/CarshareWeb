using ConfigurationApi.Models;
using ConfigurationApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace ConfigurationApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TarrifsController : ControllerBase
{
    private readonly TarrifsService _tarrifsService;

    private readonly TariffOverridesService _overridesService;


    public TarrifsController(TarrifsService tarrifsService, TariffOverridesService overridesService)
    {
        _tarrifsService = tarrifsService;
        _overridesService = overridesService;
    }


    [HttpGet]
    public async Task<IEnumerable<ProviderWithTarrifs>> GetTarrifs()
    {
        return await _tarrifsService.GetAll();
    }

    [HttpGet("providers/{providerId}/cars/{model}")]
    public async Task<ActionResult<CarPrice>> GetCarPrice(string providerId, string model, string? userId)
    {
        var provider = await _tarrifsService.GetById(providerId);

        if (provider is null)
        {
            return NotFound();
        }

        var carPrice = provider.CarPrices.FirstOrDefault(c => c.Model == model);

        if (carPrice is null)
        {
            return NotFound();
        }

        var tariffOverride = userId is not null ? await _overridesService.GetByUserId(userId) : null;
        var carOverride = tariffOverride?.CarPrices.FirstOrDefault(c => c.ProviderId == providerId && c.Model == model);

        if (carOverride is not null)
        {
            carPrice.PackageTariffs = carOverride.PackageTariffs;

            return carPrice;
        }

        return carPrice;
    }

    [HttpPut("providers/{providerId}/cars/{model}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateTarrifs(string providerId, string model, IList<PackageTariff> packageTariffs)
    {
        if (packageTariffs.Where(t => t.IsBase).Count() != 1)
        {
            return BadRequest("There should be one base tariff.");
        }

        var provider = await _tarrifsService.GetById(providerId);

        if (provider is null)
        {
            return NotFound("Provider not found.");
        }

        var priceToUpdate = provider.CarPrices.FirstOrDefault(c => c.Model == model);

        if (priceToUpdate is null)
        {
            return NotFound("Model not found.");
        }

        priceToUpdate.PackageTariffs = packageTariffs;

        await _tarrifsService.Update(provider);

        return Ok();
    }
}
