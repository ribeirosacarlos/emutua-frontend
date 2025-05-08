import { useState, useCallback } from 'react';
import { Product } from '@/types/product';
import { productService } from '@/services/productService';

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await productService.getAll();
            setProducts(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Erro ao carregar produtos'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createProduct = useCallback(async (product: Omit<Product, 'id'>) => {
        try {
            setIsLoading(true);
            setError(null);
            const newProduct = await productService.create(product);
            setProducts(prev => [...prev, newProduct]);
            return newProduct;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Erro ao criar produto'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateProduct = useCallback(async (id: number, product: Partial<Product>) => {
        try {
            setIsLoading(true);
            setError(null);
            const updatedProduct = await productService.update(id, product);
            setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
            return updatedProduct;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Erro ao atualizar produto'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteProduct = useCallback(async (id: number) => {
        try {
            setIsLoading(true);
            setError(null);
            await productService.delete(id);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Erro ao excluir produto'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        products,
        isLoading,
        error,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct
    };
} 