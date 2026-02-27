using ErpStore.Domain.Common;

namespace ErpStore.Domain.Entities;

public class User : BaseEntity
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public Role Role { get; set; }
    public List<string> Permissions { get; set; } = new();

    public bool HasPermission(string permission)
    {
        if (Role == Role.Admin) return true;
        return Permissions.Contains(permission);
    }
}
