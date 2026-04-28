import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, updateProduct } from "../services/products";

export default function EditProduct() {

  const { slug } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProduct(slug!),
    enabled: !!slug
  });

  const mutation = useMutation({
    mutationFn: (payload: any) =>
      updateProduct(slug!, payload),
    onSuccess: () => navigate("/products")
  });

  const [name, setName] = useState("");
  const [partNumber, setPartNumber] = useState("");

  useEffect(() => {
    if (data?.product) {
      setName(data.product.name || "");
      setPartNumber(data.product.part_number || "");
    }
  }, [data]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    mutation.mutate({
      name,
      part_number: partNumber || null
    });
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">

      <h1 className="text-xl font-semibold mb-6">
        Edit Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block mb-1">Name</label>

          <input
            className="border p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Part Number</label>

          <input
            className="border p-2 w-full"
            value={partNumber}
            onChange={(e) => setPartNumber(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2"
        >
          Save
        </button>

      </form>

    </div>
  );
}
