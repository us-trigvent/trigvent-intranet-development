
import { useState } from "react";
import { CalendarPlus, Send, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const employees = [
  { id: "EMP001", name: "Rahul Gupta" },
  { id: "EMP002", name: "Priya Sharma" },
  { id: "EMP003", name: "Amit Kumar" },
];

const workTypes = [
  { value: "full", label: "Full Day", days: 1 },
  { value: "half", label: "Half Day", days: 0.5 },
];

const today = () => {
  const date = new Date();
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

const initialForm = {
  employee: "",
  workDate: today(),
  workType: "",
  reason: "",
};

const inputClass =
  "w-full rounded-xl border border-border-default bg-white px-3.5 py-2.5 text-sm text-brand-navy outline-none transition placeholder:text-neutral-400 focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 disabled:cursor-not-allowed disabled:bg-surface-muted";

function FormField({ label, required, error, children }) {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-sm font-medium text-text-secondary">
        {label}
        {required && <span className="ml-1 text-danger">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-danger">{error}</p>
      )}
    </div>
  );
}

export default function AddCompOffCredit({
  employeeOptions = employees,
  onSubmit,
  onCancel,
}) {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const selectedWorkType = workTypes.find(
    (type) => type.value === form.workType
  );

  const creditDays = selectedWorkType?.days ?? 0;

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: "" }));
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!form.employee) {
      nextErrors.employee = "Please select an employee.";
    }

    if (!form.workDate) {
      nextErrors.workDate = "Please select a work date.";
    }

    if (!form.workType) {
      nextErrors.workType = "Please select a work type.";
    }

    if (!form.reason.trim()) {
      nextErrors.reason = "Please enter the work reason.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    if (!onSubmit) {
      setMessage("Form validated. Connect your API to save this record.");
      return;
    }

    try {
      setLoading(true);

      await onSubmit({
        employeeId: form.employee,
        workDate: form.workDate,
        workType: form.workType,
        creditDays,
        reason: form.reason.trim(),
      });

      setMessage("Comp off credit added successfully.");
      setForm({ ...initialForm, workDate: today() });
      setErrors({});
    } catch (error) {
      setMessage(
        error?.message || "Unable to add comp off credit."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-page px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <header className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-neutral-500">
          <span>Trigvent</span>
          <span className="text-neutral-300">/</span>
          <span>Leave Management</span>
          <span className="text-neutral-300">/</span>
          <span className="text-brand-teal">Add Comp Off Credit</span>
        </div>

        <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-teal-soft text-brand-teal">
            <CalendarPlus size={23} />
          </span>
          Add Comp Off Credit
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Credit comp off for employees who worked on non-working days.
        </p>
      </header>

      <main className="overflow-hidden rounded-2xl border border-border-default/80 bg-white shadow-sm">
        <div className="border-b border-border-default bg-surface-subtle/70 px-5 py-4 sm:px-7">
          <h2 className="text-base font-semibold text-brand-navy">Comp Off Details</h2>
          <p className="mt-1 text-sm text-neutral-500">Enter the employee and work-day information.</p>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:p-6 lg:grid-cols-2 lg:p-7">
            <FormField
              label="Employee"
              required
              error={errors.employee}
            >
              <select
                value={form.employee}
                onChange={(e) => updateField("employee", e.target.value)}
                className={inputClass}
              >
                <option value="">Select Employee</option>
                {employeeOptions.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Work Date"
              required
              error={errors.workDate}
            >
              <input
                type="date"
                value={form.workDate}
                onChange={(e) => updateField("workDate", e.target.value)}
                className={`${inputClass} bg-surface-muted`}
              />
            </FormField>

            <FormField
              label="Work Type"
              required
              error={errors.workType}
            >
              <select
                value={form.workType}
                onChange={(e) => updateField("workType", e.target.value)}
                className={inputClass}
              >
                <option value="">Select Work Type</option>
                {workTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Credit Days (Auto-calculated)">
              <input
                type="text"
                readOnly
                value={creditDays.toFixed(1)}
                className={`${inputClass} cursor-not-allowed bg-surface-muted`}
              />
            </FormField>

            <div className="lg:col-span-2">
              <FormField
                label="Work Reason"
                required
                error={errors.reason}
              >
                <textarea
                  rows={5}
                  value={form.reason}
                  onChange={(e) => updateField("reason", e.target.value)}
                  placeholder="Explain why the employee worked on a non-working day (e.g., project deadline, urgent deployment...)"
                  className={`${inputClass} min-h-28 resize-y`}
                />
              </FormField>
            </div>
          </div>

          {message && (
            <p
              role="status"
              className="mx-5 mt-5 rounded-xl border border-brand-teal-soft bg-brand-teal-soft px-4 py-3 text-sm text-brand-teal-dark sm:mx-7"
            >
              {message}
            </p>
          )}

          <div className="mt-0 flex justify-end gap-3 border-t border-border-light px-5 py-4 sm:px-7">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-default px-5 py-3 text-sm font-semibold text-neutral-600 transition hover:bg-surface-subtle disabled:opacity-60"
            >
              <X size={17} />
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-teal px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-teal-dark disabled:opacity-60"
            >
              <Send size={17} />
              {loading ? "Submitting..." : "Add Comp Off Credit"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
