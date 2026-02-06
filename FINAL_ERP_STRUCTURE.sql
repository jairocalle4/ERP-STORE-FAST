USE [master]
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'ERP_STORE_DB')
BEGIN
    CREATE DATABASE [ERP_STORE_DB]
END
GO

USE [ERP_STORE_DB]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* =============================================
   1. SEGURIDAD (IDENTITY)
   ============================================= */
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AspNetUsers]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[AspNetUsers](
    [Id] [nvarchar](128) NOT NULL,
    [Email] [nvarchar](256) NULL,
    [EmailConfirmed] [bit] NOT NULL,
    [PasswordHash] [nvarchar](max) NULL,
    [SecurityStamp] [nvarchar](max) NULL,
    [PhoneNumber] [nvarchar](max) NULL,
    [PhoneNumberConfirmed] [bit] NOT NULL,
    [TwoFactorEnabled] [bit] NOT NULL,
    [LockoutEndDateUtc] [datetime] NULL,
    [LockoutEnabled] [bit] NOT NULL,
    [AccessFailedCount] [int] NOT NULL,
    [UserName] [nvarchar](256) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetUsers] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AspNetRoles]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[AspNetRoles](
    [Id] [nvarchar](128) NOT NULL,
    [Name] [nvarchar](256) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetRoles] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AspNetUserClaims]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[AspNetUserClaims](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [UserId] [nvarchar](128) NOT NULL,
    [ClaimType] [nvarchar](max) NULL,
    [ClaimValue] [nvarchar](max) NULL,
 CONSTRAINT [PK_dbo.AspNetUserClaims] PRIMARY KEY CLUSTERED ([Id] ASC),
 CONSTRAINT [FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AspNetUserLogins]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[AspNetUserLogins](
    [LoginProvider] [nvarchar](128) NOT NULL,
    [ProviderKey] [nvarchar](128) NOT NULL,
    [UserId] [nvarchar](128) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetUserLogins] PRIMARY KEY CLUSTERED ([LoginProvider] ASC, [ProviderKey] ASC, [UserId] ASC),
 CONSTRAINT [FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AspNetUserRoles]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[AspNetUserRoles](
    [UserId] [nvarchar](128) NOT NULL,
    [RoleId] [nvarchar](128) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetUserRoles] PRIMARY KEY CLUSTERED ([UserId] ASC, [RoleId] ASC),
 CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetRoles_RoleId] FOREIGN KEY([RoleId]) REFERENCES [dbo].[AspNetRoles] ([Id]) ON DELETE CASCADE,
 CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE
)
END
GO

/* =============================================
   2. RECURSOS HUMANOS / PERSONAS
   ============================================= */
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Empleado]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Empleado](
    [IdEmpleado] [int] IDENTITY(1,1) NOT NULL,
    [Nombre] [nvarchar](100) NOT NULL,
    [Apellido] [nvarchar](100) NOT NULL,
    [Identificacion] [nvarchar](20) NULL,
    [Telefono] [nvarchar](20) NULL,
    [Cargo] [nvarchar](50) DEFAULT 'Encargado',
    [Estado] [bit] NOT NULL DEFAULT 1,
    [UsuarioId] [nvarchar](128) NULL, -- Link to Identity User
 CONSTRAINT [PK_Empleado] PRIMARY KEY CLUSTERED ([IdEmpleado] ASC),
 CONSTRAINT [FK_Empleado_AspNetUsers] FOREIGN KEY([UsuarioId]) REFERENCES [dbo].[AspNetUsers] ([Id])
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Clientes]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Clientes](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Nombre] [nvarchar](100) NOT NULL,
    [Identificacion] [nvarchar](20) NULL, -- RUC/Cedula
    [Telefono] [nvarchar](20) NULL,
    [Email] [nvarchar](100) NULL,
    [Direccion] [nvarchar](255) NULL,
    [FechaRegistro] [datetime] DEFAULT GETDATE(),
    [Activo] [bit] DEFAULT 1,
 CONSTRAINT [PK_Clientes] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

