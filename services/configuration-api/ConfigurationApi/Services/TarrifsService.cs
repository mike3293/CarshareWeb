using ConfigurationApi.Configuration;
using ConfigurationApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfigurationApi.Services
{
    public class TarrifsService
    {
        private readonly IMongoCollection<ProviderWithTarrifs> _tariffs;


        public TarrifsService(IOptions<MongoDbConfig> config)
        {
            var client = new MongoClient(config.Value.ConnectionString);
            var database = client.GetDatabase(config.Value.ConfigurationDbName);

            _tariffs = database.GetCollection<ProviderWithTarrifs>(config.Value.TariffsCollection);
        }


        public async Task<IEnumerable<ProviderWithTarrifs>> GetAll()
        {
            return await _tariffs.Find(_ => true).ToListAsync();
        }

        public async Task<ProviderWithTarrifs> GetById(string id)
        {
            return await _tariffs.Find(t => t.Id == id).FirstOrDefaultAsync();
        }

        public async Task<ProviderWithTarrifs> GetByProviderId(string providerId)
        {
            return await _tariffs.Find(t => t.Provider.Id == providerId).FirstOrDefaultAsync();
        }

        public async Task Create(ProviderWithTarrifs tarrif)
        {
            await _tariffs.InsertOneAsync(tarrif);
        }

        public async Task Update(ProviderWithTarrifs tarrif)
        {
            await _tariffs.ReplaceOneAsync(t => t.Id == tarrif.Id, tarrif);
        }

        public async Task Remove(string id)
        {
            await _tariffs.DeleteOneAsync(t => t.Id == id);
        }
    }
}
