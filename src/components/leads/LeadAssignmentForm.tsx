// components/leads/AssignLeadForm.tsx
'use client';

import { useEffect, useState } from 'react';
import clientService from '@/services/client.service';
import api from '@/services/api';
import { Client, PaginatedResponse } from '@/types';
import Dropdown from '../ui/Dropdown';
import TextArea from '../ui/TextArea';

export default function AssignLeadForm({ leadId }: { leadId: string }) {
    const [clients, setClients] = useState<Client[]>([]);
    const [clientId, setClientId] = useState('');
    const [remarks, setRemarks] = useState('');

    useEffect(() => {
        clientService.getClients({ pageIndex: 1, pageSize: 500 })
            .then((res: PaginatedResponse<Client>) => {
                setClients(res.data);
            });
    }, []);

    const assign = async () => {
        await api.post('/lead-assignments', {
            leadId,
            clientId,
            remarks,
            status: 'assigned',
        });
    };

    return (
        <div className="space-y-4 border rounded p-4">

            <Dropdown
                label="Clients"
                value={clientId}
                onChange={value => setClientId(value)}
                options={[
                    { label: 'Select Client', value: '' },
                    ...clients.map(c => ({ label: c.name, value: c.id }))
                ]}
            />

            <TextArea
                label='Remarks'
                placeholder="Write Remarks"
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                className="input h-20"
            />



            <div className="flex items-center justify-end pt-4">
                <button
                    type="submit"
                    onClick={assign}
                    className="inline-flex items-center rounded-full bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
                >
                    Assign Lead
                </button>
            </div>
        </div>
    );
}
