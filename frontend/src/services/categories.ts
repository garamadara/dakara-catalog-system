import api from "../lib/api"

export function getCategories() {
  return api.get("/admin/categories").then(res => res.data)
}
