import React from 'react';
import { X, Package, Tag, DollarSign, Archive, Activity } from 'lucide-react';
import type { Product } from '../../services/product.service';

interface ProductDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ isOpen, onClose, product }) => {
    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl w-full max-w-lg shadow-xl text-white relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="flex items-center gap-4 mb-6">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <Package size={32} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{product.name}</h2>
                        <span className="bg-white/10 px-2 py-1 rounded text-sm text-indigo-200 font-mono">
                            SKU: {product.sku}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 text-indigo-300 mb-1">
                            <Tag size={16} />
                            <span className="text-sm font-medium">Categoría</span>
                        </div>
                        <p className="text-lg font-semibold">{product.category?.name || 'N/A'}</p>
                    </div>

                    <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 text-emerald-300 mb-1">
                            <DollarSign size={16} />
                            <span className="text-sm font-medium">Precio</span>
                        </div>
                        <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
                    </div>

                    <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 text-amber-300 mb-1">
                            <Archive size={16} />
                            <span className="text-sm font-medium">Stock</span>
                        </div>
                        <p className="text-lg font-semibold">{product.stock} unidades</p>
                    </div>

                    <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 text-blue-300 mb-1">
                            <Activity size={16} />
                            <span className="text-sm font-medium">Estado</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${product.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            <span className="text-lg font-semibold">
                                {product.isActive ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-medium transition-all shadow-lg shadow-indigo-600/30"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsModal;
