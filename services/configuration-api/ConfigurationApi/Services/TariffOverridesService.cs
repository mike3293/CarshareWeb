using ConfigurationApi.Configuration;
using ConfigurationApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ConfigurationApi.Services
{
    public class TariffOverridesService
    {
        private readonly IMongoCollection<TariffOverride> _overrides;


        public TariffOverridesService(IOptions<MongoDbConfig> config)
        {
            var client = new MongoClient(config.Value.ConnectionString);
            var database = client.GetDatabase(config.Value.ConfigurationDbName);

            _overrides = database.GetCollection<TariffOverride>(config.Value.TariffOverridesCollection);
        }


        public async Task<IEnumerable<TariffOverride>> GetAll()
        {
            return await _overrides.Find(_ => true).ToListAsync();
        }

        public async Task<TariffOverride> GetByUserId(string userId)
        {
            return await _overrides.Find(o => o.UserId == userId).FirstOrDefaultAsync();
        }

        public async Task Create(TariffOverride tarrif)
        {
            await _overrides.InsertOneAsync(tarrif);
        }

        public async Task Update(TariffOverride tarrif)
        {
            await _overrides.ReplaceOneAsync(o => o.UserId == tarrif.UserId, tarrif);
        }

        public async Task Remove(string userId)
        {
            await _overrides.DeleteOneAsync(o => o.UserId == userId);
        }
    }
}
