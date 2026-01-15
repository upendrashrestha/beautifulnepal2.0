// components/ui/Checkbox.tsx
'use client';

interface Props {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export default function Checkbox({ label, checked, onChange }: Props) {
    return (
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={e => onChange(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />
            {label}
        </label>
    );
}
