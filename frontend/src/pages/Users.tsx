import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "../components/PageHeader";
import AdminTable from "../components/AdminTable";

import { getUsers } from "../services/users";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function Users() {

  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["users", search],
    queryFn: () => getUsers(search),
  });

  const columns = [
    {
      header: "ID",
      accessor: (u: User) => u.id,
    },
    {
      header: "Name",
      accessor: (u: User) => u.name,
    },
    {
      header: "Email",
      accessor: (u: User) => u.email,
    },
  ];

  return (
    <div className="p-6">

      <PageHeader
        title="Users"
        search={search}
        onSearchChange={setSearch}
      />

      <AdminTable
        columns={columns}
        data={data}
        isLoading={isLoading}
      />

    </div>
  );
}