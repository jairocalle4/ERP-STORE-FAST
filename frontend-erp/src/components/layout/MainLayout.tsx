import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Layers, LogOut, Menu, User, Briefcase, FileText, ShoppingCart, X, Settings, DollarSign, BarChart2, Plus } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Toast } from '../common/Toast';
import { companyService } from '../../services/company.service';

export default function MainLayout() {
    const { logout, user } = useAuthStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // Controlled dropdown state
    const [companyName, setCompanyName] = useState('ERP-STORE-FAST');
    const location = useLocation();

    useEffect(() => {
        const fetchCompanyInfo = async () => {
            try {
                const settings = await companyService.getSettings();
                if (settings?.name) {
                    setCompanyName(settings.name);
                }
            } catch (error) {
                console.error('Error loading company info', error);
            }
        };
        fetchCompanyInfo();
    }, []);

    // Close mobile menu on route change
    if (isMobileMenuOpen && location) {
        // We can use an effect, but simple logic here works too or onClick in NavLink
    }

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/products', icon: Package, label: 'Productos' },
        { path: '/categories', icon: Layers, label: 'Categorías' },
        { path: '/clients', icon: User, label: 'Clientes' },
        { path: '/employees', icon: Briefcase, label: 'Empleados' },
        { path: '/sales', icon: FileText, label: 'Ventas' },
        { path: '/expenses', icon: DollarSign, label: 'Egresos' },
        { path: '/reports', icon: BarChart2, label: 'Reportes' },
        { path: '/pos', icon: ShoppingCart, label: 'Punto de Venta' },
    ];

    const SidebarContent = () => (
        <>
            <div className="p-8 flex items-center justify-center border-b border-white/10 mx-4">
                <h1 className="text-xl font-black tracking-tighter text-white filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] text-center break-words leading-tight">
                    {companyName.toUpperCase()}
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group font-medium text-sm ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 relative overflow-hidden'
                                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-100 -z-10"></div>}
                                <item.icon size={20} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className="tracking-wide">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>


        </>
    );

    return (
        <div className="flex h-screen overflow-hidden text-slate-800 bg-slate-50/0 font-sans selection:bg-indigo-500/30">
            {/* Desktop Floating Sidebar */}
            <aside className="hidden md:flex flex-col fixed left-4 top-4 bottom-4 w-72 glass-float rounded-3xl z-30 transition-all duration-300 border border-white/10 shadow-2xl">
                <SidebarContent />
            </aside>

            {/* Mobile Overlay & Sidebar */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <aside className="absolute left-0 top-0 bottom-0 w-[85%] max-w-xs glass-float flex flex-col z-50 animate-scale-in shadow-2xl border-r border-white/10">
                        <button
                            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <X size={24} />
                        </button>
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Main Content Wrapper */}
            <div className="flex-1 md:ml-80 flex flex-col h-full overflow-hidden relative">

                {/* Desktop Header / Mobile Header */}
                <header className="sticky top-0 z-20 px-6 py-4 flex justify-between items-center md:bg-transparent md:backdrop-blur-none bg-white/80 backdrop-blur-md md:pt-6">
                    <div className="md:hidden">
                        <span className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent break-words leading-tight">
                            {companyName.toUpperCase()}
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <NavLink
                            to="/pos"
                            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
                        >
                            <ShoppingCart size={18} strokeWidth={2.5} />
                            <span>Nueva Venta</span>
                        </NavLink>
                        <NavLink
                            to="/products/new"
                            className="flex items-center gap-2 bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50 px-5 py-2.5 rounded-full font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
                        >
                            <Plus size={18} strokeWidth={2.5} />
                            <span>Nuevo Producto</span>
                        </NavLink>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-slate-500 hidden md:inline-block">{new Date().toLocaleDateString()}</span>

                        {/* User Menu Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-indigo-50 hover:ring-indigo-200 transition-all cursor-pointer"
                            >
                                {user?.username?.substring(0, 2).toUpperCase() || 'AD'}
                            </button>

                            {/* Overlay to close menu when clicking outside */}
                            {isUserMenuOpen && (
                                <div
                                    className="fixed inset-0 z-40 bg-transparent"
                                    onClick={() => setIsUserMenuOpen(false)}
                                />
                            )}

                            {/* Dropdown Content */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 animate-scale-in origin-top-right z-50">
                                    <div className="p-4 border-b border-slate-100 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                            {user?.username?.substring(0, 2).toUpperCase() || 'AD'}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="font-bold text-slate-800 truncate">{user?.username || 'Admin'}</p>
                                            <p className="text-xs text-slate-500 truncate">{user?.role || 'Administrator'}</p>
                                        </div>
                                    </div>

                                    <div className="py-2">
                                        <NavLink
                                            to="/settings"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all text-sm font-medium"
                                        >
                                            <Settings size={18} />
                                            Configuración
                                        </NavLink>
                                        <NavLink
                                            to="/profile"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all text-sm font-medium"
                                        >
                                            <User size={18} />
                                            Mi Perfil
                                        </NavLink>
                                    </div>

                                    <div className="border-t border-slate-100 py-2">
                                        <button
                                            onClick={() => {
                                                setIsUserMenuOpen(false);
                                                logout();
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all text-sm font-medium"
                                        >
                                            <LogOut size={18} />
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar">
                    <Outlet />
                </main>
            </div>
            <Toast />
        </div>
    );
}
