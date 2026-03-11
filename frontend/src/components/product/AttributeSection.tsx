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

      {/* LEFT TITLE */}

      <div className="col-span-3">

        <h3 className="text-sm font-semibold text-gray-900">
          Attributes
        </h3>

        <p className="text-xs text-gray-500 mt-1">
          Add product specifications.
        </p>

      </div>

      {/* RIGHT CARD */}

      <div className="col-span-9 bg-white border border-gray-200 rounded-xl p-6 space-y-6">

        {/* ATTRIBUTE SELECT */}

        <div className="flex gap-3">

          <select
            className="
            flex-1
            border
            border-gray-200
            rounded-md
            px-3
            py-2
            text-sm
            text-gray-800
            focus:outline-none
            focus:ring-2
            focus:ring-green-500
            "
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
            onClick={addAttribute}
            className="
            bg-green-600
            hover:bg-green-700
            text-white
            text-sm
            font-medium
            px-4
            py-2
            rounded-md
            transition
            "
          >
            Add
          </button>

        </div>

        {/* SELECTED ATTRIBUTES */}

        <div className="space-y-6">

          {selectedIds.map((id) => {

            const attr = attributes?.find((a: any) => a.id === id);

            return (

              <div
                key={id}
                className="grid grid-cols-12 gap-6 items-start"
              >

                {/* LABEL */}

                <label className="col-span-3 text-sm font-medium text-gray-700 pt-2">
                  {attr?.name}
                </label>

                {/* FIELD */}

                <div className="col-span-7">

                  {(() => {

                    if (!attr) return null;

                    /* SELECT (multi checkbox) */

                    if (attr.type === "select") {

                      const selectedValues = values[id] || [];

                      return (

                        <div className="space-y-2">

                          {attr.options?.map((opt: string) => {

                            const checked = selectedValues.includes(opt);

                            return (

                              <label
                                key={opt}
                                className="flex items-center gap-2 text-sm text-gray-700"
                              >

                                <input
                                  type="checkbox"
                                  className="accent-green-600"
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

                    /* BOOLEAN */

                    if (attr.type === "boolean") {

                      return (
                        <input
                          type="checkbox"
                          className="accent-green-600"
                          checked={values[id] === "true"}
                          onChange={(e) =>
                            update(id, e.target.checked ? "true" : "false")
                          }
                        />
                      );

                    }

                    /* NUMBER */

                    if (attr.type === "number") {

                      return (
                        <input
                          type="number"
                          className="
                          w-full
                          border
                          border-gray-200
                          rounded-md
                          px-3
                          py-2
                          text-sm
                          text-gray-800
                          focus:outline-none
                          focus:ring-2
                          focus:ring-green-500
                          "
                          value={values[id] || ""}
                          onChange={(e) => update(id, e.target.value)}
                        />
                      );

                    }

                    /* TEXT */

                    return (
                      <input
                        className="
                        w-full
                        border
                        border-gray-200
                        rounded-md
                        px-3
                        py-2
                        text-sm
                        text-gray-800
                        focus:outline-none
                        focus:ring-2
                        focus:ring-green-500
                        "
                        placeholder={`Enter ${attr.name}`}
                        value={values[id] || ""}
                        onChange={(e) => update(id, e.target.value)}
                      />
                    );

                  })()}

                </div>

                {/* REMOVE BUTTON */}

                <div className="col-span-2 pt-2">

                  <button
                    type="button"
                    className="text-red-500 text-sm hover:underline"
                    onClick={() => removeAttribute(id)}
                  >
                    Remove
                  </button>

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </section>

  );

}