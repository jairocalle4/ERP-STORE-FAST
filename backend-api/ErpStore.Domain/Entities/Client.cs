using ErpStore.Domain.Common;

namespace ErpStore.Domain.Entities;

public class Client : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? CedulaRuc { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? Email { get; set; }
    public DateTime? RegisteredAt { get; set; }
}
