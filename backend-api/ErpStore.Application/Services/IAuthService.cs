namespace ErpStore.Application.Services;

public interface IAuthService
{
    Task<string?> Login(string username, string password);
}
