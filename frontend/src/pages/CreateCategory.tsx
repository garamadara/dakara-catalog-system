import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/categories";

import api from "../lib/api";

export default function CreateCategory() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    parent_id: null
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories("")
  });

  function update(key: string, value: any) {
    setForm({ ...form, [key]: value });
  }

async function handleSave(e: any) {
  e.preventDefault();
  try {
    const res = await api.post("/admin/categories", form);
    navigate("/categories");

  } catch (error) {
    console.error(error);
  }
}

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-semibold">
        Create Category
      </h1>

      <form
        onSubmit={handleSave}
        className="bg-white border rounded p-6 space-y-6"
      >

        {/* Name */}
        <div>
          <label className="block text-sm mb-1 font-medium">
            Category Name
          </label>

          <input
            className="border rounded w-full px-3 py-2"
            placeholder="Suspension"
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
            placeholder="suspension"
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
          />
        </div>

        {/* Parent Category */}
        <select
          className="border rounded w-full px-3 py-2"
          value={form.parent_id ?? ""}
          onChange={(e) =>
            update(
              "parent_id",
              e.target.value ? Number(e.target.value) : null
            )
          }
        >
          <option value="">None</option>

          {categories?.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}

        </select>

        {/* Image */}
        <div>
          <label className="block text-sm mb-2 font-medium">
            Category Image
          </label>

          <div className="border-dashed border rounded p-8 text-center text-gray-500">
            Upload Image
          </div>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Save Category
          </button>
        </div>

      </form>

    </div>
  );
}