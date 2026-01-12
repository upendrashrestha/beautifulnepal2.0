'use client';

import LeadForm from '@/components/leads/LeadForm';
import LeadService from '@/services/lead.service';
import Toast from '@/components/ui/Toast';
import { useState } from 'react';

export default function CreateLeadPage() {
    const [showToast, setShowToast] = useState(false);

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-xl font-bold mb-4">Are you planning to visit Nepal?</h1>
            <p className="mb-6 text-sm leading-relaxed text-gray-600">
                Share your travel details and we’ll connect you with the best local travel
                agencies to help you plan your trip to Nepal. This service is completely
                free — we’re here to help make your visit smooth, safe, and unforgettable.
            </p>
            <LeadForm
                submitLabel="Submit"
                initialData={{ fullName: '', email: '', status: 'new' }}
                onSubmit={async (data) => {
                    await LeadService.createLead(data);
                    setShowToast(true);
                }}
                resetOnSuccess={true} // ✅ clear form after successful submission
            />

            {showToast && (
                <Toast
                    message="🎉 Your request was submitted successfully!"
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
}
