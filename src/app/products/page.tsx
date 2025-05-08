"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { getProducts } from "@/services/api";
import { Button } from "@/components/ui/button";
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
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Log quando os produtos são atualizados
    useEffect(() => {
        console.log('Produtos:', products);
    }, [products]);

    // Log quando o estado da tabela muda
    useEffect(() => {
        console.log('Estado da tabela:', {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection
        });
    }, [sorting, columnFilters, columnVisibility, rowSelection]);

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
            header: "Descrição",
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
                return <div className="font-medium text-green-600">R$ {price.toFixed(2)}</div>;
            },
        },
        {
            accessorKey: "category",
            header: "Categoria",
        },
        {
            id: "actions",
            cell: ({ row }: { row: any }) => {
                const product = row.original;
                return (
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
                );
            },
        },
    ];

    const table = useReactTable({
        data: products,
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

    async function fetchProducts() {
        const data = await getProducts();
        setProducts(data);
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Produtos</h1>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                            Novo Produto
                        </Button>
                    </div>
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
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Anterior
                        </Button>
                        <Button
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
        </div>
    );
}