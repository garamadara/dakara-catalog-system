import api from "../lib/api"

export function addAliases(productId: number, aliases: string[]) {

  return api.post(`/admin/products/${productId}/aliases`, {
    aliases
  })
}
