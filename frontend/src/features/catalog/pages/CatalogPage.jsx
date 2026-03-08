import useProducts from "../hooks/useProducts"
import ProductCard from "../components/ProductCard"
import Pagination from "../components/Pagination"
import SearchBar from "../components/SearchBar"

export default function CatalogPage() {

  const { products, meta } = useProducts()

  return (
    <div className="space-y-6">

      <SearchBar />

      <div className="grid grid-cols-4 gap-6">

        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}

      </div>

      <Pagination meta={meta} />

    </div>
  )
}
