import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createProduct } from "../services/products";

import BasicInfoSection from "../components/product/BasicInfoSection";
import PricingSection from "../components/product/PricingSection";
import DescriptionSection from "../components/product/DescriptionSection";
import GallerySection from "../components/product/GallerySection";
import AliasSection from "../components/product/AliasSection";
import CrossReferenceSection from "../components/product/CrossReferenceSection";
import PublishPanel from "../components/product/PublishPanel";
import AttributeSection from "../components/product/AttributeSection"

export default function CreateProduct() {
  const [form,setForm] = useState({

    name:"",
    part_number:"",
    barcode:"",

    brand_id:"",
    category_id:"",

    cost_price:"",
    selling_price:"",
    promo_price:"",

    description:"",
    public_description:"",

    aliases:[],
    cross_refs:[],

    images:[],

    attribute_values:{},

    status:"draft"

    });

  const mutation = useMutation({
    mutationFn: createProduct,
  });

   async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      // 1️⃣ create product

      const product = await createProduct(form);

      const productId = product.data.id;

      // 2️⃣ upload images

      for (const img of form.images) {
        await uploadProductImage(productId, img.file);
      }

      // 3️⃣ attach attributes

      const attrs = Object.entries(form.attribute_values).map(
        ([attribute_id, value]) => ({
          attribute_id,
          value,
        }),
      );

      if (attrs.length) {
        await attachAttributes(productId, attrs);
      }

      // 4️⃣ attach aliases

      if (form.aliases?.length) {
        await addAliases(productId, form.aliases);
      }

      // 5️⃣ attach cross references

      if (form.cross_refs?.length) {
        await addCrossReferences(productId, form.cross_refs);
      }
    } catch (err) {
      console.error(err);
    }
  }


  return (
    <form onSubmit={handleSubmit} className="p-8">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-9 space-y-8">
          <BasicInfoSection form={form} setForm={setForm} />

          <PricingSection form={form} setForm={setForm} />

          <DescriptionSection form={form} setForm={setForm} />

          <GallerySection form={form} setForm={setForm} />

          <AliasSection form={form} setForm={setForm} />

          <CrossReferenceSection form={form} setForm={setForm} />

          <AttributeSection form={form} setForm={setForm} /> 
        </div>

        <div className="col-span-3">
          <PublishPanel form={form} setForm={setForm} />
        </div>
      </div>
    </form>
  );
}
