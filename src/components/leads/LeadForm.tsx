'use client';

import { Lead, LeadCreate, LeadUpdate } from '../../../types';
import { useRef, useState } from 'react';
import Input from '../ui/Input';
import CountrySelect from '../CountrySelect';
import Dropdown from '../ui/Dropdown';
import BotCheck, { BotCheckRef } from '../BotCheck';
import Checkbox from '../ui/Checkbox';
import { FaArrowRight } from 'react-icons/fa';

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
].map((i) => ({ label: i, value: i }));

const STATUS_OPTIONS = [
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'In Progress', value: 'inprogress' },
  { label: 'Client Assigned', value: 'assigned' },
  { label: 'Lost', value: 'lost' },
  { label: 'Cancelled', value: 'cancelled' },
];

const MONTH_OPTIONS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
].map((m) => ({ label: m, value: m }));

const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => {
  const year = `${new Date().getFullYear() + i}`;
  return { label: year, value: year };
});

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
  const botCheckRef = useRef<BotCheckRef>(null);
  const [botCheckPassed, setBotCheckPassed] = useState(false);
  const [understandDisclaimer, setUnderstandDisclaimer] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      botCheckRef.current?.clear();
      return;
    }
    if (!botCheckPassed) {
      setBotCheckPassed(true);
      return;
    }

    setLoading(true);
    try {
      if (initialData.id) {
        await onUpdate({ ...form, id: initialData.id } as LeadUpdate);
      } else {
        await onSubmit(form as LeadCreate);
      }

      if (resetOnSuccess) {
        setForm(initialData);
      }
    } catch (err) {
      console.error(err);
      botCheckRef.current?.clear();
    } finally {
      setLoading(false);
      botCheckRef.current?.clear();
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
    if (!botCheckPassed) {
      newErrors.botCheck = "Please answer the security question correctly.";
    }

    if (!understandDisclaimer)
      newErrors.disclaimer = "You must agree to the disclaimer before submitting the form."

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [travelMonth, travelYear] = form.travelMonth?.split(' ') || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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

      {/* Status */}
      {initialData.id && (
        <Dropdown
          label="Status"
          name="status"
          value={form.status}
          options={STATUS_OPTIONS}
          onChange={handleChange}
        />
      )}

      {/* Interest */}
      <Dropdown
        label="Interest"
        name="interestType"
        value={form.interestType || ''}
        options={INTEREST_OPTIONS}
        onChange={handleChange}
      />

      {/* Travel Month / Year */}
      <div className="grid grid-cols-2 gap-4">
        <Dropdown
          label="Travel Month"
          name="travelMonth"
          value={travelMonth || ''}
          options={MONTH_OPTIONS}
          onChange={(e) =>
            setForm({
              ...form,
              travelMonth: `${e.target.value} ${travelYear || ''}`.trim(),
            })
          }
        />

        <Dropdown
          label="Year"
          name="travelYear"
          value={travelYear || ''}
          options={YEAR_OPTIONS}
          onChange={(e) =>
            setForm({
              ...form,
              travelMonth: `${travelMonth || ''} ${e.target.value}`.trim(),
            })
          }
        />
      </div>
      <div className="flex items-center gap-3 my-6 text-xs uppercase tracking-widest text-gray-400">
        <span className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        Verification
        <span className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </div>

      <BotCheck
        ref={botCheckRef}
        error={errors.botCheck}
        onVerified={(passed) => setBotCheckPassed(passed)}
      />

      <Checkbox
        label='I understand and agree that BeautifulNepal will share my trip request with licensed third-party travel agencies in Nepal.'
        required={true}
        name="disclaimer"
        checked={understandDisclaimer}
        error={errors.disclaimer}
        onChange={(v) => setUnderstandDisclaimer(v)}
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-full bg-[#1A1714] text-white text-sm font-medium tracking-wide
             flex items-center justify-center gap-2
             hover:bg-[#3A2F25] active:scale-[.98] transition-all duration-150"
      >
        {loading ? 'Sending…' : submitLabel}
        {!loading && <FaArrowRight className="w-4 h-4" />}
      </button>

    </form>
  );
}
