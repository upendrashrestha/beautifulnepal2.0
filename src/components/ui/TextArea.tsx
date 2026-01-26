// components/ui/TextArea.tsx
'use client';

import { TextareaHTMLAttributes } from 'react';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    helperText?: string;
    error?: string; // 🔹 add error prop
}

export default function TextArea({ label, helperText, error, className, ...props }: Props) {
    return (
        <div className="w-full">
            {label && (
                <label className="block font-bold text-gray-700 dark:text-gray-200 text-left mb-1">
                    {label}
                </label>
            )}
            <textarea
                {...props}
                className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none
                ${error ? 'border-red-500 focus:border-red-500' : ''} 
                ${className ?? ''}`}
            />
            {helperText && !error && <p className="helper text-gray-500 text-sm">{helperText}</p>}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}
