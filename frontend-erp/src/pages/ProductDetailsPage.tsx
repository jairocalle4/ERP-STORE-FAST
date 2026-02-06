import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, PlayCircle, Activity, Archive, Tag, Image as ImageIcon, ShoppingBag, BarChart2 } from 'lucide-react';
import { productService, type Product } from '../services/product.service';

export default function ProductDetailsPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) fetchProduct(Number(id));
    }, [id]);

    const fetchProduct = async (productId: number) => {
        try {
            console.log('Fetching Product ID:', productId);
            const data = await productService.getById(productId);
            if (!data) {
                throw new Error("Producto no encontrado en la respuesta");
            }
            setProduct(data);
            console.log('Product Data:', data);
            // Set initial selected image (cover or first image)
            const cover = data.images && data.images.length > 0 ? (data.images.find(img => img.isCover) || data.images[0]) : null;
            if (cover) setSelectedImage(cover.url);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError('No se pudo cargar el producto. Verifica que el ID sea correcto.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-indigo-900 font-bold animate-pulse">Cargando detalles...</p>
        </div>
    );

    if (error || !product) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <div className="p-4 bg-rose-100 rounded-full text-rose-600">
                <Activity size={48} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Ups, algo salió mal</h2>
            <p className="text-slate-500">{error || 'Producto no encontrado'}</p>
            <Link to="/products" className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all">
                Volver al listado
            </Link>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-12 pt-6 px-4">
            {/* Minimalist Header with Breadcrumb-like feel */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/products" className="p-3 glass hover:bg-white/50 rounded-full text-slate-500 hover:text-indigo-600 transition-all active:scale-95">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                                {product.name}
                            </h1>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${product.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                {product.isActive ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-500 font-medium">
                            <span className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors cursor-default">
                                <ShoppingBag size={14} /> {product.category?.name || 'General'}
                            </span>
                            {product.subcategory && (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span className="flex items-center gap-1.5 hover:text-purple-600 transition-colors cursor-default">
                                        <Tag size={14} /> {product.subcategory.name}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <Link to={`/products/edit/${product.id}`} className="glass-panel px-6 py-2.5 rounded-full text-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-2 font-bold text-sm active:scale-95 group">
                    <Edit2 size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                    <span>Editar</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Visual Section (Left) */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Main Image Stage */}
                    <div className="glass-panel p-2 rounded-[2rem] relative group overflow-hidden shadow-2xl shadow-indigo-100/40">
                        <div className="aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-white/50 relative">
                            {selectedImage ? (
                                <img
                                    src={selectedImage}
                                    alt={product.name}
                                    className="w-full h-full object-contain mix-blend-multiply cursor-zoom-in transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                    <ImageIcon size={48} className="mb-2 opacity-50" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Sin Imagen</span>
                                </div>
                            )}

                            {/* Floating Stock Badge */}
                            <div className="absolute top-4 left-4">
                                <span className={`glass px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm border border-white/40 ${product.stock > 0 ? 'text-indigo-900' : 'text-rose-600'}`}>
                                    {product.stock > 0 ? `${product.stock} Unidades` : 'Agotado'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Minimal Thumbnail Strip */}
                    {product.images && product.images.length > 0 && (
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {product.images.map((img) => (
                                <button
                                    key={img.id}
                                    onClick={() => setSelectedImage(img.url)}
                                    className={`relative w-20 aspect-square flex-shrink-0 rounded-2xl overflow-hidden transition-all duration-300 ${selectedImage === img.url ? 'ring-2 ring-indigo-500 ring-offset-2 scale-105 shadow-lg' : 'opacity-60 hover:opacity-100 hover:scale-105'}`}
                                >
                                    <img src={img.url} alt="thumb" className="w-full h-full object-cover bg-white" />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Video Section (Collapsible style or neat card) */}
                    {product.videoUrl && (
                        <div className="glass-panel p-1 rounded-3xl overflow-hidden mt-4">
                            <div className="bg-slate-900/95 rounded-[1.3rem] p-6 text-white relative overflow-hidden">
                                <div className="flex items-center gap-3 mb-4 z-10 relative">
                                    <div className="p-2 bg-indigo-500/20 rounded-full text-indigo-400">
                                        <PlayCircle size={20} />
                                    </div>
                                    <span className="font-bold text-sm tracking-wide">Video del Producto</span>
                                </div>
                                <div className="aspect-video rounded-xl overflow-hidden bg-black/50 border border-white/5 relative z-10 shadow-inner">
                                    <video controls className="w-full h-full object-cover">
                                        <source src={product.videoUrl} type="video/mp4" />
                                    </video>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Details Section (Right) */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Primary Info & Price - Clean & Open */}
                    <div className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden">
                        {/* Subtle background wash */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <div className="relative z-10">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Precio Actual</p>
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-6xl font-black text-slate-800 tracking-tighter">
                                    ${product.price ? product.price.toFixed(2) : '0.00'}
                                </span>
                                <span className="text-xl font-bold text-slate-400">USD</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                                <div>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Código SKU</p>
                                    <p className="font-mono text-slate-600 font-medium">{product.barcode || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Stock Disponible</p>
                                    <div className="flex items-center gap-2 text-indigo-600 font-bold">
                                        <Archive size={16} />
                                        <span>{product.stock}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Metrics - Grid of Mini Glass Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass-panel p-5 rounded-3xl hover-float">
                            <div className="flex items-center gap-3 mb-2 text-slate-400">
                                <Activity size={18} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Costo</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-700 font-mono">
                                ${product.cost ? product.cost.toFixed(2) : '0.00'}
                            </p>
                        </div>
                        <div className="glass-panel p-5 rounded-3xl hover-float">
                            <div className="flex items-center gap-3 mb-2 text-emerald-500">
                                <BarChart2 size={18} />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600/70">Margen</span>
                            </div>
                            <p className="text-2xl font-bold text-emerald-600 font-mono">
                                {product.price > 0
                                    ? Math.round(((product.price - product.cost) / product.price) * 100)
                                    : 0}%
                            </p>
                        </div>
                    </div>

                    {/* Description - Minimal Text Block */}
                    <div className="glass-panel p-8 rounded-[2rem]">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            Sobre el producto
                        </h3>
                        <div className="prose prose-sm prose-slate text-slate-500 font-medium leading-relaxed">
                            <p>
                                {product.description || 'Este producto no tiene una descripción detallada.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
