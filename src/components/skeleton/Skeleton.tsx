"use client";

interface SkeletonProps {
  count?: number;
  className?: string;
}

export default function Skeleton({ count = 1, className = "" }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
        />
      ))}
    </>
  );
}
