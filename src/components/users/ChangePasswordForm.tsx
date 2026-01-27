'use client';

import { useState } from 'react';
import { ChangeUserPassword } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface ChangePasswordFormProps {
  onSubmit: (data: ChangeUserPassword) => Promise<void>;
  loading?: boolean;
}

export default function ChangePasswordForm({
  onSubmit,
  loading = false
}: ChangePasswordFormProps) {
  const [form, setForm] = useState<ChangeUserPassword>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.currentPassword) {
      setError('Current password is required.');
      return;
    }

    if (form.newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }

    if (form.newPassword !== form.confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    await onSubmit(form);

    // Optional: clear form on success
    setForm({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-6">

      {error && (
        <div className="rounded bg-red-50 text-red-700 px-4 py-2 text-sm">
          {error}
        </div>
      )}

      <Input
        label="Current Password"
        type="password"
        name="currentPassword"
        value={form.currentPassword}
        onChange={handleChange}
        required
        className="input-base"
      />

      <Input
        label="New Password"
        type="password"
        name="newPassword"
        value={form.newPassword}
        onChange={handleChange}
        required
        className="input-base"
      />

      <Input
        label="Confirm New Password"
        type="password"
        name="confirmNewPassword"
        value={form.confirmNewPassword}
        onChange={handleChange}
        required
        className="input-base"
      />

      <Button
        type="submit"
        disabled={loading}
        loadingLabel="Resetting..."
        label="Change Password"
      />
    </form>
  );
}
