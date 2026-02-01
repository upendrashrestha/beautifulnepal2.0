// components/ui/Checkbox.tsx
'use client';

interface Props {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    required?: boolean;
    name?: string;
    error?: string;
}

export default function Checkbox({
    label,
    checked,
    onChange,
    required = false,
    name,
    error,
}: Props) {
    return (
        <>
            <label className="flex cursor-pointer items-start gap-2 text-sm text-gray-700">
                <input
                    type="checkbox"
                    name={name}
                    checked={checked}
                    required={required}
                    onChange={e => onChange(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <span>{label}</span>
            </label>
            {error && (
                <p className="text-xs text-red-600">
                    {error}
                </p>
            )}
        </>
    );
}