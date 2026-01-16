// components/ui/Dropdown.tsx
'use client';


interface Option {
    label: string;
    value: string;
}

interface Props {
    label?: string;
    value?: string;
    options: Option[];
    required?: boolean;
    onChange: (value: string) => void;
}

export default function Dropdown({ label, value, options, required, onChange }: Props) {

    return (
        <div className="space-y-1">
            {label && (
                     <label className="block font-bold text-gray-700 dark:text-gray-200 text-left mb-1">{label}
          
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className=" w-full bg-transparent pb-3.5
          border-b
          focus-visible:outline-none"
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div >
    );
}
