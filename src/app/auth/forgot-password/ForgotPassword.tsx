'use client';

import { useState } from 'react';
import accountService from '@/services/account.service';

import PageLayout from '@/components/layouts/PageLayout';
import AnimatedSection from '@/components/AnimatedSection';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | undefined>('');

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await accountService.forgotPassword({ email });
            setSuccess(true);
        } catch {
            setError('Unable to send reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout
            title={success ? 'Email Sent' : 'Forgot Password'}
            className="text-center"
        >
            <AnimatedSection>
                <div className="flex flex-col-reverse flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-center xl:gap-20">
                    <div className="animate_top w-full rounded-lg bg-white p-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black md:w-3/5 lg:w-2/3 xl:p-15">

                        {success ? (
                            <div className="mt-4 text-center">
                                <p className="font-medium text-green-600">
                                    If the email exists in our system, a password reset link has been sent.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={submit} className="space-y-5">
                                <p className="text-sm text-gray-600">
                                    Enter your email below and we’ll send you a password reset link.
                                </p>

                                <Input
                                    type="email"
                                    placeholder="Email address"
                                    className="w-full rounded border p-3"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    error={error}
                                />


                                <Button
                                    type="submit"
                                    disabled={loading}
                                    label='Send Reset Link'
                                    loading={loading}
                                    loadingLabel='Submitting...' />
                            </form>
                        )}
                    </div>
                </div>
            </AnimatedSection>
        </PageLayout>
    );
}
