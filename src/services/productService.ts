import { Product } from "@/types/product";
import { api } from "./api";

export const productService = {
    async getAll(): Promise<Product[]> {
        const response = await api.get('/products');
        return response.data;
    },

    async create(product: Omit<Product, 'id'>): Promise<Product> {
        const response = await api.post('/products', product);
        return response.data.data;
    },

    async update(id: string, product: Partial<Product>): Promise<Product> {
        const response = await api.put(`/products/${id}`, product);
        return response.data.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/products/${id}`);
    }
}; 