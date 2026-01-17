'use client';

import Toast from '@/components/ui/Toast';
import ResetPasswordForm from '@/components/users/ResetPasswordForm';
import AccountService from '@/services/account.service';
import { ResetUserPassword } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [showToast, setShowToast] = useState(false);
    const handleReset = async (data: ResetUserPassword) => {
        await AccountService.resetPassword(data);
        setShowToast(true);
    };

    return (
        <div className="max-w-xl mx-auto p-6">
            <div className="flex items-center justify-between pt-4">
                <h1 className="mb-4 text-xl font-bold">Reset Password</h1>
                <button
                    type="submit"
                    onClick={() => { router.push('../') }}
                    className="inline-flex items-center font-medium text-black hover:text-red-600 transition-colors dark:text-white dark:hover:text-red-500 cursor-pointer p-2"
                >
                    <FaTimes className="mr-1" />
                </button>
            </div>
            <ResetPasswordForm onSubmit={handleReset} />
            {showToast && (
                <Toast
                    message="Password updated successfully"
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
}
