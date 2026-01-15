'use client';

import { Lead, LeadCreate, LeadUpdate } from '@/types';
import { useState } from 'react';
import Input from '../ui/Input';
import CountrySelect from '../CountrySelect';

interface Props {
    initialData: Lead;
    onSubmit: (data: LeadCreate) => Promise<void>;
    onUpdate: (data: LeadUpdate) => Promise<void>;
    submitLabel: string;
    resetOnSuccess?: boolean;
}

const INTEREST_OPTIONS = [
    'Travel',
    'Trek',
    'Adventure',
    'Cultural Tour',
    'Luxury Trip',
    'Custom',
];

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const YEARS = Array.from({ length: 5 }, (_, i) => `${new Date().getFullYear() + i}`);

export default function LeadForm({
    initialData,
    onSubmit,
    onUpdate,
    submitLabel,
    resetOnSuccess = false,
}: Props) {
    const [form, setForm] = useState({ ...initialData } as LeadCreate | LeadUpdate);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        try {
            if (initialData.id) {
                await onUpdate({ ...form, id: initialData.id } as LeadUpdate);
            } else {
                await onSubmit(form as LeadCreate);
            }

            if (resetOnSuccess) {
                setForm(initialData); // ✅ clear form
            }
        } finally {
            setLoading(false);
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!form.fullName?.trim()) {
            newErrors.fullName = 'Name is required';
        }

        if (!form.email?.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            newErrors.email = 'Invalid email address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <form onSubmit={handleSubmit} className="mt-10 space-y-6">

            <Input
                label="Name *"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                error={errors.fullName}
            />

            <Input
                label="Email *"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
            />

            <Input
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
            />

            <CountrySelect
                label="Nationality"
                value={form.country || ''}
                onChange={(value) => setForm({ ...form, country: value })}
            />
            {initialData.id !== '' && <>
                <label className="block font-bold text-gray-700 dark:text-gray-200 text-left mb-1">
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
                    <option value="inprogress">In Progress</option>
                    <option value="assigned">Client Assigned</option>
                    <option value="lost">Lost</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </>}
            {/* Interest */}
            <div>
                <label className="block font-bold text-gray-700 dark:text-gray-200 text-left mb-1">
                    Interest
                </label>
                <select
                    name="interestType"
                    value={form.interestType || ''}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                >
                    <option value="">Select interest</option>
                    {INTEREST_OPTIONS.map((interest) => (
                        <option key={interest} value={interest}>
                            {interest}
                        </option>
                    ))}
                </select>
            </div>

            {/* Travel Month */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-200 text-left mb-1">
                        Travel Month
                    </label>
                    <select
                        name="travelMonth"
                        value={form.travelMonth?.split(' ')[0] || ''}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                travelMonth: `${e.target.value} ${form.travelMonth?.split(' ')[1] || ''}`.trim(),
                            })
                        }
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                    >
                        <option value="">Month</option>
                        {MONTHS.map((m) => (
                            <option key={m} value={m}>
                                {m}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-200 text-left mb-1">
                        Year
                    </label>
                    <select
                        value={form.travelMonth?.split(' ')[1] || ''}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                travelMonth: `${form.travelMonth?.split(' ')[0] || ''} ${e.target.value}`.trim(),
                            })
                        }
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                    >
                        <option value="">Year</option>
                        {YEARS.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

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
