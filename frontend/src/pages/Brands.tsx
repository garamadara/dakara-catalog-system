import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import AdminTable from "../components/AdminTable";

import { getBrands } from "../services/brands";

type Brand = {
  id: number;
  name: string;
};

export default function Brands() {

  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["brands", search],
    queryFn: () => getBrands(search),
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
  ];

  return (
    <div className="p-6">

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