import { useState } from "react"

export default function ProductAutocomplete({ onSelect }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  async function handleSearch(value) {
    setQuery(value)

    if (!value) {
      setResults([])
      return
    }

    setLoading(true)

    const res = await fetch(`/api/catalog/search/suggest?q=${encodeURIComponent(value)}`)
    const data = await res.json()

    setResults(data)
    setLoading(false)
  }

  return (
    <div className="relative">
      <input
        type="text"
        className="border rounded p-2 w-full"
        placeholder="Search part number..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />

      {results.length > 0 && (
        <div className="absolute bg-white border rounded w-full mt-1 max-h-60 overflow-auto z-50">
          {results.map((product) => (
            <div
              key={product.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(product)
                setQuery("")
                setResults([])
              }}
            >
              <div className="font-medium">{product.part_number}</div>
              <div className="text-sm text-gray-500">{product.name}</div>
            </div>
          ))}
        </div>
      )}

      {loading && <div className="text-xs text-gray-500 mt-1">Searching...</div>}
    </div>
  )
}
