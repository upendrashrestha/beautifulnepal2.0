'use client';

import { Client } from '@/types';
import { useState } from 'react';
import TextArea from '@/components/ui/TextArea';
import Checkbox from '@/components/ui/Checkbox';
import Input from '../ui/Input';
import Dropdown from '../ui/Dropdown';

interface Props {
    initialData?: Partial<Client>;
    onSubmit: (data: Partial<Client>) => Promise<void>;
    submitLabel: string;
}

export default function ClientForm({
    initialData = {},
    onSubmit,
    submitLabel,
}: Props) {
    const [form, setForm] = useState<Partial<Client>>(initialData);
    const [loading, setLoading] = useState(false);

    const update = <K extends keyof Client>(key: K, value: Client[K]) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    return (
        <form
            onSubmit={async e => {
                e.preventDefault();
                setLoading(true);
                await onSubmit(form);
                setLoading(false);
            }}
            className="mt-10 space-y-6">

            <Input
                label="Name *"
                value={form.name ?? ''}
                onChange={e => update('name', e.target.value)}
                className="input-base"
                required
            />


            <Input
                label="Email *"
                type="email"
                value={form.email ?? ''}
                onChange={e => update('email', e.target.value)}
                className="input-base"
            />

            <Input
                label="Phone Number"
                value={form.phoneNumber ?? ''}
                onChange={e => update('phoneNumber', e.target.value)}
                className="input-base"
            />

            <Input
                label='Website'
                value={form.website ?? ''}
                onChange={e => update('website', e.target.value)}
                className="input-base"
            />

            <TextArea
                label="Agency Bio"
                placeholder="Short description about the agency"
                value={form.bio ?? ''}
                onChange={e => update('bio', e.target.value)}
            />



            <Checkbox
                label="Verified Agency"
                checked={form.verified ?? false}
                onChange={val => update('verified', val)}
            />

            <Checkbox
                label="Sponsored Partner"
                checked={form.sponsored ?? false}
                onChange={val => update('sponsored', val)}
            />

            <Checkbox
                label="Primary Agency"
                checked={form.isPrimary ?? false}
                onChange={val => update('isPrimary', val)}
            />

            <Dropdown
                label="Status"
                required
                value={form.status}
                onChange={value => {
                    update('status', value);
                    update('statusId', value);
                }}
                options={[
                    { label: '', value: 'Select Status' },
                    { label: 'Active', value: 'Active' },
                    { label: 'Inactive', value: 'InActive' },
                ]}
            />
            {/* Submit */}
            <div className="flex items-center justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center rounded-full bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
                >
                    {loading ? 'Saving…' : submitLabel}
                </button>
            </div>

        </form>
    );
}