/* =============================================
   3. CONFIGURACION
   ============================================= */
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ConfiguracionEmpresa]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[ConfiguracionEmpresa](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [NombreEmpresa] [nvarchar](100) NOT NULL,
    [Ruc] [nvarchar](20) NULL,
    [Direccion] [nvarchar](255) NULL,
    [Telefono] [nvarchar](20) NULL,
    [Email] [nvarchar](100) NULL,
    [LogoUrl] [nvarchar](255) NULL,
    [PorcentajeImpuesto] [decimal](5,2) DEFAULT 12.00,
    [Moneda] [nvarchar](10) DEFAULT '$',
    [MensajeLegal] [nvarchar](255) DEFAULT 'Contribuyente Régimen RIMPE – Negocio Popular',
    [Establecimiento] [nvarchar](3) DEFAULT '001',
    [PuntoEmision] [nvarchar](3) DEFAULT '001',
    [SecuencialActual] [int] DEFAULT 0,
    [FechaRegistro] [datetime] DEFAULT GETDATE(),
 CONSTRAINT [PK_ConfiguracionEmpresa] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

/* =============================================
   4. INVENTARIO Y CATALOGO
   ============================================= */
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Categorias]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Categorias](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Nombre] [nvarchar](100) NOT NULL,
    [Descripcion] [nvarchar](255) NULL,
    [EsActivo] [bit] DEFAULT 1,
 CONSTRAINT [PK_Categorias] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Subcategorias]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Subcategorias](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [CategoriaId] [int] NOT NULL,
    [Nombre] [nvarchar](100) NOT NULL,
    [EsActivo] [bit] DEFAULT 1,
 CONSTRAINT [PK_Subcategorias] PRIMARY KEY CLUSTERED ([Id] ASC),
 CONSTRAINT [FK_Subcategorias_Categorias] FOREIGN KEY([CategoriaId]) REFERENCES [dbo].[Categorias] ([Id]) ON DELETE CASCADE
)
END
GO

