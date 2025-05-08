import axios from "axios";
import { Product } from "@/types/product";

const API_URL = "http://127.0.0.1:8000/api/v1";

export async function getProducts(query?: string): Promise<Product[]> {
    const url = query ? `${API_URL}/products?search=${query}` : `${API_URL}/products`;
    const response = await axios.get(url);
    return response.data;
}