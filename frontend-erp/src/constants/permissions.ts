export const PERMISSIONS = {
    DASHBOARD_VIEW: 'dashboard.view',
    PRODUCTS_VIEW: 'products.view',
    PRODUCTS_MANAGE: 'products.manage',
    CATEGORIES_MANAGE: 'categories.manage',
    POS_ACCESS: 'pos.access',
    SALES_VIEW: 'sales.view',
    SALES_VOID: 'sales.void',
    CASH_REGISTER_MANAGE: 'cash.manage',
    PURCHASES_VIEW: 'purchases.view',
    PURCHASES_MANAGE: 'purchases.manage',
    SUPPLIERS_MANAGE: 'suppliers.manage',
    CLIENTS_MANAGE: 'clients.manage',
    EXPENSES_MANAGE: 'expenses.manage',
    REPORTS_VIEW: 'reports.view',
    USERS_MANAGE: 'users.manage',
    SETTINGS_MANAGE: 'settings.manage',
};

export const PERMISSION_LABELS: Record<string, { label: string, category: string }> = {
    [PERMISSIONS.DASHBOARD_VIEW]: { label: 'Ver Dashboard', category: 'General' },
    [PERMISSIONS.PRODUCTS_VIEW]: { label: 'Ver Productos', category: 'Inventario' },
    [PERMISSIONS.PRODUCTS_MANAGE]: { label: 'Gestionar Productos', category: 'Inventario' },
    [PERMISSIONS.CATEGORIES_MANAGE]: { label: 'Gestionar Categorías', category: 'Inventario' },
    [PERMISSIONS.POS_ACCESS]: { label: 'Acceso a Punto de Venta', category: 'Ventas' },
    [PERMISSIONS.SALES_VIEW]: { label: 'Ver Historial de Ventas', category: 'Ventas' },
    [PERMISSIONS.SALES_VOID]: { label: 'Anular Ventas', category: 'Ventas' },
    [PERMISSIONS.CASH_REGISTER_MANAGE]: { label: 'Gestionar Caja', category: 'Ventas' },
    [PERMISSIONS.PURCHASES_VIEW]: { label: 'Ver Compras', category: 'Compras' },
    [PERMISSIONS.PURCHASES_MANAGE]: { label: 'Gestionar Compras', category: 'Compras' },
    [PERMISSIONS.SUPPLIERS_MANAGE]: { label: 'Gestionar Proveedores', category: 'Compras' },
    [PERMISSIONS.CLIENTS_MANAGE]: { label: 'Gestionar Clientes', category: 'Ventas' },
    [PERMISSIONS.EXPENSES_MANAGE]: { label: 'Gestionar Gastos', category: 'Finanzas' },
    [PERMISSIONS.REPORTS_VIEW]: { label: 'Ver Reportes', category: 'Finanzas' },
    [PERMISSIONS.USERS_MANAGE]: { label: 'Gestionar Usuarios', category: 'Sistema' },
    [PERMISSIONS.SETTINGS_MANAGE]: { label: 'Configuración del Sistema', category: 'Sistema' },
};

export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
    'Admin': Object.values(PERMISSIONS),
    'Gerente': [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.PRODUCTS_VIEW,
        PERMISSIONS.PRODUCTS_MANAGE,
        PERMISSIONS.CATEGORIES_MANAGE,
        PERMISSIONS.POS_ACCESS,
        PERMISSIONS.SALES_VIEW,
        PERMISSIONS.CASH_REGISTER_MANAGE,
        PERMISSIONS.PURCHASES_VIEW,
        PERMISSIONS.CLIENTS_MANAGE,
        PERMISSIONS.REPORTS_VIEW
    ],
    'Vendedor': [
        PERMISSIONS.POS_ACCESS,
        PERMISSIONS.SALES_VIEW,
        PERMISSIONS.PRODUCTS_VIEW,
        PERMISSIONS.CLIENTS_MANAGE,
        PERMISSIONS.CASH_REGISTER_MANAGE
    ],
    'Bodeguero': [
        PERMISSIONS.PRODUCTS_VIEW,
        PERMISSIONS.PRODUCTS_MANAGE,
        PERMISSIONS.CATEGORIES_MANAGE,
        PERMISSIONS.PURCHASES_VIEW,
        PERMISSIONS.PURCHASES_MANAGE,
        PERMISSIONS.SUPPLIERS_MANAGE
    ],
    'Customer': []
};
