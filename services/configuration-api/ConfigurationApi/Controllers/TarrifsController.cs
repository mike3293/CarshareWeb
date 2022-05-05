using ConfigurationApi.Configuration;
using ConfigurationApi.Models;
using ConfigurationApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace ConfigurationApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TarrifsController : ControllerBase
    {
        private readonly ILogger<TarrifsController> _logger;

        private readonly TarrifsService _tarrifsService;


        public TarrifsController(ILogger<TarrifsController> logger, TarrifsService tarrifsService)
        {
            _logger = logger;
            _tarrifsService = tarrifsService;
        }


        [HttpGet]
        [Authorize]
        public async Task<IEnumerable<ProviderWithTarrifs>> GetTarrifs()
        {
            return await _tarrifsService.GetAll();
        }

        [HttpGet("providers/{providerId}/cars/{model}")]
        public async Task<ActionResult<CarPrice>> GetCarPrice(string providerId, string model)
        {
            var provider = await _tarrifsService.GetByProviderId(providerId);

            if (provider is null)
            {
                return NotFound();
            }

            var carPrice = provider.CarPrices.FirstOrDefault(c => c.Model == model);

            if (carPrice is null)
            {
                return NotFound();
            }

            return carPrice;
        }

        [HttpPut("providers/{providerId}/cars/{model}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateTarrifs(string providerId, string model, IList<PackageTariff> packageTariffs)
        {
            if (packageTariffs.Where(t => t.IsBase).Count() > 1)
            {
                return BadRequest("There can be only one base tariff.");
            }

            var provider = await _tarrifsService.GetById(providerId);

            if (provider is null)
            {
                return NotFound("Provider not found.");
            }

            var escapedModel = HttpUtility.UrlDecode(model);
            var priceToUpdate = provider.CarPrices.FirstOrDefault(c => c.Model == escapedModel);

            if (priceToUpdate is null)
            {
                return NotFound("Model not found.");
            }

            priceToUpdate.PackageTariffs = packageTariffs;

            await _tarrifsService.Update(provider);

            return Ok();
        }
    }
}
