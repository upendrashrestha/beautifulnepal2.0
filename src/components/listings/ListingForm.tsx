"use client";

import { useEffect, useState } from "react";
import {
    Listing,
    ListingCreate,
    ListingUpdate,
    ListingType,
} from "../../../types/listing.types";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import Dropdown from "../ui/Dropdown";
import DatePicker from "../ui/DatePicker";
import Button from "../ui/Button";
import PicturePicker from "../pictures/PicturePicker";
import pictureService from "@/services/picture.service";

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
    pictureUrl?: string;
}

type FormErrors = Partial<Record<keyof ListingFormState, string>>;

/** simple slugify */
const slugify = (text: string) =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

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
        pictureUrl: initialData?.pictureUrl ?? undefined,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [slugTouched, setSlugTouched] = useState(!!initialData?.slug);
    const [pictureFile, setPictureFile] = useState<File | null>(null);
    const [pictureUrl, setPictureUrl] = useState<string | undefined>(initialData?.pictureUrl ?? undefined);

    /** auto-generate slug from title */
    useEffect(() => {
        if (!slugTouched && form.title) {
            setForm((p) => ({ ...p, slug: slugify(form.title) }));
        }
    }, [form.title, slugTouched]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name === "slug") {
            setSlugTouched(true);
        }

        setForm((p) => ({ ...p, [name]: value }));
        setErrors((p) => ({ ...p, [name]: undefined }));
    };

    const validate = (): boolean => {
        const nextErrors: FormErrors = {};

        if (!form.title.trim()) nextErrors.title = "Title is required";
        if (!form.slug.trim()) nextErrors.slug = "Slug is required";
        if (!form.description.trim())
            nextErrors.description = "Description is required";
        if (!form.activationDate)
            nextErrors.activationDate = "Activation date is required";
        if (!form.location.trim())
            nextErrors.location = "Location is required";

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        let uploadedImageUrl = pictureUrl;

        if (pictureFile) {
            const res = await pictureService.uploadPicture({
                name: pictureFile.name,
                file: pictureFile,
            });

            uploadedImageUrl = res.url;
        }

        const payload: ListingCreate | ListingUpdate = {
            ...(initialData ? { ...initialData } : {}),
            ...form,
            pictureUrl: uploadedImageUrl
        };

        const result = await onSubmit(payload);
        onSuccess(result.id);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                name="title"
                label="Title *"
                value={form.title}
                onChange={handleChange}
                error={errors.title}
            />

            <Input
                name="slug"
                label="Slug *"
                value={form.slug}
                onChange={handleChange}
                error={errors.slug}
            />

            <div className="grid grid-cols-2 gap-4">
                <Input
                    name="price"
                    type="number"
                    label="Price"
                    value={form.price}
                    onChange={handleChange}
                />
                <Dropdown
                    name="currency"
                    label="Currency"
                    value={form.currency}
                    options={["USD", "EUR", "NPR"].map((v) => ({
                        label: v,
                        value: v,
                    }))}
                    onChange={handleChange}
                />
            </div>


            <PicturePicker
                label="Event Image"
                value={pictureUrl}
                showGallery
                onChange={({ file, url }) => {
                    setPictureFile(file ?? null);
                    setPictureUrl(url);
                }}
            />

            <Input
                name="location"
                label="Location *"
                value={form.location}
                onChange={handleChange}
                error={errors.location}
            />

            <Dropdown
                name="listingType"
                label="Listing Type"
                value={form.listingType}
                options={Object.values(ListingType).map((v) => ({
                    label: v,
                    value: v,
                }))}
                onChange={handleChange}
            />

            {initialData && (
                <Input
                    name="clientId"
                    label="Client ID"
                    value={form.clientId}
                    onChange={handleChange}
                />
            )}

            <DatePicker
                name="activationDate"
                label="Activation Date *"
                value={form.activationDate}
                onChange={handleChange}
                error={errors.activationDate}
            />

            <DatePicker
                name="expirationDate"
                label="Expiration Date"
                value={form.expirationDate}
                onChange={handleChange}
            />

            <TextArea
                name="description"
                label="Description *"
                value={form.description}
                onChange={handleChange}
                error={errors.description}
            />

            <TextArea
                name="keywords"
                label="Keywords"
                value={form.keywords}
                onChange={handleChange}
            />

            <Button type="submit" label="Save Listing" />
        </form>
    );
}
