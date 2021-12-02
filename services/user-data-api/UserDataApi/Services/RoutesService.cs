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
            return await _routes.Find(t => t.UserId == id).FirstOrDefaultAsync();
        }

        public async Task Create(Route route)
        {
            await _routes.InsertOneAsync(route);
        }

        public async Task Update(Route route)
        {
            await _routes.ReplaceOneAsync(t => t.UserId == route.UserId, route);
        }

        public async Task Upsert(Route route)
        {
            await _routes.ReplaceOneAsync(t => t.UserId == route.UserId, route, new ReplaceOptions() { IsUpsert = true });
        }

        public async Task Remove(string id)
        {
            await _routes.DeleteOneAsync(t => t.UserId == id);
        }
    }
}
