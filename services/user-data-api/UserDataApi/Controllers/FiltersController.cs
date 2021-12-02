using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UserDataApi.Models;
using UserDataApi.Services;

namespace UserDataApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FiltersController : ControllerBase
    {
        private readonly ILogger<FiltersController> _logger;

        private readonly FiltersService _filtersService;


        public FiltersController(ILogger<FiltersController> logger, FiltersService routesService)
        {
            _logger = logger;
            _filtersService = routesService;
        }


        [HttpGet("{userId}")]
        public async Task<Filter> GetFilters(string userId)
        {
            var filters = await _filtersService.GetById(userId);

            return filters ?? new Filter() { ProviderIds = new List<string>() };
        }

        [HttpPost]
        public async Task<IActionResult> SaveFilters(Filter filter)
        {
            await _filtersService.Upsert(filter);

            return Ok();
        }
    }
}