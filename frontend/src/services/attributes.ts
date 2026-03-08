import api from "../lib/api"

export async function getAttributes() {

  const res = await api.get("/admin/attributes")

  return res.data.data

}
