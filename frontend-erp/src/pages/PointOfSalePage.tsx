import { useState, useEffect } from 'react';
import {
    Search, ShoppingCart, Plus, Minus, Trash2,
    User, Check, Package, Tag,
    ChevronRight, CreditCard, X, LayoutGrid, Eye
} from 'lucide-react';
import { productService, type Product } from '../services/product.service';
import { clientService, type Client, type ClientCreateDto } from '../services/client.service';
import { saleService, type CreateSaleDto, type Sale } from '../services/sale.service';
import { useNotificationStore } from '../store/useNotificationStore';
import ClientFormModal from '../components/modals/ClientFormModal';
import SaleDetailsModal from '../components/modals/SaleDetailsModal';
import api from '../services/api';
import ConfirmModal from '../components/modals/ConfirmModal';

interface CartItem {
    product: Product;
    quantity: number;
    price: number; // Editable price
}

interface Category {
    id: number;
    name: string;
}

export default function PointOfSalePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const addNotification = useNotificationStore(s => s.addNotification);

    // Cart & Sale State
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [clientSearch, setClientSearch] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [completedSale, setCompletedSale] = useState<Sale | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Transferencia'>('Efectivo');
    const [isClosedSessionModalOpen, setIsClosedSessionModalOpen] = useState(false);

    // Pagination / Infinite Scroll
    const [visibleLimit, setVisibleLimit] = useState(24);

    useEffect(() => {
        // Reset limit when searching or changing category
        setVisibleLimit(24);
    }, [searchTerm, selectedCategory]);

    const fetchData = async () => {
        try {
            const [productsData, clientsData, categoriesRes] = await Promise.all([
                productService.getAll(false),
                clientService.getAll(),
                api.get('/categories')
            ]);
            setProducts(productsData);
            setClients(clientsData);
            setCategories(categoriesRes.data);
        } catch (err) {
            console.error('Error fetching POS data', err);
            addNotification('Error al cargar datos del punto de venta', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Intersection Observer for Infinite Scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleLimit(prev => prev + 24);
                }
            },
            { threshold: 0.1 }
        );

        const target = document.querySelector('#pos-scroll-end');
        if (target) observer.observe(target);

        return () => observer.disconnect();
    }, [products, searchTerm, selectedCategory]);

    const addToCart = (product: Product) => {
        if (product.stock <= 0) {
            addNotification('Producto sin stock disponible', 'error');
            return;
        }

        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) {
                    addNotification('Máximo stock alcanzado', 'warning');
                    return prev;
                }
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1, price: product.price }];
        });
    };

    const removeFromCart = (productId: number) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.product.id === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                if (delta > 0 && newQty > item.product.stock) {
                    addNotification('Stock insuficiente', 'warning');
                    return item;
                }
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const updatePrice = (productId: number, newPrice: number) => {
        setCart(prev => prev.map(item =>
            item.product.id === productId ? { ...item, price: newPrice } : item
        ));
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        if (!selectedClient) {
            addNotification('Por favor selecciona un cliente', 'warning');
            return;
        }

        setIsProcessing(true);
        try {
            const saleData: CreateSaleDto = {
                employeeId: 1, // To be replaced by auth context
                clientId: selectedClient.id,
                observation: 'Venta realizada desde el POS Profesional',
                paymentMethod: paymentMethod,
                details: cart.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    unitPrice: item.price
                }))
            };

            const newSale = await saleService.create(saleData);

            setCompletedSale(newSale);
            setShowSuccess(true);
            setCart([]);
            setSelectedClient(null);
            // We don't auto-hide anymore so user can print

            // Refresh products to update stock
            const updatedProducts = await productService.getAll(false);
            setProducts(updatedProducts);
        } catch (err: any) {
            console.error('Checkout error', err);

            if (err.response?.status === 400 && err.response?.data?.includes('NO_OPEN_SESSION')) {
                setIsClosedSessionModalOpen(true);
            } else {
                addNotification(err.response?.data || 'Error al procesar la venta', 'error');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSaveClient = async (data: ClientCreateDto) => {
        try {
            const newClient = await clientService.create(data);
            setClients(prev => [...prev, newClient]);
            setSelectedClient(newClient);
            addNotification('Cliente creado y seleccionado', 'success');
        } catch (err) {
            console.error('Error creating client from POS', err);
            throw err;
        }
    };

    const normalizeString = (str: string) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const filteredProducts = products.filter(p => {
        const searchLower = normalizeString(searchTerm);
        const matchesSearch = normalizeString(p.name).includes(searchLower) ||
            normalizeString(p.sku).includes(searchLower);
        const matchesCategory = selectedCategory ? p.categoryId === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
        (c.cedulaRuc && c.cedulaRuc.includes(clientSearch))
    );

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col gap-6 animate-fade-in relative">

            <div className="h-[calc(100vh-40px)] grid grid-cols-12 gap-6 overflow-hidden p-4">

                {/* LEFT COLUMN: HEADER + CATEGORIES + PRODUCTS */}
                <div className="col-span-12 lg:col-span-7 xl:col-span-8 2xl:col-span-9 flex flex-col gap-6 h-full min-h-0">

                    {/* Header Section (Moved inside left column) */}
                    <div className="flex justify-between items-center bg-white/40 backdrop-blur-md p-4 rounded-3xl border border-white/60 shadow-sm shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                                <ShoppingCart size={24} />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Caja Registradora</h1>
                                <p className="text-slate-500 text-sm font-medium">Nueva transacción de venta</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 flex-1 justify-end ml-4">
                            <div className="relative group w-full max-w-[350px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600" size={18} />
                                <input
                                    type="text"
                                    className="w-full pl-11 pr-4 py-3 bg-white/80 border border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 outline-none text-slate-700 font-medium transition-all"
                                    placeholder="Buscar producto por nombre o SKU..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* CATEGORIES ROW */}
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar shrink-0">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-6 py-3 rounded-2xl border transition-all flex items-center gap-2 whitespace-nowrap group font-bold text-sm tracking-tight ${selectedCategory === null
                                ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20'
                                : 'bg-white/60 border-white/60 text-slate-600 hover:bg-white hover:border-slate-200'
                                }`}
                        >
                            <LayoutGrid size={16} className={selectedCategory === null ? 'text-indigo-400' : 'text-slate-400'} />
                            Todas
                        </button>

                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-6 py-3 rounded-2xl border transition-all flex items-center gap-2 whitespace-nowrap group font-bold text-sm tracking-tight ${selectedCategory === cat.id
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-600/20'
                                    : 'bg-white/60 border-white/60 text-slate-600 hover:bg-white hover:border-slate-200'
                                    }`}
                            >
                                <Tag size={16} className={selectedCategory === cat.id ? 'text-indigo-200' : 'text-slate-400 group-hover:text-indigo-500'} />
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* PRODUCTS GRID (RESPONSIVE) */}
                    <div className="grow overflow-y-auto pr-2 custom-scrollbar">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 pb-4">
                            {loading ? (
                                Array(6).fill(0).map((_, i) => (
                                    <div key={i} className="bg-white/40 h-48 rounded-3xl animate-pulse"></div>
                                ))
                            ) : filteredProducts.length === 0 ? (
                                <div className="col-span-full h-64 flex flex-col items-center justify-center text-slate-400">
                                    <Package size={48} className="mb-4 opacity-20" />
                                    <p className="font-bold">No se encontraron productos</p>
                                </div>
                            ) : (
                                <>
                                    {filteredProducts.slice(0, visibleLimit).map(product => {
                                        const inCart = cart.find(item => item.product.id === product.id);
                                        return (
                                            <div
                                                key={product.id}
                                                onClick={() => addToCart(product)}
                                                className={`group relative bg-white/60 border-2 rounded-3xl p-4 transition-all hover:-translate-y-1 cursor-pointer overflow-hidden ${product.stock <= 0
                                                    ? 'opacity-60 grayscale border-slate-100 cursor-not-allowed'
                                                    : inCart
                                                        ? 'border-indigo-500 bg-white ring-4 ring-indigo-500/5'
                                                        : 'border-white/60 hover:border-indigo-200 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/5'
                                                    }`}
                                            >
                                                {inCart && (
                                                    <div className="absolute top-2 right-2 h-7 w-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-black shadow-lg shadow-indigo-600/20 z-10 animate-scale-in">
                                                        {inCart.quantity}
                                                    </div>
                                                )}

                                                <div className="aspect-square rounded-2xl bg-slate-50 mb-3 overflow-hidden flex items-center justify-center border border-slate-100 relative group-hover:bg-white transition-colors">
                                                    {product.images?.[0] ? (
                                                        <img src={product.images[0].url} alt={product.name} className="w-full h-full object-contain p-2 mix-blend-multiply transition-transform duration-500 group-hover:scale-110" />
                                                    ) : (
                                                        <Package className="text-slate-200" size={32} />
                                                    )}

                                                    {product.stock <= 5 && product.stock > 0 && (
                                                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-black rounded-lg uppercase tracking-wider">
                                                            Stock Bajo
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-1">
                                                    <h3 className="font-bold text-slate-800 text-sm leading-tight h-10 line-clamp-2 transition-colors group-hover:text-indigo-600">{product.name}</h3>
                                                    <div className="flex justify-between items-end gap-2">
                                                        <div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Package size={12} className={product.stock <= 5 ? 'text-rose-500' : 'text-emerald-500'} />
                                                                <p className={`text-[11px] font-black uppercase tracking-tight ${product.stock <= 5 ? 'text-rose-500' : 'text-emerald-600'
                                                                    }`}>
                                                                    {product.stock} {product.stock === 1 ? 'Disponible' : 'Disponibles'}
                                                                </p>
                                                            </div>
                                                            <p className="text-lg font-black text-slate-900">${product.price.toFixed(2)}</p>
                                                        </div>
                                                        <div className={`p-2 rounded-xl transition-all ${inCart ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                                                            <Plus size={16} strokeWidth={3} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {/* Sentinel for Infinite Scroll */}
                                    <div id="pos-scroll-end" className="col-span-full h-10 flex items-center justify-center">
                                        {visibleLimit < filteredProducts.length && (
                                            <div className="flex gap-2 items-center text-slate-400 text-xs font-bold animate-pulse">
                                                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                                Cargando más productos...
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: CART & CHECKOUT (FULL HEIGHT) */}
                <div className="col-span-12 lg:col-span-5 xl:col-span-4 2xl:col-span-3 flex flex-col h-full min-h-0">
                    <div className="h-full flex flex-col bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-2xl shadow-indigo-500/5 overflow-hidden min-h-0">

                        {/* Consumidor Final Toggle */}
                        <div className="p-6 border-b border-indigo-100/30">
                            <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-indigo-50 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${selectedClient?.cedulaRuc === '9999999999' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-100 text-slate-400'}`}>
                                        <User size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-base font-black text-slate-800 leading-none">Consumidor Final</p>
                                        <p className="text-xs text-slate-400 font-bold uppercase mt-1.5 tracking-wider">9999999999</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={selectedClient?.cedulaRuc === '9999999999'}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                const cf = clients.find(c => c.cedulaRuc === '9999999999');
                                                if (cf) setSelectedClient(cf);
                                            } else {
                                                setSelectedClient(null);
                                            }
                                        }}
                                    />
                                    <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>

                            {selectedClient && selectedClient.cedulaRuc !== '9999999999' && (
                                <div className="mt-4 flex items-center gap-4 bg-white p-4 rounded-2xl border border-indigo-50 shadow-sm animate-scale-in">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <User size={18} />
                                    </div>
                                    <div className="grow min-w-0">
                                        <p className="text-sm font-black text-slate-800 truncate">{selectedClient.name}</p>
                                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5">{selectedClient.cedulaRuc}</p>
                                    </div>
                                    <button onClick={() => setSelectedClient(null)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                                        <X size={18} />
                                    </button>
                                </div>
                            )}

                            {!selectedClient && (
                                <div className="mt-4 flex gap-3">
                                    <div className="relative grow">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="text"
                                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="Buscar otro cliente..."
                                            value={clientSearch}
                                            onChange={e => setClientSearch(e.target.value)}
                                        />
                                        {clientSearch && (
                                            <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-2xl mt-2 shadow-2xl z-30 max-h-48 overflow-y-auto p-2 space-y-1">
                                                {filteredClients.map(client => (
                                                    <div
                                                        key={client.id}
                                                        className="p-3 hover:bg-indigo-50 rounded-xl cursor-pointer transition-colors group"
                                                        onClick={() => { setSelectedClient(client); setClientSearch(''); }}
                                                    >
                                                        <div className="font-bold text-slate-800 text-sm group-hover:text-indigo-600">{client.name}</div>
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{client.cedulaRuc}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setIsClientModalOpen(true)}
                                        className="p-3 bg-white border border-slate-100 rounded-2xl text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm flex items-center justify-center shrink-0"
                                        title="Registrar nuevo cliente"
                                    >
                                        <Plus size={20} strokeWidth={3} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Cart Items List */}
                        <div className="grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                        <ShoppingCart size={32} className="text-slate-200" />
                                    </div>
                                    <p className="font-black text-slate-400 uppercase tracking-widest text-xs">El carrito está vacío</p>
                                    <p className="text-sm text-slate-400 mt-2 font-medium">Agregue productos para comenzar la venta</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.product.id} className="flex gap-4 p-3 bg-white/50 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-100 hover:shadow-sm">
                                        <div className="h-12 w-12 bg-white rounded-xl p-1 shrink-0 border border-slate-100 flex items-center justify-center">
                                            {item.product.images?.[0] ? (
                                                <img src={item.product.images[0].url} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                            ) : <Package className="text-slate-200" size={16} />}
                                        </div>

                                        <div className="grow min-w-0 flex flex-col justify-center gap-1">
                                            <h4 className="font-bold text-slate-700 text-sm truncate leading-tight">{item.product.name}</h4>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1 bg-slate-50 rounded-lg px-2 py-0.5 border border-slate-100 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                                                    <span className="text-xs text-slate-400">$</span>
                                                    <input
                                                        type="number"
                                                        value={item.price}
                                                        onChange={(e) => updatePrice(item.product.id, parseFloat(e.target.value) || 0)}
                                                        className="w-14 bg-transparent text-xs font-bold text-slate-700 outline-none"
                                                    />
                                                </div>
                                                <span className="text-xs text-slate-300">x</span>
                                                <div className="flex items-center bg-white rounded-lg border border-slate-100">
                                                    <button onClick={() => updateQuantity(item.product.id, -1)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"><Minus size={12} /></button>
                                                    <span className="text-xs font-bold w-4 text-center text-slate-700">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.product.id, 1)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"><Plus size={12} /></button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end justify-between">
                                            <button onClick={() => removeFromCart(item.product.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-1"><Trash2 size={14} /></button>
                                            <span className="font-bold text-slate-800 text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Payment Method Selection - Compact */}
                        <div className="px-5 py-3 border-t border-indigo-50/50 bg-slate-50/30">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Método de Pago</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setPaymentMethod('Efectivo')}
                                    className={`py-2 px-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-bold text-sm ${paymentMethod === 'Efectivo'
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                        : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200'
                                        }`}
                                >
                                    <div className={`p-1 rounded-lg ${paymentMethod === 'Efectivo' ? 'bg-white/20' : 'bg-slate-100'}`}>
                                        <CreditCard size={14} />
                                    </div>
                                    Efectivo
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('Transferencia')}
                                    className={`py-2 px-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-bold text-sm ${paymentMethod === 'Transferencia'
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                        : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200'
                                        }`}
                                >
                                    <div className={`p-1 rounded-lg ${paymentMethod === 'Transferencia' ? 'bg-white/20' : 'bg-slate-100'}`}>
                                        <ChevronRight size={14} className="rotate-45" />
                                    </div>
                                    Transferencia
                                </button>
                            </div>
                        </div>

                        {/* Summary & Checkout - Compact */}
                        <div className="p-5 bg-white border-t-2 border-slate-50 shadow-[0_-20px_50px_rgba(0,0,0,0.03)]">
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between items-end px-1">
                                    <span className="text-sm font-black text-slate-800 uppercase tracking-widest">Total a Pagar</span>
                                    <span className="text-3xl font-black text-indigo-600 tracking-tighter">
                                        <span className="text-lg font-bold mr-1">$</span>
                                        {calculateTotal().toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={cart.length === 0 || isProcessing || !selectedClient}
                                className="group relative w-full bg-slate-900 disabled:bg-slate-200 py-4 rounded-2xl font-black text-white transition-all hover:bg-slate-800 active:scale-95 shadow-xl shadow-slate-900/20 flex items-center justify-center gap-4"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                {isProcessing ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <div className="p-1.5 bg-white/10 rounded-lg">
                                            <CreditCard size={18} className="text-indigo-300" />
                                        </div>
                                        <span className="uppercase tracking-widest text-xs">Completar Venta</span>
                                        <ChevronRight size={18} className="text-white/40 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Overlay */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl animate-fade-in text-center">
                    <div className="bg-white p-10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] max-w-md w-full animate-scale-in border-4 border-emerald-500/10">
                        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/40 relative">
                            <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
                            <Check size={40} className="text-white" strokeWidth={4} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">¡Venta Exitosa!</h2>
                        <p className="text-slate-500 font-bold mb-8">La transacción ha sido procesada correctamente.</p>

                        <div className="space-y-3">
                            <button
                                onClick={() => setIsDetailsModalOpen(true)}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3"
                            >
                                <Eye size={16} />
                                Ver Detalles / Imprimir
                            </button>
                            <button
                                onClick={() => { setShowSuccess(false); setCompletedSale(null); }}
                                className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
                            >
                                Nueva Venta
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Client Creation Modal */}
            <ClientFormModal
                isOpen={isClientModalOpen}
                onClose={() => setIsClientModalOpen(false)}
                onSave={handleSaveClient}
            />

            {/* Sale Details & Printing Modal */}
            <SaleDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                sale={completedSale}
            />

            <ConfirmModal
                isOpen={isClosedSessionModalOpen}
                onClose={() => setIsClosedSessionModalOpen(false)}
                onConfirm={() => window.location.href = '/cash-register'}
                title="Caja Cerrada"
                message="Debe abrir caja antes de realizar ventas en efectivo. ¿Desea ir al Arqueo de Caja ahora?"
                confirmText="Ir a Arqueo de Caja"
                cancelText="Cerrar"
            />
        </div>
    );
}
