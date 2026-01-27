// components/ui/Dropdown.tsx
'use client';

interface Option {
  label: string;
  value: string;
}

interface Props {
  label?: string;
  name: string;
  value?: string;
  options: Option[];
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function Dropdown({
  label,
  name,
  value,
  options,
  required,
  onChange,
}: Props) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block font-bold text-gray-700 dark:text-gray-200 text-left mb-1">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
