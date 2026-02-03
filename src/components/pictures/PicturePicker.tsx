"use client";

import { useRef, useState, useEffect } from "react";
import { Picture } from "@/types/picture.types";
import pictureService from "@/services/picture.service";
import { FaTrash } from "react-icons/fa";

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

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Event Image Preview
        </label>
        <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl bg-gray-100 dark:bg-gray-700">
          {preview ? (
            <img
              src={preview}
              alt="Event preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">

            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Preview label */}
          <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              This is how your image will appear on the event detail page
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {label && <label className="m-1 ont-medium">{label}</label>}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-400"
        >
          Select Image
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
