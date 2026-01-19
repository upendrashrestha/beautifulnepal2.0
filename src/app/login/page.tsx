"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { validateEmail } from "@/utils/validations";
import { useRouter } from "next/navigation";
import type { Login } from "@/types";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { FaTimes } from "react-icons/fa";

export default function Login() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const { login, authLoading } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!identifier) {
            setError("Please enter email or username");
            return;
        }

        if (!password) {
            setError("Please enter your password");
            return;
        }

        const loginData: Login = { password };

        if (validateEmail(identifier)) {
            loginData.email = identifier;
        } else {
            loginData.userName = identifier;
        }

        setIsLoading(true);
        try {
            await login(loginData);
            router.replace("/dashboard");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Invalid credentials");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const loading = isLoading || authLoading;

    return (
        <div className="min-h-screen flex flex-col items-center mt-30 text-black text-center">
            <div className="w-full max-w-lg">
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => router.push("../")}
                        className="flex items-center font-medium text-black hover:text-red-600 transition-colors dark:text-white dark:hover:text-red-500 cursor-pointer p-2"
                    >
                        <FaTimes className="mr-1" />
                    </button>
                </div>
                <div className="flex items-center justify-between py-4">
                    <h1 className="text-3xl mb-4">Sign In</h1>
                </div>
                <form onSubmit={handleLogin} className="space-y-5">
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
                        className="p-2"
                    />

                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        className="p-2"
                    />

                    <Button
                        type="submit"
                        label="Login"
                        loading={loading}
                        disabled={loading}
                        loadingLabel="Logging in..."
                    />
                </form>
            </div>
        </div>
    );
}
