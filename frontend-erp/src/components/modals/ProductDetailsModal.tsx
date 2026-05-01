import React, { useState } from 'react';
import { X, Package, Tag, Archive, Activity, BarChart2, ShoppingBag, PlayCircle, Image as ImageIcon, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../../services/product.service';

interface ProductDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ isOpen, onClose, product }) => {
    const [selectedImage, setSelectedImage] = useState<string>('');

    // Reset image when product changes
    React.useEffect(() => {
        if (product?.images && product.images.length > 0) {
            const cover = product.images.find(img => img.isCover) || product.images[0];
            setSelectedImage(cover.url);
        } else {
            setSelectedImage('');
        }
    }, [product]);

    if (!isOpen || !product) return null;

    const margin = product.price > 0
        ? Math.round(((product.price - product.cost) / product.price) * 100)
        : 0;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col animate-scale-in">

                {/* Header */}
                <div className="flex justify-between items-start p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50/80 to-purple-50/40 shrink-0">
                    <div className="flex items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">{product.name}</h2>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${product.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                    {product.isActive ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 font-medium flex-wrap">
                                <span className="flex items-center gap-1.5">
                                    <ShoppingBag size={13} /> {product.category?.name || 'General'}
                                </span>
                                {product.subcategory && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                                        <span className="flex items-center gap-1.5">
                                            <Tag size={13} /> {product.subcategory.name}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Link
                            to={`/products/edit/${product.id}`}
                            onClick={onClose}
                            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-indigo-100 text-indigo-600 hover:bg-indigo-50 rounded-xl font-bold text-sm transition-all shadow-sm"
                        >
                            <Edit2 size={15} /> Editar
                        </Link>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                        >
                            <X size={22} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="overflow-y-auto custom-scrollbar flex-1 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Left: Images */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 aspect-[4/3] flex items-center justify-center shadow-sm">
                                {selectedImage ? (
                                    <img
                                        src={selectedImage}
                                        alt={product.name}
                                        className="w-full h-full object-contain mix-blend-multiply"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-slate-300 gap-2">
                                        <ImageIcon size={48} className="opacity-40" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Sin Imagen</span>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Strip */}
                            {product.images && product.images.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-1">
                                    {product.images.map((img) => (
                                        <button
                                            key={img.id}
                                            onClick={() => setSelectedImage(img.url)}
                                            className={`relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden transition-all ${selectedImage === img.url ? 'ring-2 ring-indigo-500 ring-offset-2 scale-105 shadow-md' : 'opacity-60 hover:opacity-100 hover:scale-105 border border-slate-100'}`}
                                        >
                                            <img src={img.url} alt="thumb" className="w-full h-full object-cover bg-white" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Video */}
                            {product.videoUrl && (
                                <div className="bg-slate-900 rounded-2xl p-4 text-white">
                                    <div className="flex items-center gap-2 mb-3">
                                        <PlayCircle size={18} className="text-indigo-400" />
                                        <span className="text-sm font-bold">Video del Producto</span>
                                    </div>
                                    <div className="aspect-video rounded-xl overflow-hidden bg-black/50">
                                        <video controls className="w-full h-full object-cover">
                                            <source src={product.videoUrl} type="video/mp4" />
                                        </video>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Details */}
                        <div className="space-y-4">
                            {/* Price */}
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50/60 rounded-2xl p-6 border border-indigo-100/60">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Precio de Venta</p>
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-5xl font-black text-slate-800 tracking-tighter">
                                        ${product.price ? product.price.toFixed(2) : '0.00'}
                                    </span>
                                    <span className="text-lg font-bold text-slate-400">USD</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-indigo-100">
                                    <div>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Código SKU</p>
                                        <p className="font-mono text-slate-600 font-medium text-sm">{product.barcode || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Stock</p>
                                        <div className="flex items-center gap-1.5 text-indigo-600 font-bold">
                                            <Archive size={14} />
                                            <span>{product.stock} uds.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Metrics */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2 text-slate-400">
                                        <Activity size={16} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Costo</span>
                                    </div>
                                    <p className="text-xl font-bold text-slate-700 font-mono">
                                        ${product.cost ? product.cost.toFixed(2) : '0.00'}
                                    </p>
                                </div>
                                <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2 text-emerald-500">
                                        <BarChart2 size={16} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600/70">Margen</span>
                                    </div>
                                    <p className="text-xl font-bold text-emerald-600 font-mono">{margin}%</p>
                                </div>
                            </div>

                            {/* Stock Status Badge */}
                            <div className={`rounded-2xl px-4 py-3 border flex items-center gap-3 ${product.stock > (product.minStock || 5) ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : product.stock > 0 ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                                <Package size={18} />
                                <div>
                                    <p className="font-black text-xs uppercase tracking-wider">
                                        {product.stock > (product.minStock || 5) ? 'Stock Disponible' : product.stock > 0 ? '⚠ Stock Bajo — Reponer pronto' : '✗ Producto Agotado'}
                                    </p>
                                    <p className="text-xs font-medium opacity-70">
                                        {product.stock} unidades · Mínimo: {product.minStock || 5}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                    Sobre el producto
                                </h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                    {product.description || 'Este producto no tiene una descripción detallada.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 shrink-0 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
                    >
                        Cerrar
                    </button>
                    <Link
                        to={`/products/edit/${product.id}`}
                        onClick={onClose}
                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
                    >
                        <Edit2 size={15} /> Editar Producto
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsModal;
