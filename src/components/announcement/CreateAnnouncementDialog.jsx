
import { useEffect } from "react";
import { useFormik } from "formik";
import { CalendarDays, Loader2, Megaphone, X } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import { createAnnouncementValidationSchema } from "../../validations/createAnnouncement";

const emptyForm = {
  title: "",
  content: "",
  date: "",
  highlight: false,
};

const toRichHtml = (html = "") => {
  const trimmedHtml = html.trim();
  if (!trimmedHtml) return "";

  if (/^<(?:p|div|h[1-6]|ul|ol|blockquote|table)\b/i.test(trimmedHtml)) {
    return trimmedHtml;
  }

  const plainText = trimmedHtml
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>|<\/div>|<\/li>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .trim();

  if (!plainText) return "";
  return `<p>${trimmedHtml
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join("</p><p>")}</p>`;
};

export default function CreateAnnouncementDialog({
  open,
  onClose,
  onSubmit,
  submitting = false,
  initialValues = null,
  mode = "create",
  loading = false,
}) {
  const formik = useFormik({
    initialValues: initialValues || emptyForm,
    enableReinitialize: true,
    validationSchema: createAnnouncementValidationSchema,
    onSubmit: async (values) => {
      const created = await onSubmit({
        title: values.title.trim(),
        content: toRichHtml(values.content),
        date: values.date,
        highlight: values.highlight ? 1 : 0,
      });

      if (created !== false) {
        formik.resetForm();
        onClose();
      }
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-dark/50 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-announcement-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <form
        onSubmit={formik.handleSubmit}
        className="max-h-[calc(100vh-3rem)] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-brand-navy px-5 py-4 text-white sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <Megaphone size={19} />
            </span>

            <div>
              <h2
                id="create-announcement-title"
                className="text-lg font-semibold"
              >
                {mode === "edit" ? "Edit Announcement" : "Create Announcement"}
              </h2>
              <p className="mt-0.5 text-xs text-white/70">
                {mode === "edit" ? "Update this company announcement" : "Publish a new company update"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close dialog"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Fields */}
        {loading && (
          <div className="flex min-h-96 flex-col items-center justify-center gap-3 text-sm text-neutral-500">
            <Loader2 size={28} className="animate-spin text-brand-teal" />
            Loading announcement details...
          </div>
        )}
        {!loading && (
        <div className="max-h-[calc(100vh-13rem)] overflow-y-auto p-5 sm:p-6">

          {/* Title */}
          <div>
            <label
              htmlFor="announcement-title"
              className="mb-2 block text-sm font-medium text-text-secondary"
            >
              Title <span className="text-danger">*</span>
            </label>

            <input
              id="announcement-title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter announcement title"
              className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-brand-navy outline-none placeholder:text-neutral-400 focus:ring-4 ${
                formik.touched.title && formik.errors.title
                  ? "border-danger focus:ring-danger-soft"
                  : "border-border-default focus:border-brand-teal focus:ring-brand-teal/10"
              }`}
            />

            {formik.touched.title && formik.errors.title && (
              <p className="mt-1.5 text-xs font-medium text-danger">
                {formik.errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-text-secondary">
              Description <span className="text-danger">*</span>
            </label>

            <RichTextEditor
              value={formik.values.content}
              onChange={(value) =>
                formik.setFieldValue("content", value)
              }
              onBlur={() =>
                formik.setFieldTouched("content", true)
              }
              error={
                formik.touched.content
                  ? formik.errors.content
                  : ""
              }
            />
          </div>

          {/* Date and Highlight */}
          <div className="mt-5 grid gap-5 sm:grid-cols-2">

            {/* Date */}
            <div>
              <label
                htmlFor="announcement-date"
                className="mb-2 block text-sm font-medium text-text-secondary"
              >
                Date <span className="text-danger">*</span>
              </label>

              <div className="relative">
                <input
                  id="announcement-date"
                  name="date"
                  type="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-brand-navy outline-none focus:ring-4 ${
                    formik.touched.date && formik.errors.date
                      ? "border-danger focus:ring-danger-soft"
                      : "border-border-default focus:border-brand-teal focus:ring-brand-teal/10"
                  }`}
                />

                <CalendarDays
                  size={16}
                  className="pointer-events-none absolute right-3.5 top-1/2 hidden -translate-y-1/2 text-neutral-400 sm:block"
                />
              </div>

              {formik.touched.date && formik.errors.date && (
                <p className="mt-1.5 text-xs font-medium text-danger">
                  {formik.errors.date}
                </p>
              )}
            </div>

            {/* Highlight */}
            <label className="flex items-center gap-3 rounded-xl border border-border-default px-4 py-3 sm:mt-[26px]">
              <input
                type="checkbox"
                name="highlight"
                checked={formik.values.highlight}
                onChange={formik.handleChange}
                className="h-4 w-4 accent-brand-teal"
              />

              <span>
                <span className="block text-sm font-medium text-brand-navy">
                  Highlight announcement
                </span>
                <span className="mt-0.5 block text-xs text-neutral-500">
                  Feature this announcement prominently
                </span>
              </span>
            </label>
          </div>

        </div>
        )}

        {/* Footer */}
        {!loading && <div className="flex flex-col-reverse gap-3 border-t border-border-default px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl border border-border-default px-5 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-surface-subtle disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-teal px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-teal-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && (
              <Loader2 size={17} className="animate-spin" />
            )}

            {submitting
              ? mode === "edit" ? "Updating..." : "Creating..."
              : mode === "edit" ? "Update Announcement" : "Create Announcement"}
          </button>
        </div>}
      </form>
    </div>
  );
}
