'use client';

import { useEffect, useState } from 'react';
import LeadForm from '@/components/leads/LeadForm';
import leadService from '@/services/lead.service';
import { Lead } from '@/types';
import Toast from '@/components/ui/Toast';
import { useParams, useRouter } from 'next/navigation';
import { FaTimes } from 'react-icons/fa';

export default function UpdateLeadPage() {
    const router = useRouter();
     const params = useParams<{ id: string }>();
          const  id  = params?.id;
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
                <h1 className="text-xl font-bold mb-4">Update Lead</h1>
                <button
                    type="submit"
                    onClick={() => { router.push('../leads') }}
                    className="inline-flex items-center font-medium text-black hover:text-red-600 transition-colors dark:text-white dark:hover:text-red-500 cursor-pointer p-2"
                >
                    <FaTimes className="mr-1" />
                </button>
            </div>
            <LeadForm
                submitLabel="Update Lead"
                initialData={lead}
                onSubmit={async (data) => {
                    await leadService.createLead(data);
                }}
                onUpdate={async (data) => {
                    await leadService.updateLead(data);
                    setShowToast(true);
                    router.push('../leads');
                }}
            />


            {showToast && (
                <Toast
                    message="Leads updated successfully!"
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
}
