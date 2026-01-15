'use client';

import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    danger?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    title = 'Confirm Action',
    message,
    confirmText = 'Delete',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    danger = true
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
                {/* Header */}
                <div className="border-b px-5 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                </div>

                {/* Body */}
                <div className="px-5 py-4 text-gray-700">
                    <p>{message}</p>
                    {danger && (
                        <p className="mt-2 text-sm text-red-600">
                            This action cannot be undone.
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t px-5 py-4">
                    <button
                        onClick={onCancel}
                        className="rounded border px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        className={`rounded px-4 py-2 text-white ${danger
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
