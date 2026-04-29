import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import AdminTable from "../components/AdminTable";

import { deleteAttribute, getAttributes } from "../services/attributes";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Toast from "../components/ui/Toast";

type Attribute = {
  id: number;
  name: string;
};

export default function Attributes() {

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["attributes", search],
    queryFn: () => getAttributes(),
  });

  const columns = [
    {
      header: "ID",
      accessor: (a: Attribute) => a.id,
    },
    {
      header: "Name",
      accessor: (a: Attribute) => a.name,
    },
    {
      header: "Action",
      accessor: (a: Attribute) => (
        <div className="flex gap-3 text-sm">
          <button
            onClick={() => navigate(`/attributes/${a.id}/edit`)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => setPendingDeleteId(a.id)}
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const deleteMutation = useMutation({
    mutationFn: deleteAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      setToast({ type: "success", message: "Attribute deleted." });
      setPendingDeleteId(null);
    },
    onError: () => setToast({ type: "error", message: "Failed to delete attribute." }),
  });

  return (
    <div className="p-6">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete attribute?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => pendingDeleteId && deleteMutation.mutate(pendingDeleteId)}
        loading={deleteMutation.isPending}
      />

      <PageHeader
        title="Attributes"
        search={search}
        onSearchChange={setSearch}
        actionLabel="Add Attribute"
        onAction={() => navigate("/attributes/create")}
      />

      <AdminTable
        columns={columns}
        data={data}
        isLoading={isLoading}
      />

    </div>
  );
}
