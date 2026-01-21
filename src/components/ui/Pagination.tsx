"use client";

interface PaginationProps {
  pageIndex: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function Pagination({
  pageIndex,
  totalPages,
  onPrevious,
  onNext,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-center text-sm text-gray-600 sm:text-left">
        Page <strong>{pageIndex}</strong> of <strong>{totalPages}</strong>
      </span>

      <div className="flex w-full gap-3 sm:w-auto">
        <button
          disabled={pageIndex === 1}
          onClick={onPrevious}
          className="flex-1 rounded border px-4 py-2 text-sm disabled:opacity-50 sm:flex-none"
        >
          ← Previous
        </button>

        <button
          disabled={pageIndex === totalPages}
          onClick={onNext}
          className="flex-1 rounded border px-4 py-2 text-sm disabled:opacity-50 sm:flex-none"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
