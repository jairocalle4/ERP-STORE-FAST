import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Search, Filter, Package, Eye, RefreshCw, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/common/GlassCard';
import { productService, type Product } from '../services/product.service';
import ConfirmModal from '../components/modals/ConfirmModal';
import { useNotificationStore } from '../store/useNotificationStore';

interface Category {
    id: number;
    name: string;
}

interface Subcategory {
    id: number;
    name: string;
    categoryId: number;
}

export default function ProductListPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const addNotification = useNotificationStore(s => s.addNotification);

    // Filters State
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryId, setCategoryId] = useState<number>(0);
    const [subcategoryId, setSubcategoryId] = useState<number>(0);
    const [stockFilter, setStockFilter] = useState<string>('all'); // all, low, out, available
    const [statusFilter, setStatusFilter] = useState<string>('all'); // all, active, inactive
    const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'price' | 'stock', direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });

    // Data for dropdowns
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

    // Delete Modal State
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (categoryId > 0) {
            fetchSubcategories(categoryId);
            setSubcategoryId(0);
        } else {
            setSubcategories([]);
        }
    }, [categoryId]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await productService.getAll(true); // Include inactive
            setProducts(data);
        } catch (err) {
            console.error('Error fetching products', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:5140/api/v1/categories');
            setCategories(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchSubcategories = async (catId: number) => {
        try {
            const res = await axios.get(`http://localhost:5140/api/v1/subcategories?categoryId=${catId}`);
            setSubcategories(res.data);
        } catch (err) { console.error(err); }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await productService.delete(deleteId);
            setProducts(products.filter(p => p.id !== deleteId));
            addNotification('Producto eliminado correctamente');
            setIsDeleteModalOpen(false);
            setDeleteId(null);
        } catch (err: any) {
            console.error(err);
            setIsDeleteModalOpen(false); // Close modal to show message
            let errorMessage = 'Error al eliminar producto.';
            if (err.response && err.response.data) {
                if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                } else if (err.response.data.title) {
                    errorMessage = err.response.data.title;
                }
            } else {
                errorMessage = 'Error de conexión con el servidor.';
            }
            addNotification(errorMessage, 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    // Filter & Sort Logic
    const sortedProducts = [...products]
        .filter(p => {
            const normalize = (str: string) =>
                str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

            const normalizedName = normalize(p.name);
            const normalizedSearch = normalize(searchTerm);

            const matchName = normalizedName.includes(normalizedSearch);
            const matchCategory = categoryId === 0 || p.categoryId === categoryId;
            const matchSubcategory = subcategoryId === 0 || p.subcategoryId === subcategoryId;

            // Status Filter
            let matchStatus = true;
            if (statusFilter === 'active') matchStatus = p.isActive;
            if (statusFilter === 'inactive') matchStatus = !p.isActive;

            // Stock Filter
            let matchStock = true;
            if (stockFilter === 'low') matchStock = p.stock > 0 && p.stock <= 5;
            if (stockFilter === 'out') matchStock = p.stock === 0;
            if (stockFilter === 'available') matchStock = p.stock > 0;

            return matchName && matchCategory && matchSubcategory && matchStatus && matchStock;
        })
        .sort((a, b) => {
            const { key, direction } = sortConfig;
            let comparison = 0;

            if (key === 'name') {
                comparison = a.name.localeCompare(b.name);
            } else if (key === 'price') {
                comparison = a.price - b.price;
            } else if (key === 'stock') {
                comparison = a.stock - b.stock;
            }

            return direction === 'asc' ? comparison : -comparison;
        });

    const toggleSort = (key: 'name' | 'price' | 'stock') => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const clearFilters = () => {
        setSearchTerm('');
        setCategoryId(0);
        setSubcategoryId(0);
        setStockFilter('all');
        setStatusFilter('all');
        setSortConfig({ key: 'name', direction: 'asc' });
    };

    return (
        <>
            <div className="space-y-6 animate-fade-in relative z-0">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">Productos</h2>
                        <p className="text-slate-500 mt-1">Gestiona el inventario de tu tienda</p>
                    </div>
                    <Link
                        to="/products/new"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 font-medium"
                    >
                        <Plus size={20} />
                        Nuevo Producto
                    </Link>
                </div>

                {/* Filter Section */}
                <GlassCard className="p-6">
                    <div className="flex items-center gap-2 mb-4 text-indigo-900 font-bold border-b border-indigo-50 pb-2">
                        <Filter size={20} className="text-indigo-600" />
                        Buscar y Filtrar
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                        <div className="lg:col-span-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre</label>
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoría</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(Number(e.target.value))}
                                className="w-full px-4 py-2 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm text-slate-700"
                            >
                                <option value={0}>Todas</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subcategoría</label>
                            <select
                                value={subcategoryId}
                                onChange={(e) => setSubcategoryId(Number(e.target.value))}
                                className="w-full px-4 py-2 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm text-slate-700 disabled:opacity-50"
                                disabled={categoryId === 0}
                            >
                                <option value={0}>Todas</option>
                                {subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Estado</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm text-slate-700"
                            >
                                <option value="all">Todos</option>
                                <option value="active">Activos</option>
                                <option value="inactive">Inactivos</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Filtro de Stock</label>
                            <select
                                value={stockFilter}
                                onChange={(e) => setStockFilter(e.target.value)}
                                className="w-full px-4 py-2 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm text-slate-700"
                            >
                                <option value="all">Todos</option>
                                <option value="available">Disponible (&gt; 0)</option>
                                <option value="low">Bajo Stock (1-5)</option>
                                <option value="out">Agotado (0)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ordenar Por</label>
                            <select
                                value={`${sortConfig.key}-${sortConfig.direction}`}
                                onChange={(e) => {
                                    const [key, direction] = e.target.value.split('-') as [any, any];
                                    setSortConfig({ key, direction });
                                }}
                                className="w-full px-4 py-2 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm text-slate-700"
                            >
                                <option value="name-asc">Nombre (A-Z)</option>
                                <option value="name-desc">Nombre (Z-A)</option>
                                <option value="price-asc">Precio (Menor a Mayor)</option>
                                <option value="price-desc">Precio (Mayor a Menor)</option>
                                <option value="stock-asc">Stock (Menor a Mayor)</option>
                                <option value="stock-desc">Stock (Mayor a Menor)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={fetchProducts}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2"
                        >
                            <Search size={16} /> Buscar
                        </button>
                        <button
                            onClick={clearFilters}
                            className="bg-white text-slate-600 border border-slate-200 px-6 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
                        >
                            <RefreshCw size={16} /> Limpiar
                        </button>
                    </div>
                </GlassCard>

                <GlassCard className="p-0 overflow-hidden border-0">
                    <div className="overflow-x-auto">
                        <table className="table-clean w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="cursor-pointer group" onClick={() => toggleSort('name')}>
                                        <div className="flex items-center gap-2">
                                            Producto
                                            <ArrowUpDown size={12} className={`transition-opacity ${sortConfig.key === 'name' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                                        </div>
                                    </th>
                                    <th>Categoría</th>
                                    <th className="cursor-pointer group" onClick={() => toggleSort('price')}>
                                        <div className="flex items-center gap-2">
                                            Precio
                                            <ArrowUpDown size={12} className={`transition-opacity ${sortConfig.key === 'price' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                                        </div>
                                    </th>
                                    <th className="cursor-pointer group" onClick={() => toggleSort('stock')}>
                                        <div className="flex items-center gap-2">
                                            Stock
                                            <ArrowUpDown size={12} className={`transition-opacity ${sortConfig.key === 'stock' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                                        </div>
                                    </th>
                                    <th>Estado</th>
                                    <th className="text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-indigo-50/50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-slate-500">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                                                <p>Cargando productos...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : sortedProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-slate-500">
                                            No se encontraron productos con los filtros seleccionados.
                                        </td>
                                    </tr>
                                ) : (
                                    sortedProducts.map((p) => (
                                        <tr key={p.id} className="transition-colors duration-200 group hover:bg-slate-50/50">
                                            <td className="font-semibold text-slate-700 flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-xl bg-white border border-indigo-100 p-1 flex-shrink-0 shadow-sm">
                                                    {p.images && p.images.length > 0 ? (
                                                        <img src={p.images.find(i => i.isCover)?.url || p.images[0].url} alt="" className="w-full h-full object-contain rounded-lg" />
                                                    ) : (
                                                        <div className="text-indigo-200 flex items-center justify-center h-full"><Package size={24} /></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="block text-slate-800 font-bold">{p.name}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex flex-col items-start gap-1">
                                                    <span className="text-sm font-bold text-slate-700">
                                                        {p.category?.name || 'N/A'}
                                                    </span>
                                                    {p.subcategory && (
                                                        <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md text-[10px] font-bold border border-indigo-100 uppercase tracking-wide">
                                                            {p.subcategory.name}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="font-bold text-slate-800 text-lg">${p.price.toFixed(2)}</td>
                                            <td>
                                                <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${p.stock > 5
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    : p.stock > 0
                                                        ? 'bg-amber-50 text-amber-600 border-amber-100'
                                                        : 'bg-rose-50 text-rose-600 border-rose-100'
                                                    }`}>
                                                    {p.stock}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.isActive
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                    {p.isActive ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        to={`/products/${p.id}/details`}
                                                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                        title="Ver Detalle"
                                                    >
                                                        <Eye size={16} />
                                                    </Link>
                                                    <Link to={`/products/edit/${p.id}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                        <Edit2 size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteClick(p.id)}
                                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
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

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Eliminar Producto"
                message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
                confirmText="Sí, Eliminar"
                isLoading={isDeleting}
            />
        </>
    );
}
