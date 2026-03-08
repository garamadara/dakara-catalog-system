export default function PricingSection({ form, setForm }: any) {
  function update(key: string, value: any) {
    setForm({ ...form, [key]: value });
  }

  return (
    <section className="grid grid-cols-12 gap-6">
      <div className="col-span-3">
        <h3 className="text-sm font-semibold">Pricing</h3>

        <p className="text-xs text-gray-500">Configure product pricing.</p>
      </div>

      <div className="col-span-9 bg-white border rounded-lg p-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">Cost Price</label>
            <input
              className="input"
              value={form.cost_price || ""}
              onChange={(e) => update("cost_price", e.target.value)}
            />
          </div>

          <div>
            <label className="label">Selling Price</label>
            <input
              className="input"
              value={form.selling_price || ""}
              onChange={(e) => update("selling_price", e.target.value)}
            />
          </div>

          <div>
            <label className="label">Promo Price</label>
            <input
              className="input"
              value={form.promo_price || ""}
              onChange={(e) => update("promo_price", e.target.value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

