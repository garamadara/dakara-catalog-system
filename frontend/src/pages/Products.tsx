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
    accessor: (p: Product) => p.id,
  },
  {
    header: "Name",
    accessor: (p: Product) => p.name,
  },
  {
    header: "Part Number",
    accessor: (p: Product) => p.part_number,
  },
  {
    header: "Actions",
    accessor: (p: Product) => (
      <div className="space-x-3">
        <button
          onClick={() => navigate(`/products/${p.slug}/edit`)}
          className="text-blue-600 hover:underline"
        >
          Edit
        </button>

        <button
          onClick={() => handleDelete(p.id)}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    ),
  },
];

  /* ------------------------------
     Debounce search (300ms)
  ------------------------------ */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  /* ------------------------------
     Fetch products
  ------------------------------ */

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", debouncedSearch],
    queryFn: () => getProducts(debouncedSearch),
  });

  /* ------------------------------
     Delete mutation
  ------------------------------ */

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

      {/* ------------------------------
          Header
      ------------------------------ */}

      <PageHeader
        title="Products"
        search={search}
        onSearchChange={setSearch}
        actionLabel="Add Product"
        onAction={() => navigate("/products/create")}
      />

      {/* ------------------------------
          Table
      ------------------------------ */}

      <AdminTable
          columns={columns}
          data={data}
          isLoading={isLoading}
        />
    </div>
  );
}