import { Archive, ArchiveRestore, Loader2, X } from "lucide-react";
import Button from "../../common/Button";

export default function ArchiveConfirmationDialog({
  open,
  employee,
  action = "archive",
  onClose,
  onConfirm,
  loading = false,
}) {
  if (!open || !employee) return null;

  const isUnarchiving = action === "unarchive";
  const ActionIcon = isUnarchiving ? ArchiveRestore : Archive;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-dark/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="archive-confirmation-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex justify-end px-5 pt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={loading}
            aria-label="Close archive dialog"
            className="text-neutral-400 hover:bg-surface-subtle hover:text-brand-navy"
          >
            <X size={19} />
          </Button>
        </div>

        <div className="px-6 pb-6">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${
              isUnarchiving
                ? "bg-brand-teal-soft text-brand-teal-dark"
                : "bg-warning-soft text-warning-dark"
            }`}
          >
            <ActionIcon size={23} />
          </div>
          <h2
            id="archive-confirmation-title"
            className="mt-4 text-lg font-semibold text-brand-navy"
          >
            {isUnarchiving ? "Unarchive employee?" : "Archive employee?"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            {isUnarchiving
              ? `Are you sure you want to unarchive "${employee.name}"? This employee will return to the active listing.`
              : `Are you sure you want to archive "${employee.name}"? This employee will be moved out of the active listing.`}
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant={isUnarchiving ? "default" : "warning"}
              onClick={onConfirm}
              disabled={loading}
              className="min-w-32"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading
                ? isUnarchiving
                  ? "Unarchiving..."
                  : "Archiving..."
                : isUnarchiving
                  ? "Unarchive employee"
                  : "Archive employee"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
