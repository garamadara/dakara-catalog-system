import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

export default function useProducts() {
  const [searchParams] = useSearchParams()

  const [products, setProducts] = useState([])
  const [meta, setMeta] = useState({})

  const page = searchParams.get("page") || 1
  const search = searchParams.get("search") || ""
  const brand = searchParams.get("brand") || ""

  useEffect(() => {
    const params = new URLSearchParams({
      page,
      search,
      brand
    })

    fetch(`/api/catalog/products?${params}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.data)
        setMeta(data.meta)
      })

  }, [page, search, brand])

  return { products, meta }
}
