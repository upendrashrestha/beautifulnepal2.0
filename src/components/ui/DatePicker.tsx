// components/ui/DatePicker.tsx
"use client";

import React from "react";

interface DatePickerProps {
    name: string;
    label: string;
    value: string; // ISO string or empty
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    className?: string;
    error?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ name, label, value, onChange, required = false, className, error }) => {
    return (
        <div className={`flex flex-col ${className || ""}`}>
            <label htmlFor={name} className="font-medium mb-1">
                {label}
            </label>
            <input
                type="date"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {error && (
                <p className="text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};

export default DatePicker;
