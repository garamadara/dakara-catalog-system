import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import { getAttributes } from "../services/attributes";

export default function Attributes() {

  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["attributes", search],
    queryFn: () => getAttributes(search),
  });

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6">API Error</div>;

  return (
    <div className="p-6">

      <PageHeader
        title="Attributes"
        search={search}
        onSearchChange={setSearch}
        actionLabel="Add Attribute"
        onAction={() => navigate("/attributes/create")}
      />

      <table className="w-full border">

        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Name</th>
          </tr>
        </thead>

        <tbody>

          {data?.map((attr: any) => (
            <tr key={attr.id} className="border-t">
              <td className="p-2">{attr.id}</td>
              <td className="p-2">{attr.name}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}