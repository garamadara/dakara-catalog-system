import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, deleteProduct } from "../services/products";
import type { Product } from "../services/products";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import AdminTable from "../components/AdminTable";

export default function Products() {

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const columns = [
    {
      header: "ID",
      accessor: (p: Product) => (
        <span className="text-sm text-gray-500">
          {p.id}
        </span>
      ),
    },

    {
      header: "Thumbnail",
      accessor: (p: Product) => (
        <img
          src={
            p.thumbnail?.image_url
              ? p.thumbnail.image_url
              : "/placeholder.png"
          }
          className="w-12 h-12 object-cover rounded"
        />
      ),
    },

    {
      header: "Item Name",
      accessor: (p: Product) => (
        <span className="text-sm font-medium text-gray-800">
          {p.name}
        </span>
      ),
    },

    {
      header: "Category",
      accessor: (p: Product) => (
        <span className="text-sm text-gray-500">
          {p.categories?.length ? p.categories[0].name : "-"}
        </span>
      ),
    },

    {
      header: "Price",
      accessor: (p: Product) => (
        <span className="text-sm font-medium text-gray-700">
          $${Number(p.selling_price || 0).toFixed(2)}
        </span>
      ),
    },

    {
      header: "Status",
      accessor: (p: Product) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            p.status === "published"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {p.status ?? "draft"}
        </span>
      ),
    },

    {
      header: "Action",
      accessor: (p: Product) => (
        <div className="flex gap-4 text-sm">

          <button
            onClick={() => navigate(`/products/${p.slug}/edit`)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(p.id)}
            className="text-red-500 hover:text-red-700 font-medium"
          >
            Delete
          </button>

        </div>
      ),
    },
  ];

  /* Debounce search */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  /* Fetch products */

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", debouncedSearch],
    queryFn: () => getProducts(debouncedSearch),
  });

  /* Delete mutation */

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
        exact: false,
      });
    },
  });

  function handleDelete(id: number) {
    if (!confirm("Delete this product?")) return;
    deleteMutation.mutate(id);
  }

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6">API Error</div>;

  return (
    <div className="p-6">

      <PageHeader
        title="Products"
        search={search}
        onSearchChange={setSearch}
        actionLabel="Add Product"
        onAction={() => navigate("/products/create")}
      />

      <AdminTable
        columns={columns}
        data={data ?? []}
        isLoading={isLoading}
      />

    </div>
  );
}