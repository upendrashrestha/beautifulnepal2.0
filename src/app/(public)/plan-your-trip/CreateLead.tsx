'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import LeadForm from '@/components/leads/LeadForm';
import LeadService from '@/services/lead.service';
import Toast from '@/components/ui/Toast';
import PageLayout from '@/components/layouts/PageLayout';
import AnimatedSection from '@/components/AnimatedSection';

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
                
            </AnimatedSection>
        </PageLayout>
    );
}
