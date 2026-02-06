import { useEffect, useState } from 'react';
import { Eye, Search, Calendar, User, Printer } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import type { Sale } from '../services/sale.service';
import { saleService } from '../services/sale.service';
import SaleDetailsModal from '../components/modals/SaleDetailsModal';

export default function SalesHistoryPage() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shouldAutoPrint, setShouldAutoPrint] = useState(false);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const data = await saleService.getAll();
            setSales(data);
        } catch (err) {
            console.error('Error fetching sales', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSeeDetails = async (id: number, autoPrint: boolean = false) => {
        try {
            const fullSale = await saleService.getById(id);
            setSelectedSale(fullSale);
            setShouldAutoPrint(autoPrint);
            setIsModalOpen(true);
        } catch (err) {
            console.error('Error fetching sale details', err);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-EC', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredSales = sales.filter(s =>
        s.noteNumber?.includes(searchTerm) ||
        s.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.employee?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Historial de Ventas</h2>
                    <p className="text-slate-500 mt-1">Revisa y administra tus transacciones</p>
                </div>
            </div>

            <GlassCard className="p-0 overflow-hidden border-0">
                <div className="p-6 border-b border-indigo-50/50 bg-white/40">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por # Nota, Cliente o Vendedor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="table-clean w-full border-collapse">
                        <thead>
                            <tr>
                                <th># Nota</th>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>Vendedor</th>
                                <th className="text-right">Total</th>
                                <th className="text-center">Estado</th>
                                <th className="text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-indigo-50/30">
                            {loading ? (
                                <tr><td colSpan={7} className="text-center py-8 text-slate-500">Cargando ventas...</td></tr>
                            ) : filteredSales.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-8 text-slate-500">No se encontraron ventas</td></tr>
                            ) : (
                                filteredSales.map(sale => (
                                    <tr key={sale.id} className="cursor-default transition-colors">
                                        <td className="font-mono text-slate-600">{sale.noteNumber || `N-${sale.id}`}</td>
                                        <td className="text-slate-600 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-slate-400" />
                                                {formatDate(sale.date)}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="font-medium text-slate-700">{sale.client?.name || 'Consumidor Final'}</div>
                                        </td>
                                        <td className="text-slate-600 text-sm">
                                            <div className="flex items-center gap-2">
                                                <User size={14} className="text-slate-400" />
                                                {sale.employee?.name}
                                            </div>
                                        </td>
                                        <td className="text-right font-bold text-slate-800">
                                            ${sale.total.toFixed(2)}
                                        </td>
                                        <td className="text-center">
                                            {sale.isVoid ? (
                                                <span className="inline-flex px-2 py-1 rounded bg-rose-100 text-rose-600 text-xs font-bold uppercase tracking-wider">
                                                    Anulada
                                                </span>
                                            ) : (
                                                <span className="inline-flex px-2 py-1 rounded bg-emerald-100 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                                                    Completada
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleSeeDetails(sale.id)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Ver Detalle"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleSeeDetails(sale.id, true)}
                                                    className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
                                                    title="Imprimir Ticket"
                                                >
                                                    <Printer size={18} />
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

            <SaleDetailsModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setShouldAutoPrint(false);
                }}
                sale={selectedSale}
                autoPrint={shouldAutoPrint}
                onVoid={fetchSales}
            />
        </div>
    );
}
