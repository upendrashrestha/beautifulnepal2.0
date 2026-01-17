'use client';

import { useState } from 'react';
import { RegisterUser as User } from '@/types';
import Input from '../ui/Input';
import Dropdown from '../ui/Dropdown';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';

interface UserFormProps {
    initialData?: Partial<User>;
    onSubmit: (data: User) => Promise<void>;
    loading?: boolean;
}

export default function UserForm({
    initialData,
    onSubmit,
    loading = false
}: UserFormProps) {
    const isEditMode = !!initialData;

    const [form, setForm] = useState<User>({
        displayName: initialData?.displayName ?? '',
        email: initialData?.email ?? '',
        userName: initialData?.userName ?? '',
        phoneNumber: initialData?.phoneNumber ?? '',
        role: initialData?.role ?? '',
        clientId: initialData?.clientId ?? '-1',
        password: '',
        isActive: initialData?.isActive ?? true
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDropdownChange = (value: string) => {
        setForm((prev) => ({
            ...prev,
            role: value
        }));
    };

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setForm((prev) => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <Input
                label="Display Name"
                name="displayName"
                value={form.displayName}
                onChange={handleChange}
                required
                className="input-base"
            />

            <Input
                label="Email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="input-base"
            />

            <Input
                label="Username"
                name="userName"
                value={form.userName}
                onChange={handleChange}
                required
                className="input-base"
            />

            {/* Password: required only on create */}
            <Input
                label="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                required={!isEditMode}
                placeholder={isEditMode ? 'Leave blank to keep current password' : ''}
                className="input-base"
            />

            <Input
                label="Phone Number"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className="input-base"
            />

            <Checkbox
                label="Is Active"
                checked={form.isActive}
                onChange={v => handleCheckboxChange('isActive', v)}
            />

            <Dropdown
                label="Role"
                value={form.role}
                onChange={handleDropdownChange}
                required
                options={[
                    { value: 'Admin', label: 'Admin' },
                    { value: 'SuperAdmin', label: 'Super Admin' },
                    { value: 'SuperDuperAdmin', label: 'Super Duper Admin' }
                ]}
            />

            <Button
                type="submit"
                disabled={loading}
                loadingLabel="Saving..."
                label="Save"
            />
        </form>
    );
}
