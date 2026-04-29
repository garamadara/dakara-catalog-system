import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import AdminTable from "../components/AdminTable";

import { deleteBrand, getBrands } from "../services/brands";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Toast from "../components/ui/Toast";

type Brand = {
  id: number;
  name: string;
  logo_url?: string | null;
};

export default function Brands() {

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["brands", search],
    queryFn: () => getBrands(),
  });

  const columns = [
    {
      header: "ID",
      accessor: (b: Brand) => b.id,
    },
    {
      header: "Name",
      accessor: (b: Brand) => b.name,
    },
    {
      header: "Logo",
      accessor: (b: Brand) => (
        b.logo_url
          ? <img src={b.logo_url} className="w-10 h-10 rounded object-cover border" />
          : <span className="text-xs text-gray-400">No logo</span>
      ),
    },
    {
      header: "Action",
      accessor: (b: Brand) => (
        <div className="flex gap-3 text-sm">
          <button
            onClick={() => navigate(`/brands/${b.id}/edit`)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => setPendingDeleteId(b.id)}
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const deleteMutation = useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      setToast({ type: "success", message: "Brand deleted." });
      setPendingDeleteId(null);
    },
    onError: () => setToast({ type: "error", message: "Failed to delete brand." }),
  });

  return (
    <div className="p-6">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete brand?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => pendingDeleteId && deleteMutation.mutate(pendingDeleteId)}
        loading={deleteMutation.isPending}
      />

      <PageHeader
        title="Brands"
        search={search}
        onSearchChange={setSearch}
        actionLabel="Add Brand"
        onAction={() => navigate("/brands/create")}
      />

      <AdminTable
        columns={columns}
        data={data}
        isLoading={isLoading}
      />

    </div>
  );
}
