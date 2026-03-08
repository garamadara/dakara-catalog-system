import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../layout/AdminLayout";

import Products from "../pages/Products";
import CreateProduct from "../pages/CreateProduct";
import EditProduct from "../pages/EditProduct";

import Categories from "../pages/Categories";
import CreateCategory from "../pages/CreateCategory";

import Brands from "../pages/Brands";
import CreateBrand from "../pages/CreateBrand";

import Attributes from "../pages/Attributes";
import CreateAttribute from "../pages/CreateAttribute";

export default function Router() {
  return (
    <BrowserRouter>

      <Routes>

        {/* redirect root */}
        <Route path="/" element={<Navigate to="/products" />} />

        <Route element={<AdminLayout />}>

          <Route path="/products" element={<Products />} />
          <Route path="/products/create" element={<CreateProduct />} />
	  <Route path="/products/:id/edit" element={<EditProduct />} />

          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/create" element={<CreateCategory />} />

          <Route path="/brands" element={<Brands />} />
          <Route path="/brands/create" element={<CreateBrand />} />

          <Route path="/attributes" element={<Attributes />} />
          <Route path="/attributes/create" element={<CreateAttribute />} />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}
