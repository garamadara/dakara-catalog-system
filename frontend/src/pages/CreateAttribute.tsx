import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function CreateAttribute() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    type: "text",
    options: ""
  });

  function update(key: string, value: any) {
    setForm({ ...form, [key]: value });
  }

  async function handleSave(e: any) {

    e.preventDefault();

    try {

      let payload: any = {
        name: form.name,
        slug: form.slug,
        type: form.type
      };

      if (form.type === "select") {
        payload.options = form.options
          .split(",")
          .map((v) => v.trim());
      }

      await api.post("/admin/attributes", payload);

      navigate("/attributes");

    } catch (error) {
      console.error(error);
      alert("Failed to save attribute");
    }

  }

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-semibold">
        Create Attribute
      </h1>

      <form
        onSubmit={handleSave}
        className="bg-white border rounded p-6 space-y-6"
      >

        {/* Name */}
        <div>
          <label className="block text-sm mb-1 font-medium">
            Attribute Name
          </label>

          <input
            required
            className="border rounded w-full px-3 py-2"
            placeholder="Color"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm mb-1 font-medium">
            Slug
          </label>

          <input
            className="border rounded w-full px-3 py-2"
            placeholder="color"
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm mb-1 font-medium">
            Type
          </label>

          <select
            className="border rounded w-full px-3 py-2"
            value={form.type}
            onChange={(e) => update("type", e.target.value)}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="select">Select</option>
            <option value="boolean">Boolean</option>
          </select>
        </div>

        {/* Options (only for select) */}
        {form.type === "select" && (

          <div>
            <label className="block text-sm mb-1 font-medium">
              Options (comma separated)
            </label>

            <input
              className="border rounded w-full px-3 py-2"
              placeholder="Red, Blue, Black"
              value={form.options}
              onChange={(e) => update("options", e.target.value)}
            />
          </div>

        )}

        {/* Save */}
        <div>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Save Attribute
          </button>
        </div>

      </form>

    </div>
  );
}