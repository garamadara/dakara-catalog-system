import { useQuery } from "@tanstack/react-query";
import BasicInfoSection from "../components/product/BasicInfoSection";
import PricingSection from "../components/product/PricingSection";
import DescriptionSection from "../components/product/DescriptionSection";
import GallerySection from "../components/product/GallerySection";
import AliasSection from "../components/product/AliasSection";
import CrossReferenceSection from "../components/product/CrossReferenceSection";
import PublishPanel from "../components/product/PublishPanel";
import AttributeSection from "../components/product/AttributeSection";
import Toast from "../components/ui/Toast";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getCategories } from "../services/categories";
import { getBrands } from "../services/brands";
import { getAttributes } from "../services/attributes";

import {
  createProduct,
  uploadProductImage,
  attachAttributes,
  addAliases,
  addCrossReferences
} from "../services/products";

type ProductForm = {
  name: string
  part_number: string
  barcode: string

  brand_id: number | null
  category_id: number | null

  cost_price: string
  selling_price: string
  promo_price: string

  description: string
  public_description: string

  aliases: string[]

  cross_refs: {
    referenced_product_id: number
    part_number: string
  }[]

  images: any[]

  variants: {
    sku: string
    part_number: string
    cost_price: string
    selling_price: string
    promo_price: string
    stock: string
    source?: "generated" | "manual"
    generated_key?: string
  }[]

  attribute_values: Record<number, string>

  status: "draft" | "published"

  categories?: any[]
  brands?: any[]
}

