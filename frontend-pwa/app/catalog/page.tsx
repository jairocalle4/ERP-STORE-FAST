"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Product } from "@/types/product";
import { Search, SlidersHorizontal, ShoppingBag, Star } from "lucide-react";

export default function CatalogPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [prodRes, catRes] = await Promise.all([
                    fetch("http://localhost:5140/api/v1/products"),
                    fetch("http://localhost:5140/api/v1/categories")
                ]);

                if (!prodRes.ok || !catRes.ok) throw new Error("Failed to fetch data");

                const [prodData, catData] = await Promise.all([
                    prodRes.json(),
                    catRes.json()
                ]);

                setProducts(prodData);
                setCategories(catData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();

        // Restaurar posición del scroll
        const savedScrollPos = sessionStorage.getItem("catalog_scroll_pos");
        if (savedScrollPos && !loading) {
            setTimeout(() => {
                window.scrollTo(0, parseInt(savedScrollPos));
                sessionStorage.removeItem("catalog_scroll_pos");
            }, 100);
        }
    }, [loading]);

    // Guardar posición antes de salir
    const handleProductClick = () => {
        sessionStorage.setItem("catalog_scroll_pos", window.scrollY.toString());
    };

    const filteredProducts = products.filter(p => {
        const matchesCategory = selectedCategory === "Todos" || p.category?.name === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const activeCategories = categories.filter(cat =>
        products.some(p => p.category?.id === cat.id)
    );

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />

            <main className="flex-grow pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-6xl font-outfit font-black tracking-tighter uppercase leading-none">
                                CATÁLOGO <span className="gradient-text">COMPLETO.</span>
                            </h1>
                            <p className="text-muted-foreground max-w-lg">
                                Explora nuestra colección completa de productos de alta calidad, seleccionados especialmente para ti.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100 w-full md:w-96">
                            <Search size={20} className="ml-3 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                className="bg-transparent border-none outline-none w-full py-2 text-sm font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Filters Bar */}
                    <div className="flex items-center gap-4 overflow-x-auto pb-6 mb-12 custom-scrollbar border-b border-slate-50">
                        <div className="flex items-center gap-2 px-4 py-2 bg-foreground text-white rounded-xl text-xs font-bold uppercase tracking-widest shrink-0">
                            <SlidersHorizontal size={14} />
                            <span>Filtros</span>
                        </div>

                        <button
                            onClick={() => setSelectedCategory("Todos")}
                            className={`px-6 py-2.5 rounded-xl border text-sm font-semibold transition-all shadow-sm flex-shrink-0 ${selectedCategory === "Todos" ? 'bg-primary text-white border-primary' : 'bg-white border-slate-100 hover:border-primary hover:text-primary'}`}
                        >
                            Todos
                        </button>
                        {activeCategories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`px-6 py-2.5 rounded-xl border text-sm font-semibold transition-all shadow-sm flex-shrink-0 ${selectedCategory === cat.name ? 'bg-primary text-white border-primary' : 'bg-white border-slate-100 hover:border-primary hover:text-primary'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Results Info */}
                    <div className="flex justify-between items-center mb-8">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            Mostrando {filteredProducts.length} de {products.length} productos
                        </p>
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="glass-card rounded-2xl md:rounded-[2rem] p-3 h-[300px] md:h-[450px] animate-pulse">
                                    <div className="aspect-[4/5] bg-slate-200 rounded-xl md:rounded-[1.8rem] mb-4"></div>
                                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                                    <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onClick={handleProductClick}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card rounded-[3rem] p-20 text-center max-w-2xl mx-auto border-dashed">
                                <ShoppingBag className="mx-auto text-muted-foreground mb-6 opacity-20" size={80} />
                                <h3 className="text-2xl font-outfit font-bold mb-2">No se encontraron productos</h3>
                                <p className="text-muted-foreground mb-8 text-sm">Intenta ajustar tus filtros o búsqueda para encontrar lo que necesitas.</p>
                                <button
                                    onClick={() => { setSelectedCategory("Todos"); setSearchQuery(""); }}
                                    className="premium-button px-8 py-4 rounded-2xl"
                                >
                                    Limpiar Filtros
                                </button>
                            </div>
                        )
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
