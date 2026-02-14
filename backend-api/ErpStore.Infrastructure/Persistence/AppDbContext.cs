using ErpStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ErpStore.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Subcategory> Subcategories { get; set; }
    
    // New Entities
    public DbSet<Client> Clients { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<CompanySetting> CompanySettings { get; set; }
    public DbSet<Sale> Sales { get; set; }
    public DbSet<SaleDetail> SaleDetails { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<ProductImage> ProductImages { get; set; }
    public DbSet<Expense> Expenses { get; set; }
    public DbSet<ExpenseCategory> ExpenseCategories { get; set; } 
    public DbSet<CashRegisterSession> CashRegisterSessions { get; set; }
    public DbSet<CashTransaction> CashTransactions { get; set; }
    public DbSet<Supplier> Suppliers { get; set; }
    public DbSet<Purchase> Purchases { get; set; }
    public DbSet<PurchaseDetail> PurchaseDetails { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<InventoryMovement> InventoryMovements { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Product configuration
        modelBuilder.Entity<Product>()
            .Property(p => p.Price)
            .HasColumnType("decimal(18,2)");
            
        modelBuilder.Entity<Product>()
            .Property(p => p.Cost)
            .HasColumnType("decimal(18,2)");
            
        modelBuilder.Entity<Product>()
            .HasIndex(p => p.SKU)
            .IsUnique();

        // Expense configuration
        modelBuilder.Entity<Expense>()
            .Property(e => e.Amount)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Purchase>()
            .Property(p => p.Total)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<PurchaseDetail>()
            .Property(pd => pd.UnitPrice)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<PurchaseDetail>()
            .Property(pd => pd.Subtotal)
            .HasColumnType("decimal(18,2)");
            
        // Seed Expense Categories
        var fixedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        modelBuilder.Entity<ExpenseCategory>().HasData(
            new ExpenseCategory { Id = 1, Name = "Servicios Básicos", Description = "Luz, Agua, Internet", IsActive = true, CreatedAt = fixedDate },
            new ExpenseCategory { Id = 2, Name = "Alquiler", Description = "Pago de local", IsActive = true, CreatedAt = fixedDate },
            new ExpenseCategory { Id = 3, Name = "Nómina", Description = "Sueldos y salarios", IsActive = true, CreatedAt = fixedDate },
            new ExpenseCategory { Id = 4, Name = "Insumos", Description = "Materiales de oficina y limpieza", IsActive = true, CreatedAt = fixedDate },
            new ExpenseCategory { Id = 5, Name = "Mantenimiento", Description = "Reparaciones y mantenimiento", IsActive = true, CreatedAt = fixedDate },
            new ExpenseCategory { Id = 6, Name = "Marketing", Description = "Publicidad y promociones", IsActive = true, CreatedAt = fixedDate },
            new ExpenseCategory { Id = 7, Name = "Otros", Description = "Gastos varios", IsActive = true, CreatedAt = fixedDate }
        );

        // Seed data (optional starter)
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Electrónica", Description = "Artículos electrónicos", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Category { Id = 2, Name = "Hogar", Description = "Artículos para el hogar", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) }
        );

        modelBuilder.Entity<Product>().HasData(
            new Product { Id = 1, Name = "Laptop Gamer", Description = "Laptop de alto rendimiento", Price = 1200.00m, Cost = 900.00m, Stock = 10, SKU = "LAP-001", CategoryId = 1, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Product { Id = 2, Name = "Smartphone X", Description = "Teléfono inteligente", Price = 800.00m, Cost = 600.00m, Stock = 20, SKU = "PHN-001", CategoryId = 1, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Product { Id = 3, Name = "Cafetera", Description = "Cafetera automática", Price = 50.00m, Cost = 30.00m, Stock = 15, SKU = "CAF-001", CategoryId = 2, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) }
        );

        // Seed Master User (Password: admin123) - For MVP only using simple hash or plain for simplicity then hashing in service
        // Ideally use password hasher. Here we simulate a hashed password.
        // For this MVP, we will implement a simple comparison in AuthService, so we seed consistent data.
        modelBuilder.Entity<User>().HasData(
            new User 
            { 
                Id = 1, 
                Username = "admin", 
                Email = "admin@erpstore.com", 
                FirstName = "Admin",
                LastName = "User",
                Role = Role.Admin, 
                PasswordHash = "admin123", // In real app, this must be BCrypt hash
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}
