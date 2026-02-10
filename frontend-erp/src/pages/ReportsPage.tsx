import { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, ComposedChart, Line
} from 'recharts';
import {
    FileText, TrendingUp, Package, DollarSign, Calendar,
    ArrowDownRight, CreditCard, Activity
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import {
    reportsService,
    type KpiStats,
    type SalesTrend,
    type TopProduct,
    type InventoryValuation,
    type SaleProfit
} from '../services/reports.service';

const COLORS = ['#4f46e5', '#ec4899', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export default function ReportsPage() {
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
        start: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    const [kpi, setKpi] = useState<KpiStats | null>(null);
    const [trends, setTrends] = useState<SalesTrend[]>([]);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [inventoryValuation, setInventoryValuation] = useState<InventoryValuation[]>([]);
    const [salesProfit, setSalesProfit] = useState<SaleProfit[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'financial' | 'inventory' | 'details'>('financial');

    useEffect(() => {
        fetchData();
    }, [dateRange]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const start = new Date(dateRange.start);
            const end = new Date(dateRange.end);

            const [kpiData, trendData, topData, invData, profitData] = await Promise.all([
                reportsService.getKpiStats(start, end),
                reportsService.getSalesTrend(start, end),
                reportsService.getTopProducts(start, end),
                reportsService.getInventoryValuation(), // Inventory is point-in-time, rarely range based (for now)
                reportsService.getSalesProfit(start, end)
            ]);

            setKpi(kpiData);
            setTrends(trendData);
            setTopProducts(topData);
            setInventoryValuation(invData);
            setSalesProfit(profitData);
        } catch (error) {
            console.error("Error loading reports", error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickFilter = (days: number) => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - days);
        setDateRange({
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-EC', {
            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
        });
    };

    const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Reportes Avanzados</h2>
                    <p className="text-slate-500 mt-1">Análisis financiero y operativo de tu negocio</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-xl">
                        <Calendar size={16} className="text-slate-500" />
                        <span className="text-xs font-bold text-slate-500 uppercase">Rango:</span>
                    </div>
                    <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="bg-transparent text-sm font-medium text-slate-700 outline-none border-b border-transparent focus:border-indigo-500 transition-colors"
                    />
                    <span className="text-slate-300">|</span>
                    <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="bg-transparent text-sm font-medium text-slate-700 outline-none border-b border-transparent focus:border-indigo-500 transition-colors"
                    />
                    <div className="h-6 w-px bg-slate-200 mx-1"></div>
                    <button onClick={() => handleQuickFilter(7)} className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-lg transition-colors">7 Días</button>
                    <button onClick={() => handleQuickFilter(30)} className="text-xs font-bold text-slate-500 hover:bg-slate-50 px-2 py-1 rounded-lg transition-colors">30 Días</button>
                    <button onClick={() => handleQuickFilter(0)} className="text-xs font-bold text-slate-500 hover:bg-slate-50 px-2 py-1 rounded-lg transition-colors">Hoy</button>
                </div>
            </div>

            {/* KPI Cards */}
            {kpi && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Fixed Card Background - Using standard div instead of GlassCard to ensure gradient is visible */}
                    <div className="rounded-2xl p-5 bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 transition-transform hover:-translate-y-1 duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <DollarSign size={20} className="text-white" />
                            </div>
                            <span className="bg-white/20 text-xs font-bold px-2 py-1 rounded-lg backdrop-blur-sm">+100%</span>
                        </div>
                        <p className="text-indigo-100 text-sm font-medium mb-1">Ingresos Totales</p>
                        <h3 className="text-3xl font-black">{formatCurrency(kpi.totalRevenue)}</h3>
                    </div>

                    <GlassCard className="p-5 border-0">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-emerald-100 rounded-xl">
                                <TrendingUp size={20} className="text-emerald-600" />
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm font-bold mb-1">Ganancia Bruta</p>
                        <h3 className="text-3xl font-black text-slate-800">{formatCurrency(kpi.grossProfit)}</h3>
                        <p className="text-xs text-slate-400 mt-1">Ventas - Costo Mercancía</p>
                    </GlassCard>

                    <GlassCard className="p-5 border-0">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-rose-100 rounded-xl">
                                <ArrowDownRight size={20} className="text-rose-600" />
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm font-bold mb-1">Gastos Operativos</p>
                        <h3 className="text-3xl font-black text-rose-600">-{formatCurrency(kpi.totalExpenses)}</h3>
                        <p className="text-xs text-slate-400 mt-1">Servicios, Alquiler, etc.</p>
                    </GlassCard>

                    <GlassCard className="p-5 border-0 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
                            <Activity size={100} />
                        </div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="p-2 bg-slate-900 rounded-xl">
                                <Activity size={20} className="text-white" />
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm font-bold mb-1 relative z-10">Utilidad Neta</p>
                        <h3 className={`text-3xl font-black relative z-10 ${kpi.netProfit >= 0 ? 'text-slate-800' : 'text-rose-600'}`}>
                            {formatCurrency(kpi.netProfit)}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 relative z-10">Margen Real: {((kpi.netProfit / (kpi.totalRevenue || 1)) * 100).toFixed(1)}%</p>
                    </GlassCard>
                </div>
            )}

            {/* Main Tabs */}
            <div className="flex gap-4 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('financial')}
                    className={`pb-3 px-2 text-sm font-bold transition-all relative ${activeTab === 'financial' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Análisis Financiero
                    {activeTab === 'financial' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('inventory')}
                    className={`pb-3 px-2 text-sm font-bold transition-all relative ${activeTab === 'inventory' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Inventario y Productos
                    {activeTab === 'inventory' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-3 px-2 text-sm font-bold transition-all relative ${activeTab === 'details' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Detalle de Transacciones
                    {activeTab === 'details' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>}
                </button>
            </div>

            {/* Content per Tab */}
            {activeTab === 'financial' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                    <GlassCard className="p-6 border-0 lg:col-span-2 h-[450px] flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <TrendingUp size={20} className="text-indigo-600" />
                                    Flujo de Caja: Ingresos vs Egresos
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">Comparativa de dinero entrando vs saliendo de la caja.</p>
                            </div>
                            <div className="text-xs bg-slate-100 px-3 py-1 rounded-lg text-slate-500 font-medium">
                                Flujo Neto = Ingresos - Gastos
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={trends} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    formatter={(value: any, name: any) => [formatCurrency(Number(value)), name]}
                                    labelStyle={{ color: '#64748b', marginBottom: '0.5rem' }}
                                />
                                <Legend verticalAlign="top" height={36} iconType="circle" />
                                {/* Changed Area to Bar for Revenue for better visibility and comparison */}
                                <Bar dataKey="revenue" name="Ingresos" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="expenses" name="Gastos" fill="#fb7185" radius={[4, 4, 0, 0]} barSize={20} />
                                <Line type="monotone" dataKey="netProfit" name="Flujo Neto" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </GlassCard>

                    <GlassCard className="p-6 border-0 h-[450px] flex flex-col">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <CreditCard size={20} className="text-indigo-600" />
                            Métodos de Pago
                        </h3>
                        {/* Mock data visualization since we don't have aggregated payment methods yet but added to DTO */}
                        <div className="flex-1 flex items-center justify-center flex-col text-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <CreditCard size={48} className="text-slate-300 mb-4" />
                            <p className="text-slate-500 font-medium">Esta gráfica estará disponible cuando se registren suficientes ventas con diferentes métodos de pago.</p>
                        </div>
                    </GlassCard>
                </div>
            )}

            {activeTab === 'inventory' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                    <GlassCard className="p-6 border-0 h-[400px] flex flex-col relative">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Package size={20} className="text-indigo-600" />
                                Valoración de Inventario
                            </h3>
                        </div>

                        {/* Total Value Display */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</p>
                            <p className="text-2xl font-black text-slate-700">
                                {formatCurrency(inventoryValuation.reduce((acc, curr) => acc + curr.totalValue, 0))}
                            </p>
                        </div>

                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={inventoryValuation}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80} // Increased inner radius for more space
                                    outerRadius={110}
                                    paddingAngle={2}
                                    dataKey="totalValue"
                                    nameKey="categoryName"
                                >
                                    {inventoryValuation.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: '11px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </GlassCard>

                    <GlassCard className="p-6 border-0 h-[400px] flex flex-col">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <TrendingUp size={20} className="text-indigo-600" />
                            Top 5 Productos Más Vendidos
                        </h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="productName" type="category" width={120} tick={{ fontSize: 11 }} />
                                <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                                <Bar dataKey="totalRevenue" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} name="Ingresos Generados" />
                            </BarChart>
                        </ResponsiveContainer>
                    </GlassCard>
                </div>
            )}

            {activeTab === 'details' && (
                <GlassCard className="p-6 border-0 animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Detalle de Operaciones</h3>
                        <button className="flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-2 rounded-lg font-bold hover:bg-rose-100 transition-colors border border-rose-100">
                            <FileText size={18} />
                            Exportar PDF
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table-clean w-full">
                            <thead>
                                <tr>
                                    <th>N° Nota</th>
                                    <th>Fecha</th>
                                    <th>Vendedor</th>
                                    <th>Producto</th>
                                    <th className="text-center">Cant.</th>
                                    <th className="text-right">Total Venta</th>
                                    <th className="text-right text-rose-500">Costo</th>
                                    <th className="text-right text-emerald-600 bg-emerald-50/50">Ganancia Bruta</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salesProfit.map((item) => (
                                    <tr key={`${item.saleId}-${item.productNames}`} className="hover:bg-slate-50/50">
                                        <td className="font-bold text-indigo-600 text-xs">{item.noteNumber}</td>
                                        <td className="text-xs text-slate-500">{formatDate(item.date)}</td>
                                        <td>
                                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">
                                                {item.employeeName}
                                            </span>
                                        </td>
                                        <td className="font-medium text-slate-700 text-sm max-w-[200px] truncate" title={item.productNames}>
                                            {item.productNames}
                                        </td>
                                        <td className="text-center font-bold text-slate-600">{item.totalQuantity}</td>
                                        <td className="text-right font-bold text-slate-800">{formatCurrency(item.totalRevenue)}</td>
                                        <td className="text-right text-rose-400 text-xs">{formatCurrency(item.totalCost)}</td>
                                        <td className="text-right font-black text-emerald-600 bg-emerald-50/30">
                                            +{formatCurrency(item.grossProfit)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>
            )}
        </div>
    );
}
