import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function GallerySection({ form, setForm }: any) {
  const images = form.images || [];

  const onDrop = useCallback(
    (acceptedFiles: any[]) => {
      const mapped = acceptedFiles.map((file: any) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setForm({
        ...form,
        images: [...images, ...mapped],
      });
    },
    [images, form, setForm],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
  });

  function removeImage(index: number) {
    const newImages = images.filter((_: any, i: number) => i !== index);

    setForm({ ...form, images: newImages });
  }

  function setPrimary(index: number) {
    const newImages = [...images];

    const primary = newImages.splice(index, 1)[0];

    newImages.unshift(primary);

    setForm({ ...form, images: newImages });
  }

  return (
    <section className="grid grid-cols-12 gap-6">
      <div className="col-span-3">
        <h3 className="text-sm font-semibold">Gallery</h3>

        <p className="text-xs text-gray-500">Upload product gallery images.</p>
      </div>

      <div className="col-span-9 bg-white border rounded-lg p-6">
        {/* DROP ZONE */}

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
${isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"}
`}
        >
          <input {...getInputProps()} />

          <p className="text-sm text-gray-500">
            Drag & drop images here or click to upload
          </p>
        </div>

        {/* PREVIEW GRID */}

        <div className="grid grid-cols-6 gap-3 mt-6">
          {images.map((img: any, index: number) => (
            <div
              key={index}
              className="relative group border rounded-lg overflow-hidden"
            >
              <img src={img.preview} className="w-full h-20 object-cover" />

              {/* PRIMARY BADGE */}

              {index === 0 && (
                <span className="absolute top-1 left-1 text-[10px] bg-green-600 text-white px-1 rounded">
                  Primary
                </span>
              )}

              {/* ACTIONS */}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2">
                <button
                  type="button"
                  className="text-xs bg-white px-2 py-1 rounded"
                  onClick={() => setPrimary(index)}
                >
                  Primary
                </button>

                <button
                  type="button"
                  className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => removeImage(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
