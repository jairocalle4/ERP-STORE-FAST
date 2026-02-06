namespace ErpStore.Application.DTOs;

public class ReportFilterDto
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

public class KpiStatsDto
{
    public decimal TotalRevenue { get; set; }
    public decimal TotalCost { get; set; }
    public decimal GrossProfit { get; set; } // Revenue - Cost
    public decimal TotalExpenses { get; set; }
    public decimal NetProfit { get; set; } // GrossProfit - Expenses
    public int TotalTransactions { get; set; }
    public decimal AverageTicket { get; set; }
}

public class SalesTrendDto
{
    public string Period { get; set; } = string.Empty; // Day or Month label
    public DateTime Date { get; set; } // For sorting
    public decimal Revenue { get; set; }
    public decimal Expenses { get; set; }
    public decimal NetProfit { get; set; }
}

public class TopProductDto
{
    public string ProductName { get; set; } = string.Empty;
    public int QuantitySold { get; set; }
    public decimal TotalRevenue { get; set; }
}

public class SalesEvolutionDto
{
    public string Month { get; set; } = string.Empty;
    public int Year { get; set; }
    public int MonthNumber { get; set; }
    public decimal TotalSales { get; set; }
}

public class InventoryValuationDto
{
    public string CategoryName { get; set; } = string.Empty;
    public decimal TotalValue { get; set; }
    public int ProductCount { get; set; }
    public decimal Percentage { get; set; }
}

public class SaleProfitDto
{
    public int SaleId { get; set; }
    public string NoteNumber { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string ProductNames { get; set; } = string.Empty;
    public int TotalQuantity { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal TotalCost { get; set; }
    public decimal GrossProfit { get; set; }
    // Add Payment Method for filtering/analysis
    public string PaymentMethod { get; set; } = string.Empty;
}