export default function CreateProduct() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  const [form,setForm] = useState<ProductForm>({
    name:"",
    part_number:"",
    barcode:"",

    brand_id:null,
    category_id:null,

    cost_price:"",
    selling_price:"0.00",
    promo_price:"",

    description:"",
    public_description:"",

    aliases:[],
    cross_refs:[],

    images:[],

    variants: [],

    attribute_values:{},

    status:"draft"
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories
  });

  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands
  });

  const { data: attributes } = useQuery({
    queryKey: ["attributes"],
    queryFn: getAttributes
  });

  useEffect(() => {

    if (categories) {
      setForm(prev => ({
        ...prev,
        categories
      }));
    }

  }, [categories]);

  useEffect(() => {

    if (brands) {
      setForm(prev => ({
        ...prev,
        brands
      }));
    }

  }, [brands]);

  useEffect(() => {
    if (!attributes?.length) return;

    setForm(prev => {
      const selectedSelectAttributes = Object.entries(prev.attribute_values)
        .map(([id, value]) => {
          const attr = attributes.find((a: any) => a.id === Number(id));
          return { attr, value };
        })
        .filter(({ attr, value }) =>
          attr?.type === "select" &&
          Array.isArray(value) &&
          value.length > 0
        );

      if (!selectedSelectAttributes.length) {
        return {
          ...prev,
          variants: prev.variants.filter(v => v.source !== "generated")
        };
      }

      let combos: string[][] = [[]];
      for (const { value } of selectedSelectAttributes) {
        const options = Array.isArray(value) ? value : [];
        combos = combos.flatMap(c => options.map(v => [...c, v]));
      }

      const existingGenerated = new Map(
        prev.variants
          .filter(v => v.source === "generated" && v.generated_key)
          .map(v => [v.generated_key as string, v])
      );

      const generatedVariants = combos.map(combo => {
        const key = combo.join(" / ");
        const existing = existingGenerated.get(key);
        const baseName = (prev.name || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const optionSlug = combo.join("-").toLowerCase().replace(/\s+/g, "-");
        const generatedSku = [baseName, optionSlug].filter(Boolean).join("-");

        if (existing) {
          return {
            ...existing,
            sku: generatedSku
          };
        }

        return {
          sku: generatedSku,
          part_number: "",
          cost_price: prev.cost_price || "0",
          selling_price: prev.selling_price || "0",
          promo_price: prev.promo_price || "0",
          stock: "0",
          source: "generated" as const,
          generated_key: key,
        };
      });

      const manualVariants = prev.variants.filter(v => v.source !== "generated");

      return {
        ...prev,
        variants: [...generatedVariants, ...manualVariants],
      };
    });
  }, [attributes, form.attribute_values, form.name]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      if (!form.name) {
        setToast({ type: "warning", message: "Product name is required." });
        return;
      }

      if (!form.category_id) {
        setToast({ type: "warning", message: "Category is required." });
        return;
      }

      const variantsPayload = form.variants
        .filter(v =>
          v.sku.trim() ||
          v.part_number.trim() ||
          v.cost_price.trim() ||
          v.selling_price.trim() ||
          v.promo_price.trim() ||
          v.stock.trim()
        )
        .map(v => ({
          sku: v.sku.trim() || null,
          part_number: v.part_number.trim() || null,
          cost_price: v.cost_price ? Number(v.cost_price) : 0,
          selling_price: v.selling_price ? Number(v.selling_price) : 0,
          promo_price: v.promo_price ? Number(v.promo_price) : 0,
          stock: v.stock ? Number(v.stock) : 0
        }));

      const product = await createProduct({
        name: form.name,
        category_id: form.category_id,
        brand_id: form.brand_id,
        part_number: form.part_number || null,

        cost_price: form.cost_price ? Number(form.cost_price) : null,
        selling_price: Number(form.selling_price || 0),
        promo_price: form.promo_price ? Number(form.promo_price) : null,
        variants: variantsPayload,

        status: form.status
      });

      const rawProductId =
        product?.id
        ?? product?.data?.id
        ?? product?.product?.id
        ?? product?.data?.product?.id;

      const productId = Number(rawProductId);

      if (!Number.isFinite(productId) || productId <= 0) {
        throw new Error("Create product succeeded but no valid product id was returned.");
      }
      const postCreateWarnings: string[] = [];

      console.log("Images to upload:", form.images);

      for (const img of form.images) {
        if (img?.file) {
          try {
            await uploadProductImage(productId, img.file);
          } catch {
            postCreateWarnings.push("One or more gallery images failed to upload.");
            break;
          }
        }
      }

      const attrs = Object.entries(form.attribute_values).map(
        ([attribute_id, value]) => ({
          attribute_id: Number(attribute_id),
          value,
        }),
      );

      if (attrs.length) {
        try {
          await attachAttributes(productId, attrs);
        } catch {
          postCreateWarnings.push("Attributes failed to attach.");
        }
      }

      if (form.aliases?.length) {
        try {
          await addAliases(productId, form.aliases);
        } catch {
          postCreateWarnings.push("Aliases failed to save.");
        }
      }

      if (form.cross_refs?.length) {
        try {
          await addCrossReferences(productId, form.cross_refs);
        } catch {
          postCreateWarnings.push("Cross references failed to save.");
        }
      }

      if (postCreateWarnings.length) {
        navigate("/products", {
          state: {
            toast: {
              type: "warning",
              message: `Product created, but some follow-up actions failed:\n- ${postCreateWarnings.join("\n- ")}`,
            },
          },
        });
        return;
      }

      navigate("/products", {
        state: {
          toast: {
            type: "success",
            message: "Product created successfully.",
          },
        },
      });

    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Failed to create product." });
    } finally {
      setIsSubmitting(false);
    }

  }

  return (
    <form onSubmit={handleSubmit} className="p-10 bg-gray-50 min-h-screen">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="grid grid-cols-12 gap-10 max-w-7xl mx-auto">

        <div className="col-span-9 space-y-10">

          <BasicInfoSection form={form} setForm={setForm} />

          <PricingSection form={form} setForm={setForm} />

          <DescriptionSection form={form} setForm={setForm} />

          <AttributeSection
            form={form}
            setForm={setForm}
            attributes={attributes || []}
          />

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
                        source: "manual"
                      }
                    ]
                  }))
                }
              >
                Add Manual Variant
              </button>
            </div>

            <div className="space-y-3">
              {form.variants.map((variant, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-end border rounded-lg p-3">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {variant.source === "generated"
                        ? 'SKU (Auto-generated from attributes)'
                        : "SKU"}
                    </label>
                    <input
                      className="w-full border rounded px-3 py-2 text-sm text-gray-800"
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
                    <label className="block text-sm font-medium text-gray-600 mb-1">Part #</label>
                    <input
                      className="w-full border rounded px-3 py-2 text-sm text-gray-800"
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
                    <label className="block text-sm font-medium text-gray-600 mb-1">Cost</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full border rounded px-3 py-2 text-sm text-gray-800"
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
                    <label className="block text-sm font-medium text-gray-600 mb-1">Selling</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full border rounded px-3 py-2 text-sm text-gray-800"
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
                    <label className="block text-sm font-medium text-gray-600 mb-1">Promo</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full border rounded px-3 py-2 text-sm text-gray-800"
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
                    <label className="block text-sm font-medium text-gray-600 mb-1">Stock</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      className="w-full border rounded px-3 py-2 text-sm text-gray-800"
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
                      className="text-sm font-medium text-rose-600 hover:text-rose-700"
                      onClick={() =>
                        setForm(prev => ({
                          ...prev,
                          variants: prev.variants.filter((_, i) => i !== index)
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

          <GallerySection form={form} setForm={setForm} />

          <AliasSection form={form} setForm={setForm} />

          <CrossReferenceSection form={form} setForm={setForm} />

        </div>

        <div className="col-span-3">
          <PublishPanel form={form} setForm={setForm} isSubmitting={isSubmitting} />
        </div>

      </div>

    </form>
  );
}
