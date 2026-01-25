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
}

const DatePicker: React.FC<DatePickerProps> = ({ name, label, value, onChange, required = false, className }) => {
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
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
};

export default DatePicker;
