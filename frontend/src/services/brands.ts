import api from "../lib/api"

export function getBrands() {
  return api.get("/admin/brands").then(res => res.data)
}
