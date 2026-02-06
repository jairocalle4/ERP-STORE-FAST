using System.Text.Json;
using System.Text.Json.Serialization;
using ErpStore.Domain.Entities;
using ErpStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ErpStore.Infrastructure.Services;

public class DbSeeder
{
    private readonly AppDbContext _context;
    private readonly ILogger<DbSeeder> _logger;

    public DbSeeder(AppDbContext context, ILogger<DbSeeder> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SeedAsync(string jsonDataPath)
    {
        if (!File.Exists(jsonDataPath))
        {
            _logger.LogError($"Migration data file not found at: {jsonDataPath}");
            throw new FileNotFoundException("Migration file not found", jsonDataPath);
        }

        try
        {
            var jsonString = await File.ReadAllTextAsync(jsonDataPath);
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            
            var data = JsonSerializer.Deserialize<MigrationData>(jsonString, options);

            if (data == null)
            {
                 _logger.LogError("Failed to deserialize migration data");
                 return;
            }

            _logger.LogInformation($"Deserialized data: Categories={data.Categories?.Count}, Products={data.Products?.Count}, Clients={data.Clients?.Count}, Sales={data.Sales?.Count}, Details={data.SaleDetails?.Count}");

             // 1. Clear existing data
             _logger.LogInformation("Clearing existing data...");
             _context.SaleDetails.RemoveRange(_context.SaleDetails);
             _context.Sales.RemoveRange(_context.Sales);
             _context.Products.RemoveRange(_context.Products);
             _context.Subcategories.RemoveRange(_context.Subcategories);
             _context.Categories.RemoveRange(_context.Categories);
             _context.Clients.RemoveRange(_context.Clients);
             _context.Employees.RemoveRange(_context.Employees);
             _context.CompanySettings.RemoveRange(_context.CompanySettings);
             
             await _context.SaveChangesAsync();
             _logger.LogInformation("Existing data cleared.");

             // 2. Insert Independent Entities
             if (data.Categories != null)
             {
                 _logger.LogInformation($"Adding {data.Categories.Count} Categories...");
                 var categories = data.Categories.Select(c => new Category
                 {
                     Id = c.Id,
                     Name = c.Name ?? string.Empty,
                     IsActive = c.IsActive,
                     CreatedAt = DateTime.UtcNow,
                     UpdatedAt = DateTime.UtcNow
                 }).ToList();
                 await _context.Categories.AddRangeAsync(categories);
             }
             
             if (data.Employees != null)
             {
                 _logger.LogInformation($"Adding {data.Employees.Count} Employees...");
                 var employees = data.Employees.Select(e => new Employee
                 {
                     Id = e.Id,
                     Name = e.Name ?? "Unknown",
                     Role = e.Role ?? "Employee",
                     IsActive = e.IsActive,
                     CreatedAt = DateTime.UtcNow
                 }).ToList();
                 await _context.Employees.AddRangeAsync(employees);
             }

             if (data.Clients != null)
             {
                 _logger.LogInformation($"Adding {data.Clients.Count} Clients...");
                 var clients = data.Clients.Select(c => new Client
                 {
                     Id = c.Id,
                     Name = c.Name ?? "Unknown Client",
                     CedulaRuc = c.CedulaRuc ?? string.Empty,
                     Phone = c.Phone ?? string.Empty,
                     Address = c.Address ?? string.Empty,
                     Email = c.Email ?? string.Empty,
                     RegisteredAt = DateTime.TryParse(c.RegisteredAt, out var d) ? d : DateTime.UtcNow,
                     CreatedAt = DateTime.UtcNow
                 }).ToList();
                 await _context.Clients.AddRangeAsync(clients);
             }

             if (data.CompanySettings != null)
             {
                 _logger.LogInformation($"Adding {data.CompanySettings.Count} CompanySettings...");
                 var settings = data.CompanySettings.Select(s => new CompanySetting
                 {
                     Id = s.Id,
                     Name = s.Name ?? "Company",
                     Ruc = s.Ruc ?? string.Empty,
                     Address = s.Address ?? string.Empty,
                     Phone = s.Phone ?? string.Empty,
                     Email = s.Email ?? string.Empty,
                     LegalMessage = s.LegalMessage ?? string.Empty,
                     SriAuth = s.SriAuth ?? string.Empty,
                     Establishment = s.Establishment ?? "001",
                     PointOfIssue = s.PointOfIssue ?? "001",
                     CurrentSequence = s.CurrentSequence,
                     ExpirationDate = DateTime.TryParse(s.ExpirationDate, out var ed) ? ed : null,
                     SocialReason = s.SocialReason ?? string.Empty,
                     CreatedAt = DateTime.UtcNow
                 }).ToList();
                 await _context.CompanySettings.AddRangeAsync(settings);
             }

             // 3. Insert Dependent Entities (Subcategories)
             if (data.Subcategories != null)
             {
                 _logger.LogInformation($"Adding {data.Subcategories.Count} Subcategories...");
                 var subcategories = data.Subcategories.Select(s => new Subcategory
                 {
                     Id = s.Id,
                     Name = s.Name ?? string.Empty,
                     CategoryId = s.CategoryId,
                     IsActive = s.IsActive,
                     CreatedAt = DateTime.UtcNow
                 }).ToList();
                  await _context.Subcategories.AddRangeAsync(subcategories);
             }

             // 4. Insert Products
              if (data.Products != null)
             {
                 _logger.LogInformation($"Adding {data.Products.Count} Products...");
                 var products = data.Products.Select(p => new Product
                 {
                     Id = p.Id,
                     Name = p.Name ?? "Unnamed Product",
                     Description = p.Description ?? string.Empty,
                     Price = p.Price,
                     Cost = p.Cost,
                     Stock = p.Stock,
                     SKU = $"PROD-{p.Id}", 
                     Images = !string.IsNullOrEmpty(p.ImageUrl) ? new List<ProductImage> { new ProductImage { Url = p.ImageUrl, IsCover = true, Order = 0 } } : new List<ProductImage>(),
                     VideoUrl = p.VideoUrl,
                     CategoryId = p.CategoryId,
                     SubcategoryId = p.SubcategoryId,
                     IsActive = p.IsActive,
                     CreatedAt = DateTime.TryParse(p.Date, out var date) ? date : DateTime.UtcNow,
                 }).ToList();
                 await _context.Products.AddRangeAsync(products);
             }

              // 5. Insert Sales
              if (data.Sales != null)
              {
                  _logger.LogInformation($"Adding {data.Sales.Count} Sales...");
                  var sales = data.Sales.Select(s => new Sale
                  {
                      Id = s.Id,
                      Date = DateTime.TryParse(s.Date, out var d) ? d : DateTime.UtcNow,
                      EmployeeId = s.EmployeeId,
                      Total = s.Total,
                      Observation = s.Observation,
                      ClientId = s.ClientId,
                      NoteNumber = s.NoteNumber, // Nullable? Property is string?
                      IsVoid = s.IsVoid,
                      CreatedAt = DateTime.UtcNow
                  }).ToList();
                  await _context.Sales.AddRangeAsync(sales);
              }

              // 6. Insert Sale Details
              if (data.SaleDetails != null)
              {
                  _logger.LogInformation($"Adding {data.SaleDetails.Count} SaleDetails...");
                  var details = data.SaleDetails.Select(d => new SaleDetail
                  {
                      Id = d.Id,
                      SaleId = d.SaleId,
                      ProductId = d.ProductId,
                      Quantity = d.Quantity,
                      Subtotal = d.Subtotal,
                      UnitPrice = d.UnitPrice,
                      CreatedAt = DateTime.UtcNow
                  }).ToList();
                  await _context.SaleDetails.AddRangeAsync(details);
              }
              
             await _context.SaveChangesAsync();
             _logger.LogInformation("Database seeded successfully and changes saved.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding database");
            throw;
        }
    }
}

// Helper classes for JSON deserialization
public class MigrationData
{
    [JsonPropertyName("categories")]
    public List<JsonCategory>? Categories { get; set; }
    
