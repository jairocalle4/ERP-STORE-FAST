"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Star, Truck, ShieldCheck, ArrowLeft, Heart, Play, Share2, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductDetailsClient({ id }: { id: string }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [isVideoMode, setIsVideoMode] = useState(false);
    const { addToCart } = useCart();
    const router = useRouter();

    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch(`http://localhost:5140/api/v1/products/${id}`);
                if (!res.ok) throw new Error("Product not found");
                const data = await res.json();
                setProduct(data);
                setSelectedImage(data.images?.find((img: any) => img.isCover)?.url || data.images?.[0]?.url || "");
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50">
                <Navbar />
                <main className="flex-grow flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Cargando...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50">
                <Navbar />
                <main className="flex-grow flex flex-col items-center justify-center space-y-6 text-center px-4">
                    <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                        <ShoppingBag size={40} className="text-slate-400" />
                    </div>
                    <h2 className="text-3xl font-outfit font-black text-slate-800">Producto no encontrado</h2>
                    <p className="text-muted-foreground max-w-md">Lo sentimos, el producto que buscas no existe o ha sido eliminado de nuestro catálogo.</p>
                    <Link href="/" className="premium-button px-8 py-3 rounded-xl flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                        <ArrowLeft size={16} /> Volver a la Tienda
                    </Link>
                </main>
            </div>
        );
    }

    const discountPercentage = product.discountPercentage || 0;
    const oldPrice = discountPercentage > 0 ? (product.price / (1 - discountPercentage / 100)) : 0;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            <main className="flex-grow pt-24 md:pt-32 pb-24 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Navigation Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={() => router.back()}
                            className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white transition-all shadow-sm group"
                            aria-label="Volver atrás"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </button>

                        <nav className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-400">
                            <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
                            <span className="opacity-50">/</span>
                            <Link href="/catalog" className="hover:text-primary transition-colors">Catálogo</Link>
                            <span className="opacity-50">/</span>
                            <span className="text-slate-800 font-bold">{product.category?.name || 'General'}</span>
                        </nav>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        {/* Left Column: Gallery (7 cols) */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square bg-white rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-white">
                                {isVideoMode && product.videoUrl ? (
                                    <video
                                        src={product.videoUrl}
                                        autoPlay
                                        muted
                                        loop
                                        controls
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src={selectedImage}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-8 md:p-12 animate-fade-in hover:scale-105 transition-transform duration-700"
                                    />
                                )}

                                {/* Floating Badges */}
                                <div className="absolute top-6 left-6 flex flex-col gap-2">
                                    {product.stock > 0 ? (
                                        <span className="bg-emerald-500/90 backdrop-blur text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/30">
                                            En Stock
                                        </span>
                                    ) : (
                                        <span className="bg-rose-500/90 backdrop-blur text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/30">
                                            Agotado
                                        </span>
                                    )}
                                    {discountPercentage > 0 && (
                                        <span className="bg-white/90 backdrop-blur text-foreground px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border border-slate-100">
                                            -{discountPercentage}% OFF
                                        </span>
                                    )}
                                </div>

                                {/* Floating Actions */}
                                <div className="absolute top-6 right-6 flex flex-col gap-2">
                                    <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:scale-110 transition-all active:scale-90">
                                        <Heart size={18} fill="currentColor" className={false ? "text-rose-500" : ""} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: product.name,
                                                    text: product.description,
                                                    url: window.location.href,
                                                });
                                            }
                                        }}
                                        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-slate-400 hover:text-primary hover:scale-110 transition-all active:scale-90"
                                    >
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Thumbnails Grid */}
                            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                                {product.videoUrl && (
                                    <button
                                        onClick={() => setIsVideoMode(true)}
                                        className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all relative group ${isVideoMode ? 'border-primary ring-2 ring-primary/20' : 'border-white bg-white hover:border-slate-300'}`}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 group-hover:bg-slate-900/20 transition-all">
                                            <Play size={24} className="text-white drop-shadow-md" fill="currentColor" />
                                        </div>
                                    </button>
                                )}
                                {product.images?.map((img, idx) => (
                                    <button
                                        key={img.id || idx}
                                        onClick={() => { setSelectedImage(img.url); setIsVideoMode(false); }}
                                        className={`aspect-square rounded-2xl overflow-hidden border-2 bg-white transition-all p-1 ${selectedImage === img.url && !isVideoMode ? 'border-primary ring-2 ring-primary/20 scale-95' : 'border-transparent hover:border-slate-200'}`}
                                    >
                                        <img src={img.url} alt="" className="w-full h-full object-contain" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Info & Buy (5 cols) */}
                        <div className="lg:col-span-5 flex flex-col h-full">
                            <div className="sticky top-32 space-y-8 bg-white/50 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/50">
                                {/* Header Info */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                                            {product.category?.name || 'General'}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Star size={14} className="text-amber-400 fill-amber-400" />
                                            <span className="text-xs font-bold text-slate-700">4.9 (120)</span>
                                        </div>
                                    </div>

                                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-outfit font-black text-slate-900 leading-[0.95] tracking-tight uppercase">
                                        {product.name}
                                    </h1>

                                    <div className="flex items-baseline gap-3">
                                        <span className="text-4xl md:text-5xl font-outfit font-black text-primary tracking-tighter">
                                            ${product.price.toFixed(2)}
                                        </span>
                                        {oldPrice > 0 && (
                                            <span className="text-lg text-slate-400 line-through decoration-2 decoration-rose-400/50 font-medium">
                                                ${oldPrice.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full h-px bg-slate-100"></div>

                                {/* Description */}
                                <div className="space-y-3">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Sobre este producto</h3>
                                    <div className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
                                        <p>{product.description || "Sin descripción disponible para este producto premium."}</p>
                                    </div>
                                </div>

                                {/* Benefits Matrix */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-indigo-50/50 p-4 rounded-2xl flex flex-col gap-2 border border-indigo-100/50">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                            <Truck size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black tracking-widest text-indigo-400">Envío</p>
                                            <p className="text-xs font-bold text-indigo-900">Nacional Rápido</p>
                                        </div>
                                    </div>
                                    <div className="bg-emerald-50/50 p-4 rounded-2xl flex flex-col gap-2 border border-emerald-100/50">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                            <ShieldCheck size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black tracking-widest text-emerald-400">Garantía</p>
                                            <p className="text-xs font-bold text-emerald-900">30 Días de Retorno</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="space-y-4 pt-4">
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="w-full premium-button py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 group hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="relative">
                                            <ShoppingCart size={24} className="group-hover:scale-110 transition-transform duration-300" />
                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping"></div>
                                        </div>
                                        <span className="text-lg font-black uppercase tracking-widest">Añadir al Carrito</span>
                                    </button>

                                    <p className="text-center text-[10px] text-slate-400 font-medium">
                                        Pago seguro con encriptación SSL de 256-bits.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
