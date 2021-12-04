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
        private readonly IMongoCollection<ProviderWithTarrifs> _tarrifs;


        public TarrifsService(IOptions<MongoDbConfig> config)
        {
            var client = new MongoClient(config.Value.ConnectionString);
            var database = client.GetDatabase(config.Value.ConfigurationDbName);

            _tarrifs = database.GetCollection<ProviderWithTarrifs>(config.Value.TarrifsCollection);
        }


        public async Task<IEnumerable<ProviderWithTarrifs>> GetAll()
        {
            return await _tarrifs.Find(_ => true).ToListAsync();
        }

        public async Task<ProviderWithTarrifs> GetById(string id)
        {
            return await _tarrifs.Find(t => t.Id == id).FirstOrDefaultAsync();
        }

        public async Task<ProviderWithTarrifs> GetByProviderId(string providerId)
        {
            return await _tarrifs.Find(t => t.Provider.Id == providerId).FirstOrDefaultAsync();
        }

        public async Task Create(ProviderWithTarrifs tarrif)
        {
            await _tarrifs.InsertOneAsync(tarrif);
        }

        public async Task Update(ProviderWithTarrifs tarrif)
        {
            await _tarrifs.ReplaceOneAsync(t => t.Id == tarrif.Id, tarrif);
        }

        public async Task Remove(string id)
        {
            await _tarrifs.DeleteOneAsync(t => t.Id == id);
        }
    }
}
