using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Metis.Core.Entities;
using Metis.Guard.Entities;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace Metis.Overseer.Services
{
    public class SiteService
    {
        private readonly IMongoCollection<Site> _Sites;

        #region snippet_UserserviceConstructor
        public SiteService(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("metis");
            _Sites = database.GetCollection<Site>("sites");
        }
        #endregion

        public async Task<IEnumerable<Site>> GetAll()
        {
            var data = await _Sites.Find(site => true).ToListAsync();
            return data;
        }

        public async Task<IEnumerable<Site>> GetForMembers()
        {
            return await _Sites.Find(site => true).ToListAsync();
        }

        public async Task<Site> Get(string id)
        {
            return await _Sites.Find<Site>(site => site.Id == id)
                .FirstOrDefaultAsync();
        }

        public async Task<Site> Create(Site site)
        {
            await _Sites.InsertOneAsync(site);
            return site;
        }

        public async Task Update(string id, Site model)
        {
            await _Sites.ReplaceOneAsync(site => site.Id == id, model);
        }

        public async Task Remove(Site model)
        {
            await _Sites.DeleteOneAsync(site => site.Id == model.Id);
        }

        public async Task Remove(string id)
        {
            await _Sites.DeleteOneAsync(site => site.Id == id);
        }
    }
}