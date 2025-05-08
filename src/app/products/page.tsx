"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { getProducts } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);

    async function fetchProducts() {
        const data = await getProducts();
        setProducts(data);
    }

    useEffect(() => {
        fetchProducts();
    }, );

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">Produtos</h1>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                        Novo Produto
                    </Button>
                </div>
                <Input
                    placeholder="Buscar produtos..."
                    className="mb-6 max-w-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50 hover:bg-gray-50">
                                <TableHead className="font-semibold text-gray-700">Nome</TableHead>
                                <TableHead className="font-semibold text-gray-700">Descrição</TableHead>
                                <TableHead className="font-semibold text-gray-700">Preço</TableHead>
                                <TableHead className="font-semibold text-gray-700">Categoria</TableHead>
                                <TableHead className="font-semibold text-gray-700">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map(product => (
                            <TableRow 
                                key={product.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell className="text-gray-600">{product.description}</TableCell>
                                <TableCell className="font-medium text-green-600">R$ {product.price.toFixed(2)}</TableCell>
                                <TableCell className="text-gray-600">{product.category}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                        >
                                            Editar
                                        </Button>
                                        <Button 
                                            variant="destructive" 
                                            size="sm"
                                            className="hover:bg-red-50 hover:text-red-600 transition-colors"
                                        >
                                            Excluir
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}