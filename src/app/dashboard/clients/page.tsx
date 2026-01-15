// app/clients/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import clientService from '@/services/client.service';
import { Client, PaginatedResponse } from '@/types';

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');

    const totalPages = Math.ceil(totalCount / pageSize);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setPageIndex(1);
            setSearch(searchInput.trim());
        }, 800); // 👈 UX sweet spot

        return () => clearTimeout(timeout);
    }, [searchInput]);

    useEffect(() => {
        clientService.getClients({
            pageIndex,
            pageSize,
            search: search || undefined,
            status: status || undefined
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
            <div className="flex justify-between items-center">

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setPageIndex(1);
                                setSearch(searchInput.trim());
                            }
                            if (e.key === 'Escape') {
                                setSearchInput('');
                                setSearch('');
                            }
                        }}
                        className="
       rounded border border-gray-300 bg-white px-3 py-2 pr-8
      text-gray-900 caret-gray-900
      focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
    "
                    /> {searchInput && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchInput('');
                                setSearch('');
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                            aria-label="Clear search"
                        >
                            ✕
                        </button>)}

                    <select
                        value={status}
                        onChange={(e) => {
                            setPageIndex(1);
                            setStatus(e.target.value);
                        }}
                        className="border rounded px-3 py-2"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">InActive</option>
                    </select>
                    <label className='p-2'>Page Size</label>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(parseInt(e.target.value));
                        }}
                        className="border rounded px-3 py-2"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </select>
                </div>
                <Link href="./clients/create" className="btn-primary text-black hover:text-green-700">
                    + New Client
                </Link>
            </div>

            <div className="border rounded overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-3 border-b">Name</th>
                            <th className="p-3 border-b">Status</th>
                            <th className="p-3 border-b">Verified</th>
                            <th className="p-3 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(c => (
                            <tr key={c.id} className="border-t hover:bg-gray-50">
                                <td className="p-3 border-b">{c.name}</td>
                                <td className="p-3 capitalize border-b">{c.status}</td>
                                <td className="p-3 border-b">{c.verified ? '✅' : '—'}</td>
                                <td className="p-3 border-b">
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

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                    Page {pageIndex} of {totalPages}
                </span>

                <div className="flex gap-2">
                    <button
                        disabled={pageIndex === 1}
                        onClick={() => setPageIndex((p) => p - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <button
                        disabled={pageIndex === totalPages}
                        onClick={() => setPageIndex((p) => p + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
