"use client";

import { useEffect, useMemo, useState } from "react";
import { FaTrash } from "react-icons/fa";
import messageService from "@/services/message.service";
import { Message, PaginatedResponse } from "@/types";
import ConfirmationModal from "@/components/ConfirmationModal";
import Table from "@/components/ui/Table";
import { ColumnDef } from "@/types/table";
import Pagination from "@/components/ui/Pagination";

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  const totalPages = Math.ceil(totalCount / pageSize);

  /* 🔹 Debounced search */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPageIndex(1);
      setSearch(searchInput.trim());
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  /* 🔹 Fetch messages */
  useEffect(() => {
    setLoading(true);

    messageService
      .getMessages({
        pageIndex,
        pageSize,
        search: search || undefined,
      })
      .then((res: PaginatedResponse<Message>) => {
        setMessages(res.data);
        setTotalCount(res.count);
      })
      .finally(() => setLoading(false));
  }, [pageIndex, pageSize, search]);

  /* 🔹 Delete handler */
  const handleDelete = async () => {
    if (!selectedMessageId) return;

    try {
      await messageService.deleteMessage(selectedMessageId);
      setMessages((prev) => prev.filter((m) => m.id !== selectedMessageId));
    } catch {
      alert("Failed to delete message.");
    } finally {
      setShowConfirm(false);
      setSelectedMessageId(null);
    }
  };

  /* ✅ Table columns */
  const columns: ColumnDef<Message>[] = useMemo(
    () => [
      {
        header: "Name",
        accessor: (m) => m.createdBy,
      },
      {
        header: "Category",
        accessor: (m) => (
          <span className="capitalize">{m.category}</span>
        ),
      },
      {
        header: "Content",
        accessor: (m) => (
          <span className="block max-w-xs truncate">{m.content}</span>
        ),
      },
      {
        header: "Sent On",
        accessor: (m) => m.createdOn,
      },
      {
        header: "Actions",
        render: (m) => (
          <FaTrash
            className="cursor-pointer text-gray-500 hover:text-red-600"
            onClick={() => {
              setSelectedMessageId(m.id!);
              setShowConfirm(true);
            }}
          />
        ),
      },
    ],
    []
  );

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <h1 className="text-2xl font-bold">Messages</h1>

      {/* Table */}
      <Table<Message>
        data={messages}
        columns={columns}
        getRowId={(m) => m.id!}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageIndex(1);
          setPageSize(size);
        }}
        loading={loading}
        emptyText="No messages found"
      />

      {/* Pagination */}
          <Pagination
       pageIndex={pageIndex}
       totalPages={totalPages}
       onPrevious={() => setPageIndex((p) => p - 1)}
       onNext={() => setPageIndex((p) => p + 1)}
     />

      {/* Confirm delete */}
      <ConfirmationModal
        isOpen={showConfirm}
        title="Delete Message"
        message="Are you sure you want to delete this message?"
        confirmText="Yes, Delete"
        onCancel={() => {
          setShowConfirm(false);
          setSelectedMessageId(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
