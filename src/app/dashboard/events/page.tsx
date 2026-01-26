"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import eventService from "@/services/event.service";
import { PaginatedResponse } from "@/types";
import { Event } from "@/types/event.types";
import Table from "@/components/ui/Table";
import { ColumnDef } from "@/types/table";
import Pagination from "@/components/ui/Pagination";
import { FaTrash } from "react-icons/fa";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);

    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const totalPages = Math.ceil(totalCount / pageSize);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    /* 🔹 Debounced search */
    useEffect(() => {
        const timeout = setTimeout(() => {
            setPageIndex(1);
            setSearch(searchInput.trim());
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchInput]);

    /* 🔹 Fetch events */
    useEffect(() => {
        setLoading(true);

        eventService
            .getEvents({
                pageIndex,
                pageSize,
                search: search || undefined,
            })
            .then((res: PaginatedResponse<Event>) => {
                setEvents(res.data);
                setTotalCount(res.count);
            })
            .finally(() => setLoading(false));
    }, [pageIndex, pageSize, search]);

    /* 🔹 Delete */
    const handleDelete = async () => {
        if (!selectedEventId) return;

        try {
            await eventService.deleteEvent(selectedEventId);
            setEvents((prev) => prev.filter((e) => e.id !== selectedEventId));
        } finally {
            setShowConfirm(false);
            setSelectedEventId(null);
        }
    };

    /* ✅ Table columns */
    const columns: ColumnDef<Event>[] = useMemo(
        () => [
            {
                header: "Title",
                accessor: (e) => e.title,
            },
            {
                header: "Location",
                accessor: (e) => e.location,
            },
            {
                header: "Date",
                accessor: (e) => (
                    <span>{new Date(e.eventOn).toLocaleDateString()}</span>
                ),
            },
            {
                header: "Time",
                accessor: (e) => (
                    <span className="text-sm text-gray-600">
                        {e.eventOnTime || "—"}
                        {e.eventOffTime && ` – ${e.eventOffTime}`}
                    </span>
                ),
            },
            {
                header: "Organized By",
                accessor: (e) => e.organizedBy,
            },
            {
                header: "Actions",
                render: (e) => (
                    <div className="flex flex-row gap-2">
                        <Link
                            href={`./events/${e.id}`}
                            className="text-blue-600 hover:underline text-sm font-medium"
                        >
                            Edit
                        </Link>
                        <FaTrash
                            className="cursor-pointer text-red-500 hover:text-red-700"
                            onClick={() => {
                                setSelectedEventId(e.id!);
                                setShowConfirm(true);
                            }} /></div>
                ),
            },
        ],
        [],
    );

    return (
        <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold">Events</h1>

                <Link
                    href="./events/create"
                    className="btn-primary text-center sm:w-auto"
                >
                    + New Event
                </Link>
            </div>

            {/* Table */}
            <Table<Event>
                data={events}
                columns={columns}
                getRowId={(e) => e.id}
                searchValue={searchInput}
                onSearchChange={setSearchInput}
                pageSize={pageSize}
                onPageSizeChange={(size) => {
                    setPageIndex(1);
                    setPageSize(size);
                }}
                loading={loading}
                emptyText="No events found"
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
                title="Delete Event"
                message="Are you sure you want to delete this event?"
                confirmText="Yes, Delete"
                onCancel={() => setShowConfirm(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
}
