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

        if (!identifier) return setError("Please enter email or username");
        if (!password) return setError("Please enter your password");

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
            setError(err instanceof Error ? err.message : "Invalid credentials");
        } finally {
            setIsLoading(false);
        }
    };

    const loading = isLoading || authLoading;

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-xl">
                {/* Close button */}
                <button
                    type="button"
                    onClick={() => router.push("../")}
                    className="absolute right-4 top-4 text-gray-400 hover:text-red-600 transition"
                >
                    <FaTimes size={18} />
                </button>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
                    Sign In
                </h1>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">
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
                        className="w-full"
                    />

                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        className="w-full"
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
