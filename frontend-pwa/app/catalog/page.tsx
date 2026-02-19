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
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const PAGE_SIZE = 8;

    // Categorías se cargan una sola vez
    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch("http://localhost:5140/api/v1/categories");
                if (res.ok) setCategories(await res.json());
            } catch (e) { console.error(e); }
        }
        fetchCategories();
    }, []);

    // Carga de productos (inicial y paginada)
    const fetchProducts = async (pageNum: number, isInitial = false, catId: number | null = null, search: string = searchQuery) => {
        if (pageNum > 1) setLoadingMore(true);
        else if (isInitial) setLoading(true);

        try {
            const categoryParam = catId ? `&categoryId=${catId}` : "";
            const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
            const res = await fetch(`http://localhost:5140/api/v1/products?page=${pageNum}&pageSize=${PAGE_SIZE}${categoryParam}${searchParam}`);
            if (!res.ok) throw new Error("Failed");
            const newProducts = await res.json();

            setHasMore(newProducts.length === PAGE_SIZE);

            if (isInitial) {
                setProducts(newProducts);
            } else {
                setProducts(prev => [...prev, ...newProducts]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Al cambiar la categoría, reseteamos todo
    const handleCategoryChange = (id: number | null) => {
        setSelectedCategoryId(id);
        setPage(1);
        setHasMore(true);
        setProducts([]);
        fetchProducts(1, true, id, searchQuery);
    };

    useEffect(() => {
        // Initialize once, rely on search effect for first fetch if search is empty?
        // Actually, search query effect should run initially too due to searchQuery state.
        // But let's keep separate logic to avoid double fetch if needed?
        // No, fetchProducts(1, true) handles it.
        // BUT search effect below will handle searchQuery change.
        // Let's remove fetchProducts(1, true) from here and let the search effect handle it?
        // Or keep it separate
        if (!searchQuery) fetchProducts(1, true);

        // Restaurar posición del scroll
        const savedScrollPos = sessionStorage.getItem("catalog_scroll_pos");
        if (savedScrollPos) {
            setTimeout(() => {
                window.scrollTo(0, parseInt(savedScrollPos));
                sessionStorage.removeItem("catalog_scroll_pos");
            }, 100);
        }
    }, []);

    // Effect for Search (Debounced)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery) {
                setPage(1);
                setHasMore(true);
                // setProducts([]); // Don't clear immediately to avoid flash? UI might look cleaner if we do or show loading
                setProducts([]);
                fetchProducts(1, true, selectedCategoryId, searchQuery);
            } else {
                // handled by initial load or category change mostly, but if user clears search:
                // We should re-fetch all
                if (products.length === 0 && !loading) { // logic to avoid double fetch on mount?
                    fetchProducts(1, true, selectedCategoryId, "");
                } else if (searchQuery === "" && products.length > 0) {
                    // If existing products are filtered search result, we need to refresh
                    // How to know? Assume yes if search cleared.
                    setPage(1);
                    setProducts([]);
                    fetchProducts(1, true, selectedCategoryId, "");
                }
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]); // Removed selectedCategoryId from deps here to avoid double fetch with handler, only search change matters here


    // Infinite Scroll Observer
    useEffect(() => {
        if (!hasMore || loadingMore || loading) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                const nextPage = page + 1;
                setPage(nextPage);
                fetchProducts(nextPage, false, selectedCategoryId, searchQuery);
            }
        }, { threshold: 0.1 });

        const loader = document.getElementById("scroll-loader");
        if (loader) observer.observe(loader);

        return () => observer.disconnect();
    }, [page, hasMore, loadingMore, loading, selectedCategoryId, searchQuery]);

    // Guardar posición antes de salir
    const handleProductClick = () => {
        sessionStorage.setItem("catalog_scroll_pos", window.scrollY.toString());
    };

    // const normalizeString = (str: string) => {
    //     return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    // };

    // const filteredProducts = products.filter(p => {
    //     const normalizedName = normalizeString(p.name);
    //     const normalizedDesc = normalizeString(p.description || "");
    //     const normalizedQuery = normalizeString(searchQuery);

    //     return normalizedName.includes(normalizedQuery) || normalizedDesc.includes(normalizedQuery);
    // });
    const filteredProducts = products; // Use backend results directly

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />

            <main className="flex-grow pt-24 md:pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                        <div className="space-y-4">
                            <h1 className="text-3xl sm:text-5xl md:text-6xl font-outfit font-black tracking-tighter uppercase leading-none">
                                CATÁLOGO <span className="gradient-text">COMPLETO.</span>
                            </h1>
                            <p className="text-muted-foreground max-w-lg">
                                Explora nuestra colección completa de productos de alta calidad, seleccionados especialmente para ti.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100 w-full sm:w-96">
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
                            onClick={() => handleCategoryChange(null)}
                            className={`px-6 py-2.5 rounded-xl border text-sm font-semibold transition-all shadow-sm flex-shrink-0 ${selectedCategoryId === null ? 'bg-primary text-white border-primary' : 'bg-white border-slate-100 hover:border-primary hover:text-primary'}`}
                        >
                            Todos
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`px-6 py-2.5 rounded-xl border text-sm font-semibold transition-all shadow-sm flex-shrink-0 ${selectedCategoryId === cat.id ? 'bg-primary text-white border-primary' : 'bg-white border-slate-100 hover:border-primary hover:text-primary'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Results Info */}
                    <div className="flex justify-between items-center mb-8">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            Mostrando {filteredProducts.length} productos
                        </p>
                    </div>

                    {/* Grid */}
                    {loading && products.length === 0 ? (
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
                        <>
                            {filteredProducts.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 transition-all">
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
                                        onClick={() => { handleCategoryChange(null); setSearchQuery(""); }}
                                        className="premium-button px-8 py-4 rounded-2xl"
                                    >
                                        Limpiar Filtros
                                    </button>
                                </div>
                            )}

                            {/* Loader for Infinite Scroll */}
                            <div id="scroll-loader" className="py-20 flex flex-col items-center justify-center gap-4">
                                {loadingMore ? (
                                    <>
                                        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Cargando más tesoros...</p>
                                    </>
                                ) : hasMore && filteredProducts.length > 0 && searchQuery === "" ? (
                                    <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                                ) : null}
                            </div>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
