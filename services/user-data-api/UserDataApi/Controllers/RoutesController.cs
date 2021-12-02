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
    public class RoutesController : ControllerBase
    {
        private readonly ILogger<RoutesController> _logger;

        private readonly RoutesService _routesService;


        public RoutesController(ILogger<RoutesController> logger, RoutesService routesService)
        {
            _logger = logger;
            _routesService = routesService;
        }


        [HttpGet("{userId}")]
        public async Task<Route> GetRoute(string userId)
        {
            var route = await _routesService.GetById(userId);

            return route;
        }

        [HttpPost]
        public async Task<IActionResult> SaveRoute(Route route)
        {
            await _routesService.Upsert(route);

            return Ok();
        }
    }
}