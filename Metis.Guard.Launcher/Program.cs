using Newtonsoft.Json;
using System;
using System.IO;
using System.Text;

namespace Metis.Guard
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

                Console.WriteLine($"Started guarding site {configuration.UiD}.");

                var watcher = new Watcher(configuration);
                watcher.SiteStatusChanged += Watcher_SiteStatusChanged;
                watcher.SiteException += Watcher_SiteException;
                watcher.Start();

                Console.ReadLine();
                Console.WriteLine("Stopping....");
                watcher.Stop();
                watcher.SiteStatusChanged -= Watcher_SiteStatusChanged;
                watcher.SiteException -= Watcher_SiteException;
                Console.WriteLine("Stopped");
                Console.ReadLine();
            }
            catch(Exception exc)
            {
                Console.WriteLine(exc.ToString());

                Console.ReadLine();
            }           
        }

        private static void Watcher_SiteException(object sender, Entities.SiteExceptionEventArgs e)
        {
            
        }

        private static void Watcher_SiteStatusChanged(object sender, Entities.SiteStatusEventArgs e)
        {
            
        }
    }
}
