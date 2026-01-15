// components/ui/Radio.tsx
'use client';

interface Props {
    name: string;
    value: string;
    label: string;
    checked: boolean;
    onChange: (value: string) => void;
}

export default function Radio({ name, value, label, checked, onChange }: Props) {
    return (
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={() => onChange(value)}
                className="h-4 w-4 border-gray-300 text-black focus:ring-black"
            />
            {label}
        </label>
    );
}
