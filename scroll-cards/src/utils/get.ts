import type { Product } from "@/types";

export const getProducts = async (state: any) => {
  try {
    const response = await fetch('products.json');
    const data: Product[] = await response.json();
    state.value.products = data;
    return data;
  } catch (error) {
    console.error("❌ Error fetching products", error);
    return [];
  }
}