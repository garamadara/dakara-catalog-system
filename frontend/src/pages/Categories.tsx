import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import AdminTable from "../components/AdminTable";

import { getCategories } from "../services/categories";

type Category = {
  id: number;
  name: string;
};

export default function Categories() {

  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["categories", search],
    queryFn: () => getCategories(search),
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
  ];

  return (
    <div className="p-6">

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