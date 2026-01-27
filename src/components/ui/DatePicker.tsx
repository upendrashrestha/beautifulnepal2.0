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
                className={` ${error
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-stroke focus:border-waterloo dark:border-strokedark dark:focus:border-manatee'}
          ${className}
        `}
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
