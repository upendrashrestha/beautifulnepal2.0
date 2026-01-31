'use client';

import Toast from '@/components/ui/Toast';
import ChangePasswordForm from '@/components/users/ChangePasswordForm';
import AccountService from '@/services/account.service';
import { ChangeUserPassword } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

export default function ChangePasswordPage() {
    const router = useRouter();
    const [showToast, setShowToast] = useState(false);
    const handleChangePassword = async (data: ChangeUserPassword) => {
        await AccountService.changePassword(data);
        setShowToast(true);
    };

    return (
        <main className="mx-auto px-5">
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
            <ChangePasswordForm onSubmit={handleChangePassword} />
            {showToast && (
                <Toast
                    message="Password updated successfully"
                    onClose={() => setShowToast(false)}
                />
            )}
        </main>
    );
}
