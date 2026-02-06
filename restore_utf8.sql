USE [SAFARI_WEB]
GO
/****** Object:  User [jairocalle4_SQLLogin_1]    Script Date: 27/01/2026 15:09:24 ******/
CREATE USER [jairocalle4_SQLLogin_1] FOR LOGIN [jairocalle4_SQLLogin_1] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [jairocalle4_SQLLogin_1]
GO
/****** Object:  Schema [jairocalle4_SQLLogin_1]    Script Date: 27/01/2026 15:09:24 ******/
CREATE SCHEMA [jairocalle4_SQLLogin_1]
GO
/****** Object:  Table [dbo].[ArqueoCaja]    Script Date: 27/01/2026 15:09:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ArqueoCaja](
	[IdArqueo] [int] IDENTITY(1,1) NOT NULL,
	[Fecha] [date] NOT NULL,
	[Turno] [tinyint] NULL,
	[IdEncargado] [int] NOT NULL,
	[SaldoInicial] [decimal](10, 2) NULL,
	[TotalVentas] [decimal](10, 2) NULL,
	[TotalEgresos] [decimal](10, 2) NULL,
	[GananciaNeta] [decimal](10, 2) NULL,
	[ResultadoEsperado] [decimal](10, 2) NULL,
	[EfectivoTotal] [decimal](10, 2) NULL,
	[UtilidadDia] [decimal](10, 2) NULL,
	[Observaciones] [text] NULL,
PRIMARY KEY CLUSTERED 
(
	[IdArqueo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetRoles]    Script Date: 27/01/2026 15:09:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetRoles](
	[Id] [nvarchar](128) NOT NULL,
	[Name] [nvarchar](256) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetRoles] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUserClaims]    Script Date: 27/01/2026 15:09:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserClaims](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [nvarchar](128) NOT NULL,
	[ClaimType] [nvarchar](max) NULL,
	[ClaimValue] [nvarchar](max) NULL,
 CONSTRAINT [PK_dbo.AspNetUserClaims] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUserLogins]    Script Date: 27/01/2026 15:09:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserLogins](
	[LoginProvider] [nvarchar](128) NOT NULL,
	[ProviderKey] [nvarchar](128) NOT NULL,
	[UserId] [nvarchar](128) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetUserLogins] PRIMARY KEY CLUSTERED 
(
	[LoginProvider] ASC,
	[ProviderKey] ASC,
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUserRoles]    Script Date: 27/01/2026 15:09:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserRoles](
	[UserId] [nvarchar](128) NOT NULL,
	[RoleId] [nvarchar](128) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetUserRoles] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUsers]    Script Date: 27/01/2026 15:09:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
 CONSTRAINT [PK_dbo.AspNetUsers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Categorias]    Script Date: 27/01/2026 15:09:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Categorias](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](100) NOT NULL,
	[EsActivo] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Clientes]    Script Date: 27/01/2026 15:09:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Clientes](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [nvarchar](150) NOT NULL,
	[CedulaRuc] [nvarchar](13) NULL,
	[Telefono] [nvarchar](10) NULL,
	[Direccion] [nvarchar](200) NULL,
	[Email] [nvarchar](150) NULL,
	[FechaRegistro] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ConfiguracionEmpresa]    Script Date: 27/01/2026 15:09:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ConfiguracionEmpresa](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[NombreComercial] [nvarchar](200) NOT NULL,
	[RUC] [nvarchar](13) NOT NULL,
	[Direccion] [nvarchar](300) NOT NULL,
	[Telefono] [nvarchar](15) NULL,
	[Email] [nvarchar](150) NULL,
	[MensajeLegal] [nvarchar](300) NULL,
	[FechaRegistro] [datetime] NULL,
	[AutorizacionSRI] [varchar](50) NULL,
	[Establecimiento] [varchar](3) NOT NULL,
	[PuntoEmision] [varchar](3) NOT NULL,
	[SecuencialActual] [int] NOT NULL,
	[FechaCaducidadAutorizacion] [date] NULL,
	[RazonSocial] [nvarchar](200) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DetalleEfectivo]    Script Date: 27/01/2026 15:09:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DetalleEfectivo](
	[IdDetalle] [int] IDENTITY(1,1) NOT NULL,
	[IdArqueo] [int] NOT NULL,
	[Denominacion] [decimal](5, 2) NOT NULL,
	[Cantidad] [int] NOT NULL,
	[Total]  AS ([Denominacion]*[Cantidad]) PERSISTED,
PRIMARY KEY CLUSTERED 
(
	[IdDetalle] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DetalleEntradaInventarios]    Script Date: 27/01/2026 15:09:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DetalleEntradaInventarios](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[EntradaInventarioId] [int] NOT NULL,
	[ProductoId] [int] NOT NULL,
	[Cantidad] [int] NOT NULL,
	[CostoUnitario] [decimal](10, 2) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DetalleVentas]    Script Date: 27/01/2026 15:09:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DetalleVentas](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[VentaId] [int] NOT NULL,
	[ProductoId] [int] NOT NULL,
	[Cantidad] [int] NOT NULL,
	[Subtotal] [decimal](10, 2) NOT NULL,
	[PrecioUnitarioVenta] [decimal](10, 2) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EgresoGasto]    Script Date: 27/01/2026 15:09:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EgresoGasto](
	[IdEgreso] [int] IDENTITY(1,1) NOT NULL,
	[IdArqueo] [int] NULL,
	[Descripcion] [varchar](100) NULL,
	[Monto] [decimal](18, 2) NULL,
	[Fecha] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[IdEgreso] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Empleado]    Script Date: 27/01/2026 15:09:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Empleado](
	[IdEmpleado] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](50) NOT NULL,
	[Cargo] [varchar](50) NULL,
	[Estado] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[IdEmpleado] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EntradaInventarios]    Script Date: 27/01/2026 15:09:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EntradaInventarios](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[FechaEntrada] [datetime] NOT NULL,
	[EmpleadoId] [int] NOT NULL,
	[Observacion] [varchar](255) NULL,
	[TotalProductos] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProductoImagenes]    Script Date: 27/01/2026 15:09:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductoImagenes](
	[IdImagen] [int] IDENTITY(1,1) NOT NULL,
	[IdProducto] [int] NOT NULL,
	[UrlImagen] [nvarchar](max) NOT NULL,
	[Orden] [int] NULL,
	[EsPortada] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[IdImagen] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Productos]    Script Date: 27/01/2026 15:09:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Productos](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](100) NOT NULL,
	[CategoriaId] [int] NOT NULL,
	[Stock] [int] NOT NULL,
	[Precio] [decimal](10, 2) NOT NULL,
	[FechaCreacion] [datetime] NOT NULL,
	[EsActivo] [bit] NOT NULL,
	[Descripcion] [nvarchar](max) NULL,
	[SubcategoriaId] [int] NULL,
	[FotoUrl] [nvarchar](255) NULL,
	[Costo] [decimal](18, 2) NOT NULL,
	[UrlVideo] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Subcategorias]    Script Date: 27/01/2026 15:09:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Subcategorias](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](100) NOT NULL,
	[CategoriaId] [int] NOT NULL,
	[EsActivo] [bit] NOT NULL,
 CONSTRAINT [PK_Subcategorias] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[VentaIngreso]    Script Date: 27/01/2026 15:09:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[VentaIngreso](
	[IdVenta] [int] IDENTITY(1,1) NOT NULL,
	[IdArqueo] [int] NOT NULL,
	[Categoria] [varchar](50) NULL,
	[Monto] [decimal](18, 2) NULL,
PRIMARY KEY CLUSTERED 
(
	[IdVenta] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Ventas]    Script Date: 27/01/2026 15:09:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ventas](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[FechaVenta] [datetime] NOT NULL,
	[EmpleadoId] [int] NOT NULL,
	[Total] [decimal](10, 2) NOT NULL,
	[Observacion] [varchar](255) NULL,
	[ClienteId] [int] NULL,
	[NumeroNota] [nvarchar](50) NULL,
	[EsAnulada] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[AspNetUsers] ([Id], [Email], [EmailConfirmed], [PasswordHash], [SecurityStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEndDateUtc], [LockoutEnabled], [AccessFailedCount], [UserName]) VALUES (N'73e39fb8-c826-4a64-991d-b1dfdf01cbda', N'jairocalle4@gmail.com', 0, N'AAWyw4UDWzM5m7Bhwcrb9z8OhSSwLPopcso3wCbJ9gAnbHwVbjsCw2fZI2GpJHQn3Q==', N'a4cee58d-68e3-4f1c-9225-172d33af0bd6', NULL, 0, 0, NULL, 1, 0, N'jairocalle4@gmail.com')
GO
SET IDENTITY_INSERT [dbo].[Categorias] ON 

INSERT [dbo].[Categorias] ([Id], [Nombre], [EsActivo]) VALUES (2, N'LIBRERIA', 1)
INSERT [dbo].[Categorias] ([Id], [Nombre], [EsActivo]) VALUES (3, N'TINTAS', 1)
INSERT [dbo].[Categorias] ([Id], [Nombre], [EsActivo]) VALUES (5, N'CÁMARAS', 1)
INSERT [dbo].[Categorias] ([Id], [Nombre], [EsActivo]) VALUES (7, N'VAPES', 1)
INSERT [dbo].[Categorias] ([Id], [Nombre], [EsActivo]) VALUES (8, N'DISP. ALMACENAMIENTO', 1)
INSERT [dbo].[Categorias] ([Id], [Nombre], [EsActivo]) VALUES (10, N'COLECCION', 1)
INSERT [dbo].[Categorias] ([Id], [Nombre], [EsActivo]) VALUES (13, N'MASCARAS', 1)
INSERT [dbo].[Categorias] ([Id], [Nombre], [EsActivo]) VALUES (14, N'CONSOLAS', 1)
INSERT [dbo].[Categorias] ([Id], [Nombre], [EsActivo]) VALUES (16, N'PROYECTORES', 1)
INSERT [dbo].[Categorias] ([Id], [Nombre], [EsActivo]) VALUES (17, N'AUDIFONOS', 1)
INSERT [dbo].[Categorias] ([Id], [Nombre], [EsActivo]) VALUES (18, N'ACCESORIOS PC/LAPTOP', 1)
INSERT [dbo].[Categorias] ([Id], [Nombre], [EsActivo]) VALUES (19, N'PALANCAS', 1)
SET IDENTITY_INSERT [dbo].[Categorias] OFF
GO
SET IDENTITY_INSERT [dbo].[Clientes] ON 

INSERT [dbo].[Clientes] ([Id], [Nombre], [CedulaRuc], [Telefono], [Direccion], [Email], [FechaRegistro]) VALUES (1, N'CONSUMIDOR FINAL', N'9999999999', N'N/A', N'La Troncal', NULL, NULL)
SET IDENTITY_INSERT [dbo].[Clientes] OFF
GO
SET IDENTITY_INSERT [dbo].[ConfiguracionEmpresa] ON 

INSERT [dbo].[ConfiguracionEmpresa] ([Id], [NombreComercial], [RUC], [Direccion], [Telefono], [Email], [MensajeLegal], [FechaRegistro], [AutorizacionSRI], [Establecimiento], [PuntoEmision], [SecuencialActual], [FechaCaducidadAutorizacion], [RazonSocial]) VALUES (1, N'JC TECH', N'0929433514001', N'Calle Manabi y El Artesano', N'0991693863', N'jairocalle4@gmail.com', N'Contribuyente Negocio Popular – Régimen RIMPE.', CAST(N'2026-01-05T13:02:43.613' AS DateTime), N'9999999999', N'001', N'001', 10, CAST(N'2025-11-17' AS Date), N'Jairo Leonardo Calle Maldonado')
SET IDENTITY_INSERT [dbo].[ConfiguracionEmpresa] OFF
GO
SET IDENTITY_INSERT [dbo].[DetalleVentas] ON 

INSERT [dbo].[DetalleVentas] ([Id], [VentaId], [ProductoId], [Cantidad], [Subtotal], [PrecioUnitarioVenta]) VALUES (1, 1, 23, 1, CAST(5.00 AS Decimal(10, 2)), CAST(5.00 AS Decimal(10, 2)))
SET IDENTITY_INSERT [dbo].[DetalleVentas] OFF
GO
SET IDENTITY_INSERT [dbo].[Empleado] ON 

INSERT [dbo].[Empleado] ([IdEmpleado], [Nombre], [Cargo], [Estado]) VALUES (1, N'Jairo Calle', N'Administrador', 1)
SET IDENTITY_INSERT [dbo].[Empleado] OFF
GO
SET IDENTITY_INSERT [dbo].[ProductoImagenes] ON 

INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (3, 4, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767796781/1GSM41-_fznbww.png', 3, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (4, 4, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767797108/3bb7afccd1c3e2b67e4a2020dde840e4548a87df_original_pmrhz5.jpg', 4, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (5, 4, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767797108/525745944_1466721571149698_6996934762023862895_n_pr0jgc.jpg', 5, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (6, 4, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767797121/515493935_1466721547816367_7370414575066808438_n_dd1myu.jpg', 6, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (7, 4, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767797128/S6755f16e1c37465a931bd0e9715437a6a_svuvhv.avif', 7, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (8, 5, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767884271/71mg_Rol-pL._AC_UF894_1000_QL80__vhr5vv.jpg', 1, 1)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (9, 5, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767884271/71R4KMkVdkL_jzkj8z.jpg', 2, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (10, 5, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767884271/71Yza1faCpL._AC_UF350_350_QL80__wamuqc.jpg', 3, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (11, 5, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767884271/1739637867716370_a5wlth.png', 4, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (12, 5, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767884271/640_ee5fn1.webp', 5, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (13, 5, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767884271/61pqyz-cCtL._AC_UF350_350_QL80__okzk34.jpg', 6, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (14, 6, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767885327/auri-eb90c5c789cc32e5df17068837804883-1024-1024_qcp1e9.jpg', 1, 1)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (15, 6, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767885372/A2931.BLACK__ce4tam.jpg', 2, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (16, 6, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767885969/cn-11134207-7qukw-ljdka4bxeoome2_dmkskq.jpg', 3, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (17, 6, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767885969/1736298309Capturadepantalla20250107alas185004png_aajxjh.png', 4, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (18, 7, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767886690/D_NQ_NP_2X_982746-MLA87770498480_072025-F_tgybyi.webp', 1, 1)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (19, 7, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767886689/D_NQ_NP_2X_910698-MLA87770262824_072025-F_icrkcf.webp', 2, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (20, 7, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767886689/D_NQ_NP_2X_998731-MLA87770684834_072025-F_jbogab.webp', 3, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (21, 7, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767886689/D_NQ_NP_2X_696907-MLA87770183794_072025-F_vq0jgc.webp', 4, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (22, 7, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767886689/D_NQ_NP_2X_716880-MLA99937762653_112025-F_lkt8re.webp', 5, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (23, 8, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767969463/bang-king-35000-12-768x768_slss1h.jpg', 1, 1)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (24, 8, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767969955/bang-king-35000-4_wyc5zp.jpg', 2, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (25, 9, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767970291/bang-28000-puffs-grape-ice_orlkum.jpg', 1, 1)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (26, 9, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767970291/6f282742aa386f29b9de70ed36_rvuijg.jpg', 2, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (27, 10, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767989133/D_NQ_NP_627651-MLA99855629837_112025-O_rfaqhf.webp', 1, 1)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (28, 11, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767990119/D_Q_NP_665929-MLA100089121319_122025-O_wfwn69.webp', 1, 1)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (29, 11, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767990119/D_NQ_NP_2X_622446-MLA84837720645_052025-F_wvisth.webp', 2, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (30, 11, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767990119/D_NQ_NP_2X_736248-MLA84539548884_052025-F_ij4scx.webp', 3, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (31, 11, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767990120/cable-hdmi-15-metros_ozgpck.webp', 4, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (32, 12, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767990119/D_NQ_NP_2X_736248-MLA84539548884_052025-F_ij4scx.webp', 1, 1)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (33, 12, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767990119/D_Q_NP_665929-MLA100089121319_122025-O_wfwn69.webp', 2, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (34, 12, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767990119/D_NQ_NP_2X_622446-MLA84837720645_052025-F_wvisth.webp', 3, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (35, 13, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767991215/D_NQ_NP_652001-MEC70181282524_062023-O_xu3coj.webp', 1, 1)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (36, 13, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767991216/1701284768893_1701284766340_1701284765794_1_uiwu0o.webp', 2, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (37, 13, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767991215/camara-wifi-tptz-ip66-cla_nzqosa.jpg', 3, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (38, 14, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767991632/Camara-de-seguridad-inteligente-WiFi-V380-1_wrfaza.png', 1, 1)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (39, 14, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767991630/Camara-de-seguridad-inteligente-WiFi-V380-5_v9urzg.png', 2, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (40, 14, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767991629/Camara-de-seguridad-inteligente-WiFi-V380-4_fqwxvl.png', 3, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (41, 14, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767991623/Camara-de-seguridad-inteligente-WiFi-V380-7_jdq7fb.png', 4, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (42, 14, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767991622/Camara-de-seguridad-inteligente-WiFi-V380-3_e0oq4w.png', 5, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (43, 15, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767992401/Tapo_C500_EU_1.0_overview_normal_20230413025303g_psqryc.png', 1, 1)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (44, 15, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767992399/D_NQ_NP_654601-MLU77337134092_072024-O_e6eqvl.webp', 2, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (45, 15, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767992400/05_normal_20221223095855g_kgrecn.jpg', 3, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (46, 15, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767992401/01_normal_20221223095419u_dyynor.jpg', 4, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (47, 15, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767992400/02_normal_20221223095434z_trg2bt.jpg', 5, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (48, 15, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767992400/04_normal_20221223095731t_kcrkbg.jpg', 6, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (49, 15, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767992400/06_normal_20221223100035x_ojitri.jpg', 7, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (50, 16, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768155432/0100544305-000000000004795043-0-c515Wx515H_yfxksy.jpg', 1, 1)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (51, 16, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768155432/D_NQ_NP_833125-MEC81412780843_122024-O_q3xprg.webp', 2, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (52, 16, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768155432/51OWGgMpEXL._AC_UF894_1000_QL80__qtwrk2.jpg', 3, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (53, 16, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768155432/efb1af35-01b0-46a5-9498-50424fb2fb02_oqpu1y.webp', 4, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (54, 17, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768155665/D_NQ_NP_744476-MEC92271883318_092025-O_xnbgcc.webp', 1, 1)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (55, 17, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768155665/descarga_1_lxovt9.jpg', 2, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (56, 17, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768155665/1VSM54_gsshuy.webp', 3, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (57, 17, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768155665/mando-control-palanca-dualshock-4-ps4-inalambrico-generico-D_NQ_NP_978818-MEC40637131859_022020-Q_tfsmxo.jpg', 4, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (58, 18, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768157132/PROYECTORGAME_Ma28_11zon_grande_of8mre.webp', 1, 1)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (59, 18, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768157101/83dc70c2-388d-42c2-a87b-03b8ccfb16e7_gayu1l.webp', 2, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (60, 18, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768157101/PROYECTORGAME_31_11zon_grande_xibxf8.webp', 3, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (61, 18, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768157101/6526f311-fbee-43d0-a438-5d5b78519b57_kumxw1.webp', 4, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (62, 19, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768157661/5157046341766066528_dvpqzj.jpg', 1, 1)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (63, 19, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768157661/5157046341766066525_bw6kza.jpg', 2, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (64, 19, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768157661/5157046341766066529_c0ku8b.jpg', 3, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (65, 19, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768157661/5157046341766066526_j9gvft.jpg', 4, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (66, 20, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768158108/D_NQ_NP_929341-MEC84016695172_052025-O_tgykff.webp', 1, 1)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (67, 20, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768158109/351359450_1978175672521064_7936416946878561419_n_drhhng.webp', 2, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (68, 20, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768158104/D_NQ_NP_616787-MLA93961652713_102025-O_wfzk0u.webp', 3, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (69, 20, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768158107/D_NQ_NP_2X_985610-MEC84016695170_052025-F_dvzfys.webp', 4, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (70, 21, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768917554/micro-sd-128-gb-kingston-cs2_g5gzfx.jpg', 1, 1)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (71, 23, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767990120/cable-hdmi-15-metros_ozgpck.webp', 1, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (72, 23, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767990119/D_NQ_NP_2X_736248-MLA84539548884_052025-F_ij4scx.webp', 2, 0)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (73, 24, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1769097499/Mouse-Color-Negro-con-cable-para-Pc-de-Escritorio-comprar-venta-quito_pvarpk.jpg', 1, 1)
INSERT [dbo].[ProductoImagenes] ([IdImagen], [IdProducto], [UrlImagen], [Orden], [EsPortada]) VALUES (74, 24, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1769097498/images_dzwapm.jpg', 2, 0)
SET IDENTITY_INSERT [dbo].[ProductoImagenes] OFF
GO
SET IDENTITY_INSERT [dbo].[Productos] ON 

INSERT [dbo].[Productos] ([Id], [Nombre], [CategoriaId], [Stock], [Precio], [FechaCreacion], [EsActivo], [Descripcion], [SubcategoriaId], [FotoUrl], [Costo], [UrlVideo]) VALUES (4, N'Camara Doble Lente Exterior', 5, 1, CAST(55.00 AS Decimal(10, 2)), CAST(N'2026-01-06T14:32:27.300' AS DateTime), 1, N'IP66
', 9, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767796781/1GSM41-_fznbww.png', CAST(25.00 AS Decimal(18, 2)), N'https://www.youtube.com/shorts/ck3gpHfF84M')
INSERT [dbo].[Productos] ([Id], [Nombre], [CategoriaId], [Stock], [Precio], [FechaCreacion], [EsActivo], [Descripcion], [SubcategoriaId], [FotoUrl], [Costo], [UrlVideo]) VALUES (5, N'Cámara Giratoria KOS-11005', 5, 2, CAST(37.50 AS Decimal(10, 2)), CAST(N'2026-01-08T08:59:11.907' AS DateTime), 1, N'MARCA: KOUVOLSEN   /   APP V380PRO
–COMPATIBLE CON DISPOSITIVOS MÓVILES: ANDROID/IOS

-VISIÓN NOCTURNA (8 POTENTES LED’S)
– NIVEL DE PROTECCIÓN IP66 A PRUEBA DE AGUA
CONFIABLE EN CUALQUIER CONDICIÓN CLIMÁTICA', 13, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767884271/71mg_Rol-pL._AC_UF894_1000_QL80__vhr5vv.jpg', CAST(18.50 AS Decimal(18, 2)), NULL)
INSERT [dbo].[Productos] ([Id], [Nombre], [CategoriaId], [Stock], [Precio], [FechaCreacion], [EsActivo], [Descripcion], [SubcategoriaId], [FotoUrl], [Costo], [UrlVideo]) VALUES (6, N'Airpods Pro 2G (Black)', 17, 1, CAST(28.50 AS Decimal(10, 2)), CAST(N'2026-01-08T09:28:35.103' AS DateTime), 1, N'- Cuenta con la tecnología True Wireless.
- Cuenta con cancelación de ruido.
- Con funda de carga.
- Incluye micrófono.
- Almohadillas ', 20, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767885327/auri-eb90c5c789cc32e5df17068837804883-1024-1024_qcp1e9.jpg', CAST(11.00 AS Decimal(18, 2)), N'https://youtube.com/shorts/jTgERSepN6g')
INSERT [dbo].[Productos] ([Id], [Nombre], [CategoriaId], [Stock], [Precio], [FechaCreacion], [EsActivo], [Descripcion], [SubcategoriaId], [FotoUrl], [Costo], [UrlVideo]) VALUES (7, N'Airpods Pro 2G (White)', 17, 2, CAST(28.00 AS Decimal(10, 2)), CAST(N'2026-01-08T09:39:19.797' AS DateTime), 1, N'Tecnología True Wireless. - Cuenta con cancelación de ruido. - Con funda de carga. - Incluye micrófono. - Almohadillas de repuesto.', 20, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767886690/D_NQ_NP_2X_982746-MLA87770498480_072025-F_tgybyi.webp', CAST(10.50 AS Decimal(18, 2)), N'https://res.cloudinary.com/ddw9fdcnt/video/upload/v1768415329/Aud_fonos_Aripro_2G_Black_720P_arrrds.mp4')
INSERT [dbo].[Productos] ([Id], [Nombre], [CategoriaId], [Stock], [Precio], [FechaCreacion], [EsActivo], [Descripcion], [SubcategoriaId], [FotoUrl], [Costo], [UrlVideo]) VALUES (8, N'Vapes Desechables Bang King 35000mil Caladas Vape Doble Sabor', 7, 2, CAST(30.00 AS Decimal(10, 2)), CAST(N'2026-01-09T08:44:33.037' AS DateTime), 1, N'Bang King 35000 Puffs viene con cápsulas dobles y sabores dobles. Hay 0%, 2%, 3% y 5% de nicotina, 56 ml de líquido.
Resistencia de malla doble de 1.0 Ω
 / Batería recargable tipo C de 650 mAh
', 21, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767969463/bang-king-35000-12-768x768_slss1h.jpg', CAST(8.00 AS Decimal(18, 2)), NULL)
INSERT [dbo].[Productos] ([Id], [Nombre], [CategoriaId], [Stock], [Precio], [FechaCreacion], [EsActivo], [Descripcion], [SubcategoriaId], [FotoUrl], [Costo], [UrlVideo]) VALUES (9, N'Vape desechable Bang 28000 Puffs -  con nivel de hielo ajustable', 7, 1, CAST(25.00 AS Decimal(10, 2)), CAST(N'2026-01-09T08:53:25.757' AS DateTime), 1, N'Bang 28000 Puffs - Vape desechable con nivel de hielo ajustableDiseñado para quienes buscan un rendimiento duradero y experiencias de vapeo personalizadas, este dispositivo combina características de vanguardia con una comodidad incomparable.', 11, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767970291/bang-28000-puffs-grape-ice_orlkum.jpg', CAST(7.00 AS Decimal(18, 2)), NULL)
INSERT [dbo].[Productos] ([Id], [Nombre], [CategoriaId], [Stock], [Precio], [FechaCreacion], [EsActivo], [Descripcion], [SubcategoriaId], [FotoUrl], [Costo], [UrlVideo]) VALUES (10, N'Micro SD 64GB (Tarjeta de meomoria)', 8, 1, CAST(15.00 AS Decimal(10, 2)), CAST(N'2026-01-09T14:16:39.883' AS DateTime), 1, N'Capacidad de 64 GB para almacenar fotos y videos.', 12, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767989133/D_NQ_NP_627651-MLA99855629837_112025-O_rfaqhf.webp', CAST(5.00 AS Decimal(18, 2)), NULL)
INSERT [dbo].[Productos] ([Id], [Nombre], [CategoriaId], [Stock], [Precio], [FechaCreacion], [EsActivo], [Descripcion], [SubcategoriaId], [FotoUrl], [Costo], [UrlVideo]) VALUES (11, N'CABLE HDMI 3 METROS 2.0', 18, 2, CAST(6.00 AS Decimal(10, 2)), CAST(N'2026-01-09T14:27:42.687' AS DateTime), 1, N'Largo del cable:  3m.
Formato de venta: Unidad.
Cable HDMI versión 1.4 que soporta Full HD 
Conectores enchapados para mejor calidad de señal.
Diseño mallado que protege de interferencias.
Doble filtro que garantiza transmisión sin interrupciones.
Diámetro del cable de 1.3 mm que asegura resistencia.
Longitud de 1 metros ideal para conexiones cómodas.', 22, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767990119/D_Q_NP_665929-MLA100089121319_122025-O_wfwn69.webp', CAST(2.00 AS Decimal(18, 2)), NULL)
INSERT [dbo].[Productos] ([Id], [Nombre], [CategoriaId], [Stock], [Precio], [FechaCreacion], [EsActivo], [Descripcion], [SubcategoriaId], [FotoUrl], [Costo], [UrlVideo]) VALUES (12, N'CABLE HDMI 5 METROS 2.0', 18, 1, CAST(8.00 AS Decimal(10, 2)), CAST(N'2026-01-09T14:29:19.113' AS DateTime), 1, N'Largo del cable: 5 m
Unidades por pack: 1
Formato de venta: Unidad
Con entrada HDMI y salida HDMI.', 22, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767990119/D_NQ_NP_2X_736248-MLA84539548884_052025-F_ij4scx.webp', CAST(3.00 AS Decimal(18, 2)), NULL)
INSERT [dbo].[Productos] ([Id], [Nombre], [CategoriaId], [Stock], [Precio], [FechaCreacion], [EsActivo], [Descripcion], [SubcategoriaId], [FotoUrl], [Costo], [UrlVideo]) VALUES (13, N'CÁMARA GIRATORIA EXTERIOR IP66 ', 5, 1, CAST(30.00 AS Decimal(10, 2)), CAST(N'2026-01-09T14:40:54.737' AS DateTime), 1, N'APP YILOT / –COMPATIBLE CON DISPOSITIVOS MÓVILES: ANDROID/IOS -VISIÓN NOCTURNA (8 POTENTES LED''S) – NIVEL DE PROTECCIÓN IP66 A PRUEBA DE AGUA CONFIABLE EN CUALQUIER CONDICIÓN CLIMÁTICA', 13, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767991215/D_NQ_NP_652001-MEC70181282524_062023-O_xu3coj.webp', CAST(12.00 AS Decimal(18, 2)), NULL)
INSERT [dbo].[Productos] ([Id], [Nombre], [CategoriaId], [Stock], [Precio], [FechaCreacion], [EsActivo], [Descripcion], [SubcategoriaId], [FotoUrl], [Costo], [UrlVideo]) VALUES (14, N'Camara Negra DOBLE V380 4G', 5, 1, CAST(45.00 AS Decimal(10, 2)), CAST(N'2026-01-09T14:48:27.503' AS DateTime), 1, N'La Cámara de Seguridad Inteligente WiFi V380 es una solución completa de videovigilancia para exteriores. Integra un sensor HD de hasta 2.0 MP con resolución 1080p, visión nocturna avanzada y conectividad WiFi para que puedas monitorear tu propiedad en tiempo real desde la app V380/V380 Pro en tu teléfono o Tablet.
Su cabezal motorizado permite rotación horizontal cercana a 355° y vertical de hasta 90°, cubriendo grandes espacios como patios, entradas o parqueaderos. La combinación de LEDs infrarrojos y luz blanca ofrece visión nocturna a color o en blanco y negro según el modo configurado, mientras que el audio bidireccional te permite escuchar y hablar con visitantes, familiares o intrusos desde cualquier lugar.
La cámara incorpora detección inteligente de movimiento, enviando notificaciones al móvil y permitiendo grabación en tarjeta microSD o en la nube, según la configuración. Es ideal para quienes buscan un sistema de seguridad moderno, fácil de instalar y manejar desde el celular.', 9, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767991632/Camara-de-seguridad-inteligente-WiFi-V380-1_wrfaza.png', CAST(19.50 AS Decimal(18, 2)), NULL)
INSERT [dbo].[Productos] ([Id], [Nombre], [CategoriaId], [Stock], [Precio], [FechaCreacion], [EsActivo], [Descripcion], [SubcategoriaId], [FotoUrl], [Costo], [UrlVideo]) VALUES (15, N'Cámara Tapo C500 Exterior Full HD de 1080p', 5, 1, CAST(69.99 AS Decimal(10, 2)), CAST(N'2026-01-09T15:01:32.063' AS DateTime), 1, N'Vista en vivo Full HD de 1080p: Revela imágenes claras y nítidas con más detalles.
 / Definición de la cámara: 4MP. /Protección IP65: Ofrece un excelente rendimiento a prueba de agua y polvo para escenarios al aire libre.
Incluye visión nocturna.
Ideal para control y seguridad de hogares, oficinas y edificios.', 8, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767992401/Tapo_C500_EU_1.0_overview_normal_20230413025303g_psqryc.png', CAST(40.00 AS Decimal(18, 2)), NULL)
INSERT [dbo].[Productos] ([Id], [Nombre], [CategoriaId], [Stock], [Precio], [FechaCreacion], [EsActivo], [Descripcion], [SubcategoriaId], [FotoUrl], [Costo], [UrlVideo]) VALUES (16, N'Palanca PlayStation 3', 19, 1, CAST(15.00 AS Decimal(10, 2)), CAST(N'2026-01-11T12:18:59.743' AS DateTime), 1, N'– Mando inalámbrico.
– Batería recargable.
– Recargable a través de puerto USB.
– Tecnología vía bluetooth.', 23, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768155432/0100544305-000000000004795043-0-c515Wx515H_yfxksy.jpg', CAST(5.00 AS Decimal(18, 2)), NULL)
INSERT [dbo].[Productos] ([Id], [Nombre], [CategoriaId], [Stock], [Precio], [FechaCreacion], [EsActivo], [Descripcion], [SubcategoriaId], [FotoUrl], [Costo], [UrlVideo]) VALUES (17, N'Palanca Playstation 4 AAA', 19, 1, CAST(29.99 AS Decimal(10, 2)), CAST(N'2026-01-11T12:24:03.923' AS DateTime), 1, N'Compatible con PS 4/PS 4 Slim/PS 4 Pro
Precisión inigualable con cada movimiento.
Funcionamiento más suave e impecable
Tecnología de comunicación inalámbrica
2,5 horas de tiempo de carga y hasta 10 horas de uso', 23, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768155665/D_NQ_NP_744476-MEC92271883318_092025-O_xnbgcc.webp', CAST(7.00 AS Decimal(18, 2)), NULL)
INSERT [dbo].[Productos] ([Id], [Nombre], [CategoriaId], [Stock], [Precio], [FechaCreacion], [EsActivo], [Descripcion], [SubcategoriaId], [FotoUrl], [Costo], [UrlVideo]) VALUES (18, N'Proyector Gamer Ultra HD + Controles incluidos', 16, 1, CAST(69.99 AS Decimal(10, 2)), CAST(N'2026-01-11T12:46:04.930' AS DateTime), 1, N'El MEJOR PROYECTOR GAMER
EN TU HOGAR! 🏠🎬 Y CON MAS DE 15000 🎮 JUEGOS PARA TU DIVERSIÓN 

Sistema Operativo: 
Android 11
📡 Android TV integrado: Accede a Netflix, YouTube, Disney+, Prime Video, y más aplicaciones.
📺 Pantalla de 4K y soporta hasta 8K
Enfoque automático con corrección trapezoidal 
Proyecta imagen hasta de 130 pulgadas 
📱 Chromecast incorporado: Transmite contenido desde tu teléfono o tablet al instante.
🎮 Más de 15000 juegos preinstalados: Disfruta horas de diversión con los 2 controles inalámbricos incluidos.
💡 Luminosidad de 8000 lúmenes
Brillo: 120 ANSI
🔊 Sonido Estéreo DSP con altavoces en alta fidelidad 
🔌Conectividad versátil: WIFI y Bluetooth y puertos HDMI, USB  para conectar todos tus dispositivos 
Compatible con Android e IOS para compartir contenido desde tu celular, tablet o PC

🛒 Incluye:
✅ Proyector Android Gamer
✅ 2 controles inalámbricos ergonómicos.
✅ Memory Stick con micro SD con 15000 juegos preinstalados 
✅ Control remoto 
✅ Caja original y manual de usuario.', 24, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768157132/PROYECTORGAME_Ma28_11zon_grande_of8mre.webp', CAST(46.00 AS Decimal(18, 2)), NULL)
INSERT [dbo].[Productos] ([Id], [Nombre], [CategoriaId], [Stock], [Precio], [FechaCreacion], [EsActivo], [Descripcion], [SubcategoriaId], [FotoUrl], [Costo], [UrlVideo]) VALUES (19, N'Auriculares ONIKUMA X25 con cable y micrófono', 17, 1, CAST(29.99 AS Decimal(10, 2)), CAST(N'2026-01-11T12:55:46.317' AS DateTime), 1, N'✔️Audífonos con luz RGB  degradada🌈
✔️ Para ordenador portátil, PC, PS4, 5, Xbox🫧
✔️Super cómodos y con luces llamativas 💫
YZK', 20, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768157661/5157046341766066528_dvpqzj.jpg', CAST(14.00 AS Decimal(18, 2)), N'https://res.cloudinary.com/ddw9fdcnt/video/upload/v1768157673/IMG_5152_qbnryj.mp4')
INSERT [dbo].[Productos] ([Id], [Nombre], [CategoriaId], [Stock], [Precio], [FechaCreacion], [EsActivo], [Descripcion], [SubcategoriaId], [FotoUrl], [Costo], [UrlVideo]) VALUES (20, N'Audifonos Inalámbricos M90', 17, 1, CAST(11.99 AS Decimal(10, 2)), CAST(N'2026-01-11T13:02:54.263' AS DateTime), 1, N'Color: Negro
Bluetooth 5.3
15 Metros
Carga tipo USB C
USB para Power Bank
Batería con 1200 mAh
Pantalla led con indicador de carga
Resistencia IPX7  1 metro de profundidad por 30 minutos', 20, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768158108/D_NQ_NP_929341-MEC84016695172_052025-O_tgykff.webp', CAST(3.50 AS Decimal(18, 2)), NULL)
INSERT [dbo].[Productos] ([Id], [Nombre], [CategoriaId], [Stock], [Precio], [FechaCreacion], [EsActivo], [Descripcion], [SubcategoriaId], [FotoUrl], [Costo], [UrlVideo]) VALUES (21, N'Micro SD 128GB (Tarjeta de meomoria)', 8, 1, CAST(20.00 AS Decimal(10, 2)), CAST(N'2026-01-20T07:59:27.907' AS DateTime), 1, NULL, 12, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1768917554/micro-sd-128-gb-kingston-cs2_g5gzfx.jpg', CAST(10.00 AS Decimal(18, 2)), NULL)
INSERT [dbo].[Productos] ([Id], [Nombre], [CategoriaId], [Stock], [Precio], [FechaCreacion], [EsActivo], [Descripcion], [SubcategoriaId], [FotoUrl], [Costo], [UrlVideo]) VALUES (23, N'CABLE HDMI 1 METRO 2.0', 18, 0, CAST(5.00 AS Decimal(10, 2)), CAST(N'2026-01-22T09:54:55.150' AS DateTime), 1, NULL, 22, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1767990120/cable-hdmi-15-metros_ozgpck.webp', CAST(1.00 AS Decimal(18, 2)), NULL)
INSERT [dbo].[Productos] ([Id], [Nombre], [CategoriaId], [Stock], [Precio], [FechaCreacion], [EsActivo], [Descripcion], [SubcategoriaId], [FotoUrl], [Costo], [UrlVideo]) VALUES (24, N'Mouse Color Negro USB cable', 18, 1, CAST(6.50 AS Decimal(10, 2)), CAST(N'2026-01-22T10:01:21.307' AS DateTime), 1, N'Cable: 1.5m
Conexion: USB
Tipo: con cable
Aclaracion: Se apaga la luz cuando se apaga la computadora', 25, N'https://res.cloudinary.com/ddw9fdcnt/image/upload/v1769097499/Mouse-Color-Negro-con-cable-para-Pc-de-Escritorio-comprar-venta-quito_pvarpk.jpg', CAST(1.50 AS Decimal(18, 2)), NULL)
SET IDENTITY_INSERT [dbo].[Productos] OFF
GO
SET IDENTITY_INSERT [dbo].[Subcategorias] ON 

INSERT [dbo].[Subcategorias] ([Id], [Nombre], [CategoriaId], [EsActivo]) VALUES (1, N'EPSON', 3, 1)
INSERT [dbo].[Subcategorias] ([Id], [Nombre], [CategoriaId], [EsActivo]) VALUES (4, N'HP', 3, 1)
INSERT [dbo].[Subcategorias] ([Id], [Nombre], [CategoriaId], [EsActivo]) VALUES (5, N'CANON', 3, 1)
INSERT [dbo].[Subcategorias] ([Id], [Nombre], [CategoriaId], [EsActivo]) VALUES (6, N'CÁMARA FOCO', 5, 1)
INSERT [dbo].[Subcategorias] ([Id], [Nombre], [CategoriaId], [EsActivo]) VALUES (7, N'LIBRERIA', 2, 1)
INSERT [dbo].[Subcategorias] ([Id], [Nombre], [CategoriaId], [EsActivo]) VALUES (8, N'TP-LINK', 5, 1)
INSERT [dbo].[Subcategorias] ([Id], [Nombre], [CategoriaId], [EsActivo]) VALUES (9, N'VARIOS LENTES', 5, 1)
INSERT [dbo].[Subcategorias] ([Id], [Nombre], [CategoriaId], [EsActivo]) VALUES (10, N'LAVIE', 7, 1)
INSERT [dbo].[Subcategorias] ([Id], [Nombre], [CategoriaId], [EsActivo]) VALUES (11, N'BANG', 7, 1)
INSERT [dbo].[Subcategorias] ([Id], [Nombre], [CategoriaId], [EsActivo]) VALUES (12, N'MICRO SD', 8, 1)
INSERT [dbo].[Subcategorias] ([Id], [Nombre], [CategoriaId], [EsActivo]) VALUES (13, N'UN LENTE GIRATORIAS', 5, 1)
INSERT [dbo].[Subcategorias] ([Id], [Nombre], [CategoriaId], [EsActivo]) VALUES (17, N'SPIDER-MAN', 13, 1)
INSERT [dbo].[Subcategorias] ([Id], [Nombre], [CategoriaId], [EsActivo]) VALUES (18, N'GAME STICK', 14, 1)
INSERT [dbo].[Subcategorias] ([Id], [Nombre], [CategoriaId], [EsActivo]) VALUES (19, N'PROYECTOR', 16, 1)
INSERT [dbo].[Subcategorias] ([Id], [Nombre], [CategoriaId], [EsActivo]) VALUES (20, N'INALAMBRICOS', 17, 1)
INSERT [dbo].[Subcategorias] ([Id], [Nombre], [CategoriaId], [EsActivo]) VALUES (21, N'BANGKING', 7, 1)
INSERT [dbo].[Subcategorias] ([Id], [Nombre], [CategoriaId], [EsActivo]) VALUES (22, N'CABLES', 18, 1)
INSERT [dbo].[Subcategorias] ([Id], [Nombre], [CategoriaId], [EsActivo]) VALUES (23, N'PLAYSTATION', 19, 1)
INSERT [dbo].[Subcategorias] ([Id], [Nombre], [CategoriaId], [EsActivo]) VALUES (24, N'PROYECTOR ANDROID', 16, 1)
INSERT [dbo].[Subcategorias] ([Id], [Nombre], [CategoriaId], [EsActivo]) VALUES (25, N'MOUSE', 18, 1)
SET IDENTITY_INSERT [dbo].[Subcategorias] OFF
GO
SET IDENTITY_INSERT [dbo].[Ventas] ON 

INSERT [dbo].[Ventas] ([Id], [FechaVenta], [EmpleadoId], [Total], [Observacion], [ClienteId], [NumeroNota], [EsAnulada]) VALUES (1, CAST(N'2026-01-22T09:56:39.557' AS DateTime), 1, CAST(5.00 AS Decimal(10, 2)), NULL, 1, N'001-001-000000010', 0)
SET IDENTITY_INSERT [dbo].[Ventas] OFF
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Categori__75E3EFCF79F1EDBE]    Script Date: 27/01/2026 15:09:28 ******/
ALTER TABLE [dbo].[Categorias] ADD UNIQUE NONCLUSTERED 
(
	[Nombre] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Producto__75E3EFCF7ECEB96D]    Script Date: 27/01/2026 15:09:28 ******/
