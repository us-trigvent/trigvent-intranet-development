import { useEffect, useState } from "react";
import { CalendarDays, Loader2, PartyPopper, X } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

const initialForm = {
  userId: "",
  heading: "",
  eventDate: "",
  anniversaryYear: "",
  image: null,
};

const getEmployees = (payload) => {
  const candidates = [
    payload?.data?.data,
    payload?.data?.employees,
    payload?.employees,
    payload?.data,
  ];
  const rows = candidates.find(Array.isArray) || [];

  return rows
    .map((employee) => ({
      id: employee.id ?? employee.user_id ?? employee.employee_id,
      name:
        employee.name ??
        employee.full_name ??
        employee.employee_name ??
        employee.employee?.name ??
        "Unknown employee",
    }))
    .filter((employee) => employee.id != null);
};

export default function CreateCelebrationDialog({
  open,
  onClose,
  onSubmit,
  submitting = false,
}) {
  const [form, setForm] = useState(initialForm);
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [employeeError, setEmployeeError] = useState("");

  useEffect(() => {
    if (!open) return undefined;

    let active = true;
    axiosInstance
      .get("/directory/employees", { params: { page: 1, per_page: 100 } })
      .then((response) => {
        if (active) setEmployees(getEmployees(response.data));
      })
      .catch((requestError) => {
        if (active) {
          setEmployeeError(
            requestError.response?.data?.message ||
              "Failed to load employees."
          );
        }
      })
      .finally(() => {
        if (active) setLoadingEmployees(false);
      });

    return () => {
      active = false;
    };
  }, [open]);

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setForm((current) => ({
      ...current,
      [name]: files ? files[0] ?? null : value,
    }));
  };

  const handleClose = () => {
    setForm(initialForm);
    setEmployees([]);
    setLoadingEmployees(true);
    setEmployeeError("");
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const created = await onSubmit(form);
    if (created !== false) handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-dark/50 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-celebration-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) handleClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="max-h-[calc(100vh-3rem)] w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between bg-brand-navy px-5 py-4 text-white sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <PartyPopper size={19} />
            </span>
            <div>
              <h2 id="create-celebration-title" className="text-lg font-semibold">
                Add Celebration
              </h2>
              <p className="mt-0.5 text-xs text-white/70">
                Add an employee birthday or anniversary
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            aria-label="Close dialog"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(100vh-13rem)] space-y-5 overflow-y-auto p-5 sm:p-6">
          <div>
            <label
              htmlFor="celebration-user"
              className="mb-2 block text-sm font-medium text-text-secondary"
            >
              Select Employee <span className="text-danger">*</span>
            </label>
            <select
              id="celebration-user"
              name="userId"
              value={form.userId}
              onChange={handleChange}
              required
              disabled={loadingEmployees || employees.length === 0}
              className="w-full rounded-xl border border-border-default bg-white px-3.5 py-2.5 text-sm text-brand-navy outline-none transition focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 disabled:cursor-not-allowed disabled:bg-surface-muted"
            >
              <option value="">
                {loadingEmployees
                  ? "Loading employees..."
                  : employees.length
                    ? "Select an employee"
                    : "No employees available"}
              </option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
            {employeeError && (
              <p role="alert" className="mt-1.5 text-xs text-danger">
                {employeeError}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="celebration-heading"
              className="mb-2 block text-sm font-medium text-text-secondary"
            >
              Heading <span className="text-danger">*</span>
            </label>
            <select
              id="celebration-heading"
              name="heading"
              value={form.heading}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-border-default bg-white px-3.5 py-2.5 text-sm text-brand-navy outline-none transition focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10"
            >
              <option value="">Select event type</option>
              <option value="Birthday">Birthday</option>
              <option value="Anniversary">Anniversary</option>
            </select>
          </div>

          {form.heading === "Anniversary" && (
            <div>
              <label
                htmlFor="celebration-anniversary-year"
                className="mb-2 block text-sm font-medium text-text-secondary"
              >
                Anniversary Year
              </label>
              <input
                id="celebration-anniversary-year"
                name="anniversaryYear"
                type="number"
                min="1"
                value={form.anniversaryYear}
                onChange={handleChange}
                placeholder="Enter years"
                className="w-full rounded-xl border border-border-default bg-white px-3.5 py-2.5 text-sm text-brand-navy outline-none transition placeholder:text-neutral-400 focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="celebration-image"
              className="mb-2 block text-sm font-medium text-text-secondary"
            >
              Image <span className="text-danger">*</span>
            </label>
            <input
              id="celebration-image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-border-default bg-white px-3.5 py-2.5 text-sm text-text-secondary file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand-teal-soft file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand-teal-dark"
            />
          </div>

          <div>
            <label
              htmlFor="celebration-date"
              className="mb-2 block text-sm font-medium text-text-secondary"
            >
              Date <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <input
                id="celebration-date"
                name="eventDate"
                type="date"
                value={form.eventDate}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-border-default bg-white px-3.5 py-2.5 pr-10 text-sm text-brand-navy outline-none transition focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10"
              />
              <CalendarDays
                size={16}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border-default px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="rounded-xl border border-border-default px-5 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-surface-subtle disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || loadingEmployees || employees.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-teal px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-teal-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && <Loader2 size={17} className="animate-spin" />}
            {submitting ? "Creating..." : "Add Celebration"}
          </button>
        </div>
      </form>
    </div>
  );
}
