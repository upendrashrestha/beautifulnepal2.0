'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import clientService from '@/services/client.service';
import ClientForm from '@/components/clients/ClientForm';
import { Client } from '@/types';

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
        <div className="mx-auto max-w-xl p-6">
            <h1 className="mb-4 text-xl font-bold">Update Agency</h1>

            <ClientForm
                initialData={client}
                submitLabel="Update Agency"
                onSubmit={async data => {
                    await clientService.updateClient(client.id, data);
                    router.push('../');
                }}
            />
        </div>
    );
}
