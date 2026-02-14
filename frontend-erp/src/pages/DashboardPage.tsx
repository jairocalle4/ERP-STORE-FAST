import { useEffect, useState } from "react";
import { Package, ShoppingCart, Settings, TrendingUp, AlertCircle, Wallet, ArrowUpRight, ArrowDownRight, MoreHorizontal, PieChart as PieIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { dashboardService } from "../services/dashboard.service";
import type { DashboardStats } from "../services/dashboard.service";

export default function DashboardPage() {
    const [statsData, setStatsData] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await dashboardService.getStats();
                setStatsData(data);
            } catch (err) {
                console.error("Error loading dashboard stats:", err);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    const pieData = [
        { name: 'Airpods Pro 2G', value: 40, color: '#4f46e5' },
        { name: 'Cable HDMI 2.0', value: 20, color: '#10b981' },
        { name: 'Case iPhone 15', value: 15, color: '#f59e0b' },
        { name: 'Cargador 20W', value: 25, color: '#ec4899' },
    ];

    const stats = [
        {
            title: "Ventas Hoy",
            value: `$${(statsData?.salesToday || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            trend: "+0%",
            icon: Wallet,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Ganancia Neta (Est.)",
            value: `$${((statsData?.salesToday || 0) * 0.3).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            trend: "+0%",
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            title: "En Caja (Efectivo)",
            value: `$${(statsData?.cashToday || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            icon: ShoppingCart,
            color: "text-cyan-600",
            bg: "bg-cyan-50"
        },
        {
            title: "Gastos / Egresos",
            value: "$0.00",
            trend: "-0%",
            icon: ArrowDownRight,
            color: "text-rose-600",
            bg: "bg-rose-50"
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <span className="bg-indigo-600 w-2 h-8 rounded-full"></span>
                        Dashboard
                    </h2>
                    <p className="text-slate-500 ml-4 font-medium">Resumen general al {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/pos" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 active:scale-95">
                        <ArrowUpRight size={20} />
                        Nueva Venta
                    </Link>
                    <button className="bg-white hover:bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 transition-colors">
                        <PieIcon size={20} />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="glass-panel p-6 rounded-2xl hover-float cursor-default">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3.5 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} strokeWidth={2.5} />
                            </div>
                            {stat.trend && (
                                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {stat.trend}
                                </span>
                            )}
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">{stat.title}</p>
                            <h3 className="text-3xl font-extrabold text-slate-800 mt-1 tracking-tight">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart */}
                <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Comportamiento de Ventas</h3>
                            <p className="text-sm text-slate-400 font-medium">Últimos 7 días</p>
                        </div>
                        <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><MoreHorizontal size={20} /></button>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={statsData?.chartData || []}>
                                <defs>
                                    <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    cursor={{ stroke: '#4f46e5', strokeWidth: 2 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="ventas"
                                    stroke="#4f46e5"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorVentas)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Products Chart */}
                <div className="glass-panel p-6 rounded-2xl flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Top 5 Más Vendidos</h3>
                        <p className="text-sm text-slate-400 font-medium">Distribución por volumen (30 días)</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center min-h-[250px]">
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={65}
                                    outerRadius={85}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="w-full mt-4 space-y-3">
                            {pieData.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-slate-600 font-medium">{item.name}</span>
                                    </div>
                                    <span className="font-bold text-slate-800">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inventory Summary */}
                <div className="glass-panel p-6 rounded-2xl flex justify-between items-center bg-white/40">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-orange-100 rounded-2xl text-orange-600">
                            <AlertCircle size={28} />
                        </div>
                        <div>
                            <h4 className="text-2xl font-bold text-slate-800">{statsData?.lowStockCount || 0}</h4>
                            <p className="text-sm font-medium text-slate-500">Prod. con Poco Stock</p>
                        </div>
                    </div>
                    <Link to="/products?stock=low" className="px-4 py-2 bg-white text-slate-600 font-bold rounded-lg shadow-sm border border-slate-100 text-sm hover:bg-slate-50 text-center">
                        Gestionar
                    </Link>
                </div>

                {/* Out of Stock Summary */}
                <div className="glass-panel p-6 rounded-2xl flex justify-between items-center bg-white/40">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-rose-100 rounded-2xl text-rose-600">
                            <Package size={28} />
                        </div>
                        <div>
                            <h4 className="text-2xl font-bold text-slate-800">{statsData?.outOfStockCount || 0}</h4>
                            <p className="text-sm font-medium text-slate-500">Agotados</p>
                        </div>
                    </div>
                    <Link to="/products?stock=out" className="px-4 py-2 bg-white text-slate-600 font-bold rounded-lg shadow-sm border border-slate-100 text-sm hover:bg-slate-50 text-center">
                        Reponer
                    </Link>
                </div>
            </div>

            {/* Restore Button (Hidden/Subtle) */}
            <div className="flex justify-center pt-8 opacity-50 hover:opacity-100 transition-opacity">
                <button
                    onClick={async () => {
                        if (!window.confirm("¿Estás seguro de que deseas RESTAURAR la base de datos?")) return;
                        try {
                            const response = await fetch('http://localhost:5140/api/Seed/restore', { method: 'POST' });
                            if (response.ok) { window.location.reload(); }
                        } catch (e) { console.error(e); }
                    }}
                    className="flex items-center gap-2 text-xs font-bold text-rose-400 hover:text-rose-600 bg-rose-50 px-4 py-2 rounded-full cursor-pointer"
                >
                    <Settings size={14} />
                    RESETEAR SISTEMA (DEMO)
                </button>
            </div>
        </div>
    );
}
