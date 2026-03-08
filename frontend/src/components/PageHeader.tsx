type Props = {
  title: string;
  search?: string;
  onSearchChange?: (value: string) => void;
  actionLabel?: string;
  onAction?: () => void;
};

export default function PageHeader({
  title,
  search,
  onSearchChange,
  actionLabel,
  onAction,
}: Props) {
  return (
    <div className="flex items-center justify-between mb-4">

      <h1 className="text-xl font-semibold">
        {title}
      </h1>

      <div className="flex gap-3">

        {onSearchChange && (
          <input
            placeholder={`Search ${title.toLowerCase()}...`}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="border px-3 py-2 w-64"
          />
        )}

        {actionLabel && (
          <button
            onClick={onAction}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {actionLabel}
          </button>
        )}

      </div>

    </div>
  );
}
