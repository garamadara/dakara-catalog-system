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
        <h3 className="text-sm font-semibold text-gray-900">
          Aliases
        </h3>
      </div>

      <div className="col-span-9 bg-white border rounded-xl p-6">

        <div className="flex gap-2 mb-3">

          <input
            className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm"
            value={aliasInput}
            onChange={(e) => setAliasInput(e.target.value)}
          />

          <button
            type="button"
            className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md font-medium"
            onClick={addAlias}
          >
            Add
          </button>

        </div>

        <div className="flex flex-wrap gap-2">

          {aliases.map((a: string, i: number) => (
            <span
              key={i}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
            >
              {a}
            </span>
          ))}

        </div>

      </div>

    </section>

  );
}