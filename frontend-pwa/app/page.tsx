"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:5140/api/v1/products");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">ERP Store Fast</h1>
          <nav className="space-x-4">
            <span className="text-gray-500 hover:text-gray-900 cursor-pointer">Shop</span>
            <span className="text-gray-500 hover:text-gray-900 cursor-pointer">Cart (0)</span>
          </nav>
        </div>
      </header>

      {/* Hero Section (Optional) */}
      <div className="bg-indigo-600 text-white py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold mb-4">Summer Collection 2026</h2>
          <p className="text-xl opacity-90">The best products at the best prices.</p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Featured Products</h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg shadow">
              <p className="text-gray-500 text-lg">No products found in the catalog.</p>
              <p className="text-sm text-gray-400 mt-2">Try seeding the database.</p>
            </div>
          )
        )}
      </div>
    </main>
  );
}
