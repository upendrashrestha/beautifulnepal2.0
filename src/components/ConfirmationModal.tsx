"use client";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="
        w-full rounded-t-2xl bg-white p-6 shadow-lg
        sm:max-w-md sm:rounded-xl
      ">
        {/* Handle (mobile) */}
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-gray-300 sm:hidden" />

        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{message}</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded border px-4 py-2 text-sm sm:w-auto"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={() => { onConfirm() }}
            className="
              w-full rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white
              hover:bg-red-700 sm:w-auto
            "
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
