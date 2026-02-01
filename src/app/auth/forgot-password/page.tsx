import { Suspense } from 'react';
import { Metadata } from 'next';
import { generateMetadataHelper } from '@/utils/generateMetadataHelper';
import ForgotPassword from './ForgotPassword';

export async function generateMetadata(): Promise<Metadata> {
    return generateMetadataHelper({
        title: 'Forgot Password',
        description: 'Request a password reset link by entering your email.',
        keywords: 'forgot password, reset password, email',
    });
}

export default function Page() {
    return (
        <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
            <ForgotPassword />
        </Suspense>
    );
}
