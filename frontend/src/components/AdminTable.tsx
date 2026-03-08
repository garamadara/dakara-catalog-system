type Column<T> = {
  header: string;
  accessor: (row: T) => React.ReactNode;
};

type Props<T> = {
  columns: Column<T>[];
  data?: T[];
  isLoading?: boolean;
  emptyText?: string;
};

export default function AdminTable<T>({
  columns,
  data,
  isLoading,
  emptyText = "No data",
}: Props<T>) {
  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          {columns.map((col, i) => (
            <th key={i} className="p-2 text-left">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data && data.length > 0 ? (
          data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="p-2">
                  {col.accessor(row)}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={columns.length}
              className="text-center p-6 text-gray-500"
            >
              {emptyText}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
