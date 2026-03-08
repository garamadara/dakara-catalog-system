import { useState } from "react";

export default function CrossReferenceSection({ form, setForm }: any) {
  const [input, setInput] = useState("");

  const refs = form.cross_refs || [];

  function addRef() {
    if (!input) return;

    setForm({
      ...form,
      cross_refs: [...refs, input],
    });

    setInput("");
  }

  return (
    <section className="grid grid-cols-12 gap-6">
      <div className="col-span-3">
        <h3 className="text-sm font-semibold">Cross References</h3>
      </div>

      <div className="col-span-9 bg-white border rounded-lg p-6">
        <div className="flex gap-2 mb-3">
          <input
            className="input flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            type="button"
            className="bg-gray-800 text-white px-4 rounded"
            onClick={addRef}
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {refs.map((r: string, i: number) => (
            <span key={i} className="px-3 py-1 bg-gray-200 text-xs rounded">
              {r}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

