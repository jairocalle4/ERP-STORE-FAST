"use client";

import { useEffect, useState, use } from "react";
import { Product } from "@/types/product";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Star, Truck, ShieldCheck, ArrowLeft, Heart, Play, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
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
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow flex flex-col items-center justify-center space-y-4">
                    <h2 className="text-2xl font-bold">Producto no encontrado</h2>
                    <Link href="/" className="text-primary hover:underline">Volver a la tienda</Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main className="flex-grow pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Breadcrumbs / Back */}
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-12 group"
                    >
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                            <ArrowLeft size={16} />
                        </div>
                        VOLVER ATRÁS
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        {/* Gallery Section */}
                        <div className="space-y-6">
                            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-2xl shadow-slate-200/50">
                                {isVideoMode && product.videoUrl ? (
                                    <video
                                        src={product.videoUrl}
                                        autoPlay
                                        muted
                                        loop
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <img src={selectedImage} alt={product.name} className="w-full h-full object-cover animate-fade-in" />
                                )}

                                {/* Actions overlay */}
                                <div className="absolute top-6 right-6 flex flex-col gap-3">
                                    <button className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all active:scale-95">
                                        <Heart size={20} />
                                    </button>
                                    <button className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all active:scale-95">
                                        <Share2 size={20} />
                                    </button>
                                </div>

                                {product.videoUrl && (
                                    <button
                                        onClick={() => setIsVideoMode(!isVideoMode)}
                                        className={`absolute bottom-6 left-6 px-6 py-3 rounded-2xl backdrop-blur flex items-center gap-2 font-bold text-sm transition-all ${isVideoMode ? 'bg-primary text-white' : 'bg-white/90 text-foreground'}`}
                                    >
                                        <Play size={16} fill={isVideoMode ? 'white' : 'currentColor'} />
                                        {isVideoMode ? 'VER IMAGEN' : 'VER VIDEO'}
                                    </button>
                                )}
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                                {product.images?.map((img) => (
                                    <button
                                        key={img.id}
                                        onClick={() => { setSelectedImage(img.url); setIsVideoMode(false); }}
                                        className={`w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${selectedImage === img.url && !isVideoMode ? 'border-primary ring-4 ring-primary/10' : 'border-slate-100 hover:border-slate-300'}`}
                                    >
                                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex text-amber-400">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                    </div>
                                    <span className="text-xs font-bold text-muted-foreground">(120+ Reseñas)</span>
                                </div>

                                <h1 className="text-5xl font-outfit font-black tracking-tighter text-foreground uppercase leading-none">
                                    {product.name}
                                </h1>

                                <p className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">
                                    {product.category?.name || 'Colección General'} / SKU: {product.sku}
                                </p>

                                <div className="flex items-baseline gap-4 pt-4">
                                    <span className="text-5xl font-outfit font-black text-foreground">${product.price.toFixed(2)}</span>
                                    <span className="text-lg text-muted-foreground line-through opacity-50">${(product.price * 1.2).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-slate-100">
                                <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Descripción</h3>
                                <div className="text-muted-foreground leading-relaxed space-y-2">
                                    {(product.description || "Este producto excepcional combina diseño vanguardista con funcionalidad superior. Cada aspecto ha sido cuidadosamente curado para ofrecerte la mejor experiencia posible, manteniendo los más altos estándares de calidad.")
                                        .split('\n')
                                        .map((line, index) => {
                                            const trimmedLine = line.trim();
                                            if (!trimmedLine) return null;

                                            // Check if it looks like a bullet point
                                            if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•') || trimmedLine.startsWith('*')) {
                                                return (
                                                    <div key={index} className="flex gap-2">
                                                        <span className="text-primary mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                                                        <span>{trimmedLine.replace(/^[-•*]\s*/, '')}</span>
                                                    </div>
                                                );
                                            }
                                            return <p key={index}>{trimmedLine}</p>;
                                        })}
                                </div>
                            </div>

                            {/* Badges / Shipping Information */}
                            <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary">
                                        <Truck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold">Envío Gratis</p>
                                        <p className="text-[10px] text-muted-foreground">En pedidos +$99</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold">Garantía Total</p>
                                        <p className="text-[10px] text-muted-foreground">30 días de retorno</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 pt-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="flex-1 premium-button h-20 rounded-3xl flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 group active:scale-95 transition-all"
                                    >
                                        <ShoppingCart size={24} />
                                        <span className="text-lg font-bold">Añadir al Carrito</span>
                                    </button>
                                    <button className="h-20 w-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-foreground hover:bg-slate-100 transition-all active:scale-95">
                                        <Heart size={24} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">En Stock: {product.stock} unidades listas para envío</span>
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
