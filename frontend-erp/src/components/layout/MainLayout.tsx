import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Layers, LogOut, Menu, User, Briefcase, FileText, ShoppingCart, X, Settings, DollarSign, BarChart2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Toast } from '../common/Toast';
import { companyService } from '../../services/company.service';

export default function MainLayout() {
    const { logout, user } = useAuthStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

            <div className="p-4 mt-auto">
                <div className="relative group">
                    <button
                        className="w-full bg-white/5 rounded-2xl p-4 flex items-center gap-3 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all text-left"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-400 to-cyan-400 flex items-center justify-center text-white font-bold shadow-lg">
                            {user?.username?.substring(0, 2).toUpperCase() || 'AD'}
                        </div>
                        <div className="overflow-hidden flex-1">
                            <p className="text-sm font-bold text-white truncate">{user?.username || 'Admin'}</p>
                            <p className="text-xs text-indigo-200 truncate font-medium">{user?.role || 'Superuser'}</p>
                        </div>
                        <Settings size={16} className="text-indigo-200 group-hover:rotate-90 transition-transform" />

                        {/* Dropdown Menu - Simple CSS hover for now, or onClick state if preferred */}
                        <div className="absolute bottom-full left-0 w-full mb-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 hidden group-focus-within:block group-hover:block animate-scale-in origin-bottom">
                            <NavLink to="/settings" className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-white/10 px-3 py-2.5 rounded-xl transition-all text-sm font-medium mb-1">
                                <Settings size={16} />
                                Configuración
                            </NavLink>
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-2 text-rose-300 hover:text-white hover:bg-rose-500/20 px-3 py-2.5 rounded-xl transition-all text-sm font-medium"
                            >
                                <LogOut size={16} />
                                Cerrar Sesión
                            </button>
                        </div>
                    </button>
                </div>
            </div>
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

                    {/* Desktop Title (Optional, or Breadcrumbs) */}
                    <div className="hidden md:block">
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                            {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden p-2 text-indigo-600 bg-indigo-50 rounded-xl active:scale-95 transition-transform"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </button>

                        {/* Profile/Notification Placeholder for Desktop Header */}
                        <div className="hidden md:flex items-center gap-3">
                            <span className="text-sm font-medium text-slate-500">{new Date().toLocaleDateString()}</span>
                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-600 ring-2 ring-indigo-50 cursor-pointer hover:ring-indigo-200 transition-all">
                                <User size={20} />
                            </div>
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
