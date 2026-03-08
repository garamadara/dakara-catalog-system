import { useSearchParams } from "react-router-dom"
import { useState } from "react"

export default function SearchBar() {

  const [searchParams, setSearchParams] = useSearchParams()
  const [value, setValue] = useState(searchParams.get("search") || "")

  const handleSubmit = e => {
    e.preventDefault()

    searchParams.set("search", value)
    searchParams.set("page", 1)

    setSearchParams(searchParams)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Search part number..."
      />
    </form>
  )
}
