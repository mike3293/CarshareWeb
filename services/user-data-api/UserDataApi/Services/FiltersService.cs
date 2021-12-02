using UserDataApi.Configuration;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UserDataApi.Models;

namespace UserDataApi.Services
{
    public class FiltersService
    {
        private readonly IMongoCollection<Filter> _filters;


        public FiltersService(IOptions<MongoDbConfig> config)
        {
            var client = new MongoClient(config.Value.ConnectionString);
            var database = client.GetDatabase(config.Value.DbName);

            _filters = database.GetCollection<Filter>(config.Value.FiltersCollection);
        }


        public async Task<IEnumerable<Filter>> GetAll()
        {
            return await _filters.Find(_ => true).ToListAsync();
        }

        public async Task<Filter> GetById(string id)
        {
            return await _filters.Find(t => t.UserId == id).FirstOrDefaultAsync();
        }

        public async Task Create(Filter Filter)
        {
            await _filters.InsertOneAsync(Filter);
        }

        public async Task Update(Filter Filter)
        {
            await _filters.ReplaceOneAsync(t => t.UserId == Filter.UserId, Filter);
        }

        public async Task Upsert(Filter Filter)
        {
            await _filters.ReplaceOneAsync(t => t.UserId == Filter.UserId, Filter, new ReplaceOptions() { IsUpsert = true });
        }

        public async Task Remove(string id)
        {
            await _filters.DeleteOneAsync(t => t.UserId == id);
        }
    }
}
