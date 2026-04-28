import { client } from "../lib/client";

export interface Product {
  id: number
  name: string
  slug: string
  selling_price: number
  status: "draft" | "published"
  variants?: {
    id: number
    sku: string | null
    part_number: string | null
    cost_price: number | null
    selling_price: number | null
    promo_price: number | null
    stock: number
  }[]

  thumbnail?: {
    image_url: string
  }

  categories?: {
    id: number
    name: string
  }[]
}

interface PaginatedProductsResponse {
  data: Product[]
}

export interface CreateProductPayload {
  name: string
  part_number?: string
  brand_id?: number | null
}

/* GET PRODUCTS */

export async function getProducts(search?: string): Promise<Product[]> {
  const url = search
    ? `/admin/products?search=${encodeURIComponent(search)}`
    : `/admin/products`;

  const res = await client.get(url) as PaginatedProductsResponse | Product[];

  if (Array.isArray(res)) {
    return res;
  }

  return res.data ?? [];
}

/* UPDATE */

export function updateProduct(id: number, data: any) {
  return client.put(`/admin/products/${id}`, data);
}

/* DELETE */

export function deleteProduct(id: number) {
  return client.delete(`/admin/products/${id}`);
}

/* GET SINGLE PRODUCT */

export async function getProduct(idOrSlug: number | string): Promise<Product> {
  return client.get(`/admin/products/${idOrSlug}/edit`);
}

/* CREATE */

export function createProduct(data: {
  name: string
  category_id: number
  brand_id?: number | null
  part_number?: string | null
  cost_price?: number | null
  selling_price: number
  promo_price?: number | null
  status?: "draft" | "published"
  variants?: {
    sku?: string | null
    part_number?: string | null
    cost_price?: number | null
    selling_price?: number | null
    promo_price?: number | null
    stock?: number
  }[]
}) {
  return client.post("/admin/products", data);
}

/* UPLOAD PRODUCT IMAGE */

export async function uploadProductImage(productId: number | string, file: File) {

  const form = new FormData();
  form.append("image", file);

  const res = await fetch(
    `http://127.0.0.1:8000/api/admin/products/${productId}/images`,
    {
      method: "POST",
      body: form
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error(text);
    throw new Error("Upload failed");
  }

  return res.json();
}

/* ATTACH ATTRIBUTES */

export function attachAttributes(productId: number, attributes: any[]) {

  return client.post(`/admin/products/${productId}/attributes`, {
    attributes
  });

}

/* ADD ALIASES */

export function addAliases(productId: number, aliases: string[]) {

  return client.post(`/admin/products/${productId}/aliases`, {
    aliases
  });

}

/* ADD CROSS REFERENCES */

export function addCrossReferences(productId: number, references: any[]) {

  return client.post(`/admin/products/${productId}/cross-references`, {
    references
  });

}

/* ADD VARIANTS */

export function addVariants(productId: number, variants: {
  sku?: string | null
  part_number?: string | null
  cost_price?: number | null
  selling_price?: number | null
  promo_price?: number | null
  stock?: number
}[]) {
  return client.post(`/admin/products/${productId}/variants`, { variants });
}
