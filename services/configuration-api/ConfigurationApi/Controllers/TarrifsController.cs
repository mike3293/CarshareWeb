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
    [Authorize(Roles = "Admin")]
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
        public async Task<IEnumerable<Tarrif>> GetTarrifs()
        {
            return await _tarrifsService.GetAll();
        }
    }
}
