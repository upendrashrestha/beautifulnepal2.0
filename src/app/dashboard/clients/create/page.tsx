'use client';

import { useRouter } from 'next/navigation';
import clientService from '@/services/client.service';
import ClientForm from '@/components/clients/ClientForm';
import { FaTimes } from 'react-icons/fa';

export default function CreateClientPage() {
    const router = useRouter();

    return (
        <div className="max-w-xl mx-auto p-6">
            <div className="flex items-center justify-between pt-4">
                <h1 className="text-xl font-bold mb-4">Create Client</h1>
                <button
                    type="submit"
                    onClick={() => { router.push('../clients') }}
                    className="inline-flex items-center font-medium text-black hover:text-red-600 transition-colors dark:text-white dark:hover:text-red-500 cursor-pointer p-2"
                >
                    <FaTimes className="mr-1" />
                </button>
            </div>
            <ClientForm
                submitLabel="Create Client"
                onSubmit={async data => {
                    await clientService.createClient(data);
                    router.push('../clients');
                }}
            />
        </div>
    );
}
