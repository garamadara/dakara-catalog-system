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
    <div className="bg-white rounded-lg border overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-50 border-b text-xs font-semibold text-gray-600 uppercase tracking-wider">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="px-6 py-3 text-left">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>

          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (

              <tr
                key={rowIndex}
                className="border-b hover:bg-gray-50 transition"
              >

                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 text-sm text-gray-700"
                  >
                    {col.accessor(row)}
                  </td>
                ))}

              </tr>

            ))
          ) : (

            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-10 text-gray-500"
              >
                {emptyText}
              </td>
            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
}