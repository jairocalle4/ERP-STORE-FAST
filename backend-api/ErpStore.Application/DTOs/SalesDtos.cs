namespace ErpStore.Application.DTOs;

public class CreateSaleDto
{
    public int? ClientId { get; set; }
    public int EmployeeId { get; set; }
    public string? Observation { get; set; }
    public string PaymentMethod { get; set; } = "Efectivo";
    public List<CreateSaleDetailDto> Details { get; set; } = new();
}

public class CreateSaleDetailDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}
