
interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

function Input({ label, error, className = '', ...props }: InputProps) {
    return (
        <div>
            {label &&
                <label className="block font-bold text-gray-700 dark:text-gray-200 text-left mb-1">{label}</label>
            }
            <input
                {...props}
                aria-invalid={!!error}
                className={`
          w-full bg-transparent pb-3.5
          border-b
          focus-visible:outline-none
          ${error
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
}

export default Input;