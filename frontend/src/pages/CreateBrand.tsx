import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function CreateBrand() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    slug: ""
  });

  function update(key: string, value: any) {
    setForm({ ...form, [key]: value });
  }

  async function handleSave(e: any) {
    e.preventDefault();

    try {

      const res = await api.post("/admin/brands", form);

      console.log("Brand saved:", res.data);

      navigate("/brands");

    } catch (error) {
      console.error(error);
      alert("Failed to save brand");
    }
  }

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-semibold">
        Create Brand
      </h1>

      <form
        onSubmit={handleSave}
        className="bg-white border rounded p-6 space-y-6"
      >

        {/* Brand Name */}
        <div>
          <label className="block text-sm mb-1 font-medium">
            Brand Name
          </label>

          <input
            required
            className="border rounded w-full px-3 py-2"
            placeholder="KYB"
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
            placeholder="kyb"
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
          />
        </div>

        {/* Save */}
        <div>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Save Brand
          </button>
        </div>

      </form>

    </div>
  );
}