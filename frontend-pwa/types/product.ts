export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    videoUrl?: string;
    category?: {
        id: number;
        name: string;
    };
}
