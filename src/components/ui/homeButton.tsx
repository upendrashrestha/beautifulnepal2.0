'use client';

import { useRouter } from 'next/navigation';
import { FaHome } from 'react-icons/fa';

type HomeButtonProps = {
    className?: string;
};

export default function HomeButton({ className }: HomeButtonProps) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push('/')}
            className={`w-10 h-10 flex cursor-pointer items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition ${className}`}
            aria-label="Go home"
        >
            <FaHome className="w-5 h-5 text-gray-700" />
        </button>
    );
}
