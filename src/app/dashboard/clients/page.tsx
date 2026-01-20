// app/clients/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clientService from "@/services/client.service";
import { Client, PaginatedResponse } from "@/types";

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const totalPages = Math.ceil(totalCount / pageSize);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setPageIndex(1);
            setSearch(searchInput.trim());
        }, 800); // 👈 UX sweet spot

        return () => clearTimeout(timeout);
    }, [searchInput]);

    useEffect(() => {
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
    }, [pageIndex, search, status, pageSize]);

    if (loading) return <p className="p-6">Loading clients…</p>;

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Clients</h1>

            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Filters */}
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search clients..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full sm:w-64 rounded border px-3 py-2 pr-8"
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
                        value={status}
                        onChange={(e) => {
                            setPageIndex(1);
                            setStatus(e.target.value);
                        }}
                        className="rounded border px-3 py-2"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(+e.target.value)}
                        className="rounded border px-3 py-2"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </select>
                </div>

                {/* CTA */}
                <Link
                    href="./clients/create"
                    className="btn-primary text-center md:w-auto"
                >
                    + New Client
                </Link>
            </div>

            <div className="hidden md:block border rounded overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Verified</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((c) => (
                            <tr key={c.id} className="border-t hover:bg-gray-50">
                                <td className="p-3">{c.name}</td>
                                <td className="p-3 capitalize">{c.status}</td>
                                <td className="p-3">{c.verified ? "✅" : "—"}</td>
                                <td className="p-3">
                                    <Link
                                        href={`./clients/update/${c.id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="space-y-3 md:hidden">
                {clients.map((c) => (
                    <div key={c.id} className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold">{c.name}</p>
                                <p className="text-sm text-gray-500 capitalize">
                                    Status: {c.status}
                                </p>
                                <p className="text-sm">Verified: {c.verified ? "✅" : "—"}</p>
                            </div>

                            <Link
                                href={`./clients/update/${c.id}`}
                                className="text-blue-600 text-sm font-medium"
                            >
                                Edit
                            </Link>
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
        </div>
    );
}
