import api from "../lib/api";

export async function getCategories() {
  const res = await api.get("/admin/categories");
  return res.data;
}