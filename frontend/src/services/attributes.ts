import api from "../lib/api"

export async function getAttributes() {
  const res = await api.get("/admin/attributes")

  return res.data

}

export async function getAttribute(id: number) {
  const res = await api.get(`/admin/attributes/${id}`);
  return res.data;
}

export async function createAttribute(payload: any) {
  const res = await api.post("/admin/attributes", payload);
  return res.data;
}

export async function updateAttribute(id: number, payload: any) {
  const res = await api.put(`/admin/attributes/${id}`, payload);
  return res.data;
}

export async function deleteAttribute(id: number) {
  const res = await api.delete(`/admin/attributes/${id}`);
  return res.data;
}
