'use client';

import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

type BackButtonProps = {
    className?: string;
};

export default function BackButton({ className }: BackButtonProps) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className={`w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition ${className}`}
            aria-label="Go back"
        >
            <FaArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
    );
}



