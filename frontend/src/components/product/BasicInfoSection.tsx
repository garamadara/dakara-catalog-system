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
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">Product Name</label>
            <input
              className="input"
              value={form.name || ""}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>

          <div>
            <label className="label">Part Number</label>
            <input
              className="input"
              value={form.part_number || ""}
              onChange={(e) => update("part_number", e.target.value)}
            />
          </div>

          <div>
            <label className="label">Barcode</label>
            <input
              className="input"
              value={form.barcode || ""}
              onChange={(e) => update("barcode", e.target.value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

