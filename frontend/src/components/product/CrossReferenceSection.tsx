import { useState } from "react";

export default function CrossReferenceSection({ form, setForm }: any) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const refs = form.cross_refs || [];

  async function search(value: string) {
    setQuery(value);

    if (!value) {
      setResults([]);
      return;
    }

    const res = await fetch(`/api/catalog/search/suggest?q=${value}`);
    const data = await res.json();

    setResults(data);
  }

  function addRef(product: any) {

    // prevent duplicates
    if (refs.find((r: any) => r.referenced_product_id === product.id)) {
      return;
    }

    setForm({
      ...form,
      cross_refs: [
        ...refs,
        {
          referenced_product_id: product.id,
          part_number: product.part_number,
        },
      ],
    });

    setQuery("");
    setResults([]);
  }

  function removeRef(index: number) {
    const newRefs = [...refs];
    newRefs.splice(index, 1);

    setForm({
      ...form,
      cross_refs: newRefs,
    });
  }

  return (
    <section className="grid grid-cols-12 gap-6">

      <div className="col-span-3">
        <h3 className="text-sm font-semibold">Cross References</h3>
      </div>

      <div className="col-span-9 bg-white border rounded-lg p-6">

        {/* Search input */}
        <input
          className="input w-full mb-3"
          placeholder="Search part number..."
          value={query}
          onChange={(e) => search(e.target.value)}
        />

        {/* dropdown */}
        {results.length > 0 && (
          <div className="border rounded mb-4 bg-white">
            {results.map((p: any) => (
              <div
                key={p.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => addRef(p)}
              >
                <div className="font-medium">{p.part_number}</div>
                <div className="text-xs text-gray-500">{p.name}</div>
              </div>
            ))}
          </div>
        )}

        {/* selected references */}
        <div className="flex flex-wrap gap-2">
          {refs.map((r: any, i: number) => (
            <span
              key={i}
              className="px-3 py-1 bg-gray-200 text-xs rounded flex items-center gap-2"
            >
              {r.part_number}

              <button
                type="button"
                className="text-red-500"
                onClick={() => removeRef(i)}
              >
                ✕
              </button>
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}