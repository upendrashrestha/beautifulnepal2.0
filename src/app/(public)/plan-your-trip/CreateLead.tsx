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
        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8`}>

            <div className="mt-10 space-y-6 ">
                <p className="mb-6 flex items-start justify-center gap-2 rounded-md bg-blue-50 px-4 py-3 text-sm text-blue-800">
                    <FaInfo className="mt-0.5 shrink-0 text-orange-700" />
                    <span>
                        <strong>Info:</strong> BeautifulNepal is not a travel agency. We connect travelers with licensed Nepal-based tour operators.
                    </span>
                </p>

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
        </div>
    );
}
