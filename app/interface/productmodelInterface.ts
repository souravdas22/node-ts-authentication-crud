export interface ProductInterface{
    name: string;
    price: number;
    size: string[];   
    color: string[];
    brand: string;
    description: string;
    image?: string;
    deleted?: boolean;
}