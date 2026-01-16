"use client";

import React from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export default function Button({
  label,
  onClick,
  loading = false,
  loadingLabel = "Saving…",
  disabled = false,
  type = "button",
  className = "",
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center rounded-full px-6 py-3 font-medium transition
        ${
          isDisabled
            ? "cursor-not-allowed bg-gray-700 text-white"
            : "bg-black text-white hover:bg-gray-800"
        }
        ${className}
      `}
    >
      {loading ? loadingLabel : label}
    </button>
  );
}
