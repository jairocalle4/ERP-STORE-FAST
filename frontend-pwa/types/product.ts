export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    sku: string;
    isActive: boolean;
    videoUrl?: string;
    category?: {
        id: number;
        name: string;
    };
    images: {
        id: number;
        url: string;
        isCover: boolean;
        order: number;
    }[];
    discountPercentage?: number;
}
