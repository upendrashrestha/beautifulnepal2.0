"use client";

import { useEffect, useState } from "react";
import messageService from "@/services/message.service";
import { Message, PaginatedResponse } from "@/types";
import { FaTrash } from "react-icons/fa";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const totalPages = Math.ceil(totalCount / pageSize);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
        null,
    );

    useEffect(() => {
        const timeout = setTimeout(() => {
            setPageIndex(1);
            setSearch(searchInput.trim());
        }, 800); // 👈 UX sweet spot

        return () => clearTimeout(timeout);
    }, [searchInput]);

    useEffect(() => {
        setLoading(true);

        messageService
            .getMessages({
                pageIndex,
                pageSize,
                search: search || undefined,
                status: status || undefined,
            })
            .then((res: PaginatedResponse<Message>) => {
                setMessages(res.data);
                setTotalCount(res.count);
            })
            .finally(() => setLoading(false));
    }, [pageIndex, search, status, pageSize]);

    if (loading) return <p className="p-4">Loading messages…</p>;

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

    return (
        <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold">Messages</h1>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <div className="relative w-full sm:w-64">
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full rounded border px-3 py-2 pr-8"
                    />
                    {searchInput && (
                        <button
                            onClick={() => {
                                setSearchInput("");
                                setSearch("");
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <select
                    value={pageSize}
                    onChange={(e) => setPageSize(parseInt(e.target.value))}
                    className="rounded border px-3 py-2"
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                </select>
            </div>
            <div className="hidden md:block overflow-x-auto border rounded">
                <table className="w-full">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-3 border-b">Name</th>
                            <th className="p-3 border-b">Category</th>
                            <th className="p-3 border-b">Content</th>
                            <th className="p-3 border-b">Sent On</th>
                            <th className="p-3 border-b">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-gray-500">
                                    No messages found
                                </td>
                            </tr>
                        )}

                        {messages.map((m) => (
                            <tr key={m.id} className="hover:bg-gray-50">
                                <td className="p-3 border-b">{m.createdBy}</td>
                                <td className="p-3 border-b capitalize">{m.category}</td>
                                <td className="p-3 border-b truncate max-w-xs">{m.content}</td>
                                <td className="p-3 border-b">{m.createdOn}</td>
                                <td className="p-3 border-b">
                                    <FaTrash
                                        className="cursor-pointer text-gray-600 hover:text-red-600"
                                        onClick={() => {
                                            setSelectedMessageId(m.id!);
                                            setShowConfirm(true);
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="space-y-3 md:hidden">
                {messages.length === 0 && (
                    <p className="text-center text-gray-500 py-6">No messages found</p>
                )}

                {messages.map((m) => (
                    <div key={m.id} className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex justify-between items-start gap-3">
                            <div className="space-y-1">
                                <p className="font-semibold">{m.createdBy}</p>
                                <p className="text-sm text-gray-500 capitalize">
                                    Category: {m.category}
                                </p>
                                <p className="text-sm text-gray-700">{m.content}</p>
                                <p className="text-xs text-gray-400">Sent on {m.createdOn}</p>
                            </div>

                            <FaTrash
                                className="cursor-pointer text-gray-500 hover:text-red-600 mt-1"
                                onClick={() => {
                                    setSelectedMessageId(m.id!);
                                    setShowConfirm(true);
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-gray-600">
                    Page {pageIndex} of {totalPages}
                </span>

                <div className="flex gap-2">
                    <button
                        disabled={pageIndex === 1}
                        onClick={() => setPageIndex((p) => p - 1)}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        disabled={pageIndex === totalPages}
                        onClick={() => setPageIndex((p) => p + 1)}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

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
