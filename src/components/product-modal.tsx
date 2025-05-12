"use client";

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { Product } from "@/types/product"
import PriceFormatInput from "@/components/input-format-price"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const productSchema = z.object({
    name: z.string()
      .min(3, "Nome deve ter pelo menos 3 caracteres")
      .max(50, "Nome deve ter no máximo 50 caracteres"),
    description: z.string()
      .min(10, "Descrição deve ter pelo menos 10 caracteres")
      .max(500, "Descrição deve ter no máximo 500 caracteres"),
    price: z.string()
      .min(1, "Preço é obrigatório")
      .refine((val) => parseFloat(val) > 0, "Preço deve ser maior que zero"),
    category: z.string()
      .min(1, "Categoria é obrigatória")
      .max(30, "Categoria deve ter no máximo 30 caracteres"),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: any) => void;
    product?: Product;
    mode?: 'create' | 'edit';
}

export function ProductModal({ 
    open, 
    onOpenChange, 
    onSave, 
    product,
    mode = 'create'
}: ProductModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        watch
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            description: "",
            price: "",
            category: ""
        }
    });

    useEffect(() => {
        if (product && mode === 'edit') {
            // Se editar produto atualiza o formulário
            reset({
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                category: product.category
            });
        } else {
            // Limpa o formulário quando não há produto
            reset({
                name: "",
                description: "",
                price: "",
                category: ""
            });
        }
    }, [product, mode, reset]);

    const onSubmitForm = (data: ProductFormData) => {
        onSave(data);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create' ? 'Novo Produto' : 'Editar Produto'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create' ? 'Preencha os Dados do novo produto' : 'Atualize os dados do produto'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmitForm)} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Nome
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="name"
                                {...register("name")}
                                className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && (
                                <span className="text-sm text-red-500">{errors.name.message}</span>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Descrição
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="description"
                                {...register("description")}
                                className={errors.description ? "border-red-500" : ""}
                            />
                            {errors.description && (
                                <span className="text-sm text-red-500">{errors.description.message}</span>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Preço
                        </Label>
                        <div className="col-span-3">
                            <PriceFormatInput
                                id="price"
                                value={watch("price")}
                                onValueChange={(values) => {
                                    setValue("price", values.value, { shouldValidate: true });
                                }}
                                className={errors.price ? "border-red-500" : ""}
                                decimalScale={2}
                                fixedDecimalScale
                                prefix="R$ "
                                decimalSeparator=","
                                thousandSeparator="."
                                allowNegative={false}
                                placeholder="R$ 0,00"
                            />
                            {errors.price && (
                                <span className="text-sm text-red-500">{errors.price.message}</span>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                            Categoria
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="category"
                                {...register("category")}
                                className={errors.category ? "border-red-500" : ""}
                            />
                            {errors.category && (
                                <span className="text-sm text-red-500">{errors.category.message}</span>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {mode === 'create' ? 'Criar Produto' : 'Salvar Alterações'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}