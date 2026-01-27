"use client";

import { useEffect, useState } from "react";
import pictureService from "@/services/picture.service";
import { Picture } from "@/types/picture.types";
import { BaseSpecParams } from "@/types";
import PictureTile from "./PictureTile";

interface Props {
    open: boolean;
    multiple?: boolean;
    onClose: () => void;
    onSelect: (pictures: Picture[]) => void;
}

export default function PictureGalleryModal({
    open,
    multiple = false,
    onClose,
    onSelect,
}: Props) {
    const [pictures, setPictures] = useState<Picture[]>([]);
    const [selected, setSelected] = useState<Picture[]>([]);
    const [loading, setLoading] = useState(false);

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(1);

    const [search, setSearch] = useState("");
    const [folder, setFolder] = useState("");

    useEffect(() => {
        if (!open) return;

        setLoading(true);
        pictureService
            .getPictures({
                pageIndex,
                pageSize,
                search: search || undefined,
                folder: folder || undefined,
            } as BaseSpecParams)
            .then((res) => {
                setPictures(res.data);
                setTotalPages(Math.ceil(res.count / pageSize));
            })
            .finally(() => setLoading(false));
    }, [open, pageIndex, search, folder]);

    if (!open) return null;

    const toggleSelect = (pic: Picture) => {
        if (!multiple) {
            onSelect([pic]);
            onClose();
            return;
        }

        setSelected((prev) =>
            prev.find((p) => p.id === pic.id)
                ? prev.filter((p) => p.id !== pic.id)
                : [...prev, pic],
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-full max-w-5xl max-h-[85vh] overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="font-semibold">Image Gallery</h2>
                    <button onClick={onClose}>✕</button>
                </div>

                {/* Filters */}
                <div className="p-4 flex gap-3 border-b">
                    <input
                        className="input-base"
                        placeholder="Search images..."
                        value={search}
                        onChange={(e) => {
                            setPageIndex(1);
                            setSearch(e.target.value);
                        }}
                    />

                    <select
                        className="input-base"
                        value={folder}
                        onChange={(e) => {
                            setPageIndex(1);
                            setFolder(e.target.value);
                        }}
                    >
                        <option value="">All folders</option>
                        <option value="events">Events</option>
                        <option value="listings">Listings</option>
                        <option value="clients">Clients</option>
                    </select>
                </div>

                {/* Grid */}
                <div className="p-4 overflow-y-auto max-h-[60vh]">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {pictures.map((pic) => (
                                <PictureTile
                                    key={pic.id}
                                    picture={pic}
                                    selected={selected.some((s) => s.id === pic.id)}
                                    onSelect={toggleSelect}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t flex justify-between items-center">
                    <div className="flex gap-2">
                        <button
                            disabled={pageIndex === 1}
                            onClick={() => setPageIndex((p) => p - 1)}
                        >
                            Prev
                        </button>
                        <span>
                            {pageIndex} / {totalPages}
                        </span>
                        <button
                            disabled={pageIndex === totalPages}
                            onClick={() => setPageIndex((p) => p + 1)}
                        >
                            Next
                        </button>
                    </div>

                    {multiple && (
                        <button
                            onClick={() => {
                                onSelect(selected);
                                onClose();
                            }}
                            className="btn-primary"
                        >
                            Select ({selected.length})
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
