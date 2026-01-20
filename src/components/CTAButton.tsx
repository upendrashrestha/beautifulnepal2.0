"use client";

import Link from "next/link";

interface CTAButtonProps {
  label: string;
  source: string;
  href?: string;
  onClick?: () => void;
}

export default function CTAButton({
  label,
  source,
  href = "/plan-your-trip",
  onClick,
}: CTAButtonProps) {
  return (
    <Link
      href={{
        pathname: href,
        query: { source },
      }}
      onClick={onClick}
      className="
        inline-flex items-center justify-center
        rounded-full bg-black px-6 py-3
        text-sm font-semibold text-gray-400
        transition
        hover:bg-gray-800 hover:text-white
      "
    >
      {label}
    </Link>
  );
}
