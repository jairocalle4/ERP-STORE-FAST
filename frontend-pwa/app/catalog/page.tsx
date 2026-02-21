"use client";

import { useEffect, useState, Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Product } from "@/types/product";
import { Search, SlidersHorizontal, ShoppingBag, Star } from "lucide-react";
import { useSearchParams } from "next/navigation";

function CatalogContent() {
    const searchParams = useSearchParams();
    const initialFilter = searchParams.get("filter");
    const initialSearch = searchParams.get("search");

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [isOffersOnly, setIsOffersOnly] = useState(initialFilter === "offers");
    const [searchQuery, setSearchQuery] = useState(initialSearch || "");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const PAGE_SIZE = 8;

    // Categorías se cargan una sola vez: solo las que tienen productos activos
    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch("http://localhost:5140/api/v1/categories?onlyWithProducts=true");
                if (res.ok) setCategories(await res.json());
            } catch (e) { console.error(e); }
        }
        fetchCategories();
    }, []);

    // Carga de productos (inicial y paginada)
    const fetchProducts = async (pageNum: number, isInitial = false, catId: number | null = null, search: string = searchQuery, offersOnly: boolean = isOffersOnly) => {
        if (pageNum > 1) setLoadingMore(true);
        else if (isInitial) setLoading(true);

        try {
            const categoryParam = catId ? `&categoryId=${catId}` : "";
            const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
            const offersParam = offersOnly ? `&onlyOffers=true` : "";

            const res = await fetch(`http://localhost:5140/api/v1/products?page=${pageNum}&pageSize=${PAGE_SIZE}${categoryParam}${searchParam}${offersParam}`);
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
        setIsOffersOnly(false); // Clear offers when switching to a category
        setPage(1);
        setHasMore(true);
        setProducts([]);
        fetchProducts(1, true, id, "", false); // Also clear search query locally for cleaner switching? 
        // User might want to keep search, but let's clear it if they click a specific category for better UX
        setSearchQuery("");
    };

    // Al cambiar a ofertas
    const handleOffersChange = () => {
        setIsOffersOnly(true);
        setSelectedCategoryId(null);
        setPage(1);
        setHasMore(true);
        setProducts([]);
        setSearchQuery("");
        fetchProducts(1, true, null, "", true);
    };

    // React to URL parameter changes (Search from Navbar or Filters)
    useEffect(() => {
        const filterParam = searchParams.get("filter");
        const srchParam = searchParams.get("search");

        if (filterParam === "offers") {
            if (!isOffersOnly) {
                setIsOffersOnly(true);
                setSelectedCategoryId(null);
                setProducts([]);
                setPage(1);
                fetchProducts(1, true, null, "", true);
            }
        } else if (srchParam !== null) {
            if (srchParam !== searchQuery) {
                setSearchQuery(srchParam);
                setIsOffersOnly(false);
                setSelectedCategoryId(null);
                setProducts([]);
                setPage(1);
                fetchProducts(1, true, null, srchParam, false);
            }
        } else if (!filterParam && srchParam === null && products.length === 0 && loading) {
            // Initial load without params
            fetchProducts(1, true, null, "", false);
        }
    }, [searchParams]);

    // Local Search Effect (Debounced)
    useEffect(() => {
        const timer = setTimeout(() => {
            const urlSearch = searchParams.get("search") || "";
            if (searchQuery !== urlSearch && searchQuery !== "") {
                setPage(1);
                setHasMore(true);
                setProducts([]);
                fetchProducts(1, true, selectedCategoryId, searchQuery, isOffersOnly);
            } else if (searchQuery === "" && urlSearch !== "") {
                // User cleared search locally
                setPage(1);
                setHasMore(true);
                setProducts([]);
                fetchProducts(1, true, selectedCategoryId, "", isOffersOnly);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);


    // Infinite Scroll Observer
    useEffect(() => {
        if (!hasMore || loadingMore || loading) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                const nextPage = page + 1;
                setPage(nextPage);
                fetchProducts(nextPage, false, selectedCategoryId, searchQuery, isOffersOnly);
            }
        }, { threshold: 0.1 });

        const loader = document.getElementById("scroll-loader");
        if (loader) observer.observe(loader);

        return () => observer.disconnect();
    }, [page, hasMore, loadingMore, loading, selectedCategoryId, searchQuery, isOffersOnly]);

    useEffect(() => {
        // Restaurar posición del scroll
        const savedScrollPos = sessionStorage.getItem("catalog_scroll_pos");
        if (savedScrollPos) {
            setTimeout(() => {
                window.scrollTo(0, parseInt(savedScrollPos));
                sessionStorage.removeItem("catalog_scroll_pos");
            }, 100);
        }
    }, []);

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
                            className={`px-6 py-2.5 rounded-xl border text-sm font-semibold transition-all shadow-sm flex-shrink-0 ${selectedCategoryId === null && !isOffersOnly ? 'bg-primary text-white border-primary' : 'bg-white border-slate-100 hover:border-primary hover:text-primary'}`}
                        >
                            Todos
                        </button>

                        <button
                            onClick={handleOffersChange}
                            className={`px-6 py-2.5 rounded-xl border text-sm font-semibold transition-all shadow-sm flex-shrink-0 ${isOffersOnly ? 'bg-amber-400 text-amber-950 border-amber-400' : 'bg-white border-slate-100 hover:border-amber-400 hover:text-amber-600'}`}
                        >
                            <div className="flex items-center gap-2">
                                <Star size={14} className={isOffersOnly ? "fill-amber-950" : "text-amber-500"} />
                                <span>Ofertas</span>
                            </div>
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

export default function CatalogPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        }>
            <CatalogContent />
        </Suspense>
    );
}
