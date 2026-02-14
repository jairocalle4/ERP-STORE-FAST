import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Save, Loader2, Trash2,
    Search, FileText, ShoppingCart,
    PlusCircle, MinusCircle, Package
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/common/GlassCard';
import { purchaseService, type CreatePurchaseDto } from '../services/purchase.service';
import { supplierService, type Supplier } from '../services/supplier.service';
import { productService, type Product } from '../services/product.service';
import { useNotificationStore } from '../store/useNotificationStore';

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
    const [showProductSearch, setShowProductSearch] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [suppliersData, productsData] = await Promise.all([
                supplierService.getAll(),
                productService.getAll(false)
            ]);
            setSuppliers(suppliersData);
            setProducts(productsData);
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

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
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
                                    <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-xl mt-2 shadow-2xl z-20 max-h-60 overflow-y-auto p-2 space-y-1 animate-scale-in">
                                        {filteredProducts.map(p => (
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
                                        ))}
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
                    <GlassCard className="bg-indigo-900 !text-white !p-8 shadow-2xl shadow-indigo-900/40 relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>

                        <div className="relative z-10">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-200/60 mb-1">Resumen de Inversión</h3>
                            <div className="flex justify-between items-end mb-8">
                                <span className="text-5xl font-black tracking-tighter">${calculateTotal().toFixed(2)}</span>
                                <span className="text-xs font-bold text-indigo-200/50 mb-2">{cart.reduce((a, b) => a + b.quantity, 0)} Items</span>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-white/10">
                                <div className="flex justify-between text-xs font-bold text-indigo-200/80">
                                    <span>Subtotal</span>
                                    <span>${calculateTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-indigo-200/80">
                                    <span>Retenciones / Imp.</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="flex justify-between text-xl font-black pt-4">
                                    <span>TOTAL</span>
                                    <span>${calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

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
    );
}
