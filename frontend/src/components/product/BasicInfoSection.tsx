export default function BasicInfoSection({ form, setForm }: any) {

  function update(key: string, value: any) {
    setForm({ ...form, [key]: value });
  }

  return (
    <section className="grid grid-cols-12 gap-6">

      <div className="col-span-3">
        <h3 className="text-sm font-semibold text-gray-900">
          Basic Info
        </h3>

        <p className="text-xs text-gray-500 mt-1">
          Enter product basic information.
        </p>
      </div>

      <div className="col-span-9 bg-white border rounded-xl p-6">

        <div className="grid grid-cols-12 gap-4">

          <div className="col-span-12">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>

            <input
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Example: STIHL MS-252 Chain Saw 16 inch"
              value={form.name || ""}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>

          <div className="col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>

            <select
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              value={form.category_id ?? ""}
              onChange={(e) =>
                update("category_id", e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">Select category</option>

              {(form.categories || []).map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>

            <select
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              value={form.brand_id ?? ""}
              onChange={(e) =>
                update("brand_id", e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">No brand</option>

              {(form.brands || []).map((b: any) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Part Number
            </label>

            <input
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              placeholder="Optional"
              value={form.part_number || ""}
              onChange={(e) => update("part_number", e.target.value)}
            />
          </div>

        </div>

      </div>

    </section>
  );
}