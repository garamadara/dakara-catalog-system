export default function CreateBrand() {
  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-semibold">
        Create Brand
      </h1>

      <div className="bg-white border rounded p-6 space-y-6">

        {/* Brand Name */}
        <div>
          <label className="block text-sm mb-1 font-medium">
            Brand Name
          </label>

          <input
            className="border rounded w-full px-3 py-2"
            placeholder="KYB"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm mb-1 font-medium">
            Country
          </label>

          <input
            className="border rounded w-full px-3 py-2"
            placeholder="Japan"
          />
        </div>

        {/* Logo */}
        <div>
          <label className="block text-sm mb-2 font-medium">
            Brand Logo
          </label>

          <div className="border-dashed border rounded p-8 text-center text-gray-500">
            Upload Logo
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm mb-1 font-medium">
            Description
          </label>

          <textarea
            className="border rounded w-full px-3 py-2"
            rows={3}
          />
        </div>

        {/* Save */}
        <div>
          <button className="bg-green-600 text-white px-6 py-2 rounded">
            Save Brand
          </button>
        </div>

      </div>

    </div>
  )
}
