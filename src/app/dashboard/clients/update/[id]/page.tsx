// app/clients/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import clientService from '@/services/client.service';
import ClientForm from '@/components/clients/ClientForm';
import { Client } from '@/types';

export default function UpdateClientPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [client, setClient] = useState<Client | null>(null);

    useEffect(() => {
        clientService.getClientById(params.id).then(setClient);
    }, [params.id]);

    if (!client) return <p className="p-6">Loading…</p>;

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-xl font-bold mb-4">Update Agency</h1>

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
