import { client } from "../lib/client";

export interface Product {
  id: number
  name: string
  part_number: string
  slug: string
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

export function updateProduct(id: number, data: any) {
  return client.put(`/admin/products/${id}`, data)
}

export function deleteProduct(id: number) {
  return client.delete(`/admin/products/${id}`)
}
/* GET SINGLE PRODUCT */

export function getProduct(slug: string): Promise<Product> {
  return client
    .get<{ data: Product }>(`/catalog/products/${slug}`)
    .then(res => res.data);
}

/* CREATE */

export function createProduct(data: {
    name: string
    part_number: string
    brand_id: number
  }) {
    return client.post("/admin/products", data)
}

/* UPLOAD PRODUCT IMAGE */

export async function uploadProductImage(productId: number, file: File) {
  const form = new FormData()
  form.append("image", file)

  const res = await fetch(
    `http://127.0.0.1:8000/api/admin/products/${productId}/images`,
    {
      method: "POST",
      body: form
    }
  )

  if (!res.ok) {
    const text = await res.text()
    console.error(text)
    throw new Error("Upload failed")
  }

  return res.json()
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