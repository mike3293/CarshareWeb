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
        [Authorize(Roles = "Admin")]
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

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateTarrifs(string id, IList<CarPrice> carPrices)
        {
            var provider = await _tarrifsService.GetById(id);

            if (provider is null)
            {
                return NotFound();
            }

            provider.CarPrices = carPrices;

            await _tarrifsService.Update(provider);

            return Ok();
        }
    }
}
