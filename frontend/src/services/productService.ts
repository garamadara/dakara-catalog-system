import api from "@/lib/api"

export async function createProduct(data) {
  return api.post("/admin/products", data)
}

export async function uploadProductImage(productId, file) {
  const form = new FormData()
  form.append("image", file)

  return api.post(`/admin/products/${productId}/images`, form)
}

export async function attachAttributes(productId, attributes) {
  return api.post(`/admin/products/${productId}/attributes`, {
    attributes
  })
}

export async function addAliases(productId, aliases) {
  return api.post(`/admin/products/${productId}/aliases`, {
    aliases
  })
}

export async function addCrossReferences(productId, refs) {
  return api.post(`/admin/products/${productId}/cross-references`, {
    references: refs
  })
}
