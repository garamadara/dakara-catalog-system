import { useQuery } from "@tanstack/react-query";
import BasicInfoSection from "../components/product/BasicInfoSection";
import PricingSection from "../components/product/PricingSection";
import DescriptionSection from "../components/product/DescriptionSection";
import GallerySection from "../components/product/GallerySection";
import AliasSection from "../components/product/AliasSection";
import CrossReferenceSection from "../components/product/CrossReferenceSection";
import PublishPanel from "../components/product/PublishPanel";
import AttributeSection from "../components/product/AttributeSection";

import React, { useState, useEffect } from "react";

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

  attribute_values: Record<number, string>

  status: "draft" | "published"

  categories?: any[]
  brands?: any[]
}


export default function CreateProduct() {

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

    attribute_values:{},

    status:"draft"
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories
  })

  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands
  })

  const { data: attributes } = useQuery({
    queryKey: ["attributes"],
    queryFn: getAttributes
  })


  useEffect(() => {

    if (categories) {
      setForm(prev => ({
        ...prev,
        categories
      }))
    }

  }, [categories])

  useEffect(() => {

    if (brands) {
      setForm(prev => ({
        ...prev,
        brands
      }))
    }

  }, [brands])


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault();

    try {

      if (!form.name) {
        alert("Product name is required");
        return;
      }

      if (!form.category_id) {
        alert("Category is required");
        return;
      }

      const product = await createProduct({
        name: form.name,
        category_id: form.category_id,
        brand_id: form.brand_id,
        part_number: form.part_number || null,

        cost_price: form.cost_price ? Number(form.cost_price) : null,
        selling_price: Number(form.selling_price || 0),
        promo_price: form.promo_price ? Number(form.promo_price) : null,

        status: form.status
      });


      const productId = product.id;


      // upload images

      for (const img of form.images) {
        if (img?.file) {
          await uploadProductImage(productId, img.file);
        }
      }


      // attach attributes

      const attrs = Object.entries(form.attribute_values).map(
        ([attribute_id, value]) => ({
          attribute_id: Number(attribute_id),
          value,
        }),
      );

      if (attrs.length) {
        await attachAttributes(productId, attrs);
      }


      // aliases

      if (form.aliases?.length) {
        await addAliases(productId, form.aliases);
      }


      // cross references

      if (form.cross_refs?.length) {
        await addCrossReferences(productId, form.cross_refs);
      }

      alert("Product created successfully");

    } catch (err) {
      console.error(err);
      alert("Failed to create product");
    }

  }


  return (
    <form onSubmit={handleSubmit} className="p-8">

      <div className="grid grid-cols-12 gap-8">

        <div className="col-span-9 space-y-8">

          <BasicInfoSection form={form} setForm={setForm} />

          <PricingSection form={form} setForm={setForm} />

          <DescriptionSection form={form} setForm={setForm} />

          <AttributeSection
            form={form}
            setForm={setForm}
            attributes={attributes || []}
          />

          <GallerySection form={form} setForm={setForm} />

          <AliasSection form={form} setForm={setForm} />

          <CrossReferenceSection form={form} setForm={setForm} />

        </div>

        <div className="col-span-3">
          <PublishPanel form={form} setForm={setForm} />
        </div>

      </div>

    </form>
  );
}