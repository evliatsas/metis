using System;

namespace Metis.Guard.Entities
{
    public delegate void PageNotFoundEventHandler(Object sender, PageExceptionEventArgs e);
    public delegate void PageParseExceptionEventHandler(Object sender, PageExceptionEventArgs e);
    public delegate void PageStatusChangedEventHandler(Object sender, PageStatusEventArgs e);

    public class PageExceptionEventArgs : EventArgs
    {
        public Page Page { get; }
        public Exception Exception { get; }

        public PageExceptionEventArgs(Page page, Exception exception = null)
        {
            this.Page = page;
            this.Exception = exception;
        }
    }

    public class PageStatusEventArgs : EventArgs
    {
        public Page Page { get; }
        public Status PreviousStatus { get; }

        public PageStatusEventArgs(Page page, Status status)
        {
            this.Page = page;
            this.PreviousStatus = status;
        }
    }
}
