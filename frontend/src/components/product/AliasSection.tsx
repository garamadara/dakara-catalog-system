import { useState } from "react";

export default function AliasSection({ form, setForm }: any) {
  const [aliasInput, setAliasInput] = useState("");

  const aliases = form.aliases || [];

  function addAlias() {
    if (!aliasInput) return;

    setForm({
      ...form,
      aliases: [...aliases, aliasInput],
    });

    setAliasInput("");
  }

  return (
    <section className="grid grid-cols-12 gap-6">
      <div className="col-span-3">
        <h3 className="text-sm font-semibold">Aliases</h3>
      </div>

      <div className="col-span-9 bg-white border rounded-lg p-6">
        <div className="flex gap-2 mb-3">
          <input
            className="input flex-1"
            value={aliasInput}
            onChange={(e) => setAliasInput(e.target.value)}
          />

          <button
            type="button"
            className="bg-gray-800 text-white px-4 rounded"
            onClick={addAlias}
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {aliases.map((a: string, i: number) => (
            <span key={i} className="px-3 py-1 bg-gray-200 text-xs rounded">
              {a}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

