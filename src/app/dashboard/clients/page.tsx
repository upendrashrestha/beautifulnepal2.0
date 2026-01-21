"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import clientService from "@/services/client.service";
import { Client, PaginatedResponse } from "@/types";
import Table from "@/components/ui/Table";
import { ColumnDef } from "@/types/table";
import Pagination from "@/components/ui/Pagination";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");


  const totalPages = Math.ceil(totalCount / pageSize);

  /* 🔹 Debounced search */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPageIndex(1);
      setSearch(searchInput.trim());
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  /* 🔹 Fetch clients */
  useEffect(() => {
    setLoading(true);

    clientService
      .getClients({
        pageIndex,
        pageSize,
        search: search || undefined,
        status: status || undefined,
      })
      .then((res: PaginatedResponse<Client>) => {
        setClients(res.data);
        setTotalCount(res.count);
      })
      .finally(() => setLoading(false));
  }, [pageIndex, pageSize, search, status]);

  /* ✅ Table columns (memoized) */
  const columns: ColumnDef<Client>[] = useMemo(
    () => [
      {
        header: "Name",
        accessor: (c) => c.name,
      },
      {
        header: "Status",
        accessor: (c) => (
          <span className="capitalize">{c.status}</span>
        ),
      },
      {
        header: "Verified",
        accessor: (c) => (c.verified ? "✅" : "—"),
      },
      {
        header: "Actions",
        render: (c) => (
          <Link
            href={`./clients/update/${c.id}`}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Edit
          </Link>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Clients</h1>

        <Link
          href="./clients/create"
          className="btn-primary text-center sm:w-auto"
        >
          + New Client
        </Link>
      </div>


      {/* Table */}
      <Table<Client>
        data={clients}
        columns={columns}
        getRowId={(c) => c.id!}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageIndex(1);
          setPageSize(size);
        }}
        loading={loading}
        emptyText="No clients found"
      />

      {/* Pagination */}
     <Pagination
  pageIndex={pageIndex}
  totalPages={totalPages}
  onPrevious={() => setPageIndex((p) => p - 1)}
  onNext={() => setPageIndex((p) => p + 1)}
/>
    </div>
  );
}
