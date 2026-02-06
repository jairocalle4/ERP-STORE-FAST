import { useState } from 'react';
import { Product } from '@/types/product';
import { Play } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="border rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 bg-white flex flex-col h-full group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-400 overflow-hidden">
                {product.videoUrl && isHovered ? (
                    <video
                        src={product.videoUrl}
                        autoPlay
                        muted
                        loop
                        className="h-full w-full object-cover rounded-md"
                    />
                ) : product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover rounded-md transition-transform duration-500 group-hover:scale-105" />
                ) : (
                    <span>No Image</span>
                )}

                {product.videoUrl && !isHovered && (
                    <div className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full">
                        <Play size={14} fill="white" />
                    </div>
                )}
            </div>
            <div className="flex-grow">
                <p className="text-xs text-blue-600 font-semibold mb-1 uppercase">{product.category?.name || 'Varios'}</p>
                <h3 className="font-bold text-lg mb-2 text-gray-900">{product.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{product.description}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                    Add
                </button>
            </div>
        </div>
    );
}
