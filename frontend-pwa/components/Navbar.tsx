"use client";

import { ShoppingBag, Search, User, Menu } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { totalItems, setIsCartOpen } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? "glass-card mx-4 mt-4 rounded-2xl py-3 px-6 shadow-lg shadow-primary/5"
                : "bg-transparent py-6 px-8"
                }`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl premium-button flex items-center justify-center shadow-lg shadow-primary/20">
                        <ShoppingBag size={22} strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-outfit font-black tracking-tighter text-foreground">
                        FAST<span className="gradient-text">STORE</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {["Colecciones", "Novedades", "Ofertas", "Contacto"].map((item) => (
                        <Link
                            key={item}
                            href="#"
                            className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors duration-300"
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button className="p-2.5 rounded-xl hover:bg-muted text-foreground transition-all duration-300 group">
                        <Search size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                    <button className="p-2.5 rounded-xl hover:bg-muted text-foreground transition-all duration-300 group">
                        <User size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2.5 rounded-xl premium-button shadow-lg shadow-primary/20 group"
                    >
                        <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-primary">
                                {totalItems}
                            </span>
                        )}
                    </button>
                    <button className="md:hidden p-2.5 rounded-xl hover:bg-muted text-foreground transition-all">
                        <Menu size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
