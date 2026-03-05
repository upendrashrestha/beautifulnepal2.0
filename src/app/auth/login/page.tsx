"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { validateEmail } from "@/utils/validations";
import { useRouter } from "next/navigation";
import type { Login } from "../../../../types";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PageLayout from "@/components/layouts/PageLayout";
import AnimatedSection from "@/components/AnimatedSection";
import TrekAppBanner from "@/components/TrekappBanner";

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
        <PageLayout
            title={'Login'}
            className="text-center"
        >
            <TrekAppBanner />
            <AnimatedSection>
                <div className="flex flex-col-reverse flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-center xl:gap-20">
                    <div className="animate_top w-full rounded-lg bg-white p-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black md:w-3/5 lg:w-2/3 xl:p-15">
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

                            {/* Forgot Password link */}
                            <div className="text-right">
                                <button
                                    type="button"
                                    className="text-sm text-blue-600 hover:underline cursor-pointer"
                                    onClick={() => router.push("./forgot-password")}
                                >
                                    Forgot Password?
                                </button>
                            </div>

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
            </AnimatedSection>
        </PageLayout>

    );
}
