
interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

function Input({ label, ...props }: InputProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                {...props}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
        </div>
    );
}

export default Input;