import { useState, useEffect } from 'react';
import { Plus, Search, Phone, MapPin, Mail, Edit, Trash2 } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { supplierService, type Supplier } from '../services/supplier.service';
import { useNotificationStore } from '../store/useNotificationStore';
import { SupplierFormModal } from '../components/modals/SupplierFormModal';
import ConfirmModal from '../components/modals/ConfirmModal';

export default function SupplierListPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [supplierToDelete, setSupplierToDelete] = useState<number | null>(null);

    const addNotification = useNotificationStore(s => s.addNotification);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const data = await supplierService.getAll();
            setSuppliers(data);
        } catch (err) {
            console.error(err);
            addNotification('Error al cargar proveedores', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedSupplier(null);
        setIsFormOpen(true);
    };

    const handleEdit = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setSupplierToDelete(id);
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!supplierToDelete) return;
        try {
            await supplierService.delete(supplierToDelete);
            addNotification('Proveedor eliminado correctamente', 'success');
            fetchSuppliers();
        } catch (err) {
            addNotification('Error al eliminar proveedor', 'error');
        } finally {
            setIsConfirmOpen(false);
        }
    };

    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.taxId && s.taxId.includes(searchTerm))
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-indigo-950 flex items-center gap-2">
                        <span className="bg-indigo-600 w-2 h-8 rounded-full"></span>
                        Proveedores
                    </h1>
                    <p className="text-slate-500 font-medium ml-4">Gestiona las empresas que surten tu inventario</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                    <Plus size={20} />
                    Nuevo Proveedor
                </button>
            </div>

            <GlassCard>
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o RUC..."
                        className="w-full pl-12 pr-4 py-3 bg-white/50 border border-indigo-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 outline-none transition-all font-medium"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-separate border-spacing-y-3">
                        <thead>
                            <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest px-4">
                                <th className="pb-2 pl-4">Proveedor</th>
                                <th className="pb-2">Identificación</th>
                                <th className="pb-2">Contacto</th>
                                <th className="pb-2">Estado</th>
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
                            ) : filteredSuppliers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-20 bg-white/30 rounded-3xl">
                                        <div className="max-w-xs mx-auto space-y-3">
                                            <Search size={48} className="mx-auto text-slate-200" />
                                            <p className="text-slate-400 font-bold">No se encontraron proveedores</p>
                                            <p className="text-xs text-slate-300">Intenta con otro término o crea uno nuevo</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredSuppliers.map(supplier => (
                                    <tr key={supplier.id} className="group bg-white/60 hover:bg-white transition-all shadow-sm">
                                        <td className="py-4 pl-4 rounded-l-2xl border-y border-l border-indigo-50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                                                    {supplier.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-indigo-950 leading-none">{supplier.name}</p>
                                                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-bold">
                                                        <MapPin size={10} /> {supplier.address || 'Sin dirección'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 border-y border-indigo-50">
                                            <span className="bg-slate-100 text-indigo-900/60 px-3 py-1 rounded-lg text-xs font-black font-mono uppercase tracking-wider">
                                                {supplier.taxId || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="py-4 border-y border-indigo-50">
                                            <div className="space-y-1">
                                                {supplier.phone && <p className="text-[11px] font-bold text-slate-700 flex items-center gap-2 tracking-tight"><Phone size={10} className="text-indigo-400" /> {supplier.phone}</p>}
                                                {supplier.email && <p className="text-[11px] text-slate-500 flex items-center gap-2 font-medium"><Mail size={10} className="text-indigo-400" /> {supplier.email}</p>}
                                                {!supplier.phone && !supplier.email && <span className="text-xs text-slate-300 italic">Sin contacto</span>}
                                            </div>
                                        </td>
                                        <td className="py-4 border-y border-indigo-50">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${supplier.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-50' : 'bg-rose-50 text-rose-600 border-rose-100 shadow-sm shadow-rose-50'}`}>
                                                {supplier.isActive ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="py-4 pr-4 rounded-r-2xl border-y border-r border-indigo-50 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => handleEdit(supplier)}
                                                    className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(supplier.id)}
                                                    className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                                                >
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

            <SupplierFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={fetchSuppliers}
                supplier={selectedSupplier}
            />

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Eliminar Proveedor"
                message="¿Estás seguro de eliminar este proveedor? Esta acción no se puede deshacer."
                confirmText="Eliminar"
            />
        </div>
    );
}

