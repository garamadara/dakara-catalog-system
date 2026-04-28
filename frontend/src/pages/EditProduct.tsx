import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { client } from "../lib/client";
import PageHeader from "../components/PageHeader";
import BasicInfoSection from "../components/product/BasicInfoSection";
import PricingSection from "../components/product/PricingSection";
import DescriptionSection from "../components/product/DescriptionSection";
import GallerySection from "../components/product/GallerySection";
import PublishPanel from "../components/product/PublishPanel";
import { uploadProductImage } from "../services/products";

type VariantForm = {
  id?: number
  sku: string
  part_number: string
  cost_price: string
  selling_price: string
  promo_price: string
  stock: string
};

type ProductForm = {
  name: string
  part_number: string
  brand_id: number | null
  category_id: number | null
  cost_price: string
  selling_price: string
  promo_price: string
  description: string
  public_description: string
  status: "draft" | "published"
  variants: VariantForm[]
  images: any[]
  categories?: any[]
  brands?: any[]
};

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<ProductForm>({
    name: "",
    part_number: "",
    brand_id: null,
    category_id: null,
    cost_price: "",
    selling_price: "0.00",
    promo_price: "",
    description: "",
    public_description: "",
    status: "draft",
    variants: [],
    images: [],
    categories: [],
    brands: [],
  });

  const { data, isLoading } = useQuery({
    queryKey: ["product-edit", id],
    enabled: !!id,
    queryFn: () => client.get(`/admin/products/${id}/edit`),
  });

  useEffect(() => {
    if (!data?.product) return;

    const product = data.product;

    setForm({
      name: product.name || "",
      part_number: product.part_number || "",
      brand_id: product.brand_id ?? null,
      category_id: product.categories?.[0]?.id ?? null,
      cost_price: product.cost_price?.toString() || "",
      selling_price: product.selling_price?.toString() || "0.00",
      promo_price: product.promo_price?.toString() || "",
      description: product.description || "",
      public_description: product.public_description || "",
      status: product.status || "draft",
      variants: (product.variants || []).map((variant: any) => ({
        id: variant.id,
        sku: variant.sku || "",
        part_number: variant.part_number || "",
        cost_price: variant.cost_price?.toString() || "",
        selling_price: variant.selling_price?.toString() || "",
        promo_price: variant.promo_price?.toString() || "",
        stock: variant.stock?.toString() || "0",
      })),
      images: (product.images || []).map((image: any) => ({
        id: image.id,
        image_url: image.image_url,
        preview: image.image_url,
      })),
      brands: data.brands || [],
      categories: data.categories || [],
    });
  }, [data]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!id) return;

      await client.put(`/admin/products/${id}`, {
        name: form.name,
        part_number: form.part_number || null,
        brand_id: form.brand_id,
        category_id: form.category_id,
        cost_price: form.cost_price ? Number(form.cost_price) : null,
        selling_price: Number(form.selling_price || 0),
        promo_price: form.promo_price ? Number(form.promo_price) : null,
      });

      await client.post(`/admin/products/${id}/variants`, {
        replace: true,
        variants: form.variants.map(v => ({
          sku: v.sku || null,
          part_number: v.part_number || null,
          cost_price: v.cost_price ? Number(v.cost_price) : 0,
          selling_price: v.selling_price ? Number(v.selling_price) : 0,
          promo_price: v.promo_price ? Number(v.promo_price) : 0,
          stock: v.stock ? Number(v.stock) : 0,
        })),
      });

      for (const image of form.images) {
        if (image?.file) {
          await uploadProductImage(Number(id), image.file);
        }
      }
    },
    onSuccess: () => {
      alert("Product updated successfully");
      navigate("/products");
    },
    onError: () => {
      alert("Failed to update product");
    },
  });

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <form
      className="p-10 bg-gray-50 min-h-screen"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
    >
      <div className="max-w-7xl mx-auto">
        <PageHeader title="Edit Product" />
      </div>

      <div className="grid grid-cols-12 gap-10 max-w-7xl mx-auto mt-6">
        <div className="col-span-9 space-y-10">
          <BasicInfoSection form={form} setForm={setForm} />
          <PricingSection form={form} setForm={setForm} />
          <DescriptionSection form={form} setForm={setForm} />
          <GallerySection form={form} setForm={setForm} />

          <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Variants</h2>
              <button
                type="button"
                className="px-3 py-1.5 text-sm rounded bg-gray-900 text-white"
                onClick={() =>
                  setForm(prev => ({
                    ...prev,
                    variants: [
                      ...prev.variants,
                      {
                        sku: "",
                        part_number: "",
                        cost_price: "",
                        selling_price: "",
                        promo_price: "",
                        stock: "0",
                      },
                    ],
                  }))
                }
              >
                Add Variant
              </button>
            </div>

            <div className="space-y-3">
              {form.variants.map((variant, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-end border rounded-lg p-3">
                  <div className="col-span-2">
                    <label className="block text-xs mb-1">SKU</label>
                    <input
                      className="w-full border rounded px-3 py-2"
                      value={variant.sku}
                      onChange={(e) =>
                        setForm(prev => {
                          const variants = [...prev.variants];
                          variants[index] = { ...variants[index], sku: e.target.value };
                          return { ...prev, variants };
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs mb-1">Part #</label>
                    <input
                      className="w-full border rounded px-3 py-2"
                      value={variant.part_number}
                      onChange={(e) =>
                        setForm(prev => {
                          const variants = [...prev.variants];
                          variants[index] = { ...variants[index], part_number: e.target.value };
                          return { ...prev, variants };
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs mb-1">Cost</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full border rounded px-3 py-2"
                      value={variant.cost_price}
                      onChange={(e) =>
                        setForm(prev => {
                          const variants = [...prev.variants];
                          variants[index] = { ...variants[index], cost_price: e.target.value };
                          return { ...prev, variants };
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs mb-1">Selling</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full border rounded px-3 py-2"
                      value={variant.selling_price}
                      onChange={(e) =>
                        setForm(prev => {
                          const variants = [...prev.variants];
                          variants[index] = { ...variants[index], selling_price: e.target.value };
                          return { ...prev, variants };
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs mb-1">Promo</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full border rounded px-3 py-2"
                      value={variant.promo_price}
                      onChange={(e) =>
                        setForm(prev => {
                          const variants = [...prev.variants];
                          variants[index] = { ...variants[index], promo_price: e.target.value };
                          return { ...prev, variants };
                        })
                      }
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs mb-1">Stock</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      className="w-full border rounded px-3 py-2"
                      value={variant.stock}
                      onChange={(e) =>
                        setForm(prev => {
                          const variants = [...prev.variants];
                          variants[index] = { ...variants[index], stock: e.target.value };
                          return { ...prev, variants };
                        })
                      }
                    />
                  </div>
                  <div className="col-span-1">
                    <button
                      type="button"
                      className="text-sm text-red-600"
                      onClick={() =>
                        setForm(prev => ({
                          ...prev,
                          variants: prev.variants.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-3">
          <PublishPanel form={form} setForm={setForm} isSubmitting={mutation.isPending} />
        </div>
      </div>
    </form>
  );
}
