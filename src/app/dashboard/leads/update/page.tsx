'use client';

import { useRouter } from 'next/navigation';
import LeadForm from '@/components/leads/LeadForm';
import LeadService from '@/services/lead.service';

export default function UpdateLeadPage() {
    const router = useRouter();

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-xl font-bold mb-4">Update Lead</h1>

            <LeadForm
                submitLabel="Create Lead"
                initialData={{ fullName: '', email: '', status: 'new' }}
                onSubmit={async (data) => {
                    await LeadService.createLead(data);
                    router.push('/leads');
                }}
            />
        </div>
    );
}
