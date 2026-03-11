import { useQuery } from "@tanstack/react-query";
import { getAttributes } from "../../services/attributes";
import { useState } from "react";

export default function AttributeSection({ form, setForm }: any) {

  const { data: attributes } = useQuery({
    queryKey: ["attributes"],
    queryFn: getAttributes,
  });

  const values = form.attribute_values || {};

  const [selectedAttr, setSelectedAttr] = useState("");

  function update(id: number, value: any) {

    setForm({
      ...form,
      attribute_values: {
        ...values,
        [id]: value,
      },
    });

  }

  function addAttribute() {

    if (!selectedAttr) return;

    const id = Number(selectedAttr);

    if (values[id]) return;

    const attr = attributes?.find((a: any) => a.id === id);

    setForm({
      ...form,
      attribute_values: {
        ...values,
        [id]: attr?.type === "select" ? [] : "",
      },
    });

    setSelectedAttr("");

  }

  function removeAttribute(id: number) {

    const copy = { ...values };
    delete copy[id];

    setForm({
      ...form,
      attribute_values: copy,
    });

  }

  const selectedIds = Object.keys(values).map(Number);

  const availableAttributes =
    attributes?.filter((a: any) => !selectedIds.includes(a.id)) || [];

  return (
    <section className="grid grid-cols-12 gap-6">

      <div className="col-span-3">
        <h3 className="text-sm font-semibold">
          Attributes
        </h3>

        <p className="text-xs text-gray-500">
          Add product specifications.
        </p>
      </div>

      <div className="col-span-9 bg-white border rounded-lg p-6 space-y-4">

        {/* ADD ATTRIBUTE */}

        <div className="flex gap-3">

          <select
            className="input"
            value={selectedAttr}
            onChange={(e) => setSelectedAttr(e.target.value)}
          >
            <option value="">Select attribute</option>

            {availableAttributes.map((attr: any) => (
              <option key={attr.id} value={attr.id}>
                {attr.name}
              </option>
            ))}

          </select>

          <button
            type="button"
            className="px-3 py-2 bg-gray-200 rounded"
            onClick={addAttribute}
          >
            Add
          </button>

        </div>

        {/* SELECTED ATTRIBUTES */}

        <div className="space-y-4">

          {selectedIds.map((id) => {

            const attr = attributes?.find((a: any) => a.id === id);

            return (

              <div
                key={id}
                className="grid grid-cols-3 gap-4 items-start"
              >

                <label className="text-sm font-medium">
                  {attr?.name}
                </label>

                {(() => {

                  if (!attr) return null;

                  // SELECT (multi-value)
                  if (attr.type === "select") {

                    const selectedValues = values[id] || [];

                    return (

                      <div className="col-span-1 space-y-1">

                        {attr.options?.map((opt: string) => {

                          const checked = selectedValues.includes(opt);

                          return (

                            <label
                              key={opt}
                              className="flex items-center gap-2 text-sm"
                            >

                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {

                                  let updated = [...selectedValues];

                                  if (e.target.checked) {
                                    updated.push(opt);
                                  } else {
                                    updated = updated.filter(v => v !== opt);
                                  }

                                  update(id, updated);

                                }}
                              />

                              {opt}

                            </label>

                          );

                        })}

                      </div>

                    );

                  }

                  // BOOLEAN
                  if (attr.type === "boolean") {

                    return (
                      <input
                        type="checkbox"
                        checked={values[id] === "true"}
                        onChange={(e) =>
                          update(id, e.target.checked ? "true" : "false")
                        }
                      />
                    );

                  }

                  // NUMBER
                  if (attr.type === "number") {

                    return (
                      <input
                        type="number"
                        className="input col-span-1"
                        value={values[id] || ""}
                        onChange={(e) => update(id, e.target.value)}
                      />
                    );

                  }

                  // TEXT
                  return (
                    <input
                      className="input col-span-1"
                      placeholder={`Enter ${attr.name}`}
                      value={values[id] || ""}
                      onChange={(e) => update(id, e.target.value)}
                    />
                  );

                })()}

                <button
                  type="button"
                  className="text-red-500 text-sm"
                  onClick={() => removeAttribute(id)}
                >
                  Remove
                </button>

              </div>

            );

          })}

        </div>

      </div>

    </section>
  );
}