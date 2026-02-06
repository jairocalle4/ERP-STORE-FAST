import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, Search, Layers, LayoutList, X } from 'lucide-react';
import CategoryFormModal from '../components/CategoryFormModal';
import SubcategoryFormModal from '../components/SubcategoryFormModal';
import { GlassCard } from '../components/common/GlassCard';
import { useNotificationStore } from '../store/useNotificationStore';
import ConfirmModal from '../components/modals/ConfirmModal';

interface Subcategory {
    id: number;
    name: string;
    categoryId: number;
    isActive: boolean;
}

interface Category {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    subcategories: Subcategory[];
}

export default function CategoryListPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [subModalOpen, setSubModalOpen] = useState(false);
    const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
    const addNotification = useNotificationStore(s => s.addNotification);

    // Delete Modal State
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Subcategory Delete State
    const [subDeleteId, setSubDeleteId] = useState<number | null>(null);
    const [isSubDeleteModalOpen, setIsSubDeleteModalOpen] = useState(false);
    const [isSubDeleting, setIsSubDeleting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (err) {
            console.error('Error categories', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleRow = (id: number) => {
        setExpandedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await api.delete(`/categories/${deleteId}`);
            setCategories(categories.filter(c => c.id !== deleteId));
            addNotification('Categoría eliminada con éxito');
            setIsDeleteModalOpen(false);
            setDeleteId(null);
        } catch (err: any) {
            console.error(err);
            let errorMessage = 'Error al eliminar categoría.';
            if (err.response && err.response.data) {
                errorMessage = typeof err.response.data === 'string'
                    ? err.response.data
                    : (err.response.data.title || errorMessage);
            }
            addNotification(errorMessage, 'error');
            setIsDeleteModalOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const openEdit = (cat: Category) => {
        setEditingCategory(cat);
        setModalOpen(true);
    };

    const openSubAdd = (catId: number) => {
        setEditingSubcategory(null);
        setActiveCategoryId(catId);
        setSubModalOpen(true);
    };

    const openSubEdit = (sub: Subcategory) => {
        setEditingSubcategory(sub);
        setActiveCategoryId(sub.categoryId);
        setSubModalOpen(true);
    };

    const handleSubDeleteClick = (subId: number) => {
        setSubDeleteId(subId);
        setIsSubDeleteModalOpen(true);
    };

    const confirmSubDelete = async () => {
        if (!subDeleteId) return;
        setIsSubDeleting(true);
        try {
            await api.delete(`/subcategories/${subDeleteId}`);
            addNotification('Subcategoría eliminada');
            setIsSubDeleteModalOpen(false);
            setSubDeleteId(null);
            fetchCategories();
        } catch (err: any) {
            console.error(err);
            let errorMessage = 'Error al eliminar subcategoría.';
            if (err.response?.status === 401) {
                errorMessage = 'Sesión expirada. Por favor, reingresa.';
            } else if (err.response?.data) {
                errorMessage = typeof err.response.data === 'string'
                    ? err.response.data
                    : (err.response.data.title || errorMessage);
            }
            addNotification(errorMessage, 'error');
            setIsSubDeleteModalOpen(false);
        } finally {
            setIsSubDeleting(false);
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="space-y-6 animate-fade-in relative z-0">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">Categorías</h2>
                        <p className="text-slate-500 mt-1">Organiza tu catálogo de forma eficiente</p>
                    </div>
                    <button
                        onClick={() => { setEditingCategory(null); setModalOpen(true); }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 font-medium"
                    >
                        <Plus size={20} />
                        Nueva Categoría
                    </button>
                </div>

                <GlassCard className="p-0 overflow-hidden border-0">
                    <div className="p-6 border-b border-indigo-50/50 bg-white/40">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar categoría..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                                <p className="text-slate-500 font-medium animate-pulse">Cargando catálogo...</p>
                            </div>
                        ) : filteredCategories.length === 0 ? (
                            <div className="text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-indigo-100">
                                <Layers size={48} className="mx-auto text-indigo-200 mb-4" />
                                <p className="text-slate-500 font-medium">No se encontraron categorías.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredCategories.map((c) => (
                                    <div key={c.id} className="category-card group p-8 flex flex-col h-full animate-scale-in">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-4 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl text-white shadow-xl shadow-indigo-200">
                                                <LayoutList size={28} />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openEdit(c)}
                                                    className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 rounded-xl transition-all shadow-sm"
                                                    title="Editar Categoría"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(c.id)}
                                                    className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-rose-600 hover:border-rose-200 rounded-xl transition-all shadow-sm"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{c.name}</h3>
                                                {!c.isActive && (
                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md uppercase">Inactivo</span>
                                                )}
                                            </div>
                                            <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed min-h-[40px]">
                                                {c.description || 'Sin descripción disponible para esta categoría.'}
                                            </p>
                                        </div>

                                        <div className="mt-auto pt-6 border-t border-indigo-50/50">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">
                                                    Subcategorías ({c.subcategories?.length || 0})
                                                </h4>
                                            </div>

                                            <div className="flex flex-wrap gap-2 min-h-[32px]">
                                                {c.subcategories && c.subcategories.length > 0 ? (
                                                    c.subcategories.slice(0, 4).map(s => (
                                                        <div key={s.id} className="group/sub relative">
                                                            <span className="px-3 py-1.5 bg-indigo-50/50 text-indigo-600 rounded-lg text-xs font-bold border border-indigo-100 flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all cursor-default">
                                                                {s.name}
                                                            </span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">No hay subcategorías</span>
                                                )}
                                                {c.subcategories && c.subcategories.length > 4 && (
                                                    <span className="px-2 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold border border-slate-200">
                                                        +{c.subcategories.length - 4}
                                                    </span>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => {
                                                    toggleRow(c.id);
                                                    setActiveCategoryId(c.id);
                                                }}
                                                className="w-full mt-6 py-3 bg-slate-50 text-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm flex items-center justify-center gap-2 border border-indigo-50"
                                            >
                                                <Plus size={14} /> Gestionar Subcategorías
                                            </button>
                                        </div>

                                        {/* Expanded Subcategories overlay/list */}
                                        {expandedRows.includes(c.id) && (
                                            <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-md p-8 animate-fade-in flex flex-col">
                                                <div className="flex justify-between items-center mb-6">
                                                    <h3 className="text-xl font-bold text-slate-800">Subcategorías: {c.name}</h3>
                                                    <button onClick={() => toggleRow(c.id)} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-xl transition-colors">
                                                        <X size={20} />
                                                    </button>
                                                </div>
                                                <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                                                    {c.subcategories?.map(s => (
                                                        <div key={s.id} className="flex items-center justify-between p-3 bg-indigo-50/30 rounded-xl border border-indigo-100 group/subitem">
                                                            <span className="text-sm font-semibold text-slate-700">{s.name}</span>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); openSubEdit(s); }}
                                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
                                                                >
                                                                    <Edit2 size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleSubDeleteClick(s.id); }}
                                                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-all"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <button
                                                        onClick={() => openSubAdd(c.id)}
                                                        className="w-full p-4 border-2 border-dashed border-indigo-200 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-all font-bold text-sm flex items-center justify-center gap-2"
                                                    >
                                                        <Plus size={18} /> Nueva Subcategoría
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </GlassCard>
            </div>

            {/* Modals placed outside the animated div to fix positioning */}
            {modalOpen && (
                <CategoryFormModal
                    category={editingCategory}
                    onClose={() => setModalOpen(false)}
                    onSuccess={() => { setModalOpen(false); fetchCategories(); }}
                />
            )}

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Eliminar Categoría"
                message="¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer si no tiene productos asociados."
                confirmText="Eliminar"
                isLoading={isDeleting}
            />

            {subModalOpen && activeCategoryId && (
                <SubcategoryFormModal
                    subcategory={editingSubcategory}
                    categoryId={activeCategoryId}
                    onClose={() => setSubModalOpen(false)}
                    onSuccess={() => { setSubModalOpen(false); fetchCategories(); }}
                />
            )}

            <ConfirmModal
                isOpen={isSubDeleteModalOpen}
                onClose={() => setIsSubDeleteModalOpen(false)}
                onConfirm={confirmSubDelete}
                title="Eliminar Subcategoría"
                message="¿Estás seguro de que deseas eliminar esta subcategoría?"
                confirmText="Eliminar"
                isLoading={isSubDeleting}
            />
        </>
    );
}
