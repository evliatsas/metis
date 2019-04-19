using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace Metis.Guard
{
    class Program
    {
        static void Main(string[] args)
        {
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

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
                var watcher = new Watcher(site);
                List<Task> tasks = new List<Task>() { watcher.Start() };
                Task.WaitAll(tasks.ToArray());
            }
            catch(Exception exc)
            {
                Console.WriteLine(exc.ToString());
            }           
        }
    }
}
