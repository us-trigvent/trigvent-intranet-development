import { Loader2, Trash2, X } from "lucide-react";

export default function DeleteConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title = "Delete record?",
  itemName = "",
  description = "",
  confirmLabel = "Delete",
  loading = false,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-dark/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-confirmation-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex justify-end px-5 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close delete dialog"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-surface-subtle hover:text-brand-navy disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-danger-soft text-danger">
            <Trash2 size={23} />
          </div>
          <h2 id="delete-confirmation-title" className="mt-4 text-lg font-semibold text-brand-navy">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            {description ||
              `Are you sure you want to delete${itemName ? ` "${itemName}"` : " this record"}? This action cannot be undone.`}
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-border-default px-4 py-2.5 text-sm font-semibold text-neutral-600 transition hover:bg-surface-subtle disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="inline-flex min-w-24 items-center justify-center gap-2 rounded-xl bg-danger px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-danger-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Deleting..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
