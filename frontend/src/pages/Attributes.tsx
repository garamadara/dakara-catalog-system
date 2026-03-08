import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import AdminTable from "../components/AdminTable";

import { getAttributes } from "../services/attributes";

type Attribute = {
  id: number;
  name: string;
};

export default function Attributes() {

  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["attributes", search],
    queryFn: () => getAttributes(search),
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
  ];

  return (
    <div className="p-6">

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