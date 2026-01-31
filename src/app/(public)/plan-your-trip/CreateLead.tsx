'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import LeadForm from '@/components/leads/LeadForm';
import LeadService from '@/services/lead.service';
import Toast from '@/components/ui/Toast';
import PageLayout from '@/components/layouts/PageLayout';
import AnimatedSection from '@/components/AnimatedSection';
import { FaInfo } from 'react-icons/fa';

export default function CreateLead() {
    const [showToast, setShowToast] = useState(false);
    const [hideFormOnSubmit, setHideFormOnSubmit] = useState(false);

    const searchParams = useSearchParams();
    const source = searchParams.get('source') ?? 'unknown';

    return (
        <PageLayout
            title={hideFormOnSubmit ? 'Thank You!' : 'Plan your trip to Nepal'}
            className="text-center"
        >
            <AnimatedSection>

                <div className="flex flex-col-reverse flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-center xl:gap-20">
                    <div className="animate_top w-full rounded-lg bg-white p-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black md:w-3/5 lg:w-3/4 xl:p-15">
                        <p className="mb-6 flex items-start gap-2 rounded-md bg-blue-50 px-4 py-3 text-sm text-blue-800">
                            <FaInfo className="mt-0.5 shrink-0" />
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
                                <p className="mb-6 text-sm leading-relaxed text-gray-600">
                                    Share your travel details and we’ll connect you with the best local travel
                                    agencies to help you plan your trip to Nepal. This service is completely
                                    free — we’re here to help make your visit smooth, safe, and unforgettable.
                                </p>

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
            </AnimatedSection>
        </PageLayout>
    );
}
