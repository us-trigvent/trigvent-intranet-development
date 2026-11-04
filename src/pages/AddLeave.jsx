
import { useState } from "react";
import {
  CalendarPlus,
  UserRound,
  Users,
  CalendarDays,
  FileText,
  Send,
  Info,
} from "lucide-react";

const initialForm = {
  employee: "",
  managers: [],
  leaveCategory: "Casual Leave",
  leaveType: "Full",
  fromDate: new Date().toISOString().slice(0, 10),
  toDate: new Date().toISOString().slice(0, 10),
  reason: "",
  internalComments: "",
};

const employees = [
  { id: "EMP001", name: "Rahul Gupta" },
  { id: "EMP002", name: "Priya Sharma" },
  { id: "EMP003", name: "Amit Kumar" },
];

const managers = [
  { id: "MGR001", name: "HR Manager" },
  { id: "MGR002", name: "Engineering Manager" },
  { id: "MGR003", name: "Project Manager" },
];

const leaveCategories = [
  "Casual Leave",
  "Sick Leave",
  "Earned Leave",
  "Comp Off",
  "Unpaid Leave",
];

const leaveTypes = ["Full", "First Half", "Second Half"];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#203D61] outline-none transition placeholder:text-slate-400 focus:border-[#0D9999] focus:ring-4 focus:ring-[#0D9999]/10 disabled:cursor-not-allowed disabled:bg-slate-100";

function FormField({ label, required, error, children }) {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
        {required && (
          <span className="ml-1 text-rose-500">*</span>
        )}
      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-xs text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={inputClass}
    >
      {placeholder && <option value="">{placeholder}</option>}

      {options.map((option) => {
        const optionValue =
          typeof option === "string" ? option : option.id;

        const optionLabel =
          typeof option === "string" ? option : option.name;

        return (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        );
      })}
    </select>
  );
}

export default function AddLeave() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState("");

  const updateField = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
      ...(name === "fromDate" || name === "toDate"
        ? { fromDate: "", toDate: "" }
        : {}),
    }));

    setFeedback("");
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.employee) {
      nextErrors.employee = "Please select an employee.";
    }

    if (form.managers.length === 0) {
      nextErrors.managers = "Please select at least one manager.";
    }

    if (!form.fromDate) {
      nextErrors.fromDate = "Please select a start date.";
    }

    if (!form.toDate) {
      nextErrors.toDate = "Please select an end date.";
    }

    if (
      form.fromDate &&
      form.toDate &&
      form.toDate < form.fromDate
    ) {
      nextErrors.toDate =
        "End date cannot be earlier than start date.";
    }

    if (!form.reason.trim()) {
      nextErrors.reason = "Please provide a reason for leave.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      setFeedback("");
      return;
    }

    // Connect your Add Leave API here.
    // The current component only validates the form.
    setFeedback(
      "Form validated successfully. Connect the backend API to submit the leave request."
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] px-4 pb-8 pt-20 sm:px-6 sm:pt-20 lg:px-8 lg:pt-8">
      {/* Page Header */}
      <header className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
          <span>Trigvent</span>
          <span className="text-slate-300">/</span>
          <span>Leave Management</span>
          <span className="text-slate-300">/</span>
          <span className="text-[#0D9999]">Add Leave</span>
        </div>

        <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-[#203D61] sm:text-3xl">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F7F6] text-[#0D9999]">
            <CalendarPlus size={23} />
          </span>
          Add Leave
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Apply for a new leave and provide the required details.
        </p>
      </header>

      {/* Leave Form */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F7F6] text-[#0D9999]">
              <FileText size={20} />
            </span>

            <div>
              <h2 className="text-base font-semibold text-[#203D61]">
                Leave Information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter the employee, dates and leave details.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:p-6 lg:grid-cols-2 lg:p-7">
            {/* Employee */}
            <FormField
              label="Employee"
              required
              error={errors.employee}
            >
              <div className="relative">
                <UserRound
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={form.employee}
                  onChange={(event) =>
                    updateField("employee", event.target.value)
                  }
                  className={`${inputClass} pl-10`}
                >
                  <option value="">Select employee</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>
            </FormField>

            {/* Managers */}
            <FormField
              label="Managers"
              required
              error={errors.managers}
            >
              <div className="relative">
                <Users
                  size={17}
                  className="pointer-events-none absolute left-3 top-3 text-slate-400"
                />

                <select
                  multiple
                  value={form.managers}
                  onChange={(event) =>
                    updateField(
                      "managers",
                      Array.from(
                        event.target.selectedOptions,
                        (option) => option.value
                      )
                    )
                  }
                  aria-label="Select managers"
                  className={`${inputClass} min-h-11 pl-10`}
                >
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name}
                    </option>
                  ))}
                </select>
              </div>

              <p className="mt-1.5 text-xs text-slate-400">
                Hold Ctrl (Windows) or Command (Mac) to select multiple managers.
              </p>
            </FormField>

            {/* Leave Category */}
            <FormField label="Leave Category">
              <SelectField
                value={form.leaveCategory}
                onChange={(event) =>
                  updateField("leaveCategory", event.target.value)
                }
                options={leaveCategories}
              />
            </FormField>

            {/* Leave Type */}
            <FormField label="Leave Type">
              <SelectField
                value={form.leaveType}
                onChange={(event) =>
                  updateField("leaveType", event.target.value)
                }
                options={leaveTypes}
              />
            </FormField>

            {/* From Date */}
            <FormField
              label="From Date"
              required
              error={errors.fromDate}
            >
              <div className="relative">
                <CalendarDays
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="date"
                  value={form.fromDate}
                  onChange={(event) =>
                    updateField("fromDate", event.target.value)
                  }
                  max={form.toDate || undefined}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </FormField>

            {/* To Date */}
            <FormField
              label="To Date"
              required
              error={errors.toDate}
            >
              <div className="relative">
                <CalendarDays
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="date"
                  value={form.toDate}
                  min={form.fromDate || undefined}
                  onChange={(event) =>
                    updateField("toDate", event.target.value)
                  }
                  className={`${inputClass} pl-10`}
                />
              </div>
            </FormField>

            {/* Reason */}
            <div className="lg:col-span-2">
              <FormField
                label="Reason"
                required
                error={errors.reason}
              >
                <textarea
                  rows={4}
                  value={form.reason}
                  onChange={(event) =>
                    updateField("reason", event.target.value)
                  }
                  placeholder="Explain why you are applying for leave..."
                  className={`${inputClass} resize-y`}
                />
              </FormField>
            </div>

            {/* Internal Comments */}
            <div className="lg:col-span-2">
              <FormField label="Internal Comments (HR/Admin only)">
                <textarea
                  rows={3}
                  value={form.internalComments}
                  onChange={(event) =>
                    updateField(
                      "internalComments",
                      event.target.value
                    )
                  }
                  placeholder="Optional notes for HR/Admin..."
                  className={`${inputClass} resize-y`}
                />
              </FormField>

              <div className="mt-3 flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <Info
                  size={17}
                  className="mt-0.5 shrink-0 text-[#0D9999]"
                />
                <p className="text-xs leading-5 text-slate-500">
                  Internal comments should be used for administrative
                  notes and must not be exposed to employees.
                </p>
              </div>
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              role="status"
              className="mx-5 mb-5 rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-teal-800 sm:mx-7"
            >
              {feedback}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:px-7">
            <p className="text-xs text-slate-400">
              Fields marked with * are required.
            </p>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D9999] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#087F80] focus:outline-none focus:ring-4 focus:ring-[#0D9999]/20"
            >
              <Send size={16} />
              Add Leave
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
