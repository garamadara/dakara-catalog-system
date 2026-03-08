import api from "../lib/api"

export function uploadProductImage(productId: number, file: File) {

  const form = new FormData()

  form.append("image", file)

  return api.post(`/admin/products/${productId}/images`, form, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}
