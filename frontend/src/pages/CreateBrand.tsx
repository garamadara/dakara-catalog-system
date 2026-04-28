import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { createBrand, getBrand, updateBrand } from "../services/brands";

export default function CreateBrand() {

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    logo: null as File | null,
    logo_url: "",
    remove_logo: false,
  });

  function update(key: string, value: any) {
    setForm({ ...form, [key]: value });
  }

  const { data: existingBrand } = useQuery({
    queryKey: ["brand", id],
    enabled: isEdit,
    queryFn: () => getBrand(Number(id)),
  });

  useEffect(() => {
    if (existingBrand) {
      setForm((prev) => ({
        ...prev,
        name: existingBrand.name || "",
        slug: existingBrand.slug || "",
        logo_url: existingBrand.logo_url || "",
      }));
    }
  }, [existingBrand]);

  async function handleSave(e: any) {
    e.preventDefault();

    try {
      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("slug", form.slug);
      if (form.logo) {
        payload.append("logo", form.logo);
      }
      if (form.remove_logo) {
        payload.append("remove_logo", "1");
      }

      if (isEdit) {
        await updateBrand(Number(id), payload);
      } else {
        await createBrand(payload);
      }

      navigate("/brands");

    } catch (error) {
      console.error(error);
      alert("Failed to save brand");
    }
  }

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-semibold">
        {isEdit ? "Edit Brand" : "Create Brand"}
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
            {isEdit ? "Save Changes" : "Save Brand"}
          </button>
        </div>

        <div>
          <label className="block text-sm mb-2 font-medium">Brand Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => update("logo", e.target.files?.[0] || null)}
          />
          {(form.logo_url || form.logo) && (
            <div className="mt-3 flex items-center gap-3">
              <img
                src={form.logo ? URL.createObjectURL(form.logo) : form.logo_url}
                className="w-14 h-14 rounded object-cover border"
              />
              <button
                type="button"
                className="text-sm text-rose-600"
                onClick={() => setForm((prev) => ({ ...prev, logo: null, logo_url: "", remove_logo: true }))}
              >
                Remove Logo
              </button>
            </div>
          )}
        </div>

      </form>

    </div>
  );
}
