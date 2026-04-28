import api from "../lib/api";

export async function getBrands() {
  const res = await api.get("/admin/brands");
  return res.data;
}

export async function getBrand(id: number) {
  const res = await api.get(`/admin/brands/${id}`);
  return res.data;
}

export async function createBrand(payload: FormData | any) {
  const res = await api.post("/admin/brands", payload);
  return res.data;
}

export async function updateBrand(id: number, payload: FormData | any) {
  const res = await api.post(`/admin/brands/${id}?_method=PUT`, payload);
  return res.data;
}

export async function deleteBrand(id: number) {
  const res = await api.delete(`/admin/brands/${id}`);
  return res.data;
}
