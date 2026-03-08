export default function DescriptionSection({ form, setForm }: any) {
  function update(key: string, value: any) {
    setForm({ ...form, [key]: value });
  }

  return (
    <section className="grid grid-cols-12 gap-6">
      <div className="col-span-3">
        <h3 className="text-sm font-semibold">Description</h3>

        <p className="text-xs text-gray-500">Edit product descriptions.</p>
      </div>

      <div className="col-span-9 bg-white border rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4">
          <textarea
            className="input h-28"
            placeholder="Internal description"
            value={form.description || ""}
            onChange={(e) => update("description", e.target.value)}
          />

          <textarea
            className="input h-28"
            placeholder="Public description"
            value={form.public_description || ""}
            onChange={(e) => update("public_description", e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}

