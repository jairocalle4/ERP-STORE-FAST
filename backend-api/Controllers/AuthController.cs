using ErpStore.Application.DTOs;
using ErpStore.Application.Services;
using ErpStore.Domain.Entities;
using ErpStore.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ErpStore.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly AppDbContext _context;

    public AuthController(IAuthService authService, AppDbContext context)
    {
        _authService = authService;
        _context = context;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto request)
    {
        var token = await _authService.Login(request.Username, request.Password);
        
        if (token == null)
        {
            return Unauthorized("Invalid credentials");
        }

        // Fetch user again to return details (optimization: return details from service)
        var user = await _context.Users.FirstAsync(u => u.Username == request.Username);

        return new AuthResponseDto(token, user.Username, user.Role.ToString());
    }
}
