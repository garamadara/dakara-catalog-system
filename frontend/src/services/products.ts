import { client } from "../lib/client";

export interface Product {
  id: number;
  name: string;
  part_number: string;
  slug: string;
}

export interface CreateProductPayload {
  name: string;
  part_number?: string;
  brand_id?: number | null;
}

/* GET PRODUCTS */

export function getProducts(search?: string): Promise<Product[]> {

  const url = search
    ? `/catalog/products?search=${encodeURIComponent(search)}`
    : `/catalog/products`;

  return client
    .get<{ data: Product[] }>(url)
    .then(res => res.data);
}

/* GET SINGLE PRODUCT */

export function getProduct(slug: string): Promise<Product> {
  return client
    .get<{ data: Product }>(`/catalog/products/${slug}`)
    .then(res => res.data);
}

/* CREATE */

export function createProduct(data: CreateProductPayload) {
  return client.post("/catalog/products", data);
}

/* UPDATE */

export function updateProduct(slug: string, data: any) {
  return client.put(`/catalog/products/${slug}`, data);
}

/* DELETE */

export function deleteProduct(id: number) {
  return client.delete(`/catalog/products/${id}`);
}