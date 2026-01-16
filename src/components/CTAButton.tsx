'use client';

import Link from 'next/link';

interface CTAButtonProps {
    label: string;
    source: string;
    href?: string;
}

export default function CTAButton({
    label,
    source,
    href = '/plan-your-trip',
}: CTAButtonProps) {
    return (
        <Link
            href={{
                pathname: href,
                query: { source },
            }}
            className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-gray-400 hover:text-white transition hover:bg-gray-800"
        >
            {label}
        </Link>
    );
}