ALTER TABLE [dbo].[Productos] ADD UNIQUE NONCLUSTERED 
(
	[Nombre] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[ArqueoCaja] ADD  DEFAULT ((0)) FOR [SaldoInicial]
GO
ALTER TABLE [dbo].[ArqueoCaja] ADD  DEFAULT ((0)) FOR [TotalVentas]
GO
ALTER TABLE [dbo].[ArqueoCaja] ADD  DEFAULT ((0)) FOR [TotalEgresos]
GO
ALTER TABLE [dbo].[ArqueoCaja] ADD  DEFAULT ((0)) FOR [GananciaNeta]
GO
ALTER TABLE [dbo].[ArqueoCaja] ADD  DEFAULT ((0)) FOR [ResultadoEsperado]
GO
ALTER TABLE [dbo].[ArqueoCaja] ADD  DEFAULT ((0)) FOR [EfectivoTotal]
GO
ALTER TABLE [dbo].[ArqueoCaja] ADD  DEFAULT ((0)) FOR [UtilidadDia]
GO
ALTER TABLE [dbo].[Categorias] ADD  DEFAULT ((1)) FOR [EsActivo]
GO
ALTER TABLE [dbo].[Clientes] ADD  DEFAULT (getdate()) FOR [FechaRegistro]
GO
ALTER TABLE [dbo].[ConfiguracionEmpresa] ADD  DEFAULT ('Contribuyente Régimen RIMPE – Negocio Popular') FOR [MensajeLegal]
GO
ALTER TABLE [dbo].[ConfiguracionEmpresa] ADD  DEFAULT (getdate()) FOR [FechaRegistro]
GO
ALTER TABLE [dbo].[ConfiguracionEmpresa] ADD  CONSTRAINT [DF_Config_Establecimiento]  DEFAULT ('001') FOR [Establecimiento]
GO
ALTER TABLE [dbo].[ConfiguracionEmpresa] ADD  CONSTRAINT [DF_Config_PuntoEmision]  DEFAULT ('001') FOR [PuntoEmision]
GO
ALTER TABLE [dbo].[ConfiguracionEmpresa] ADD  CONSTRAINT [DF_Config_SecuencialActual]  DEFAULT ((0)) FOR [SecuencialActual]
GO
ALTER TABLE [dbo].[DetalleVentas] ADD  DEFAULT ((0.00)) FOR [PrecioUnitarioVenta]
GO
ALTER TABLE [dbo].[EgresoGasto] ADD  DEFAULT (getdate()) FOR [Fecha]
GO
ALTER TABLE [dbo].[Empleado] ADD  DEFAULT ('Encargado') FOR [Cargo]
GO
ALTER TABLE [dbo].[Empleado] ADD  DEFAULT ((1)) FOR [Estado]
GO
ALTER TABLE [dbo].[EntradaInventarios] ADD  DEFAULT (getdate()) FOR [FechaEntrada]
GO
ALTER TABLE [dbo].[EntradaInventarios] ADD  DEFAULT ((0)) FOR [TotalProductos]
GO
ALTER TABLE [dbo].[ProductoImagenes] ADD  DEFAULT ((0)) FOR [Orden]
GO
ALTER TABLE [dbo].[ProductoImagenes] ADD  DEFAULT ((0)) FOR [EsPortada]
GO
ALTER TABLE [dbo].[Productos] ADD  DEFAULT ((0)) FOR [Stock]
GO
ALTER TABLE [dbo].[Productos] ADD  DEFAULT (getdate()) FOR [FechaCreacion]
GO
ALTER TABLE [dbo].[Productos] ADD  DEFAULT ((1)) FOR [EsActivo]
GO
ALTER TABLE [dbo].[Productos] ADD  DEFAULT ((0)) FOR [Costo]
GO
ALTER TABLE [dbo].[Subcategorias] ADD  DEFAULT ((1)) FOR [EsActivo]
GO
ALTER TABLE [dbo].[Ventas] ADD  DEFAULT (getdate()) FOR [FechaVenta]
GO
ALTER TABLE [dbo].[Ventas] ADD  DEFAULT ((0)) FOR [EsAnulada]
GO
ALTER TABLE [dbo].[ArqueoCaja]  WITH CHECK ADD FOREIGN KEY([IdEncargado])
REFERENCES [dbo].[Empleado] ([IdEmpleado])
GO
ALTER TABLE [dbo].[AspNetUserClaims]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserClaims] CHECK CONSTRAINT [FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserLogins]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserLogins] CHECK CONSTRAINT [FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserRoles]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetRoles_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[AspNetRoles] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserRoles] CHECK CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetRoles_RoleId]
GO
ALTER TABLE [dbo].[AspNetUserRoles]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserRoles] CHECK CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[DetalleEfectivo]  WITH CHECK ADD FOREIGN KEY([IdArqueo])
REFERENCES [dbo].[ArqueoCaja] ([IdArqueo])
GO
ALTER TABLE [dbo].[DetalleEntradaInventarios]  WITH CHECK ADD FOREIGN KEY([EntradaInventarioId])
REFERENCES [dbo].[EntradaInventarios] ([Id])
GO
ALTER TABLE [dbo].[DetalleEntradaInventarios]  WITH CHECK ADD FOREIGN KEY([ProductoId])
REFERENCES [dbo].[Productos] ([Id])
GO
ALTER TABLE [dbo].[DetalleVentas]  WITH NOCHECK ADD FOREIGN KEY([ProductoId])
REFERENCES [dbo].[Productos] ([Id])
GO
ALTER TABLE [dbo].[DetalleVentas]  WITH NOCHECK ADD FOREIGN KEY([VentaId])
REFERENCES [dbo].[Ventas] ([Id])
GO
ALTER TABLE [dbo].[EgresoGasto]  WITH CHECK ADD FOREIGN KEY([IdArqueo])
REFERENCES [dbo].[ArqueoCaja] ([IdArqueo])
GO
ALTER TABLE [dbo].[EntradaInventarios]  WITH CHECK ADD FOREIGN KEY([EmpleadoId])
REFERENCES [dbo].[Empleado] ([IdEmpleado])
GO
ALTER TABLE [dbo].[ProductoImagenes]  WITH CHECK ADD  CONSTRAINT [FK_ProductoImagenes_Productos] FOREIGN KEY([IdProducto])
REFERENCES [dbo].[Productos] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ProductoImagenes] CHECK CONSTRAINT [FK_ProductoImagenes_Productos]
GO
ALTER TABLE [dbo].[Productos]  WITH CHECK ADD FOREIGN KEY([CategoriaId])
REFERENCES [dbo].[Categorias] ([Id])
GO
ALTER TABLE [dbo].[Productos]  WITH CHECK ADD  CONSTRAINT [FK_Productos_Subcategorias] FOREIGN KEY([SubcategoriaId])
REFERENCES [dbo].[Subcategorias] ([Id])
GO
ALTER TABLE [dbo].[Productos] CHECK CONSTRAINT [FK_Productos_Subcategorias]
GO
ALTER TABLE [dbo].[Subcategorias]  WITH CHECK ADD  CONSTRAINT [FK_Subcategorias_Categorias] FOREIGN KEY([CategoriaId])
REFERENCES [dbo].[Categorias] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Subcategorias] CHECK CONSTRAINT [FK_Subcategorias_Categorias]
GO
ALTER TABLE [dbo].[VentaIngreso]  WITH CHECK ADD FOREIGN KEY([IdArqueo])
REFERENCES [dbo].[ArqueoCaja] ([IdArqueo])
GO
ALTER TABLE [dbo].[Ventas]  WITH NOCHECK ADD FOREIGN KEY([EmpleadoId])
REFERENCES [dbo].[Empleado] ([IdEmpleado])
GO
ALTER TABLE [dbo].[Ventas]  WITH CHECK ADD  CONSTRAINT [FK_Ventas_Clientes] FOREIGN KEY([ClienteId])
REFERENCES [dbo].[Clientes] ([Id])
GO
ALTER TABLE [dbo].[Ventas] CHECK CONSTRAINT [FK_Ventas_Clientes]
GO
ALTER TABLE [dbo].[ArqueoCaja]  WITH CHECK ADD CHECK  (([Turno]=(2) OR [Turno]=(1)))
GO
ALTER TABLE [dbo].[Productos]  WITH CHECK ADD  CONSTRAINT [CK_Productos_Stock] CHECK  (([Stock]>=(0)))
GO
ALTER TABLE [dbo].[Productos] CHECK CONSTRAINT [CK_Productos_Stock]
GO
