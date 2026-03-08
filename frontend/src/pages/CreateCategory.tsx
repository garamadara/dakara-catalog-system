export default function CreateCategory() {
  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-semibold">
        Create Category
      </h1>

      <div className="bg-white border rounded p-6 space-y-6">

        {/* Name */}
        <div>
          <label className="block text-sm mb-1 font-medium">
            Category Name
          </label>

          <input
            className="border rounded w-full px-3 py-2"
            placeholder="Suspension"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm mb-1 font-medium">
            Slug
          </label>

          <input
            className="border rounded w-full px-3 py-2"
            placeholder="suspension"
          />
        </div>

        {/* Parent Category */}
        <div>
          <label className="block text-sm mb-1 font-medium">
            Parent Category
          </label>

          <select className="border rounded w-full px-3 py-2">
            <option>None</option>
          </select>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm mb-2 font-medium">
            Category Image
          </label>

          <div className="border-dashed border rounded p-8 text-center text-gray-500">
            Upload Image
          </div>
        </div>

        {/* Submit */}
        <div>
          <button className="bg-green-600 text-white px-6 py-2 rounded">
            Save Category
          </button>
        </div>

      </div>

    </div>
  )
}
