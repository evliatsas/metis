using Metis.Core.Entities;
using MongoDB.Driver;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Metis.Guard.Launcher
{
    class Program
    {
        static void Main(string[] args)
        {
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

            try
            {
                var exists = File.Exists(args[0]);
                if (!exists)
                {
                    Console.WriteLine("You need to provide a valid configuration json file path as an argument.");
                }
                // read file into a string and deserialize JSON to a type
                var configuration = JsonConvert.DeserializeObject<Entities.Configuration>(File.ReadAllText(args[0]));
                //importUsers(configuration.ConnectionString);
                Console.WriteLine($"Started guarding site {configuration.UiD}.");
                var mongoClient = new MongoClient(configuration.ConnectionString);
                var monitor = new Monitor(configuration.UiD, configuration.RefreshInterval, mongoClient);
                monitor.Start();

                Console.ReadLine();
                Console.WriteLine("Stopping....");
                monitor.Stop();
                monitor.Dispose();
            }
            catch (Exception exc)
            {
                Console.WriteLine(exc.ToString());

                Console.ReadLine();
            }
        }

        private static void importUsers(string dbConn)
        {
            var csv = new List<string>();
            var path = @"C:\\Users\\ELiatsas\\Downloads\\users_perif.csv";

            using (var reader = new System.IO.StreamReader(path))
            {
                while (!reader.EndOfStream)
                {
                    csv.Add(reader.ReadLine());
                }
            }
            var users = new List<User>();
            foreach (var entry in csv)
            {
                var data = entry.Split(',');
                var user = new User()
                {
                    Username = data[1],
                    Email = data[1],
                    Password = data[0],
                    Title = data[4] + " " + data[3],
                    Role = UserRole.Manager,
                    Sites = new List<string>() { data[2] }
                };
                users.Add(user);
            }

            var client = new MongoClient(dbConn);
            var database = client.GetDatabase("metis");
            IMongoCollection<User> _Users = database.GetCollection<User>("users");
            _Users.InsertMany(users);
        }
    }
}
