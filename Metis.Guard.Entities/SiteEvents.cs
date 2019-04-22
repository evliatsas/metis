using System;

namespace Metis.Guard.Entities
{
    public delegate void SiteStatusChangedEventHandler(Object sender, SiteStatusEventArgs e);
    public delegate void SiteMonitorExceptionEventHandler(Object sender, SiteExceptionEventArgs e);

    public class SiteStatusEventArgs : EventArgs
    {
        public Site Site { get; }
        public Status PreviousStatus { get; }
        public string Reason { get; }

        public SiteStatusEventArgs(Site site, Status status, string reason)
        {
            this.Site = site;
            this.PreviousStatus = status;
            this.Reason = reason;
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
