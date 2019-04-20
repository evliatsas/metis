namespace Metis.Guard.Entities
{
    /// <summary>
    /// The status of a guarded page or site
    /// </summary>
    public enum Status
    {
        Ok,
        Maintenance,
        Alarm,
        NotFound
    }

    public enum WorkerStatus
    {
        None,
        Running,
        Stopped
    }
}
