
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
                        : 'className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
       }
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