using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Metis.Core.Entities;
using Metis.Overseer.Models.DTO;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace Metis.Overseer.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _Users;

        #region snippet_UserserviceConstructor
        public UserService(IConfiguration config)
        {
            var client = new MongoClient(config.GetConnectionString("Metis"));
            var database = client.GetDatabase("metis");
            _Users = database.GetCollection<User>("users");
        }
        #endregion

        public async Task<IEnumerable<User>> GetAll()
        {
            return await _Users.Find(User => true).ToListAsync();
        }

        public async Task<IEnumerable<User>> GetForMembers()
        {
            return await _Users.Find(User => true)
                .Project<User>(Builders<User>.Projection
                    .Include(x => x.Id)
                    .Include(x => x.Title)
                    .Include(x => x.Email))
                .ToListAsync();
        }

        public async Task<User> Get(string id)
        {
            return await _Users.Find<User>(User => User.Id == id)
                .FirstOrDefaultAsync();
        }

        public async Task<User> Create(User User)
        {
            await _Users.InsertOneAsync(User);
            return User;
        }

        public async Task Update(string id, User UserIn)
        {
            await _Users.ReplaceOneAsync(User => User.Id == id, UserIn);
        }

        public async Task Remove(User UserIn)
        {
            await _Users.DeleteOneAsync(User => User.Id == UserIn.Id);
        }

        public async Task Remove(string id)
        {
            await _Users.DeleteOneAsync(User => User.Id == id);
        }

        public async Task<User> Login(UserLoginView user)
        {
            return await _Users.Find<User>(t => t.Username == user.Username && t.Password == user.Password)
                .SingleOrDefaultAsync();
        }
    }
}