"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AccountService from "@/services/account.service";
import { User } from "@/types";
import { FaTrash } from "react-icons/fa";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!selectedUserId) return;

        try {
            await AccountService.deleteUser(selectedUserId);
            setUsers((prev) => prev.filter((m) => m.userName !== selectedUserId));
        } catch {
            alert("Failed to delete user.");
        } finally {
            setShowConfirm(false);
            setSelectedUserId(null);
        }
    };

    /* Debounced search */
    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearch(searchInput.trim());
        }, 800);

        return () => clearTimeout(timeout);
    }, [searchInput]);

    /* Fetch users */
    useEffect(() => {
        setLoading(true);

        AccountService.getUsers()
            .then((res: User[]) => {
                setUsers(res);
            })
            .finally(() => setLoading(false));
    }, [search]);

    if (loading) return <p className="p-4">Loading users…</p>;

    return (
        <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold">Users</h1>

                <Link
                    href="./users/create"
                    className="btn-primary text-black hover:text-green-700 w-full sm:w-auto text-center"
                >
                    + New User
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-80">
                    <input
                        type="text"
                        placeholder="Search name, email, username..."
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
            </div>

            <div className="hidden md:block overflow-x-auto border rounded">
                <table className="w-full">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-3 border-b">Name</th>
                            <th className="p-3 border-b">Email</th>
                            <th className="p-3 border-b">Username</th>
                            <th className="p-3 border-b">Role</th>
                            <th className="p-3 border-b">Client</th>
                            <th className="p-3 border-b">Status</th>
                            <th className="p-3 border-b">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-4 text-center text-gray-500">
                                    No users found
                                </td>
                            </tr>
                        )}

                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="p-3 border-b">{user.displayName}</td>
                                <td className="p-3 border-b">{user.email}</td>
                                <td className="p-3 border-b">{user.userName}</td>
                                <td className="p-3 border-b capitalize">{user.role}</td>
                                <td className="p-3 border-b">{user.clientName}</td>
                                <td className="p-3 border-b">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${user.isActive
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {user.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="p-3 border-b">
                                    <FaTrash
                                        className="cursor-pointer text-gray-600 hover:text-red-600"
                                        onClick={() => {
                                            setSelectedUserId(user.userName!);
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
                {users.length === 0 && (
                    <p className="text-center text-gray-500 py-6">No users found</p>
                )}

                {users.map((user) => (
                    <div
                        key={user.id}
                        className="rounded-lg border bg-white p-4 shadow-sm"
                    >
                        <div className="space-y-2">
                            <div>
                                <p className="font-semibold">{user.displayName}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>

                            <div className="text-sm text-gray-700">
                                <p>
                                    <strong>Username:</strong> {user.userName}
                                </p>
                                <p>
                                    <strong>Role:</strong> {user.role}
                                </p>
                                <p>
                                    <strong>Client:</strong> {user.clientName}
                                </p>
                            </div>

                            <span
                                className={`inline-block px-2 py-1 rounded text-xs font-medium ${user.isActive
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {user.isActive ? "Active" : "Inactive"}
                            </span>

                            <div className="flex items-center gap-4 pt-2">
                                <FaTrash
                                    className="cursor-pointer text-red-500 hover:text-red-700"
                                    onClick={() => {
                                        setSelectedUserId(user.userName!);
                                        setShowConfirm(true);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ConfirmationModal
                isOpen={showConfirm}
                title="Delete User"
                message="Are you sure you want to delete this user?"
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
