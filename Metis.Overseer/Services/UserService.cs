using System.Collections.Generic;
using System.Linq;
using Metis.Overseer.Models;
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

        public List<User> Get()
        {
            return _Users.Find(User => true).ToList();
        }

        public User Get(string id)
        {
            return _Users.Find<User>(User => User.Id == id).FirstOrDefault();
        }

        public User Create(User User)
        {
            _Users.InsertOne(User);
            return User;
        }

        public void Update(string id, User UserIn)
        {
            _Users.ReplaceOne(User => User.Id == id, UserIn);
        }

        public void Remove(User UserIn)
        {
            _Users.DeleteOne(User => User.Id == UserIn.Id);
        }

        public void Remove(string id)
        {
            _Users.DeleteOne(User => User.Id == id);
        }

        public bool Login(User user)
        {
            return _Users.Find<User>(t => t.Username == user.Username && t.Password == user.Password).Any();
        }
    }
}