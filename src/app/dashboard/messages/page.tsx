'use client';

import { useEffect, useState } from 'react';
import messageService from '@/services/message.service';
import { Message, PaginatedResponse } from '@/types';
import { FaTrash } from 'react-icons/fa';
import ConfirmationModal from '@/components/ConfirmationModal';



export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');

    const totalPages = Math.ceil(totalCount / pageSize);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setPageIndex(1);
            setSearch(searchInput.trim());
        }, 800); // 👈 UX sweet spot

        return () => clearTimeout(timeout);
    }, [searchInput]);

    useEffect(() => {
        setLoading(true);

        messageService.getMessages({
            pageIndex,
            pageSize,
            search: search || undefined,
            status: status || undefined
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
            setMessages(prev => prev.filter(m => m.id !== selectedMessageId));
        } catch {
            alert('Failed to delete message.');
        } finally {
            setShowConfirm(false);
            setSelectedMessageId(null);
        }
    };

    return (
        <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Messages</h1>
            </div>

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

            {/* Table */}
            <div className="overflow-x-auto border rounded">
                <table className="w-full">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-3 border-b">Name</th>
                            <th className="p-3 border-b">Category</th>
                            <th className="p-3 border-b">Content</th>
                            <th className="p-3 border-b">SendOn</th>
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

                        {messages.map((message) => (
                            <tr key={message.id} className="hover:bg-gray-50">
                                <td className="p-3 border-b">{message.createdBy}</td>
                                <td className="p-3 border-b capitalize">{message.category}</td>
                                <td className="p-3 border-b">{message.content}</td>
                                <td className="p-3 border-b">{message.createdOn}</td>
                                <td className="p-3 border-b"><FaTrash
                                    className="cursor-pointer text-gray-600 hover:text-red-600"
                                    onClick={() => {
                                        setSelectedMessageId(message.id!);
                                        setShowConfirm(true);
                                    }}
                                />
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
