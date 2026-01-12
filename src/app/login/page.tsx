'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { validateEmail } from '@/utils/validations';
import { useRouter } from 'next/navigation';
import type { Login } from '@/types';

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

        const loginData: Login = {
            password,
        };

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
            console.error('Login failed:', err);
            setError(err?.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    const loading = isLoading || authLoading;

    return (
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
            <h1 className="text-2xl font-semibold text-center">
                Sign In to Your Account
            </h1>

            {error && (
                <div className="rounded bg-red-100 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <input
                type="text"
                placeholder="Email or Username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
                autoComplete="username"
                data-testid="identifier-input"
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
                autoComplete="current-password"
                data-testid="password-input"
            />

            <button
                type="submit"
                disabled={loading}
                className={`w-full rounded py-2 font-medium text-white transition ${loading
                    ? 'cursor-not-allowed bg-gray-400'
                    : 'bg-black hover:bg-gray-800'
                    }`}
                data-testid="login-button"
            >
                {loading ? 'Logging in…' : 'Login'}
            </button>
        </form>
    );
}