using ConfigurationApi.Extensions;
using ConfigurationApi.Models;
using ConfigurationApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfigurationApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TariffOverridesController : ControllerBase
{
    private readonly TariffOverridesService _overridesService;


    public TariffOverridesController(TariffOverridesService overridesService)
    {
        _overridesService = overridesService;
    }


    [HttpGet]
    public async Task<ActionResult<TariffOverride>> GetOverrides()
    {
        var userId = User.GetUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        return await _overridesService.GetByUserId(userId) ?? new TariffOverride(userId);
    }

    [HttpPost("providers/{providerId}/cars/{model}")]
    public async Task<IActionResult> CreateOverride(string providerId, string model, IList<PackageTariff> packageTariffs)
    {
        var userId = User.GetUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        if (packageTariffs.Where(t => t.IsBase).Count() > 1)
        {
            return BadRequest("There can be only one base tariff.");
        }

        var tariffOverride = await _overridesService.GetByUserId(userId);

        var carPrice = new CarPriceWithProviderId(model, providerId, packageTariffs);

        if (tariffOverride is not null)
        {
            tariffOverride.CarPrices.Add(carPrice);
            await _overridesService.Update(tariffOverride);
        }
        else
        {
            await _overridesService.Create(new(userId, new List<CarPriceWithProviderId> { carPrice }));
        }

        return Ok();
    }


    [HttpPut("providers/{providerId}/cars/{model}")]
    public async Task<IActionResult> UpdateOverride(string providerId, string model, IList<PackageTariff> packageTariffs)
    {
        var userId = User.GetUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        if (packageTariffs.Where(t => t.IsBase).Count() > 1)
        {
            return BadRequest("There can be only one base tariff.");
        }

        var tariffOverride = await _overridesService.GetByUserId(userId);

        if (tariffOverride is null)
        {
            return NotFound();
        }

        var priceToUpdate = tariffOverride.CarPrices.FirstOrDefault(c => c.ProviderId == providerId && c.Model == model);

        if (priceToUpdate is null)
        {
            return NotFound("Model not found.");
        }

        priceToUpdate.PackageTariffs = packageTariffs;

        await _overridesService.Update(tariffOverride);

        return Ok();
    }

    [HttpDelete("providers/{providerId}/cars/{model}")]
    public async Task<IActionResult> RemoveOverride(string providerId, string model)
    {
        var userId = User.GetUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        var tariffOverride = await _overridesService.GetByUserId(userId);

        if (tariffOverride is not null)
        {
            var priceToUpdate = tariffOverride.CarPrices.FirstOrDefault(c => c.ProviderId == providerId && c.Model == model);

            if(priceToUpdate is not null)
            {
                tariffOverride.CarPrices.Remove(priceToUpdate);
                await _overridesService.Update(tariffOverride);
            }
        }

        return Ok();
    }
}
