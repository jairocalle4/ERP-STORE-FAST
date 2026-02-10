using ErpStore.Application.DTOs;
using ErpStore.Domain.Entities;
using ErpStore.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ErpStore.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/users")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> GetMyProfile()
    {
        var userId = User.FindFirstValue("id");
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var user = await _context.Users.FindAsync(int.Parse(userId));
        if (user == null) return NotFound();

        return new UserDto(user.Id, user.Username, user.Email, user.FirstName, user.LastName, user.Role.ToString());
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateMyProfile(UpdateUserDto dto)
    {
        var userId = User.FindFirstValue("id");
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var user = await _context.Users.FindAsync(int.Parse(userId));
        if (user == null) return NotFound();

        // If username is changing, check for uniqueness
        if (!string.IsNullOrEmpty(dto.Username) && dto.Username != user.Username)
        {
            if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
            {
                return BadRequest("El nombre de usuario ya está en uso.");
            }
            user.Username = dto.Username;
        }

        user.Email = dto.Email;
        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        
        if (!string.IsNullOrEmpty(dto.Password))
        {
            // Note: In a real app, hash this password!
            user.PasswordHash = dto.Password; 
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
    {
        var users = await _context.Users
            .Select(u => new UserDto(u.Id, u.Username, u.Email, u.FirstName, u.LastName, u.Role.ToString()))
            .ToListAsync();
        return users;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateUser(CreateUserDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
        {
            return BadRequest("Username already exists");
        }

        if (!Enum.TryParse<Role>(dto.Role, true, out var role))
        {
            return BadRequest("Invalid role");
        }

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            PasswordHash = dto.Password, // Hash this!
            Role = role,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMyProfile), new { }, new UserDto(user.Id, user.Username, user.Email, user.FirstName, user.LastName, user.Role.ToString()));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, UpdateUserDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        // If username is changing, check for uniqueness
        if (!string.IsNullOrEmpty(dto.Username) && dto.Username != user.Username)
        {
            if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
            {
                return BadRequest("El nombre de usuario ya está en uso.");
            }
            user.Username = dto.Username;
        }

        user.Email = dto.Email;
        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        
        if (Enum.TryParse<Role>(dto.Role, true, out var role))
        {
            user.Role = role;
        }

        if (!string.IsNullOrEmpty(dto.Password))
        {
            user.PasswordHash = dto.Password; // Hash this!
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        // Prevent deleting self (optional but good practice)
        var currentUsername = User.Identity?.Name;
        if (user.Username == currentUsername)
        {
            return BadRequest("Cannot delete yourself");
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
