"use client";

import { TableProps } from "@/types/table";

export default function Table<T>({
  data,
  columns,
  getRowId,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50],
  emptyText = "No data found",
  loading = false,
}: TableProps<T>) {
  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded border px-3 py-2 pr-8 text-sm"
          />

          {searchValue && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
            >
              ✕
            </button>
          )}
        </div>

        {/* Page size */}
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="w-full rounded border px-3 py-2 text-sm sm:w-auto"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded border">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.header}
                  className="p-3 border-b text-sm font-semibold"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-6 text-center text-sm text-gray-500"
                >
                  Loading…
                </td>
              </tr>
            )}

            {!loading && data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-6 text-center text-sm text-gray-500"
                >
                  {emptyText}
                </td>
              </tr>
            )}

            {!loading &&
              data.map((row) => (
                <tr
                  key={getRowId(row)}
                  className="hover:bg-gray-50"
                >
                  {columns.map((col) => (
                    <td
                      key={col.header}
                      className={`p-3 border-b text-sm ${col.className ?? ""}`}
                    >
                      {col.render
                        ? col.render(row)
                        : col.accessor
                        ? col.accessor(row)
                        : null}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {loading && (
          <p className="py-6 text-center text-sm text-gray-500">Loading…</p>
        )}

        {!loading && data.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-500">
            {emptyText}
          </p>
        )}

        {!loading &&
          data.map((row) => (
            <div
              key={getRowId(row)}
              className="rounded-lg border bg-white p-4 shadow-sm"
            >
              <div className="space-y-2">
                {columns.map((col) => (
                  <div key={col.header} className="text-sm">
                    <span className="font-semibold">{col.header}: </span>
                    <span>
                      {col.render
                        ? col.render(row)
                        : col.accessor
                        ? col.accessor(row)
                        : null}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
