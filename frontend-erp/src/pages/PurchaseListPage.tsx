import { useState, useEffect } from 'react';
import { Plus, Search, Calendar, FileText, Truck, DollarSign, Eye, Trash2 } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { purchaseService, type Purchase } from '../services/purchase.service';
import { useNotificationStore } from '../store/useNotificationStore';
import { Link } from 'react-router-dom';

export default function PurchaseListPage() {
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const addNotification = useNotificationStore(s => s.addNotification);

    useEffect(() => {
        fetchPurchases();
    }, []);

    const fetchPurchases = async () => {
        try {
            const data = await purchaseService.getAll();
            setPurchases(data);
        } catch (err) {
            console.error(err);
            addNotification('Error al cargar compras', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filteredPurchases = purchases.filter(p =>
        p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Paid': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
            case 'Pending': return 'bg-amber-100 text-amber-600 border-amber-200';
            case 'PartiallyPaid': return 'bg-blue-100 text-blue-600 border-blue-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-indigo-950">Compras e Inventario</h1>
                    <p className="text-slate-500 font-medium">Historial de abastecimiento y facturas de proveedores</p>
                </div>
                <Link
                    to="/purchases/new"
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                    <Plus size={20} />
                    Registrar Compra
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="!p-6 flex items-center gap-4 border-l-4 border-l-indigo-500">
                    <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                        <FileText size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Total Compras</p>
                        <p className="text-2xl font-black text-indigo-950">{purchases.length}</p>
                    </div>
                </GlassCard>
                <GlassCard className="!p-6 flex items-center gap-4 border-l-4 border-l-emerald-500">
                    <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Inversión Total</p>
                        <p className="text-2xl font-black text-indigo-950">${purchases.reduce((acc, p) => acc + p.total, 0).toFixed(2)}</p>
                    </div>
                </GlassCard>
                <GlassCard className="!p-6 flex items-center gap-4 border-l-4 border-l-amber-500">
                    <div className="h-12 w-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                        <Truck size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Proveedores</p>
                        <p className="text-2xl font-black text-indigo-950">{Array.from(new Set(purchases.map(p => p.supplierId))).length}</p>
                    </div>
                </GlassCard>
            </div>

            <GlassCard>
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por número de factura o proveedor..."
                        className="w-full pl-12 pr-4 py-3 bg-white/50 border border-indigo-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 outline-none transition-all"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-3">
                        <thead>
                            <tr className="text-slate-400 text-xs font-black uppercase tracking-widest px-4">
                                <th className="pb-2 pl-4">Fecha / Factura</th>
                                <th className="pb-2">Proveedor</th>
                                <th className="pb-2">Total</th>
                                <th className="pb-2">Estado / Pago</th>
                                <th className="pb-2 text-right pr-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="bg-white/40 h-16 rounded-2xl"></td>
                                    </tr>
                                ))
                            ) : filteredPurchases.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-slate-400 font-medium">No se encontraron registros de compras</td>
                                </tr>
                            ) : (
                                filteredPurchases.map(purchase => (
                                    <tr key={purchase.id} className="group bg-white/60 hover:bg-white transition-all shadow-sm">
                                        <td className="py-4 pl-4 rounded-l-2xl border-y border-l border-indigo-50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-50 text-indigo-400 rounded-xl flex items-center justify-center">
                                                    <Calendar size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 leading-none">{new Date(purchase.date).toLocaleDateString()}</p>
                                                    <p className="text-xs text-slate-400 mt-1 font-mono uppercase tracking-widest">#{purchase.invoiceNumber}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 border-y border-indigo-50">
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-slate-700">{purchase.supplier?.name || 'Prov. Desconocido'}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 border-y border-indigo-50">
                                            <p className="text-lg font-black text-indigo-600">${purchase.total.toFixed(2)}</p>
                                        </td>
                                        <td className="py-4 border-y border-indigo-50">
                                            <div className="flex flex-col gap-1">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-block w-fit border ${getStatusStyle(purchase.status)}`}>
                                                    {purchase.status === 'Paid' ? 'Pagado' : purchase.status === 'Pending' ? 'Pendiente' : 'Abono'}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">{purchase.paymentMethod}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 pr-4 rounded-r-2xl border-y border-r border-indigo-50 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Ver Detalle">
                                                    <Eye size={18} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="Eliminar (Reversa Stock)">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
}
