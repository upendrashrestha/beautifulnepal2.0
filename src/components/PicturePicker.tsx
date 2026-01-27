"use client";

import { useRef, useState, useEffect } from "react";
import pictureService from "@/services/picture.service";

interface Props {
    label?: string;
    value?: string; // existing URL
    onChange: (value: { url?: string; file?: File | null }) => void;
}

export default function PicturePicker({ label, value, onChange }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | undefined>(value);
    const [loading, setLoading] = useState(false);

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            if (preview && preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    // When user selects a file
    const handleFileSelect = async (file: File) => {
        // Revoke previous blob URL if exists
        if (preview && preview.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
        }

        // Show temporary preview immediately
        const tempUrl = URL.createObjectURL(file);
        setPreview(tempUrl);
        setLoading(true);

        try {
            const res = await pictureService.uploadPicture({
                name: file.name,
                file,
            });

            // Cleanup temp URL
            URL.revokeObjectURL(tempUrl);

            // Set final preview from uploaded URL
            setPreview(res.url);

            // Emit both URL and file info to parent
            onChange({ url: res.url, file });
        } catch (err) {
            console.error("Upload failed", err);
            URL.revokeObjectURL(tempUrl);
            setPreview(undefined);
            onChange({ url: undefined, file: null });
        } finally {
            setLoading(false);
        }
    };

    // Clear image
    const clearImage = () => {
        if (preview && preview.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
        }
        setPreview(undefined);
        onChange({ url: undefined, file: null });
    };

    return (
        <div className="space-y-2">
            {label && <label className="font-medium">{label}</label>}

            <div
                onClick={() => inputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 relative"
            >
                {value ? (
                    <img src={value} alt="preview" className="mx-auto max-h-48 rounded" />
                ) : (
                    <p className="text-gray-500">Click to upload image</p>
                )}

                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                        <p className="text-sm">Uploading…</p>
                    </div>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                }}
            />

            {preview && !loading && (
                <button
                    type="button"
                    onClick={clearImage}
                    className="text-sm text-red-500"
                >
                    Remove image
                </button>
            )}
        </div>
    );
}