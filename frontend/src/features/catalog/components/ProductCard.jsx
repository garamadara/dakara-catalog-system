export default function ProductCard({ product }) {

  return (
    <div className="border p-4 rounded">

      <img
        src={product.thumbnail}
        alt={product.name}
      />

      <h3>{product.name}</h3>

      <p>{product.part_number}</p>

      <p>{product.brand?.name}</p>

    </div>
  )
}
