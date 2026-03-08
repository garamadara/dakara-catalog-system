import { useSearchParams } from "react-router-dom"

export default function Pagination({ meta }) {

  const [searchParams, setSearchParams] = useSearchParams()

  const changePage = (page) => {
    searchParams.set("page", page)
    setSearchParams(searchParams)
  }

  return (
    <div className="flex gap-4">

      <button
        disabled={meta.current_page === 1}
        onClick={() => changePage(meta.current_page - 1)}
      >
        Prev
      </button>

      <span>
        {meta.current_page} / {meta.last_page}
      </span>

      <button
        disabled={meta.current_page === meta.last_page}
        onClick={() => changePage(meta.current_page + 1)}
      >
        Next
      </button>

    </div>
  )
}
