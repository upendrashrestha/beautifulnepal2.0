"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import listingService from "@/services/listing.service";
import Table from "@/components/ui/Table";
import { ColumnDef } from "../../../../types/table";
import Pagination from "@/components/ui/Pagination";
import { FaTrash } from "react-icons/fa";
import ConfirmationModal from "@/components/ConfirmationModal";
import { Listing } from "../../../../types/listing.types";
import { ItineraryItem } from "../../../../types/itinerary.types";
import { PaginatedResponse } from "../../../../types";

export default function ListingsPage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(false);

    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

    const totalPages = Math.ceil(totalCount / pageSize);

    /* 🔹 Debounced search */
    useEffect(() => {
        const timeout = setTimeout(() => {
            setPageIndex(1);
            setSearch(searchInput.trim());
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchInput]);

    /* 🔹 Fetch listings */
    useEffect(() => {
        setLoading(true);
        listingService
            .getListings({
                pageIndex,
                pageSize,
                search: search || undefined,
            })
            .then((res: PaginatedResponse<Listing>) => {
                setListings(res.data);
                setTotalCount(res.count);
            })
            .finally(() => setLoading(false));
    }, [pageIndex, pageSize, search]);

    /* 🔹 Delete */
    const handleDelete = async () => {
        if (!selectedListingId) return;
        try {
            await listingService.deleteListing(selectedListingId);
            setListings((prev) => prev.filter((l) => l.id !== selectedListingId));
        } finally {
            setShowConfirm(false);
            setSelectedListingId(null);
        }
    };

    /* ✅ Table columns */
    const columns: ColumnDef<Listing>[] = useMemo(
        () => [
            { header: "Title", accessor: (l) => l.title },
            { header: "Location", accessor: (l) => l.location },
            { header: "Price", accessor: (l) => `${l.currency || "USD"} ${l.price}` },
            { header: "Listing Type", accessor: (l) => l.listingType },
            {
                header: "Itinerary",
                render: (l) =>
                    l.itinerary ? (
                        <div className="flex flex-col gap-1">
                            <span>Duration: {l.itinerary.duration || "—"}</span>
                            <span>Difficulty: {l.itinerary.difficultyLevel || "—"}</span>
                            {l.itinerary.items && l.itinerary.items.length > 0 && (
                                <ul className="ml-2 list-disc text-sm text-gray-700">
                                    {l.itinerary.items.map((item: ItineraryItem) => (
                                        <li key={item.id}>
                                            Day {item.day}: {item.description || "—"}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ) : (
                        "—"
                    ),
            },
            { header: "Total Views", accessor: (l) => l.viewCount },
            {
                header: "Actions",
                render: (l) => (<div className="flex items-center gap-2">
                    <Link
                        href={`./listings/${l.id}`}
                        className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Edit
                    </Link>

                    <button
                        type="button"
                        onClick={() => {
                            setSelectedListingId(l.id!);
                            setShowConfirm(true);
                        }}
                        className="inline-flex items-center gap-1 cursor-pointer rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label="Delete lead"
                    >
                        <FaTrash className="text-sm" />
                        Delete
                    </button>
                </div>

                ),
            },
        ],
        []
    );

    return (
        <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold">Listings</h1>
                <Link href="./listings/create" className="btn-primary text-center sm:w-auto">
                    + New Listing
                </Link>
            </div>

            {/* Table */}
            <Table<Listing>
                data={listings}
                columns={columns}
                getRowId={(l) => l.id}
                searchValue={searchInput}
                onSearchChange={setSearchInput}
                pageSize={pageSize}
                onPageSizeChange={(size) => {
                    setPageIndex(1);
                    setPageSize(size);
                }}
                loading={loading}
                emptyText="No listings found"
            />

            {/* Pagination */}
            <Pagination
                pageIndex={pageIndex}
                totalPages={totalPages}
                onPrevious={() => setPageIndex((p) => Math.max(1, p - 1))}
                onNext={() => setPageIndex((p) => Math.min(totalPages, p + 1))}
            />

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={showConfirm}
                title="Delete Listing"
                message="Are you sure you want to delete this listing?"
                confirmText="Yes, Delete"
                onCancel={() => setShowConfirm(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
}
