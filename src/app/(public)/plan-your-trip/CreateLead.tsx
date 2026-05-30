'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import LeadForm from '@/components/leads/LeadForm';
import LeadService from '@/services/lead.service';
import Toast from '@/components/ui/Toast';
import { FaInfo } from 'react-icons/fa';

export default function CreateLead() {
    const [showToast, setShowToast] = useState(false);
    const [hideFormOnSubmit, setHideFormOnSubmit] = useState(false);

    const searchParams = useSearchParams();
    const source = searchParams.get('source') ?? 'unknown';

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-xl mx-auto">

            {/* Header */}
            <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-1">Beautiful Nepal</p>
            <h1 className="font-serif text-3xl font-medium leading-tight mb-1">
                Plan your <em className="italic text-[#B07D50]">perfect</em> journey
            </h1>
            <p className="text-sm text-gray-500 mb-6 pb-5 border-b border-gray-100 dark:border-gray-800">
                Share your travel details and we&apos;ll connect you with the right local expert.
            </p>

            {/* Info banner */}
            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-2.5 text-[12.5px] text-amber-800 mb-6">
                <FaInfo className="mt-0.5 shrink-0 text-amber-600" />
                <span>BeautifulNepal is not a travel agency — we connect travelers with licensed Nepal-based tour operators.</span>
            </div>



            {hideFormOnSubmit ? (
                <div className="mt-4 text-center">
                    <p className="font-medium text-green-600">
                        Your request has been submitted. We will get back to you soon.
                    </p>
                </div>
            ) : (
                <>


                    <LeadForm
                        submitLabel="Submit"
                        initialData={{
                            id: '',
                            fullName: '',
                            email: '',
                            status: 'new',
                            country: '',
                            destination: '',
                            travelMonth: '',
                            phone: '',
                            source,
                        }}
                        onSubmit={async data => {
                            await LeadService.createLead(data);
                            setShowToast(true);
                            setHideFormOnSubmit(true);
                        }}
                        onUpdate={async data => {
                            await LeadService.updateLead(data);
                        }}
                        resetOnSuccess
                    />
                </>
            )}

            {showToast && (
                <Toast
                    message="Thank you! Your request has been submitted!"
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
}
