import { useState } from "react"

export default function CrossReferenceSection({ form, setForm }: any) {

  const [partNumber, setPartNumber] = useState("")
  const [productId, setProductId] = useState("")

  function addReference() {

    if (!partNumber) return

    const newRef = {
      referenced_product_id: Number(productId) || null,
      part_number: partNumber
    }

    setForm({
      ...form,
      cross_refs: [...form.cross_refs, newRef]
    })

    setPartNumber("")
    setProductId("")
  }

  function removeReference(index: number) {

    const updated = [...form.cross_refs]
    updated.splice(index, 1)

    setForm({
      ...form,
      cross_refs: updated
    })

  }

  return (

    <section className="grid grid-cols-12 gap-6">

      {/* LEFT PANEL */}

      <div className="col-span-3">

        <h3 className="text-sm font-semibold text-gray-900">
          Cross References
        </h3>

        <p className="text-xs text-gray-500 mt-1">
          Add compatible or equivalent parts.
        </p>

      </div>

      {/* RIGHT CARD */}

      <div className="col-span-9 bg-white border border-gray-200 rounded-xl p-6 space-y-4">

        {/* ADD FORM */}

        <div className="grid grid-cols-12 gap-3">

          {/* PART NUMBER */}

          <div className="col-span-5">

            <input
              type="text"
              placeholder="Part number"
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
              className="
              w-full
              border
              border-gray-200
              rounded-md
              px-3
              py-2
              text-sm
              focus:outline-none
              focus:ring-2
              focus:ring-green-500
              "
            />

          </div>

          {/* PRODUCT ID */}

          <div className="col-span-5">

            <input
              type="text"
              placeholder="Product ID (optional)"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="
              w-full
              border
              border-gray-200
              rounded-md
              px-3
              py-2
              text-sm
              focus:outline-none
              focus:ring-2
              focus:ring-green-500
              "
            />

          </div>

          {/* ADD BUTTON */}

          <div className="col-span-2">

            <button
              type="button"
              onClick={addReference}
              className="
              w-full
              bg-green-600
              hover:bg-green-700
              text-white
              text-sm
              font-medium
              px-4
              py-2
              rounded-md
              transition
              "
            >
              Add
            </button>

          </div>

        </div>

        {/* LIST */}

        {form.cross_refs?.length > 0 && (

          <div className="border border-gray-200 rounded-md divide-y">

            {form.cross_refs.map((ref: any, index: number) => (

              <div
                key={index}
                className="flex justify-between items-center px-4 py-2 text-sm"
              >

                <div className="text-gray-700">

                  {ref.part_number}

                  {ref.referenced_product_id && (
                    <span className="text-gray-400 ml-2">
                      (Product #{ref.referenced_product_id})
                    </span>
                  )}

                </div>

                <button
                  type="button"
                  onClick={() => removeReference(index)}
                  className="text-red-500 hover:text-red-600 text-xs"
                >
                  Remove
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </section>

  )

}