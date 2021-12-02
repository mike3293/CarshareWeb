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
    public class RoutesService
    {
        private readonly IMongoCollection<Route> _routes;


        public RoutesService(IOptions<MongoDbConfig> config)
        {
            var client = new MongoClient(config.Value.ConnectionString);
            var database = client.GetDatabase(config.Value.DbName);

            _routes = database.GetCollection<Route>(config.Value.RoutesCollection);
        }


        public async Task<IEnumerable<Route>> GetAll()
        {
            return await _routes.Find(_ => true).ToListAsync();
        }

        public async Task<Route> GetById(string id)
        {
            return await _routes.Find(t => t.Id == id).FirstOrDefaultAsync();
        }

        public async Task Create(Route tarrif)
        {
            await _routes.InsertOneAsync(tarrif);
        }

        public async Task Update(Route tarrif)
        {
            await _routes.ReplaceOneAsync(t => t.Id == tarrif.Id, tarrif);
        }

        public async Task Remove(string id)
        {
            await _routes.DeleteOneAsync(t => t.Id == id);
        }
    }
}
