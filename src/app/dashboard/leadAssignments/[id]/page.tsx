'use client';

import { useEffect, useState } from 'react';
import leadService from '@/services/lead.service';
import { Lead } from '@/types';
import Toast from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';
import { FaTimes } from 'react-icons/fa';
import LeadAssignmentForm from '@/components/leads/LeadAssignmentForm';

export default function UpdateLeadPage({
    params,
}: {
    params: { id: string };
}) {
    const router = useRouter();
    const { id } = params;
    const [showToast, setShowToast] = useState(false);
    const [lead, setLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLead = async () => {
            try {
                const data = await leadService.getLeadById(id);
                setLead(data);
            } catch (error) {
                console.error('Failed to load lead', error);
                setLead(null);
            } finally {
                setLoading(false);
            }
        };

        fetchLead();
    }, [id]);

    if (loading) return <p className="p-4">Loading lead…</p>;
    if (!lead) return <p className="p-4 text-red-500">Lead not found</p>;

    return (
        <div className="max-w-xl mx-auto p-6">

            <div className="flex items-center justify-between pt-4">
                <h1 className="text-xl font-bold mb-4">     Assign Lead to Agency
                </h1>
                <button
                    type="submit"
                    onClick={() => { router.push('../leads') }}
                    className="inline-flex items-center font-medium text-black hover:text-red-600 transition-colors dark:text-white dark:hover:text-red-500 cursor-pointer p-2"
                >
                    <FaTimes className="mr-1" />
                </button>
            </div>

            <LeadAssignmentForm leadId={id} />

            {showToast && (
                <Toast
                    message="Leads updated successfully!"
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
}