    [JsonPropertyName("subcategories")]
    public List<JsonSubcategory>? Subcategories { get; set; }
    
    [JsonPropertyName("products")]
    public List<JsonProduct>? Products { get; set; }
    
    [JsonPropertyName("clients")]
    public List<JsonClient>? Clients { get; set; }
    
    [JsonPropertyName("employees")]
    public List<JsonEmployee>? Employees { get; set; }

    [JsonPropertyName("company_settings")]
    public List<JsonCompanySetting>? CompanySettings { get; set; }

    [JsonPropertyName("sales")]
    public List<JsonSale>? Sales { get; set; }

    [JsonPropertyName("sale_details")]
    public List<JsonSaleDetail>? SaleDetails { get; set; } 
}

public class JsonCategory { public int Id { get; set; } public string? Name { get; set; } public bool IsActive { get; set; } }
public class JsonSubcategory { public int Id { get; set; } public string? Name { get; set; } public int CategoryId { get; set; } public bool IsActive { get; set; } }
public class JsonProduct { 
    public int Id { get; set; } 
    public string? Name { get; set; } 
    public string? Description { get; set; } 
    public decimal Price { get; set; } 
    public decimal Cost { get; set; } 
    public int Stock { get; set; } 
    public string? ImageUrl { get; set; } 
    public string? VideoUrl { get; set; } 
    public int CategoryId { get; set; } 
    public int? SubcategoryId { get; set; } 
    public bool IsActive { get; set; } 
    public string? Date { get; set; } 
}
public class JsonClient { 
    public int Id { get; set; } 
    public string? Name { get; set; } 
    public string? CedulaRuc { get; set; } 
    public string? Phone { get; set; } 
    public string? Address { get; set; } 
    public string? Email { get; set; } 
    public string? RegisteredAt { get; set; } 
}
public class JsonEmployee { public int Id { get; set; } public string? Name { get; set; } public string? Role { get; set; } public bool IsActive { get; set; } }
public class JsonCompanySetting { 
    public int Id { get; set; } 
    public string? Name { get; set; } 
    public string? Ruc { get; set; } 
    public string? Address { get; set; } 
    public string? Phone { get; set; } 
    public string? Email { get; set; } 
    public string? LegalMessage { get; set; } 
    public string? SriAuth { get; set; } 
    public string? Establishment { get; set; } 
    public string? PointOfIssue { get; set; } 
    public int CurrentSequence { get; set; } 
    public string? ExpirationDate { get; set; } 
    public string? SocialReason { get; set; } 
}
public class JsonSale { 
    public int Id { get; set; } 
    public string? Date { get; set; } 
    public int EmployeeId { get; set; } 
    public decimal Total { get; set; } 
    public string? Observation { get; set; } 
    public int? ClientId { get; set; } 
    public string? NoteNumber { get; set; } 
    public bool IsVoid { get; set; } 
}
public class JsonSaleDetail { 
    public int Id { get; set; } 
    public int SaleId { get; set; } 
    public int ProductId { get; set; } 
    public int Quantity { get; set; } 
    public decimal Subtotal { get; set; } 
    public decimal UnitPrice { get; set; } 
}
