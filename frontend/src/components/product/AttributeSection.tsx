import { useQuery } from "@tanstack/react-query";
import { getAttributes } from "../../services/attributes";

export default function AttributeSection({ form, setForm }: any) {
  const { data: attributes } = useQuery({
    queryKey: ["attributes"],
    queryFn: getAttributes,
  });

  const values = form.attribute_values || {};

  function update(id: number, value: string) {
    setForm({
      ...form,
      attribute_values: {
        ...values,
        [id]: value,
      },
    });
  }

  return (
    <section className="grid grid-cols-12 gap-6">
      <div className="col-span-3">
        <h3 className="text-sm font-semibold">Attributes</h3>

        <p className="text-xs text-gray-500">Add product specifications.</p>
      </div>

      <div className="col-span-9 bg-white border rounded-lg p-6">
        <div className="space-y-4">
          {attributes?.map((attr: any) => (
            <div key={attr.id} className="grid grid-cols-3 gap-4 items-center">
              <label className="text-sm font-medium">{attr.name}</label>

              <input
                className="input col-span-2"
                placeholder={`Enter ${attr.name}`}
                value={values[attr.id] || ""}
                onChange={(e) => update(attr.id, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

