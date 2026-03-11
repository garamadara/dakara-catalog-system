import api from "../lib/api";

export async function getBrands() {
  const res = await api.get("/admin/brands");
  return res.data;
}