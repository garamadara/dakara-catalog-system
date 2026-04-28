import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import AdminTable from "../components/AdminTable";

import { deleteCategory, getCategories } from "../services/categories";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Toast from "../components/ui/Toast";

type Category = {
  id: number;
  name: string;
  image_url?: string | null;
};

export default function Categories() {

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["categories", search],
    queryFn: () => getCategories(),
  });

  const columns = [
    {
      header: "ID",
      accessor: (c: Category) => c.id,
    },
    {
      header: "Name",
      accessor: (c: Category) => c.name,
    },
    {
      header: "Image",
      accessor: (c: Category) => (
        c.image_url
          ? <img src={c.image_url} className="w-10 h-10 rounded object-cover border" />
          : <span className="text-xs text-gray-400">No image</span>
      ),
    },
    {
      header: "Action",
      accessor: (c: Category) => (
        <div className="flex gap-3 text-sm">
          <button
            onClick={() => navigate(`/categories/${c.id}/edit`)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => setPendingDeleteId(c.id)}
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setToast({ type: "success", message: "Category deleted." });
      setPendingDeleteId(null);
    },
    onError: () => setToast({ type: "error", message: "Failed to delete category." }),
  });

  return (
    <div className="p-6">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete category?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => pendingDeleteId && deleteMutation.mutate(pendingDeleteId)}
        loading={deleteMutation.isPending}
      />

      <PageHeader
        title="Categories"
        search={search}
        onSearchChange={setSearch}
        actionLabel="Add Category"
        onAction={() => navigate("/categories/create")}
      />

      <AdminTable
        columns={columns}
        data={data}
        isLoading={isLoading}
      />

    </div>
  );
}
