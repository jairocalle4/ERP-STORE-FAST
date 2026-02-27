namespace ErpStore.Domain.Common;

public static class PermissionConstants
{
    // Dashboard
    public const string DashboardView = "dashboard.view";

    // Products & Categories
    public const string ProductsView = "products.view";
    public const string ProductsManage = "products.manage";
    public const string CategoriesManage = "categories.manage";

    // Sales & POS
    public const string PosAccess = "pos.access";
    public const string SalesView = "sales.view";
    public const string SalesVoid = "sales.void";
    public const string CashRegisterManage = "cash.manage";

    // Purchases & Suppliers
    public const string PurchasesView = "purchases.view";
    public const string PurchasesManage = "purchases.manage";
    public const string SuppliersManage = "suppliers.manage";

    // Clients
    public const string ClientsManage = "clients.manage";

    // Expenses
    public const string ExpensesManage = "expenses.manage";

    // Reports
    public const string ReportsView = "reports.view";

    // Administration
    public const string UsersManage = "users.manage";
    public const string SettingsManage = "settings.manage";

    public static List<string> GetAllPermissions() => new()
    {
        DashboardView,
        ProductsView,
        ProductsManage,
        CategoriesManage,
        PosAccess,
        SalesView,
        SalesVoid,
        CashRegisterManage,
        PurchasesView,
        PurchasesManage,
        SuppliersManage,
        ClientsManage,
        ExpensesManage,
        ReportsView,
        UsersManage,
        SettingsManage
    };
}
