"use client";

import { useState } from 'react';
import { Product } from '@/types/product';
import { Play, ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

interface ProductCardProps {
    product: Product;
    onClick?: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const { addToCart } = useCart();

    return (
        <div
            className="glass-card rounded-2xl md:rounded-[2rem] p-2 md:p-3 flex flex-col h-full group transition-all duration-500 hover:-translate-y-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link
                href={`/product/${product.id}`}
                className="flex flex-col flex-1"
                onClick={onClick}
            >
                {/* Image Container */}
                <div className="relative aspect-[4/5] bg-slate-100 rounded-xl md:rounded-[1.8rem] mb-3 md:mb-4 flex items-center justify-center overflow-hidden border border-white/40">
                    {product.videoUrl && isHovered ? (
                        <video
                            src={product.videoUrl}
                            autoPlay
                            muted
                            loop
                            className="h-full w-full object-cover rounded-[1.8rem]"
                        />
                    ) : product.images && product.images.length > 0 ? (
                        <img
                            src={product.images.find(img => img.isCover)?.url || product.images[0].url}
                            alt={product.name}
                            className="h-full w-full object-cover rounded-[1.8rem] transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest italic opacity-50">Sin Imagen</span>
                    )}

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        {product.stock <= 5 && product.stock > 0 && (
                            <span className="bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">ÚLTIMOS {product.stock}</span>
                        )}
                    </div>

                    {/* Floating Actions */}
                    <div className={`absolute bottom-4 left-4 right-4 flex justify-between items-center transition-all duration-500 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <div className="flex gap-2">
                            <button className="w-10 h-10 rounded-xl bg-white text-foreground flex items-center justify-center shadow-lg hover:bg-foreground hover:text-white transition-all transform active:scale-90">
                                <Heart size={18} />
                            </button>
                            <button className="w-10 h-10 rounded-xl bg-white text-foreground flex items-center justify-center shadow-lg hover:bg-foreground hover:text-white transition-all transform active:scale-90">
                                <Eye size={18} />
                            </button>
                        </div>
                    </div>

                    {product.videoUrl && !isHovered && (
                        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md text-foreground p-2 rounded-full shadow-lg">
                            <Play size={12} fill="currentColor" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="px-1 md:px-3 flex-grow space-y-1 md:space-y-2">
                    <p className="text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{product.category?.name || 'General'}</p>
                    <h3 className="font-outfit font-bold text-sm md:text-lg leading-tight text-foreground transition-colors group-hover:text-primary line-clamp-2">{product.name}</h3>
                    <p className="hidden md:line-clamp-2 text-muted-foreground text-xs leading-relaxed">{product.description}</p>
                </div>

            </Link>

            {/* Footer */}
            <div className="px-1 md:px-3 mt-2 md:mt-4 pt-3 md:pt-4 border-t border-slate-50 flex items-center justify-between pb-1 md:pb-2">
                <div className="flex flex-col">
                    <span className="text-base md:text-xl font-outfit font-black text-foreground">${product.price.toFixed(2)}</span>
                </div>
                <button
                    onClick={() => addToCart(product)}
                    className="premium-button p-3 md:p-4 rounded-xl md:rounded-2xl shadow-lg shadow-primary/20 group"
                >
                    <ShoppingCart size={16} className="md:w-5 md:h-5 group-active:scale-125 transition-transform" />
                </button>
            </div>
        </div>
    );
}
