"use client";

import { useRef, useState } from "react";
import { Picture } from "@/types/picture.types";
import pictureService from "@/services/picture.service";
import { FaTrash } from "react-icons/fa";
import ConfirmationModal from "../ConfirmationModal";

interface Props {
  label?: string;
  value?: string;
  showGallery?: boolean;
  canDelete?: boolean;
  onChange: (value: { url?: string; file?: File | null }) => void;
}

export default function PicturePicker({
  label,
  value,
  showGallery = false,
  canDelete = false,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  // gallery
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);

  // delete mode
  const [deleteMode, setDeleteMode] = useState(false);

  // confirm dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Picture | null>(null);

  /* ================= File Select ================= */
  const handleFileSelect = (file: File) => {
    const tempUrl = URL.createObjectURL(file);

    // 🔑 parent controls everything
    onChange({
      file,
      url: tempUrl,
    });
  };

  /* ================= Gallery ================= */
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
    if (deleteMode) return;

    onChange({
      url: pic.url,
      file: null,
    });

    setGalleryOpen(false);
  };

  /* ================= Clear (controlled) ================= */
  const clearImage = () => {
    onChange({ url: undefined, file: null });
  };

  /* ================= Delete ================= */
  const requestDelete = (pic: Picture) => {
    setPendingDelete(pic);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    if (pendingDelete.publicId)
      await pictureService.deletePicture(pendingDelete.publicId);

    setPictures((prev) =>
      prev.filter((p) => p.publicId !== pendingDelete.publicId),
    );

    // if deleted image was selected
    if (value === pendingDelete.url) {
      clearImage();
    }

    setPendingDelete(null);
    setConfirmOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Preview */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Event Image Preview
        </label>

        <div className="relative h-80 rounded-xl overflow-hidden bg-gray-100 shadow">
          {value && (
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        {label && <span className="font-medium">{label}</span>}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
        >
          Select Image
        </button>

        {showGallery && (
          <button
            type="button"
            onClick={openGallery}
            className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
          >
            Gallery
          </button>
        )}

        {value && (
          <button
            type="button"
            onClick={clearImage}
            className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
          >
            Remove
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

      {/* ================= Gallery ================= */}
      {galleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-[90%] max-w-4xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Select Image</h3>

              <div className="flex items-center gap-4">
                {canDelete && (
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={deleteMode}
                      onChange={(e) => setDeleteMode(e.target.checked)}
                    />
                    Delete mode
                  </label>
                )}

                <button onClick={() => setGalleryOpen(false)}>✕</button>
              </div>
            </div>

            {galleryLoading ? (
              <p>Loading…</p>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {pictures.map((pic) => (
                  <div
                    key={pic.publicId}
                    className="relative group border rounded overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => selectFromGallery(pic)}
                      className="block w-full h-full"
                    >
                      <img
                        src={pic.url}
                        className={`h-28 w-full object-cover ${deleteMode ? "opacity-70" : ""
                          }`}
                      />
                    </button>

                    {canDelete && deleteMode && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          requestDelete(pic);
                        }}
                        className="
                          absolute top-2 right-2
                          bg-red-600 text-white p-1.5 rounded-full
                          hover:bg-red-700
                        "
                      >
                        <FaTrash size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= Confirm ================= */}
      <ConfirmationModal
        isOpen={confirmOpen}
        title="Delete image?"
        message="This image will be permanently removed."
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
