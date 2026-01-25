"use client";

import { useEffect, useMemo, useState } from "react";
import LeadService from "@/services/lead.service";
import { Lead, PaginatedResponse } from "@/types";
import { FaTrash } from "react-icons/fa";
import ConfirmationModal from "@/components/ConfirmationModal";
import Table from "@/components/ui/Table";
import { ColumnDef } from "@/types/table";
import Pagination from "@/components/ui/Pagination";
import Link from "next/dist/client/link";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const totalPages = Math.ceil(totalCount / pageSize);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  /* 🔹 Debounced search */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPageIndex(1);
      setSearch(searchInput.trim());
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  /* 🔹 Data fetch */
  useEffect(() => {
    setLoading(true);

    LeadService.getLeads({
      pageIndex,
      pageSize,
      search: search || undefined,
    })
      .then((res: PaginatedResponse<Lead>) => {
        setLeads(res.data);
        setTotalCount(res.count);
      })
      .finally(() => setLoading(false));
  }, [pageIndex, pageSize, search]);

  /* 🔹 Delete */
  const handleDelete = async () => {
    if (!selectedLeadId) return;

    try {
      await LeadService.deleteLead(selectedLeadId);
      setLeads((prev) => prev.filter((l) => l.id !== selectedLeadId));
    } finally {
      setShowConfirm(false);
      setSelectedLeadId(null);
    }
  };

  /* ✅ Memoized columns */
  const columns: ColumnDef<Lead>[] = useMemo(
    () => [
      { header: "Name", accessor: (l) => l.fullName },
      { header: "Email", accessor: (l) => l.email },
      { header: "Interest", accessor: (l) => l.interestType },
      { header: "Travel", accessor: (l) => l.travelMonth },
      {
        header: "Status",
        accessor: (l) => <span className="capitalize">{l.status}</span>,
      },
      { header: "Source", accessor: (l) => l.source },
      {
        header: "Actions",
        render: (l) => (
          <div className="flex flex-row gap-2"><Link
            href={`./leads/${l.id}`}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Edit
          </Link>
            <FaTrash
              className="cursor-pointer text-red-500 hover:text-red-700"
              onClick={() => {
                setSelectedLeadId(l.id!);
                setShowConfirm(true);
              }} /></div>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Leads</h1>

      <Table<Lead>
        data={leads}
        columns={columns}
        getRowId={(l) => l.id!}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageIndex(1);
          setPageSize(size);
        }}
        loading={loading}
        emptyText="No leads found"
      />

      {/* Pagination */}
      <Pagination
        pageIndex={pageIndex}
        totalPages={totalPages}
        onPrevious={() => setPageIndex((p) => p - 1)}
        onNext={() => setPageIndex((p) => p + 1)}
      />

      <ConfirmationModal
        isOpen={showConfirm}
        title="Delete Lead"
        message="Are you sure you want to delete this lead?"
        confirmText="Yes, Delete"
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
