"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import accountService from "@/services/account.service";
import authService from "@/services/auth.service";
import UserForm from "@/components/users/UserForm";
import { User } from "../../../../../types";
import { FaTimes } from "react-icons/fa";

export default function UpdateUserPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        authService.getCurrentUser().then(setUser);
    }, []);

    if (!user) return <p className="p-6">Loading…</p>;

    return (
        <main className="mx-auto px-5">
            <div className="flex items-center justify-between pt-4">
                <h1 className="mb-4 text-xl font-bold">Update User</h1>
                <button
                    type="submit"
                    onClick={() => {
                        router.push("../");
                    }}
                    className="inline-flex items-center font-medium text-black hover:text-red-600 transition-colors dark:text-white dark:hover:text-red-500 cursor-pointer p-2"
                >
                    <FaTimes className="mr-1" />
                </button>
            </div>
            <p>Client: {user.clientId}</p>
            <UserForm
                initialData={user}
                onSubmit={async (data) => {
                    await accountService.updateUser(data);
                    router.push("../");
                }}
            />
        </main>
    );
}
