"use client";

import Link from "next/link";

interface CTAButtonProps {
  label: string;
  source: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function CTAButton({
  label,
  source,
  href = "/plan-your-trip",
  onClick,
  className = "",
}: CTAButtonProps) {
  return (
    <Link
      href={{
        pathname: href,
        query: { source },
      }}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        rounded-full bg-black px-6 py-3
        text-sm font-semibold text-gray-100
        transition
        hover:bg-gray-800 hover:text-white
        ${className}
      `}
    >
      {label}
    </Link>
  );
}
