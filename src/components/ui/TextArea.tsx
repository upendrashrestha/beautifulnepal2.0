// components/ui/TextArea.tsx
'use client';

import { TextareaHTMLAttributes } from 'react';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    helperText?: string;
}

export default function TextArea({ label, helperText, className, ...props }: Props) {
    return (
        <div>
            {label &&
                <label className="block font-bold text-gray-700 dark:text-gray-200 text-left mb-1">{label}</label>
            }
            <textarea
                {...props}
                className={`input-base min-h-[96px] resize-none  w-full bg-transparent pb-3.5
          border-b
          focus-visible:outline-none ${className ?? ''}`}
            />
            {helperText && <p className="helper">{helperText}</p>}
        </div>
    );
}
