import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { createCategory, getCategories, getCategory, updateCategory } from "../services/categories";

export default function CreateCategory() {

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    parent_id: null as number | null,
    image: null as File | null,
    image_url: "",
    remove_image: false,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories()
  });

  const { data: existingCategory } = useQuery({
    queryKey: ["category", id],
    enabled: isEdit,
    queryFn: () => getCategory(Number(id)),
  });

  useEffect(() => {
    if (existingCategory) {
      setForm((prev) => ({
        ...prev,
        name: existingCategory.name || "",
        slug: existingCategory.slug || "",
        parent_id: existingCategory.parent_id ?? null,
        image_url: existingCategory.image_url || "",
      }));
    }
  }, [existingCategory]);

  function update(key: string, value: any) {
    setForm({ ...form, [key]: value });
  }

async function handleSave(e: any) {
  e.preventDefault();
  try {
    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("slug", form.slug);
    if (form.parent_id) {
      payload.append("parent_id", String(form.parent_id));
    }
    if (form.image) {
      payload.append("image", form.image);
    }
    if (form.remove_image) {
      payload.append("remove_image", "1");
    }

    if (isEdit) {
      await updateCategory(Number(id), payload);
    } else {
      await createCategory(payload);
    }
    navigate("/categories");

  } catch (error) {
    console.error(error);
  }
}

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-semibold">
        {isEdit ? "Edit Category" : "Create Category"}
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
            <input
              type="file"
              accept="image/*"
              onChange={(e) => update("image", e.target.files?.[0] || null)}
            />
            {(form.image_url || form.image) && (
              <div className="mt-4 flex items-center justify-center gap-3">
                <img
                  src={form.image ? URL.createObjectURL(form.image) : form.image_url}
                  className="w-16 h-16 rounded object-cover border"
                />
                <button
                  type="button"
                  className="text-sm text-rose-600"
                  onClick={() => setForm((prev) => ({ ...prev, image: null, image_url: "", remove_image: true }))}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            {isEdit ? "Save Changes" : "Save Category"}
          </button>
        </div>

      </form>

    </div>
  );
}
