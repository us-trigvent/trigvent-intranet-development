import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  HandCoins,
  Save,
  UserRound,
} from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#203D61] outline-none transition placeholder:text-slate-400 focus:border-[#0D9999] focus:ring-4 focus:ring-[#0D9999]/10";

const employees = [
  { id: "EMP001", name: "Rahul Gupta" },
  { id: "EMP002", name: "Priya Sharma" },
  { id: "EMP003", name: "Amit Kumar" },
  { id: "EMP004", name: "Neha Singh" },
];

const initialForm = {
  employee: "",
  startDate: "",
  endDate: "",
  amount: "",
  remarks: "",
};

export default function AddLoan() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!form.employee) nextErrors.employee = "Please select an employee.";
    if (!form.startDate) nextErrors.startDate = "Please select a start date.";
    if (!form.endDate) nextErrors.endDate = "Please select an end date.";
    if (
      form.startDate &&
      form.endDate &&
      form.endDate < form.startDate
    ) nextErrors.endDate = "End date cannot be before start date.";
    if (!form.amount) nextErrors.amount = "Please enter a loan amount.";
    if (Number(form.amount) <= 0) nextErrors.amount = "Amount must be greater than zero.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setMessage("Loan added successfully.");
    } else {
      setMessage("");
    }
  };

  const Field = ({ label, name, required, error, children }) => (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F8FC] px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <header className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
          <span>Trigvent</span>
          <span className="text-slate-300">/</span>
          <span>Financial</span>
          <span className="text-slate-300">/</span>
          <span className="text-[#0D9999]">Add Loan</span>
        </div>

        <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-[#203D61] sm:text-3xl">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F7F6] text-[#0D9999]">
            <HandCoins size={23} />
          </span>
          Add Loan
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Record a new loan for an employee.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F7F6] text-[#0D9999]">
              <HandCoins size={20} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-[#203D61]">Loan Information</h2>
              <p className="mt-1 text-sm text-slate-500">Enter the employee, loan period and amount.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:p-6 lg:grid-cols-2 lg:p-7">
            <Field label="Select Employee" name="employee" required error={errors.employee}>
              <div className="relative">
                <UserRound size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  id="employee"
                  value={form.employee}
                  onChange={(event) => updateField("employee", event.target.value)}
                  className={`${inputClass} pl-10`}
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>{employee.name}</option>
                  ))}
                </select>
              </div>
            </Field>

            <Field label="Start Date" name="startDate" required error={errors.startDate}>
              <div className="relative">
                <CalendarDays size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(event) => updateField("startDate", event.target.value)}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>

            <Field label="End Date" name="endDate" required error={errors.endDate}>
              <div className="relative">
                <CalendarDays size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="endDate"
                  type="date"
                  min={form.startDate || undefined}
                  value={form.endDate}
                  onChange={(event) => updateField("endDate", event.target.value)}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>

            <Field label="Amount" name="amount" required error={errors.amount}>
              <input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(event) => updateField("amount", event.target.value)}
                placeholder="Enter amount"
                className={inputClass}
              />
            </Field>

            <div className="lg:col-span-2">
              <Field label="Remarks" name="remarks">
                <textarea
                  id="remarks"
                  rows={5}
                  value={form.remarks}
                  onChange={(event) => updateField("remarks", event.target.value)}
                  placeholder="Remarks here..."
                  className={`${inputClass} resize-y`}
                />
              </Field>
            </div>
          </div>

          {message && (
            <p role="status" className="mx-5 mb-5 flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800 sm:mx-7">
              <CheckCircle2 size={17} />
              {message}
            </p>
          )}

          <div className="flex justify-end border-t border-slate-200 px-5 py-4 sm:px-7">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0D9999] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#087F80] focus:outline-none focus:ring-4 focus:ring-[#0D9999]/20"
            >
              <Save size={17} />
              Add Loan
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
