'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { validateEmail } from '@/utils/validations';
import { useRouter } from 'next/navigation';
import type { Login } from '@/types';
import Input from '@/components/ui/Input';

export default function Login() {
    const [identifier, setIdentifier] = useState('demo');
    const [password, setPassword] = useState('Pa$$w0rd');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const { login, authLoading } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!identifier) {
            setError('Please enter email or username');
            return;
        }

        const loginData: Login = { password };

        if (validateEmail(identifier)) {
            loginData.email = identifier;
        } else {
            loginData.userName = identifier;
        }

        if (!password) {
            setError('Please enter your password');
            return;
        }

        setIsLoading(true);
        try {
            await login(loginData);
            router.replace('/dashboard');
        } catch (err: any) {
            setError(err?.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    const loading = isLoading || authLoading;

    return (
        <div className="flex justify-center bg-gray-50 ">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lg">
                <form onSubmit={handleLogin} className="space-y-5">
                    <h1 className="text-center text-2xl font-semibold text-gray-900 p-5">
                        Admin Login
                    </h1>

                    {error && (
                        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <Input
                        type="text"
                        placeholder="Email or Username"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        autoComplete="username"
                        data-testid="identifier-input"
                    />

                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        data-testid="password-input"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`
              w-full rounded-lg py-2.5 text-sm font-medium text-white transition
              ${loading
                                ? 'cursor-not-allowed bg-gray-400'
                                : 'bg-black hover:bg-gray-800'}
            `}
                        data-testid="login-button"
                    >
                        {loading ? 'Logging in…' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
