"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "sonner";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    Column,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Loader2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProductModal } from "@/components/product-modal";
import { useProducts } from "@/hooks/useProducts";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";

export default function ProductsPage() {
    const router = useRouter();
    const { 
        products, 
        isLoading, 
        error, 
        fetchProducts, 
        createProduct, 
        updateProduct, 
        deleteProduct 
    } = useProducts();
    
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSave = async (data: any) => {
        try {
            if (modalMode === 'create') {
                await createProduct(data);
            } else if (modalMode === 'edit' && selectedProduct) {
                await updateProduct(selectedProduct.id, data);
            }
    
            toast.success(`Produto ${modalMode === 'create' ? 'criado' : 'atualizado'} com sucesso!`);
            setIsModalOpen(false);
    
        } catch (error: any) {
            console.error('Erro ao salvar produto:', error);
    
            let errorList: string[] = [];
    
            if (error?.response?.data?.errors) {
                const rawErrors = error.response.data.errors;
    
                // Garante que cada valor seja uma string (por exemplo, vindo de um array de strings)
                errorList = Object.values(rawErrors)
                    .flat()
                    .filter((msg): msg is string => typeof msg === 'string');
            }
    
            if (errorList.length === 0) {
                errorList = ['Ocorreu um erro ao salvar o produto.'];
            }
    
            toast.error("Erro ao salvar produto", {
                description: (
                    <ul className="list-disc list-inside space-y-1">
                        {errorList.map((err, index) => (
                            <li key={index}>{err}</li>
                        ))}
                    </ul>
                ),
            });
        }
    };
    


    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedProduct(undefined);
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        setProductToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;

        try {
            await deleteProduct(productToDelete);
            toast.success("Produto excluído com sucesso!");
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            toast.error("Erro ao excluir produto");
        } finally {
            setDeleteDialogOpen(false);
            setProductToDelete(null);
        }
    };

    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: "name",
            header: ({ column }: { column: Column<Product> }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Nome
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "description",
            header: ({ column }: { column: Column<Product> }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
                    >
                        Descrição
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            }
        },
        {
            accessorKey: "price",
            header: ({ column }: { column: Column<Product> }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Preço
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }: { row: any }) => {
                const price = parseFloat(row.getValue("price"));
                return (
                    <div className="font-medium text-green-600">
                        {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }).format(price)}
                    </div>
                );
            },
        },
        {
            accessorKey: "category",
            header: "Categoria",
        },
        {
            id: "actions",
            header: "Ações",
            cell: ({ row }: { row: any }) => {
                const product = row.original;
                return (
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            onClick={() => handleEdit(product)}
                        >
                            Editar
                        </Button>
                        <Button 
                            variant="destructive" 
                            size="sm"
                            className="hover:bg-red-50 hover:text-red-600 transition-colors"
                            onClick={() => handleDelete(product.id)}
                        >
                            Excluir
                        </Button>
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data: products || [],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });



    return (
        <div className="container mx-auto py-10 px-4 relative">
            {isLoading && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-1001">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
            )}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Produtos</h1>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer"
                            onClick={handleCreate}
                        >
                            Novo Produto
                        </Button>
                    </div>
                </div>
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Buscar produtos..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto cursor-pointer">
                                Colunas <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value: boolean) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="bg-gray-50 dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="font-semibold text-gray-700 dark:text-gray-300">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="dark:text-gray-300">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center dark:text-gray-300"
                                    >
                                        Nenhum produto encontrado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="space-x-2">
                        <Button
                            className="cursor-pointer"
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Anterior
                        </Button>
                        <Button
                            className="cursor-pointer"
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Próximo
                        </Button>
                    </div>
                </div>
            </div>
            <ProductModal 
                open={isModalOpen} 
                onOpenChange={setIsModalOpen}
                onSave={handleSave}
                product={selectedProduct}
                mode={modalMode}
            />
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}