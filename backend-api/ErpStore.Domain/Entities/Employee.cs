using ErpStore.Domain.Common;

namespace ErpStore.Domain.Entities;

public class Employee : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Role { get; set; }
    public bool IsActive { get; set; } = true;
}
