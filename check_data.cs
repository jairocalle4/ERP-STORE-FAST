using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using ErpStore.Infrastructure.Persistence;
using ErpStore.Domain.Entities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

// This is a scratch script to check data
var host = Host.CreateDefaultBuilder().ConfigureServices((context, services) => {
    services.AddDbContext<AppDbContext>(options => 
        options.UseSqlServer("Server=localhost;Database=ErpStore;Trusted_Connection=True;TrustServerCertificate=True;"));
}).Build();

using (var scope = host.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var products = context.Products
        .Include(p => p.Category)
        .Where(p => p.IsActive)
        .ToList();

    Console.WriteLine($"Total active products: {products.Count}");
    foreach (var group in products.GroupBy(p => p.Category?.Name ?? "Unknown"))
    {
        Console.WriteLine($"Category: {group.Key}, Count: {group.Count()}, Offers: {group.Count(p => p.DiscountPercentage > 0)}");
        foreach(var p in group.Take(2)) {
             Console.WriteLine($"  - {p.Name} (Discount: {p.DiscountPercentage}%)");
        }
    }
}
