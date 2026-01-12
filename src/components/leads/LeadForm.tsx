'use client';

import { LeadCreate } from '@/types';
import { useState } from 'react';
import Input from '../ui/Input';
import CountrySelect from '../CountrySelect';

interface Props {
    initialData: LeadCreate;
    onSubmit: (data: LeadCreate) => Promise<void>;
    submitLabel: string;
    resetOnSuccess?: boolean;
}

export default function LeadForm({
    initialData,
    onSubmit,
    submitLabel,
    resetOnSuccess = false,
}: Props) {
    const [form, setForm] = useState(initialData);
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await onSubmit(form);

            if (resetOnSuccess) {
                setForm(initialData); // ✅ clear form
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-2xl space-y-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
        >
            <h2 className="text-lg font-semibold text-gray-900">
                Your Information
            </h2>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-1">
                <Input
                    label="Name"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                />

                <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                />

                <Input
                    label="Phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                />

                {/* <Input
                    label="Nationality"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                /> */}

                <CountrySelect
                    label="Nationality"
                    value={form.country || ""}
                    onChange={(value) => setForm({ ...form, country: value })}
                />

                <Input
                    label="Destination"
                    name="destination"
                    value={form.destination}
                    onChange={handleChange}
                />

                <Input
                    label="Travel Month"
                    name="travelMonth"
                    placeholder="e.g. March 2026"
                    value={form.travelMonth}
                    onChange={handleChange}
                />

                {/* {<div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Status
                    </label>
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                    </select>
                </div>
                } */}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? 'Saving…' : submitLabel}
                </button>
            </div>
        </form>
    );
}
