"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LeadService from "@/services/lead.service";
import { Lead, PaginatedResponse } from "@/types";
import { FaTrash } from "react-icons/fa";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const totalPages = Math.ceil(totalCount / pageSize);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!selectedLeadId) return;

        try {
            await LeadService.deleteLead(selectedLeadId);
            setLeads((prev) => prev.filter((m) => m.id !== selectedLeadId));
        } catch {
            alert("Failed to delete lead.");
        } finally {
            setShowConfirm(false);
            setSelectedLeadId(null);
        }
    };
    useEffect(() => {
        const timeout = setTimeout(() => {
            setPageIndex(1);
            setSearch(searchInput.trim());
        }, 800); // 👈 UX sweet spot

        return () => clearTimeout(timeout);
    }, [searchInput]);

    useEffect(() => {
        setLoading(true);

        LeadService.getLeads({
            pageIndex,
            pageSize,
            search: search || undefined,
            status: status || undefined,
        })
            .then((res: PaginatedResponse<Lead>) => {
                setLeads(res.data);
                setTotalCount(res.count);
            })
            .finally(() => setLoading(false));
    }, [pageIndex, search, status, pageSize]);

    if (loading) return <p className="p-4">Loading leads…</p>;

    return (
        <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold">Leads</h1>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <div className="relative w-full sm:w-64">
                    <input
                        type="text"
                        placeholder="Search leads..."
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
                    value={status}
                    onChange={(e) => {
                        setPageIndex(1);
                        setStatus(e.target.value);
                    }}
                    className="rounded border px-3 py-2"
                >
                    <option value="">All Status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="inprogress">In Progress</option>
                    <option value="assigned">Client Assigned</option>
                    <option value="lost">Lost</option>
                    <option value="cancelled">Cancelled</option>
                </select>

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
            {/* Table */}
            <div className="hidden md:block overflow-x-auto border rounded">
                <table className="w-full">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-3 border-b">Name</th>
                            <th className="p-3 border-b">Email</th>
                            <th className="p-3 border-b">Interest</th>
                            <th className="p-3 border-b">Travel</th>
                            <th className="p-3 border-b">Status</th>
                            <th className="p-3 border-b">Source</th>
                            <th className="p-3 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-4 text-center text-gray-500">
                                    No leads found
                                </td>
                            </tr>
                        )}

                        {leads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-gray-50">
                                <td className="p-3 border-b">{lead.fullName}</td>
                                <td className="p-3 border-b">{lead.email}</td>
                                <td className="p-3 border-b">{lead.interestType}</td>
                                <td className="p-3 border-b">{lead.travelMonth}</td>
                                <td className="p-3 border-b capitalize">{lead.status}</td>
                                <td className="p-3 border-b">{lead.source}</td>
                                <td className="p-3 border-b">
                                    <div className="flex gap-2 text-sm">
                                        <Link
                                            href={`./leads/${lead.id}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <span>|</span>
                                        <Link
                                            href={`./leadAssignments/${lead.id}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Assign
                                        </Link>
                                        <span>|</span>
                                        <FaTrash
                                            className="cursor-pointer text-red-400 hover:text-red-600"
                                            onClick={() => {
                                                setSelectedLeadId(lead.id!);
                                                setShowConfirm(true);
                                            }}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="space-y-3 md:hidden">
                {leads.length === 0 && (
                    <p className="text-center text-gray-500 py-6">No leads found</p>
                )}

                {leads.map((lead) => (
                    <div
                        key={lead.id}
                        className="rounded-lg border bg-white p-4 shadow-sm"
                    >
                        <div className="space-y-2">
                            <div>
                                <p className="font-semibold">{lead.fullName}</p>
                                <p className="text-sm text-gray-500">{lead.email}</p>
                            </div>

                            <div className="text-sm text-gray-700">
                                <p>
                                    <strong>Interest:</strong> {lead.interestType}
                                </p>
                                <p>
                                    <strong>Travel:</strong> {lead.travelMonth}
                                </p>
                                <p>
                                    <strong>Status:</strong>{" "}
                                    <span className="capitalize">{lead.status}</span>
                                </p>
                                <p>
                                    <strong>Source:</strong> {lead.source}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 pt-2 text-sm">
                                <Link
                                    href={`./leads/${lead.id}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    Edit
                                </Link>

                                <Link
                                    href={`./leadAssignments/${lead.id}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    Assign
                                </Link>

                                <FaTrash
                                    className="cursor-pointer text-red-400 hover:text-red-600"
                                    onClick={() => {
                                        setSelectedLeadId(lead.id!);
                                        setShowConfirm(true);
                                    }}
                                />
                            </div>
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
                title="Delete Lead"
                message="Are you sure you want to delete this lead?"
                confirmText="Yes, Delete"
                onCancel={() => {
                    setShowConfirm(false);
                    setSelectedLeadId(null);
                }}
                onConfirm={handleDelete}
            />
        </div>
    );
}
