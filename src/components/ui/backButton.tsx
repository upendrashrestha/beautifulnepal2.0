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
            className={`w-10 h-10 flex cursor-pointer items-center justify-center rounded-full bg-white shadow-md text-gray-800 hover:text-primary hover:bg-gray-100 transition ${className}`}
            aria-label="Go back"
        >
            <FaArrowLeft className="w-5 h-5" />
        </button>
    );
}



