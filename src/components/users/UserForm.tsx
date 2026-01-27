'use client';

import { useEffect, useState } from 'react';
import { Client, PaginatedResponse, RegisterUser as User } from '@/types';
import Input from '../ui/Input';
import Dropdown from '../ui/Dropdown';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import clientService from '@/services/client.service';

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
    const [clients, setClients] = useState<Client[]>([]);
    const [form, setForm] = useState<User>({
        id: initialData?.id ?? '',
        displayName: initialData?.displayName ?? '',
        email: initialData?.email ?? '',
        userName: initialData?.userName ?? '',
        phoneNumber: initialData?.phoneNumber ?? '',
        role: initialData?.role ?? '',
        clientId: initialData?.clientId ?? '-1',
        isActive: initialData?.isActive ?? true
    });
    useEffect(() => {
        clientService.getClients({ pageIndex: 1, pageSize: 500 })
            .then((res: PaginatedResponse<Client>) => {
                setClients(res.data);
            });
    }, []);
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };



    const handleDropdownChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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

            {isEditMode ||
                <Dropdown
                    label="Clients"
                    name="clientId"
                    value={form.clientId}
                    onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                    options={[
                        ...clients.map((c) => ({
                            label: c.name,
                            value: c.id,
                        })),
                    ]}
                />
            }
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
            {isEditMode ||
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
            }

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
                name="role"
                value={form.role}
                required
                options={[
                    { value: 'SuperAdmin', label: 'Super Admin' },
                    { value: 'Admin', label: 'Admin' },
                    { value: 'Contributor', label: 'Contributor' }
                ]}
                onChange={(e) =>
                    handleDropdownChange(e)
                }
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
