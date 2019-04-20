using System;

namespace Metis.Guard.Entities
{
    public delegate void SiteStatusChangedEventHandler(Object sender, SiteStatusEventArgs e);
    public delegate void SiteMonitorExceptionEventHandler(Object sender, SiteExceptionEventArgs e);

    public class SiteStatusEventArgs : EventArgs
    {
        public Site Site { get; }
        public Status status { get; }

        public SiteStatusEventArgs(Site site, Status status)
        {
            this.Site = site;
            this.status = status;
        }
    }

    public class SiteExceptionEventArgs : EventArgs
    {
        public Site Site { get; }
        public Page Page { get; }
        public Exception Exception { get; }

        public SiteExceptionEventArgs(Site site, Page page, Exception exception = null)
        {
            this.Site = site;
            this.Page = page;
            this.Exception = exception;
        }
    }
}
