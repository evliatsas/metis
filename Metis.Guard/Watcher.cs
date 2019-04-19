using Metis.Guard.Entities;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Metis.Guard
{
    public class Watcher
    {
        private readonly Site _site;
        private readonly Encoding _encoding;

        private List<PageMonitor> _pageMonitors; 

        public Watcher(Site site)
        {
            this._site = site;
            this._encoding = Encoding.GetEncoding(_site.EncodingCode);
            this._pageMonitors = new List<PageMonitor>();
        }

        public void Start()
        {
            foreach (var page in _site.Pages)
            {
                var pageMonitor = new PageMonitor(page, _encoding);
                this._pageMonitors.Add(pageMonitor);                
            }
        }

        public void Stop()
        {
            foreach(var monitor in this._pageMonitors)
            {
                monitor.CancellationToken.Cancel();
            }

            this._pageMonitors.Clear();
        }

      

        private async Task readLastKnownImage()
        {

        }
    }
}
