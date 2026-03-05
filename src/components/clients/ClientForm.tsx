'use client';

import { Client } from '../../../types';
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

const STATUS_OPTIONS = [
  { label: 'Active', value: 'Active' },
  { label: 'InActive', value: 'InActive' },
];

export default function ClientForm({
  initialData = {},
  onSubmit,
  submitLabel,
}: Props) {
  const [form, setForm] = useState<Partial<Client>>(initialData);
  const [loading, setLoading] = useState(false);

  const update = <K extends keyof Client>(key: K, value: Client[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-6">
      <Input
        label="Name *"
        value={form.name ?? ''}
        onChange={(e) => update('name', e.target.value)}
        required
      />

      <Input
        label="Email *"
        type="email"
        value={form.email ?? ''}
        onChange={(e) => update('email', e.target.value)}
      />

      <Input
        label="Phone Number"
        value={form.phoneNumber ?? ''}
        onChange={(e) => update('phoneNumber', e.target.value)}
      />

      <Input
        label="Website"
        value={form.website ?? ''}
        onChange={(e) => update('website', e.target.value)}
      />

      <TextArea
        label="Agency Bio"
        placeholder="Short description about the agency"
        value={form.bio ?? ''}
        onChange={(e) => update('bio', e.target.value)}
      />

      <Checkbox
        label="Verified Agency"
        checked={form.verified ?? false}
        onChange={(val) => update('verified', val)}
      />

      <Checkbox
        label="Sponsored Partner"
        checked={form.sponsored ?? false}
        onChange={(val) => update('sponsored', val)}
      />

      <Checkbox
        label="Primary Agency"
        checked={form.isPrimary ?? false}
        onChange={(val) => update('isPrimary', val)}
      />

      {/* Status */}
      <Dropdown
        label="Status"
        name="status"
        required
        value={form.status ?? ''}
        options={STATUS_OPTIONS}
        onChange={(e) => {
          update('status', e.target.value);
          update('statusId', e.target.value);
        }}
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
