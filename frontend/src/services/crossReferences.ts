import api from "../lib/api"

export function addCrossReferences(productId: number, refs: string[]) {

  return api.post(`/admin/products/${productId}/cross-references`, {
    references: refs
  })
}
