namespace Metis.Core.Entities
{
    public interface IGuardConfiguration
    {
        int RefreshInterval { get; }
    }

    public class GuardConfiguration : IGuardConfiguration
    {
        public int RefreshInterval { get; set; }
    }
}
