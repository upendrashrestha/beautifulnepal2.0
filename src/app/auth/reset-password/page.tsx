import { Suspense } from 'react';
import { Metadata } from 'next';
import { generateMetadataHelper } from '@/utils/generateMetadataHelper';
import ResetPassword from './ResetPassword';

export async function generateMetadata(): Promise<Metadata> {
    return generateMetadataHelper({
        title: 'Reset Password',
        description: 'Reset your account password securely.',
        keywords: 'reset password, account security, forgot password',
    });
}

export default function Page() {
    return (
        <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
            <ResetPassword />
        </Suspense>
    );
}
