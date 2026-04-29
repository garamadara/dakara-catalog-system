import api from "../lib/api";

export async function getCategories() {
  const res = await api.get("/admin/categories");
  return res.data;
}

export async function getCategory(id: number) {
  const res = await api.get(`/admin/categories/${id}`);
  return res.data;
}

export async function createCategory(payload: FormData | any) {
  const res = await api.post("/admin/categories", payload);
  return res.data;
}

export async function updateCategory(id: number, payload: FormData | any) {
  const res = await api.post(`/admin/categories/${id}?_method=PUT`, payload);
  return res.data;
}

export async function deleteCategory(id: number) {
  const res = await api.delete(`/admin/categories/${id}`);
  return res.data;
}
