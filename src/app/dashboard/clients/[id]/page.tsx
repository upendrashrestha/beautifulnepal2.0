'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import clientService from '@/services/client.service';
import ClientForm from '@/components/clients/ClientForm';
import { Client } from '@/types';
import { FaTimes } from 'react-icons/fa';

export default function UpdateClientPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const [client, setClient] = useState<Client | null>(null);

    const clientId = params?.id;

    useEffect(() => {
        if (!clientId) return;
        clientService.getClientById(clientId).then(setClient);
    }, [clientId]);

    if (!client) return <p className="p-6">Loading…</p>;

    return (
       <main className="mx-auto px-5">
            <div className="flex items-center justify-between pt-4">
                <h1 className="text-xl font-bold mb-4">Update Client</h1>
                <button
                    type="submit"
                    onClick={() => { router.push('../') }}
                    className="inline-flex items-center font-medium text-black hover:text-red-600 transition-colors dark:text-white dark:hover:text-red-500 cursor-pointer p-2"
                >
                    <FaTimes className="mr-1" />
                </button>
            </div>

            <ClientForm
                initialData={client}
                submitLabel="Update"
                onSubmit={async data => {
                    await clientService.updateClient(client.id, data);
                    router.push('../');
                }}
            />
        </main>
    );
}
