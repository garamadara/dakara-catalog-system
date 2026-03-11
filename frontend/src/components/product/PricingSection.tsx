export default function PricingSection({ form, setForm }: any) {

  function update(key: string, value: any) {
    setForm({ ...form, [key]: value });
  }

  return (

    <section className="grid grid-cols-12 gap-6">

      {/* LEFT TITLE */}

      <div className="col-span-3">

        <h3 className="text-sm font-semibold text-gray-900">
          Pricing
        </h3>

        <p className="text-xs text-gray-500 mt-1">
          Configure product pricing.
        </p>

      </div>

      {/* RIGHT CARD */}

      <div className="col-span-9 bg-white border border-gray-200 rounded-xl p-6">

        <div className="grid grid-cols-3 gap-6">

          {/* COST PRICE */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cost Price
            </label>

            <input
              type="number"
              className="
              w-full
              border
              border-gray-200
              rounded-md
              px-3
              py-2
              text-sm
              text-gray-800
              font-medium
              placeholder:text-gray-400
              focus:outline-none
              focus:ring-2
              focus:ring-green-500
              "
              placeholder="0.00"
              value={form.cost_price || ""}
              onChange={(e) => update("cost_price", e.target.value)}
            />

          </div>


          {/* SELLING PRICE */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selling Price
            </label>

            <input
              type="number"
              className="
              w-full
              border
              border-gray-200
              rounded-md
              px-3
              py-2
              text-sm
              text-gray-800
              font-medium
              placeholder:text-gray-400
              focus:outline-none
              focus:ring-2
              focus:ring-green-500
              "
              placeholder="0.00"
              value={form.selling_price || ""}
              onChange={(e) => update("selling_price", e.target.value)}
            />

          </div>


          {/* PROMO PRICE */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Promo Price
            </label>

            <input
              type="number"
              className="
              w-full
              border
              border-gray-200
              rounded-md
              px-3
              py-2
              text-sm
              text-gray-800
              font-medium
              placeholder:text-gray-400
              focus:outline-none
              focus:ring-2
              focus:ring-green-500
              "
              placeholder="0.00"
              value={form.promo_price || ""}
              onChange={(e) => update("promo_price", e.target.value)}
            />

          </div>

        </div>

      </div>

    </section>

  );

}