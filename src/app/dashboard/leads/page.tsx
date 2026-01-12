'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import LeadService from '@/services/lead.service';
import { Lead } from '@/types';

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        LeadService.getLeads()
            .then(setLeads)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="p-4">Loading leads…</p>;

    return (
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Leads</h1>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Destination</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map((lead) => (
                            <tr key={lead.id}>
                                <td className="p-2 border">{lead.fullName}</td>
                                <td className="p-2 border">{lead.email}</td>
                                <td className="p-2 border">{lead.destination}</td>
                                <td className="p-2 border capitalize">{lead.status}</td>
                                <td className="p-2 border">
                                    <Link
                                        href={`/leads/${lead.id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        View / Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
