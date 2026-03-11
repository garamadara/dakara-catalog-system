import { useEffect } from "react"
import { useQuill } from "react-quilljs"
import "quill/dist/quill.snow.css"

export default function DescriptionSection({ form, setForm }: any) {

  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules: {
      toolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"]
      ]
    }
  })

  function update(key: string, value: any) {
    setForm(prev => ({
      ...prev,
      [key]: value
    }))
  }

  useEffect(() => {

  if (!quill) return

  const handler = () => {
    setForm(prev => ({
      ...prev,
      public_description: quill.root.innerHTML
    }))
  }

  quill.on("text-change", handler)

  return () => {
    quill.off("text-change", handler)
  }

}, [quill])

  return (

    <section className="grid grid-cols-12 gap-6">

      {/* LEFT SIDE */}

      <div className="col-span-3">

        <h3 className="text-sm font-semibold text-gray-900">
          Description
        </h3>

        <p className="text-xs text-gray-500 mt-1">
          Edit product descriptions.
        </p>

      </div>

      {/* RIGHT CARD */}

      <div className="col-span-9 bg-white border border-gray-200 rounded-xl p-6">

        <div className="space-y-6">

          {/* INTERNAL DESCRIPTION */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Internal description
            </label>

            <textarea
              className="
              w-full
              border
              border-gray-200
              rounded-md
              px-3
              py-2
              text-sm
              h-40
              focus:outline-none
              focus:ring-2
              focus:ring-green-500
              "
              value={form.description || ""}
              onChange={(e) => update("description", e.target.value)}
            />

          </div>

          {/* PUBLIC DESCRIPTION */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Public description
            </label>

            <div
              ref={quillRef}
              className="
              bg-white
              border
              border-gray-200
              rounded-md
              min-h-[200px]
              "
            />

          </div>

        </div>

      </div>

    </section>

  )

}