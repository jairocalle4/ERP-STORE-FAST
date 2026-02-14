import { useEffect, useState } from 'react';
import { X, Calendar, User, Package, ArrowUpRight, ArrowDownLeft, History, FileText } from 'lucide-react';
import { inventoryService } from '../../services/inventory.service';
import type { InventoryMovement } from '../../types/inventory';
import { GlassCard } from '../common/GlassCard';

interface KardexModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: number | null;
    productName: string;
}

export default function KardexModal({ isOpen, onClose, productId, productName }: KardexModalProps) {
    const [movements, setMovements] = useState<InventoryMovement[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && productId) {
            fetchKardex();
        } else {
            setMovements([]);
        }
    }, [isOpen, productId]);

    const fetchKardex = async () => {
        if (!productId) return;
        setLoading(true);
        try {
            const data = await inventoryService.getKardex(productId);
            setMovements(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-4xl max-h-[90vh] flex flex-col">
                <GlassCard className="flex flex-col h-full p-0 overflow-hidden relative">
                    {/* Header */}
                    <div className="p-6 border-b border-indigo-50 flex justify-between items-center bg-white/50 backdrop-blur-md">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <History className="text-indigo-600" />
                                Historial de Movimientos
                            </h2>
                            <p className="text-slate-500 text-sm mt-1">
                                Producto: <span className="font-bold text-indigo-700">{productName}</span>
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                                <p>Cargando historial...</p>
                            </div>
                        ) : movements.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                <Package size={48} className="mb-4 opacity-20" />
                                <p>No hay movimientos registrados para este producto.</p>
                            </div>
                        ) : (
                            <div className="relative overflow-hidden rounded-xl border border-indigo-100 shadow-sm bg-white">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-indigo-50/50 text-indigo-900 font-semibold uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-3">Fecha</th>
                                            <th className="px-4 py-3">Tipo</th>
                                            <th className="px-4 py-3 text-right">Cantidad</th>
                                            <th className="px-4 py-3 text-center">Stock</th>
                                            <th className="px-4 py-3">Referencia</th>
                                            <th className="px-4 py-3">Usuario</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {movements.map((mov) => {
                                            const isPositive = mov.quantity > 0;

                                            // Determine badge color based on type
                                            let badgeClass = "bg-slate-100 text-slate-600";
                                            if (mov.type.includes("Venta")) badgeClass = "bg-rose-50 text-rose-600 border-rose-100";
                                            else if (mov.type.includes("Compra")) badgeClass = "bg-emerald-50 text-emerald-600 border-emerald-100";
                                            else if (mov.type.includes("Ajuste")) badgeClass = "bg-amber-50 text-amber-600 border-amber-100";
                                            else if (mov.type.includes("Anulacion")) badgeClass = "bg-blue-50 text-blue-600 border-blue-100";

                                            return (
                                                <tr key={mov.id} className="hover:bg-indigo-50/30 transition-colors">
                                                    <td className="px-4 py-3 text-slate-600 tabular-nums">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar size={14} className="text-slate-400" />
                                                            {new Date(mov.createdAt).toLocaleString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded-md text-xs font-bold border ${badgeClass} inline-flex items-center gap-1`}>
                                                            {mov.quantity > 0 ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                                                            {mov.type}
                                                        </span>
                                                    </td>
                                                    <td className={`px-4 py-3 text-right font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {isPositive ? '+' : ''}{mov.quantity}
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-slate-700 font-medium">
                                                        <span className="text-slate-400 text-xs mr-1">{mov.stockBefore}</span>
                                                        <span className="text-slate-300">→</span>
                                                        <span className="text-indigo-700 font-bold ml-1 text-base">{mov.stockAfter}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-600 text-xs max-w-[200px] truncate" title={mov.reason}>
                                                        <div className="flex items-center gap-1.5">
                                                            <FileText size={12} className="text-slate-400" />
                                                            {mov.reason}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-500 text-xs">
                                                        <div className="flex items-center gap-1.5 grayscale opacity-70">
                                                            <User size={12} />
                                                            {mov.user?.username || 'Sistema'}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
