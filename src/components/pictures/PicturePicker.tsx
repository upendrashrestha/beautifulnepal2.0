"use client";

import { useRef, useState, useEffect } from "react";
import { Picture } from "@/types/picture.types";
import { FaTrash } from "react-icons/fa";
import pictureService from "@/services/picture.service";

interface Props {
  label?: string;
  value?: string;
  showGallery?: boolean;
  onChange: (value: { url?: string; file?: File | null }) => void;
}

export default function PicturePicker({
  label,
  value,
  onChange,
  showGallery = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | undefined>(value);

  // gallery state
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  // ================= File Select (PREVIEW ONLY) =================
  const handleFileSelect = (file: File) => {
    const tempUrl = URL.createObjectURL(file);
    setPreview(tempUrl);

    onChange({
      file,
      url: undefined,
    });
  };

  // ================= Gallery =================
  const openGallery = async () => {
    setGalleryOpen(true);
    setGalleryLoading(true);

    try {
      const res = await pictureService.getPictures({
        pageIndex: 1,
        pageSize: 50,
      });
      setPictures(res.data);
    } finally {
      setGalleryLoading(false);
    }
  };

  const selectFromGallery = (pic: Picture) => {
    setPreview(pic.url);
    setGalleryOpen(false);

    onChange({
      url: pic.url,
      file: null,
    });
  };

  // ================= Clear =================
  const clearImage = () => {
    setPreview(undefined);
    onChange({ url: undefined, file: null });
  };

  return (
    <div className="space-y-2">
      {label && <label className="font-medium">{label}</label>}

      <div className="border-2 border-dashed rounded-lg p-4 text-center">
        {preview ? (
          <img src={preview} className="mx-auto max-h-48 rounded" />
        ) : (
          <p className="text-gray-500">No image selected</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-400"
        >
          Upload
        </button>

        {showGallery && (
          <button
            type="button"
            onClick={openGallery}
            className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-400"
          >
            Gallery
          </button>
        )}

        {preview && (
          <button
            type="button"
            onClick={clearImage}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded"
          >
            <FaTrash />
            <span>Remove</span>
          </button>
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

      {/* ================= Gallery Modal ================= */}
      {galleryOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-[90%] max-w-3xl">
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold">Select Image</h3>
              <button onClick={() => setGalleryOpen(false)}>✕</button>
            </div>

            {galleryLoading ? (
              <p>Loading…</p>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {pictures.map((pic) => (
                  <button
                    key={pic.publicId}
                    onClick={() => selectFromGallery(pic)}
                    className="border rounded overflow-hidden hover:ring-2 ring-blue-500"
                  >
                    <img
                      src={pic.url}
                      className="h-28 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
