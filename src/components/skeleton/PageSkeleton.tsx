"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Skeleton from "./Skeleton";

export default function PageSkeleton() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [previousPath, setPreviousPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== previousPath) {
      setLoading(true);
      setPreviousPath(pathname);

      const timer = setTimeout(() => setLoading(false), 500); // Show skeleton for min 500ms
      return () => clearTimeout(timer);
    }
  }, [pathname, previousPath]);

  if (!loading) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-4">
      <Skeleton count={1} className="h-8 w-1/3" /> {/* Title */}
      <Skeleton count={3} className="h-4 w-full" /> {/* Paragraph */}
      <Skeleton count={2} className="h-24 w-full rounded-xl" /> {/* Cards/images */}
    </div>
  );
}
