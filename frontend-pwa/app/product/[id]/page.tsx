import { Metadata } from 'next';
import ProductDetailsClient from '@/components/ProductDetailsClient';

type Props = {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { id } = await params;

    try {
        const res = await fetch(`http://localhost:5140/api/v1/products/${id}`);
        if (!res.ok) return { title: "Producto no encontrado" };

        const product = await res.json();
        const imageUrl = product.images?.find((img: any) => img.isCover)?.url || product.images?.[0]?.url;

        return {
            title: product.name,
            description: product.description?.substring(0, 160) || "Detalles del producto",
            openGraph: {
                title: product.name,
                description: product.description?.substring(0, 160) || "Detalles del producto",
                images: imageUrl ? [imageUrl] : [],
                url: `https://faststore.dominioprueba.com/product/${id}`,
                type: 'website',
            },
            twitter: {
                card: "summary_large_image",
                title: product.name,
                description: product.description?.substring(0, 160) || "Detalles del producto",
                images: imageUrl ? [imageUrl] : [],
            },
        };
    } catch (error) {
        return {
            title: "Producto no encontrado",
            description: "No pudimos encontrar el producto que buscas.",
        };
    }
}

export default async function Page({ params }: Props) {
    const { id } = await params;
    return <ProductDetailsClient id={id} />;
}
