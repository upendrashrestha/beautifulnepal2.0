"use client";

import { useState } from "react";
import { Listing, ListingCreate, ListingUpdate, ListingType } from "@/types/listing.types";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import Dropdown from "../ui/Dropdown";
import DatePicker from "../ui/DatePicker";
import Button from "../ui/Button";

interface Props {
    initialData?: Listing | null;
    onSuccess: (listingId: string) => void;
    onSubmit: (data: ListingCreate | ListingUpdate) => Promise<Listing>;
}

interface ListingFormState {
    title: string;
    description: string;
    keywords: string;
    price: number;
    currency: string;
    location: string;
    listingType: ListingType | "";
    clientId: string;
    activationDate: string;
    expirationDate: string;
    slug: string;
}

export default function ListingForm({ initialData, onSuccess, onSubmit }: Props) {
    const [form, setForm] = useState<ListingFormState>({
        title: initialData?.title ?? "",
        description: initialData?.description ?? "",
        keywords: initialData?.keywords ?? "",
        price: initialData?.price ?? 0,
        currency: initialData?.currency ?? "USD",
        location: initialData?.location ?? "",
        listingType: (initialData?.listingType ?? "") as ListingType | "",
        clientId: initialData?.clientId ?? "",
        activationDate: initialData?.activationDate ?? "",
        expirationDate: initialData?.expirationDate ?? "",
        slug: initialData?.slug ?? "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: ListingCreate | ListingUpdate = {
            ...(initialData ? { ...initialData } : {}),
            ...form,
        };

        const result = await onSubmit(payload);
        onSuccess(result.id);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="title" label="Title" value={form.title} onChange={handleChange} />
            <Input name="slug" label="Slug" value={form.slug} onChange={handleChange} />

            <div className="grid grid-cols-2 gap-4">
                <Input name="price" type="number" label="Price" value={form.price} onChange={handleChange} />
                <Dropdown
                    name="currency"
                    label="Currency"
                    value={form.currency}
                    options={["USD", "EUR", "NPR"].map((v) => ({ label: v, value: v }))}
                    onChange={handleChange}
                />
            </div>

            <Input name="location" label="Location" value={form.location} onChange={handleChange} />

            <Dropdown
                name="listingType"
                label="Listing Type"
                value={form.listingType}
                options={Object.values(ListingType).map((v) => ({ label: v, value: v }))}
                onChange={handleChange}
            />

            {initialData && (
                <Input name="clientId" label="Client ID" value={form.clientId} onChange={handleChange} />
            )}

            <DatePicker name="activationDate" label="Activation Date" value={form.activationDate} onChange={handleChange} />
            <DatePicker name="expirationDate" label="Expiration Date" value={form.expirationDate} onChange={handleChange} />

            <TextArea name="description" label="Description" value={form.description} onChange={handleChange} />
            <TextArea name="keywords" label="Keywords" value={form.keywords} onChange={handleChange} />

            <Button type="submit" label="Save Listing" />
        </form>
    );
}
