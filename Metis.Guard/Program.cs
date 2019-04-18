using Newtonsoft.Json;
using System;
using System.IO;

namespace Metis.Guard
{
    class Program
    {
        static void Main(string[] args)
        {
            var exists = File.Exists(args[0]);
            if(!exists)
            {
                Console.WriteLine("You need to provide a valid configuration json file path as an argument.");
            }

            try
            {
                // read file into a string and deserialize JSON to a type
                var configuration = JsonConvert.DeserializeObject<Entities.Configuration>(File.ReadAllText(args[0]));

                Console.WriteLine($"Started guarding site {configuration.UiD}.");

                var site = new Entities.Site(configuration);
                
                
            }
            catch(Exception exc)
            {
                Console.WriteLine(exc.ToString());
            }           
        }
    }
}
