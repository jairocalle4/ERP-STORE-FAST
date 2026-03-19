import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Save, Loader2, Trash2,
    Search, FileText, ShoppingCart,
    PlusCircle, MinusCircle, Package, X, Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/common/GlassCard';
import { purchaseService, type CreatePurchaseDto } from '../services/purchase.service';
import { supplierService, type Supplier } from '../services/supplier.service';
import { productService, type Product } from '../services/product.service';
import { useNotificationStore } from '../store/useNotificationStore';
import api from '../services/api';

const normalizeStr = (s: string) =>
    s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

interface CartItem {
    productId: number;
    name: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export default function PurchaseFormPage() {
    const navigate = useNavigate();
    const addNotification = useNotificationStore(s => s.addNotification);

    // Form State
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        supplierId: 0,
        date: new Date().toISOString().split('T')[0],
        invoiceNumber: '',
        paymentMethod: 'Efectivo',
        status: 'Paid',
        notes: ''
    });

    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Quick product creation modal
    const [showNewProductModal, setShowNewProductModal] = useState(false);
    const [creatingProduct, setCreatingProduct] = useState(false);
    const [newProductForm, setNewProductForm] = useState({
        name: '',
        categoryId: 0,
        cost: 0,
        price: 0,
        sku: '',
        barcode: ''
    });
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [nextSku, setNextSku] = useState('');
    const [showProductSearch, setShowProductSearch] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [suppliersData, productsData, catRes, skuRes] = await Promise.all([
                supplierService.getAll(1, 1000),
                productService.getAll(true, 1, 1000),
                api.get('/categories', { params: { pageSize: 1000 } }),
                api.get('/products/next-sku')
            ]);
            setSuppliers(suppliersData.items);
            setProducts(productsData.items);
            setCategories(catRes.data.items);
            const autoSku = skuRes.data?.nextSku ?? '';
            setNextSku(autoSku);
            setNewProductForm(f => ({ ...f, sku: autoSku }));
        } catch (err) {
            console.error(err);
            addNotification('Error al cargar datos básicos', 'error');
        }
    };

    const addToCart = (product: Product) => {
        const existing = cart.find(item => item.productId === product.id);
        if (existing) {
            setCart(cart.map(item =>
                item.productId === product.id
                    ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unitPrice }
                    : item
            ));
        } else {
            setCart([...cart, {
                productId: product.id,
                name: product.name,
                sku: product.sku,
                quantity: 1,
                unitPrice: product.cost || 0,
                subtotal: product.cost || 0
            }]);
        }
        setSearchTerm('');
        setShowProductSearch(false);
    };

    const removeFromCart = (productId: number) => {
        setCart(cart.filter(item => item.productId !== productId));
    };

    const updateCartItem = (productId: number, field: 'quantity' | 'unitPrice', value: number) => {
        setCart(cart.map(item => {
            if (item.productId === productId) {
                const updated = { ...item, [field]: value };
                updated.subtotal = updated.quantity * updated.unitPrice;
                return updated;
            }
            return item;
        }));
    };

    const calculateTotal = () => cart.reduce((acc, item) => acc + item.subtotal, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.supplierId === 0) {
            addNotification('Selecciona un proveedor', 'warning');
            return;
        }
        if (cart.length === 0) {
            addNotification('Agrega al menos un producto a la compra', 'warning');
            return;
        }

        setLoading(true);
        try {
            const payload: CreatePurchaseDto = {
                ...formData,
                details: cart.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice
                }))
            };

            await purchaseService.create(payload);
            addNotification('Compra registrada y stock actualizado', 'success');
            navigate('/purchases');
        } catch (err: any) {
            console.error(err);
            addNotification(err.response?.data || 'Error al registrar la compra', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p => {
        const q = normalizeStr(searchTerm);
        return normalizeStr(p.name).includes(q) || normalizeStr(p.sku || '').includes(q);
    });

    const handleCreateQuickProduct = async () => {
        if (!newProductForm.name.trim()) {
            addNotification('El nombre del producto es obligatorio', 'warning');
            return;
        }
        if (!newProductForm.categoryId) {
            addNotification('Selecciona una categoría', 'warning');
            return;
        }
        if (newProductForm.price <= 0) {
            addNotification('El precio de venta debe ser mayor a 0', 'warning');
            return;
        }
        setCreatingProduct(true);
        try {
            const payload = {
                name: newProductForm.name,
                categoryId: newProductForm.categoryId,
                cost: newProductForm.cost,
                price: newProductForm.price,
                sku: newProductForm.sku || nextSku,
                barcode: newProductForm.barcode || null,
                stock: 0,
                minStock: 3,
                isActive: true,
                description: '',
                discountPercentage: 0,
                images: []
            };
            const res = await api.post('/products', payload);
            const created: Product = res.data;
            // Add to products list
            setProducts(prev => [created, ...prev]);
            // Auto-add to purchase cart
            setCart(prev => [...prev, {
                productId: created.id,
                name: created.name,
                sku: created.sku || '',
                quantity: 1,
                unitPrice: created.cost || 0,
                subtotal: created.cost || 0
            }]);
            addNotification(`Producto "${created.name}" creado y agregado a la compra`, 'success');
            setShowNewProductModal(false);
            setSearchTerm('');
            setShowProductSearch(false);
            // Reset form
            const skuRes = await api.get('/products/next-sku');
            const newSku = skuRes.data?.nextSku ?? '';
            setNextSku(newSku);
            setNewProductForm({ name: '', categoryId: 0, cost: 0, price: 0, sku: newSku, barcode: '' });
        } catch (err: any) {
            addNotification(err?.response?.data || 'Error al crear el producto', 'error');
        } finally {
            setCreatingProduct(false);
        }
    };

    return (
        <>
        <div className="space-y-6 animate-fade-in pb-10">
            <div className="flex items-center gap-4">
                <Link to="/purchases" className="p-2 bg-white/50 rounded-xl shadow-sm text-indigo-600 hover:bg-indigo-50 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-3xl font-bold text-indigo-950">Nueva Compra de Inventario</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT: PURCHASE INFO & PRODUCTS */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Invoice Header */}
                    <GlassCard>
                        <h2 className="text-xl font-bold mb-6 text-indigo-900 border-b border-indigo-100 pb-2 flex items-center gap-2">
                            <FileText size={20} className="text-indigo-600" /> Datos de Factura
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="label-premium">Proveedor</label>
                                <select
                                    className="select-premium"
                                    value={formData.supplierId}
                                    onChange={e => setFormData({ ...formData, supplierId: Number(e.target.value) })}
                                    required
                                >
                                    <option value="0">Seleccionar Proveedor</option>
                                    {suppliers.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.taxId})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="label-premium">Nro. Factura / Comprobante</label>
                                <input
                                    type="text"
                                    className="input-premium"
                                    placeholder="Ej: 001-001-00000123"
                                    value={formData.invoiceNumber}
                                    onChange={e => setFormData({ ...formData, invoiceNumber: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="label-premium">Fecha de Compra</label>
                                <input
                                    type="date"
                                    className="input-premium"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="label-premium">Estado de Pago</label>
                                <select
                                    className="select-premium"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Paid">Pagado</option>
                                    <option value="Pending">Pendiente (Cta. por Pagar)</option>
                                    <option value="PartiallyPaid">Abono</option>
                                </select>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Product Selection & Cart */}
                    <GlassCard>
                        <div className="flex items-center justify-between mb-6 border-b border-indigo-100 pb-2">
                            <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                                <ShoppingCart size={20} className="text-indigo-600" /> Productos a Ingresar
                            </h2>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Buscar producto..."
                                    className="w-full pl-9 pr-4 py-2 bg-white/80 border border-indigo-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    value={searchTerm}
                                    onChange={e => {
                                        setSearchTerm(e.target.value);
                                        setShowProductSearch(e.target.value.length > 0);
                                    }}
                                />
                                {showProductSearch && (
                                    <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-xl mt-2 shadow-2xl z-20 max-h-64 overflow-y-auto p-2 space-y-1 animate-scale-in">
                                        {filteredProducts.length === 0 ? (
                                            <div className="p-3 text-center">
                                                <p className="text-sm text-slate-400 font-medium mb-2">No se encontró "{searchTerm}"</p>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowNewProductModal(true);
                                                        setNewProductForm(f => ({ ...f, name: searchTerm }));
                                                    }}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all active:scale-95"
                                                >
                                                    <Plus size={16} />
                                                    Crear nuevo producto
                                                </button>
                                            </div>
                                        ) : (
                                            filteredProducts.map(p => (
                                                <div
                                                    key={p.id}
                                                    className="p-3 hover:bg-indigo-50 rounded-lg cursor-pointer flex items-center justify-between group"
                                                    onClick={() => addToCart(p)}
                                                >
                                                    <div>
                                                        <p className="font-bold text-sm text-slate-800">{p.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-mono">{p.sku}</p>
                                                    </div>
                                                    <PlusCircle size={18} className="text-slate-300 group-hover:text-indigo-600" />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            {cart.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    <Package size={48} className="mx-auto mb-4 opacity-10" />
                                    <p className="font-bold">No has agregado productos aún</p>
                                    <p className="text-xs">Busca productos arriba para empezar a sumar stock</p>
                                </div>
                            ) : (
                                <table className="w-full border-separate border-spacing-y-2">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                                            <th className="px-4">Producto</th>
                                            <th className="px-4 w-32">Cant.</th>
                                            <th className="px-4 w-32">Costo Unit.</th>
                                            <th className="px-4 text-right">Subtotal</th>
                                            <th className="w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.map(item => (
                                            <tr key={item.productId} className="bg-white/40 border border-indigo-50 rounded-2xl">
                                                <td className="py-3 px-4 rounded-l-2xl border-y border-l border-indigo-50">
                                                    <p className="font-bold text-sm text-slate-800">{item.name}</p>
                                                    <p className="text-[10px] font-mono text-slate-400 uppercase">{item.sku}</p>
                                                </td>
                                                <td className="py-3 px-4 border-y border-indigo-50">
                                                    <div className="flex items-center bg-white rounded-lg border border-slate-100 w-fit">
                                                        <button
                                                            type="button"
                                                            onClick={() => updateCartItem(item.productId, 'quantity', Math.max(1, item.quantity - 1))}
                                                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600"
                                                        >
                                                            <MinusCircle size={14} />
                                                        </button>
                                                        <input
                                                            type="number"
                                                            className="w-10 text-center font-bold text-sm outline-none border-none bg-transparent"
                                                            value={item.quantity}
                                                            onChange={e => updateCartItem(item.productId, 'quantity', parseInt(e.target.value) || 0)}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => updateCartItem(item.productId, 'quantity', item.quantity + 1)}
                                                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600"
                                                        >
                                                            <PlusCircle size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 border-y border-indigo-50">
                                                    <div className="flex items-center gap-1 bg-white rounded-lg px-2 border border-slate-100">
                                                        <span className="text-xs text-slate-400">$</span>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            className="w-20 py-2 border-none outline-none text-sm font-bold text-slate-700"
                                                            value={item.unitPrice}
                                                            onChange={e => updateCartItem(item.productId, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 border-y border-indigo-50 text-right">
                                                    <p className="font-black text-indigo-600">${item.subtotal.toFixed(2)}</p>
                                                </td>
                                                <td className="py-3 pr-4 rounded-r-2xl border-y border-r border-indigo-50 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromCart(item.productId)}
                                                        className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </GlassCard>
                </div>

                {/* RIGHT: SUMMARY & ACTIONS */}
                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl shadow-indigo-950/20 relative overflow-hidden text-white transition-all duration-300">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>

                        <div className="relative z-10">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">Resumen de Inversión</h3>
                            <div className="flex justify-between items-end mb-8">
                                <span className="text-5xl font-black tracking-tighter text-white">${calculateTotal().toFixed(2)}</span>
                                <span className="text-xs font-bold text-indigo-300/70 mb-2">{cart.reduce((a, b) => a + b.quantity, 0)} Items</span>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-white/10">
                                <div className="flex justify-between text-xs font-bold text-slate-300">
                                    <span>Subtotal</span>
                                    <span>${calculateTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-slate-300">
                                    <span>Retenciones / Imp.</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="flex justify-between text-xl font-black pt-4 text-white">
                                    <span>TOTAL</span>
                                    <span>${calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <GlassCard>
                        <div className="space-y-6">
                            <div>
                                <label className="label-premium">Médoto de Pago Utilizado</label>
                                <select
                                    className="select-premium"
                                    value={formData.paymentMethod}
                                    onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                                >
                                    <option value="Efectivo">Efectivo (Caja Chica)</option>
                                    <option value="Transferencia">Transferencia Bancaria</option>
                                    <option value="Credito">Crédito Directo</option>
                                </select>
                            </div>

                            <div>
                                <label className="label-premium">Notas Adicionales</label>
                                <textarea
                                    className="input-premium"
                                    rows={3}
                                    placeholder="Observaciones de la compra..."
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || cart.length === 0}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-1 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                                Confirmar Compra
                            </button>
                        </div>
                    </GlassCard>
                </div>
            </form>
        </div>

            {/* Quick Product Creation Modal */}
            {showNewProductModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                <Package size={20} className="text-indigo-600" />
                                Nuevo Producto Rápido
                            </h3>
                            <button type="button" onClick={() => setShowNewProductModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="label-premium">Nombre del Producto *</label>
                                <input
                                    type="text"
                                    className="input-premium"
                                    value={newProductForm.name}
                                    onChange={e => setNewProductForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Ej: Arroz Superior 5kg"
                                />
                            </div>
                            <div>
                                <label className="label-premium">Categoría *</label>
                                <select
                                    className="select-premium"
                                    value={newProductForm.categoryId}
                                    onChange={e => setNewProductForm(f => ({ ...f, categoryId: Number(e.target.value) }))}
                                >
                                    <option value={0}>Seleccionar categoría</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label-premium">Precio de Costo ($)</label>
                                    <input
                                        type="number" step="0.01"
                                        className="input-premium"
                                        value={newProductForm.cost}
                                        onChange={e => setNewProductForm(f => ({ ...f, cost: parseFloat(e.target.value) || 0 }))}
                                    />
                                </div>
                                <div>
                                    <label className="label-premium">Precio de Venta ($) *</label>
                                    <input
                                        type="number" step="0.01"
                                        className="input-premium"
                                        value={newProductForm.price}
                                        onChange={e => setNewProductForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label-premium">SKU (auto-generado)</label>
                                    <input
                                        type="text"
                                        className="input-premium font-mono"
                                        value={newProductForm.sku}
                                        onChange={e => setNewProductForm(f => ({ ...f, sku: e.target.value }))}
                                        placeholder={nextSku}
                                    />
                                </div>
                                <div>
                                    <label className="label-premium">Código de Barras <span className="text-slate-400 font-normal">(opcional)</span></label>
                                    <input
                                        type="text"
                                        className="input-premium font-mono"
                                        value={newProductForm.barcode}
                                        onChange={e => setNewProductForm(f => ({ ...f, barcode: e.target.value }))}
                                        placeholder="Escanea o vacío"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setShowNewProductModal(false)}
                                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleCreateQuickProduct}
                                disabled={creatingProduct}
                                className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {creatingProduct ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                Crear y Agregar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
