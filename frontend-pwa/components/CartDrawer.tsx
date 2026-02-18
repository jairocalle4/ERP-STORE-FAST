"use client";

import { useCart } from "@/context/CartContext";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";

export default function CartDrawer() {
    const { cart, removeFromCart, updateQuantity, totalPrice, isCartOpen, setIsCartOpen } = useCart();

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
                <div className="w-screen max-w-md animate-slide-in-right">
                    <div className="h-full flex flex-col bg-white shadow-2xl rounded-l-[2.5rem] overflow-hidden">
                        {/* Header */}
                        <div className="px-8 py-8 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                    <ShoppingBag size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-outfit font-black tracking-tight">Tu Carrito</h2>
                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{cart.length} Artículos</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-3 rounded-2xl hover:bg-slate-50 text-muted-foreground transition-all active:scale-90"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-6 space-y-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                                        <ShoppingBag size={40} />
                                    </div>
                                    <p className="text-muted-foreground font-medium">Tu carrito está vacío</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="text-primary font-bold text-sm hover:underline"
                                    >
                                        Seguir comprando
                                    </button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="w-24 h-24 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 animate-fade-in">
                                            <img
                                                src={item.images?.[0]?.url || ""}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-sm font-bold text-foreground line-clamp-1">{item.name}</h3>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Unit: ${item.price.toFixed(2)}</p>

                                            <div className="flex items-center justify-between pt-2">
                                                <div className="flex items-center gap-1 bg-slate-50 rounded-xl p-1 border border-slate-100">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-slate-500 transition-all"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-slate-500 transition-all"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <span className="text-sm font-outfit font-black">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="px-8 py-10 border-t border-slate-50 bg-slate-50/30 space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Subtotal</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Envío</span>
                                        <span className="text-emerald-500 font-bold">Gratis</span>
                                    </div>
                                    <div className="pt-4 flex justify-between items-end">
                                        <span className="font-bold">Total</span>
                                        <span className="text-3xl font-outfit font-black text-primary">${totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button className="w-full premium-button py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 group">
                                        <span>Finalizar Compra</span>
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="w-full py-4 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Continuar Comprando
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
