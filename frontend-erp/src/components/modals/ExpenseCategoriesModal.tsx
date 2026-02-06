import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Tag } from 'lucide-react';
import { expenseCategoriesService, type ExpenseCategory } from '../../services/expense-categories.service';

interface ExpenseCategoriesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void; // Trigger parent to reload categories
}

export default function ExpenseCategoriesModal({ isOpen, onClose, onUpdate }: ExpenseCategoriesModalProps) {
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryDesc, setNewCategoryDesc] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    const fetchCategories = async () => {
        try {
            const data = await expenseCategoriesService.getAll();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories', error);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        setLoading(true);
        try {
            await expenseCategoriesService.create({
                name: newCategoryName,
                description: newCategoryDesc
            });
            setNewCategoryName('');
            setNewCategoryDesc('');
            await fetchCategories();
            onUpdate();
        } catch (error) {
            console.error('Error creating category', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Eliminar esta categoría?')) return;
        try {
            await expenseCategoriesService.delete(id);
            await fetchCategories();
            onUpdate();
        } catch (error) {
            console.error('Error deleting category', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in flex flex-col max-h-[85vh]">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Tag className="text-indigo-600" size={24} />
                        Gestionar Categorías
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    {/* Add Form */}
                    <form onSubmit={handleAdd} className="mb-8 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                        <h4 className="text-sm font-bold text-indigo-900 mb-3">Nueva Categoría</h4>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Nombre (ej. Transporte)"
                                className="w-full px-4 py-2 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                                value={newCategoryName}
                                onChange={e => setNewCategoryName(e.target.value)}
                                autoFocus
                            />
                            <input
                                type="text"
                                placeholder="Descripción (Opcional)"
                                className="w-full px-4 py-2 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                                value={newCategoryDesc}
                                onChange={e => setNewCategoryDesc(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={loading || !newCategoryName.trim()}
                                className="w-full bg-indigo-600 text-white py-2 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-indigo-600/20"
                            >
                                <Plus size={18} />
                                {loading ? 'Agregando...' : 'Agregar Categoría'}
                            </button>
                        </div>
                    </form>

                    {/* List */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Categorías Existentes ({categories.length})</h4>
                        {categories.map(cat => (
                            <div key={cat.id} className="flex justify-between items-center p-3.5 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all group">
                                <div>
                                    <p className="font-bold text-slate-700">{cat.name}</p>
                                    {cat.description && <p className="text-xs text-slate-400 mt-0.5">{cat.description}</p>}
                                </div>
                                <button
                                    onClick={() => handleDelete(cat.id)}
                                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    title="Eliminar"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        {categories.length === 0 && (
                            <p className="text-center text-slate-400 py-4 italic">No hay categorías registradas.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
