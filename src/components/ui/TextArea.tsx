// components/ui/TextArea.tsx
'use client';

import { TextareaHTMLAttributes, useState } from 'react';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    helperText?: string;
    error?: string;
    sanitizeHtml?: boolean; // 🔹 flag to enable/disable sanitization
}

export default function TextArea({
    label,
    helperText,
    error,
    className,
    value,
    onChange,
    sanitizeHtml = true, // default false
    ...props
}: Props) {
    const [internalValue, setInternalValue] = useState(value || "");

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        let newValue = e.target.value;

        if (sanitizeHtml) {
            // Remove HTML tags only if flag is true
            newValue = newValue.replace(/<\/?[^>]+(>|$)/g, "");
        }

        setInternalValue(newValue);

        if (onChange) {
            // Pass sanitized or raw value to parent
            const event = {
                ...e,
                target: { ...e.target, value: newValue }
            };
            onChange(event as React.ChangeEvent<HTMLTextAreaElement>);
        }
    };

    return (
        <div className="w-full">
            {label && <label className="block font-bold text-gray-700 dark:text-gray-200 text-left mb-1">{label}</label>}
            <textarea
                {...props}
                value={internalValue}
                onChange={handleChange}
                rows={props.rows ?? 4}
                className={`w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none
          ${error ? 'border-red-500 focus:border-red-500' : ''} 
          ${className ?? ''}`}
            />
            {helperText && !error && <p className="helper text-gray-500 text-sm">{helperText}</p>}
            {error && <p className="text-red-500 text-left text-sm mt-1">{error}</p>}
        </div>
    );
}
