"use client";

import { ShoppingBag, Search, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCompany } from "@/context/CompanyContext";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { totalItems, setIsCartOpen } = useCart();
    const { company } = useCompany();
    const router = useRouter();

    // Split name into two parts for styling: first half normal, second half gradient
    const name = company.name || "FASTSTORE";
    const half = Math.ceil(name.length / 2);
    const nameFirst = name.slice(0, half);
    const nameLast = name.slice(half);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/catalog?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery("");
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${isScrolled || isMenuOpen
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
                            {nameFirst}<span className="gradient-text">{nameLast}</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {[
                            { name: "Colecciones", href: "/catalog" },
                            { name: "Nosotros", href: "/about" },
                            { name: "Ofertas", href: "/catalog?filter=offers" },
                            { name: "Servicios", href: "/services" },
                            { name: "Contacto", href: "#footer-contact" }
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors duration-300"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* Search Bar */}
                        {isSearchOpen ? (
                            <form onSubmit={handleSearch} className="absolute inset-x-4 top-1/2 -translate-y-1/2 md:static md:inset-auto md:transform-none flex items-center bg-white md:bg-transparent z-50">
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Buscar productos..."
                                    className="w-full md:w-60 bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 ring-primary/20 transition-all text-foreground shadow-lg md:shadow-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                // onBlur={() => { if(!searchQuery) setIsSearchOpen(false); }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsSearchOpen(false)}
                                    className="ml-2 p-2 text-slate-400 hover:text-rose-500 md:hidden"
                                >
                                    <X size={20} />
                                </button>
                            </form>
                        ) : (
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2.5 rounded-xl hover:bg-muted text-foreground transition-all duration-300 group"
                            >
                                <Search size={20} className="group-hover:scale-110 transition-transform" />
                            </button>
                        )}

                        {/* User removed as per request */}
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
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2.5 rounded-xl hover:bg-muted text-foreground transition-all active:scale-95"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl animate-fade-in md:hidden">
                    <div className="flex flex-col items-center justify-center h-full space-y-8 px-8">
                        {[
                            { name: "Colecciones", href: "/catalog" },
                            { name: "Nosotros", href: "/about" },
                            { name: "Ofertas", href: "/catalog?filter=offers" },
                            { name: "Servicios", href: "/services" },
                            { name: "Contacto", href: "#footer-contact" }
                        ].map((item, i) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-4xl font-outfit font-black tracking-tighter text-foreground hover:text-primary transition-all animate-slide-in-up"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {/* Mobile quick actions removed */}
                    </div>
                </div>
            )}
        </>
    );
}
