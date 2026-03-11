export default function BasicInfoSection({ form, setForm }: any) {

  function update(key: string, value: any) {
    setForm({ ...form, [key]: value });
  }

  return (
    <section className="grid grid-cols-12 gap-6">

      <div className="col-span-3">
        <h3 className="text-sm font-semibold">Basic Info</h3>

        <p className="text-xs text-gray-500">
          Enter product basic information.
        </p>
      </div>

      <div className="col-span-9 bg-white border rounded-lg p-6">

        <div className="grid grid-cols-12 gap-4">

          {/* Row 1 — Product Name */}

          <div className="col-span-12">
            <label className="label">Product Name *</label>

            <input
              className="input"
              placeholder="Example: STIHL MS-252 Chain Saw 16 inch"
              value={form.name || ""}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>


          {/* Row 2 */}

          <div className="col-span-5">
            <label className="label">Category *</label>

            <select
              className="input"
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
            <label className="label">Brand</label>

           <select
              className="input"
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
            <label className="label">Part Number</label>

            <input
              className="input"
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