-- NUEVA TABLA: Proveedores (Recomendado para completar estructura)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Proveedores]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Proveedores](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [RazonSocial] [nvarchar](150) NOT NULL,
    [Ruc] [nvarchar](20) NULL,
    [Telefono] [nvarchar](20) NULL,
    [Email] [nvarchar](100) NULL,
    [Direccion] [nvarchar](255) NULL,
    [EsActivo] [bit] DEFAULT 1,
 CONSTRAINT [PK_Proveedores] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Productos]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Productos](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Codigo] [nvarchar](50) NULL,
    [CodigoBarra] [nvarchar](50) NULL,
    [Nombre] [nvarchar](150) NOT NULL,
    [Descripcion] [nvarchar](max) NULL,
    [CategoriaId] [int] NOT NULL,
    [SubcategoriaId] [int] NULL,
    [PrecioCompra] [decimal](18, 4) DEFAULT 0,
    [PrecioVenta] [decimal](18, 4) DEFAULT 0,
    [Stock] [decimal](18, 2) DEFAULT 0,
    [StockMinimo] [decimal](18, 2) DEFAULT 5,
    [EsActivo] [bit] DEFAULT 1,
    [FechaCreacion] [datetime] DEFAULT GETDATE(),
 CONSTRAINT [PK_Productos] PRIMARY KEY CLUSTERED ([Id] ASC),
 CONSTRAINT [FK_Productos_Categorias] FOREIGN KEY([CategoriaId]) REFERENCES [dbo].[Categorias] ([Id]),
 CONSTRAINT [FK_Productos_Subcategorias] FOREIGN KEY([SubcategoriaId]) REFERENCES [dbo].[Subcategorias] ([Id]),
 CONSTRAINT [CK_Productos_Stock] CHECK ([Stock] >= 0)
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ProductoImagenes]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[ProductoImagenes](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [IdProducto] [int] NOT NULL,
    [UrlImagen] [nvarchar](255) NOT NULL,
    [EsPortada] [bit] DEFAULT 0,
    [Orden] [int] DEFAULT 0,
 CONSTRAINT [PK_ProductoImagenes] PRIMARY KEY CLUSTERED ([Id] ASC),
 CONSTRAINT [FK_ProductoImagenes_Productos] FOREIGN KEY([IdProducto]) REFERENCES [dbo].[Productos] ([Id]) ON DELETE CASCADE
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[EntradaInventarios]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[EntradaInventarios](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [NumeroFactura] [nvarchar](50) NULL,
    [FechaEntrada] [datetime] DEFAULT GETDATE(),
    [EmpleadoId] [int] NOT NULL,
    [ProveedorId] [int] NULL, -- Relación con nueva tabla Proveedores
    [TotalCosto] [decimal](18, 2) DEFAULT 0,
    [Observacion] [nvarchar](255) NULL,
 CONSTRAINT [PK_EntradaInventarios] PRIMARY KEY CLUSTERED ([Id] ASC),
 CONSTRAINT [FK_EntradaInventarios_Empleado] FOREIGN KEY([EmpleadoId]) REFERENCES [dbo].[Empleado] ([IdEmpleado]),
 CONSTRAINT [FK_EntradaInventarios_Proveedores] FOREIGN KEY([ProveedorId]) REFERENCES [dbo].[Proveedores] ([Id])
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DetalleEntradaInventarios]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[DetalleEntradaInventarios](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [EntradaInventarioId] [int] NOT NULL,
    [ProductoId] [int] NOT NULL,
    [Cantidad] [decimal](18, 2) NOT NULL,
    [CostoUnitario] [decimal](18, 4) NOT NULL,
    [Subtotal] [decimal](18, 4) NOT NULL,
 CONSTRAINT [PK_DetalleEntradaInventarios] PRIMARY KEY CLUSTERED ([Id] ASC),
 CONSTRAINT [FK_DetalleEntradaInventarios_Entrada] FOREIGN KEY([EntradaInventarioId]) REFERENCES [dbo].[EntradaInventarios] ([Id]) ON DELETE CASCADE,
 CONSTRAINT [FK_DetalleEntradaInventarios_Productos] FOREIGN KEY([ProductoId]) REFERENCES [dbo].[Productos] ([Id])
)
END
GO

/* =============================================
   5. CAJA Y VENTAS
   ============================================= */
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ArqueoCaja]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[ArqueoCaja](
    [IdArqueo] [int] IDENTITY(1,1) NOT NULL,
    [IdEncargado] [int] NOT NULL,
    [FechaApertura] [datetime] DEFAULT GETDATE(),
    [FechaCierre] [datetime] NULL,
    [SaldoInicial] [decimal](18, 2) DEFAULT 0,
    [TotalVentas] [decimal](18, 2) DEFAULT 0,
    [TotalEgresos] [decimal](18, 2) DEFAULT 0,
    [TotalIngresos] [decimal](18, 2) DEFAULT 0,
    [SaldoFinal] [decimal](18, 2) NULL, -- Efectivo en caja al cierre
    [Diferencia] [decimal](18, 2) NULL,
    [Estado] [nvarchar](20) DEFAULT 'Abierta', -- Abierta, Cerrada
    [Turno] [int] DEFAULT 1,
 CONSTRAINT [PK_ArqueoCaja] PRIMARY KEY CLUSTERED ([IdArqueo] ASC),
 CONSTRAINT [FK_ArqueoCaja_Empleado] FOREIGN KEY([IdEncargado]) REFERENCES [dbo].[Empleado] ([IdEmpleado])
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Ventas]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Ventas](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [NumeroNota] [nvarchar](50) NULL, -- Secuencial
    [FechaVenta] [datetime] DEFAULT GETDATE(),
    [ClienteId] [int] NULL, -- Puede ser Consumidor Final
    [EmpleadoId] [int] NOT NULL,
    [ArqueoId] [int] NULL, -- Venta ligada a una caja abierta
    [Subtotal] [decimal](18, 2) NOT NULL DEFAULT 0,
    [Impuesto] [decimal](18, 2) NOT NULL DEFAULT 0,
    [Descuento] [decimal](18, 2) NOT NULL DEFAULT 0,
    [Total] [decimal](18, 2) NOT NULL DEFAULT 0,
    [MetodoPago] [nvarchar](50) DEFAULT 'Efectivo',
    [EsAnulada] [bit] DEFAULT 0,
    [Observacion] [nvarchar](255) NULL,
 CONSTRAINT [PK_Ventas] PRIMARY KEY CLUSTERED ([Id] ASC),
 CONSTRAINT [FK_Ventas_Clientes] FOREIGN KEY([ClienteId]) REFERENCES [dbo].[Clientes] ([Id]),
 CONSTRAINT [FK_Ventas_Empleado] FOREIGN KEY([EmpleadoId]) REFERENCES [dbo].[Empleado] ([IdEmpleado]),
 CONSTRAINT [FK_Ventas_ArqueoCaja] FOREIGN KEY([ArqueoId]) REFERENCES [dbo].[ArqueoCaja] ([IdArqueo])
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DetalleVentas]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[DetalleVentas](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [VentaId] [int] NOT NULL,
    [ProductoId] [int] NOT NULL,
    [Cantidad] [decimal](18, 2) NOT NULL,
    [PrecioUnitario] [decimal](18, 2) NOT NULL,
    [Descuento] [decimal](18, 2) DEFAULT 0,
    [Subtotal] [decimal](18, 2) NOT NULL, -- (Cant * Precio) - Desc
 CONSTRAINT [PK_DetalleVentas] PRIMARY KEY CLUSTERED ([Id] ASC),
 CONSTRAINT [FK_DetalleVentas_Ventas] FOREIGN KEY([VentaId]) REFERENCES [dbo].[Ventas] ([Id]) ON DELETE CASCADE,
 CONSTRAINT [FK_DetalleVentas_Productos] FOREIGN KEY([ProductoId]) REFERENCES [dbo].[Productos] ([Id])
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[EgresoGasto]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[EgresoGasto](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [IdArqueo] [int] NOT NULL,
    [Descripcion] [nvarchar](255) NOT NULL,
    [Monto] [decimal](18, 2) NOT NULL,
    [Fecha] [datetime] DEFAULT GETDATE(),
    [Tipo] [nvarchar](50) DEFAULT 'Gasto',
 CONSTRAINT [PK_EgresoGasto] PRIMARY KEY CLUSTERED ([Id] ASC),
 CONSTRAINT [FK_EgresoGasto_ArqueoCaja] FOREIGN KEY([IdArqueo]) REFERENCES [dbo].[ArqueoCaja] ([IdArqueo])
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[VentaIngreso]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[VentaIngreso](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [IdArqueo] [int] NOT NULL, -- Ingreso extra en caja
    [Descripcion] [nvarchar](255) NULL,
    [Monto] [decimal](18, 2) NOT NULL,
    [Fecha] [datetime] DEFAULT GETDATE(),
 CONSTRAINT [PK_VentaIngreso] PRIMARY KEY CLUSTERED ([Id] ASC),
 CONSTRAINT [FK_VentaIngreso_ArqueoCaja] FOREIGN KEY([IdArqueo]) REFERENCES [dbo].[ArqueoCaja] ([IdArqueo])
)
END
GO

/* =============================================
   6. OTROS
   ============================================= */
-- DetalleEfectivo: Para conteo de monedas/billetes al cierre
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DetalleEfectivo]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[DetalleEfectivo](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [IdArqueo] [int] NOT NULL,
    [Denominacion] [decimal](18, 2) NOT NULL, -- Ej: 20.00, 10.00, 0.50
    [Cantidad] [int] NOT NULL,
    [Total] [decimal](18, 2) NOT NULL,
 CONSTRAINT [PK_DetalleEfectivo] PRIMARY KEY CLUSTERED ([Id] ASC),
 CONSTRAINT [FK_DetalleEfectivo_ArqueoCaja] FOREIGN KEY([IdArqueo]) REFERENCES [dbo].[ArqueoCaja] ([IdArqueo])
)
END
GO
