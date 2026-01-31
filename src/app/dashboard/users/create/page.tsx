'use client';

import { useRouter } from 'next/navigation';
import AccountService from '@/services/account.service';
import { RegisterUser } from '@/types';
import UserForm from '@/components/users/UserForm';
import { FaTimes } from 'react-icons/fa';

export default function CreateUser() {
    const router = useRouter();

    const handleCreate = async (data: RegisterUser) => {
        await AccountService.registerUser(data);
        router.push('/users');
    };

    return (
        <main className="mx-auto px-5">
            <div className="flex items-center justify-between pt-4">
                <h1 className="text-xl font-bold mb-4">Create User</h1>
                <button
                    type="submit"
                    onClick={() => { router.push('../users') }}
                    className="inline-flex items-center font-medium text-black hover:text-red-600 transition-colors dark:text-white dark:hover:text-red-500 cursor-pointer p-2"
                >
                    <FaTimes className="mr-1" />
                </button>
            </div>
            <UserForm onSubmit={handleCreate} />
        </main>
    );
}
