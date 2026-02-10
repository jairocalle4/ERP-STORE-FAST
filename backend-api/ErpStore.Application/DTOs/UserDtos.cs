namespace ErpStore.Application.DTOs;

public record UserDto(int Id, string Username, string Email, string FirstName, string LastName, string Role);
public record CreateUserDto(string Username, string Email, string FirstName, string LastName, string Password, string Role);
public record UpdateUserDto(string? Username, string Email, string FirstName, string LastName, string Role, string? Password);
