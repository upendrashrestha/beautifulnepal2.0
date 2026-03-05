"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AccountService from "@/services/account.service";
import { PaginatedResponse, User } from "../../../../types";
import Table from "@/components/ui/Table";
import { ColumnDef } from "../../../../types/table";
import Pagination from "@/components/ui/Pagination";
import { FaTrash } from "react-icons/fa";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const totalPages = Math.ceil(totalCount / pageSize);

    /* 🔹 Debounced search */
    useEffect(() => {
        const timeout = setTimeout(() => {
            setPageIndex(1);
            setSearch(searchInput.trim());
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchInput]);

    /* 🔹 Fetch users */
    useEffect(() => {
        setLoading(true);

        AccountService.getUsers({
            pageIndex,
            pageSize,
            search: search || undefined,
        })
            .then((res: PaginatedResponse<User>) => {
                setUsers(res.data);
                setTotalCount(res.count);
            })
            .finally(() => setLoading(false));
    }, [pageIndex, pageSize, search]);

    /* 🔹 Delete */
    const handleDelete = async () => {
        if (!selectedUserId) return;

        try {
            await AccountService.deleteUser(selectedUserId);
            setUsers((prev) => prev.filter((u) => u.userName !== selectedUserId));
        } finally {
            setShowConfirm(false);
            setSelectedUserId(null);
        }
    };

    /* ✅ Table columns */
    const columns: ColumnDef<User>[] = useMemo(
        () => [
            {
                header: "Name",
                accessor: (u) => u.displayName,
            },
            {
                header: "Email",
                accessor: (u) => u.email,
            },
            {
                header: "Username",
                accessor: (u) => u.userName,
            },
            {
                header: "Role",
                accessor: (u) => <span className="capitalize">{u.role}</span>,
            },
            {
                header: "Client",
                accessor: (u) => u.clientName,
            },
            {
                header: "Status",
                accessor: (u) => (
                    <span
                        className={`px-2 py-1 rounded text-xs font-medium ${u.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                    >
                        {u.isActive ? "Active" : "Inactive"}
                    </span>
                ),
            },
            {
                header: "Actions",
                render: (u) => (
                    <div className="flex items-center gap-2">


                        <button
                            type="button"
                            onClick={() => {
                                setSelectedUserId(u.userName!);
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
        [],
    );

    return (
        <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold">Users</h1>

                <Link
                    href="./users/create"
                    className="btn-primary text-center sm:w-auto"
                >
                    + New User
                </Link>
            </div>

            {/* Table */}
            <Table<User>
                data={users}
                columns={columns}
                getRowId={(u) => u.id!}
                searchValue={searchInput}
                onSearchChange={setSearchInput}
                pageSize={pageSize}
                onPageSizeChange={(size) => {
                    setPageIndex(1);
                    setPageSize(size);
                }}
                loading={loading}
                emptyText="No users found"
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
                title="Delete User"
                message="Are you sure you want to delete this user? This action cannot be undone."
                confirmText="Yes, Delete"
                onCancel={() => {
                    setShowConfirm(false);
                    setSelectedUserId(null);
                }}
                onConfirm={handleDelete}
            />
        </div>
    );
}
