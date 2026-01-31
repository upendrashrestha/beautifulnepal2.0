'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import accountService from '@/services/account.service';
import { ResetPassword as ResetPasswordType } from '@/types';

import PageLayout from '@/components/layouts/PageLayout';
import AnimatedSection from '@/components/AnimatedSection';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ResetPassword() {
    const params = useSearchParams();

    const token = params.get('token') ?? '';
    const email = params.get('email') ?? '';

    const [form, setForm] = useState<ResetPasswordType>({
        email,
        token,
        newPassword: '',
        confirmPassword: '',
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!token || !email) {
        return (
            <PageLayout title="Invalid Link" className="text-center">
                <p className="text-red-600">
                    Invalid or expired reset link.
                </p>
            </PageLayout>
        );
    }

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (form.newPassword !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await accountService.resetPassword(form);
            setSuccess(true);
        } catch {
            setError('Unable to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout
            title={success ? 'Password Reset' : 'Reset Your Password'}
            className="text-center"
        >
            <AnimatedSection>
                <div className="flex flex-col-reverse flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-center xl:gap-20">
                    <div className="animate_top w-full rounded-lg bg-white p-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black md:w-3/5 lg:w-2/3 xl:p-15">

                        {success ? (
                            <div className="mt-4 text-center">
                                <p className="font-medium text-green-600">
                                    Your password has been reset successfully.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={submit} className="space-y-5">
                                <p className="text-sm text-gray-600">
                                    Enter your new password below.
                                </p>

                                <Input
                                    type="password"
                                    placeholder="New password"
                                    className="w-full rounded border p-3"
                                    value={form.newPassword}
                                    onChange={e =>
                                        setForm(prev => ({
                                            ...prev,
                                            newPassword: e.target.value,
                                        }))
                                    }
                                    required
                                />

                                <Input
                                    type="password"
                                    placeholder="Confirm password"
                                    className="w-full rounded border p-3"
                                    value={form.confirmPassword}
                                    onChange={e =>
                                        setForm(prev => ({
                                            ...prev,
                                            confirmPassword: e.target.value,
                                        }))
                                    }
                                    required
                                />

                                {error && (
                                    <p className="text-sm text-red-600">
                                        {error}
                                    </p>
                                )}

                                <Button
                                    label="Reset Password"
                                    loadingLabel='Submitting..'
                                    type="submit"
                                    loading={loading}
                                />
                            </form>
                        )}
                    </div>
                </div>
            </AnimatedSection>
        </PageLayout>
    );
}
