import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Save,
  UserRound,
  UsersRound,
} from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-border-default bg-white px-3.5 py-2.5 text-sm text-brand-navy outline-none transition placeholder:text-neutral-400 focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10";

const initialForm = {
  trainee: "",
  amount: "",
  date: "",
  mode: "",
  receivedBy: "",
  submittedToAdmin: "",
};

const trainees = [
  "Aman Kumar",
  "Bhavya Sharma",
  "Chetan Singh",
  "Disha Verma",
];

const employees = [
  "Rahul Gupta",
  "Priya Sharma",
  "Amit Kumar",
  "Neha Singh",
];

export default function AddPayment() {
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

    const requiredFields = [
      "trainee",
      "amount",
      "date",
      "mode",
      "receivedBy",
      "submittedToAdmin",
    ];
    const nextErrors = {};

    requiredFields.forEach((field) => {
      if (!form[field]) nextErrors[field] = "This field is required.";
    });

    if (form.amount && Number(form.amount) <= 0) {
      nextErrors.amount = "Amount must be greater than zero.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setMessage("Payment saved successfully.");
    } else {
      setMessage("");
    }
  };

  const Field = ({ label, name, required = true, error, children }) => (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-text-secondary">
        {label}
        {required && <span className="ml-1 text-danger">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-page px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <header className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-neutral-500">
          <span>Trigvent</span>
          <span className="text-neutral-300">/</span>
          <span>Training</span>
          <span className="text-neutral-300">/</span>
          <span className="text-brand-teal">Add Payment</span>
        </div>

        <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-teal-soft text-brand-teal">
            <CreditCard size={23} />
          </span>
          Add Payment
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Record a new payment for a trainee.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-border-default/80 bg-white shadow-sm">
        <div className="border-b border-border-default bg-surface-subtle/70 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-teal-soft text-brand-teal">
              <CreditCard size={20} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-brand-navy">Payment Details</h2>
              <p className="mt-1 text-sm text-neutral-500">Enter the trainee and transaction information.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:p-6 lg:grid-cols-2 lg:p-7">
            <Field label="Select Trainee" name="trainee" error={errors.trainee}>
              <div className="relative">
                <UserRound size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <select
                  id="trainee"
                  value={form.trainee}
                  onChange={(event) => updateField("trainee", event.target.value)}
                  className={`${inputClass} pl-10`}
                >
                  <option value="">Select Trainee</option>
                  {trainees.map((trainee) => <option key={trainee} value={trainee}>{trainee}</option>)}
                </select>
              </div>
            </Field>

            <Field label="Amount" name="amount" error={errors.amount}>
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

            <Field label="Date" name="date" error={errors.date}>
              <div className="relative">
                <CalendarDays size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(event) => updateField("date", event.target.value)}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>

            <Field label="Select Mode" name="mode" error={errors.mode}>
              <select
                id="mode"
                value={form.mode}
                onChange={(event) => updateField("mode", event.target.value)}
                className={inputClass}
              >
                <option value="">Select Mode</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </Field>

            <Field label="Received By" name="receivedBy" error={errors.receivedBy}>
              <div className="relative">
                <UsersRound size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <select
                  id="receivedBy"
                  value={form.receivedBy}
                  onChange={(event) => updateField("receivedBy", event.target.value)}
                  className={`${inputClass} pl-10`}
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => <option key={employee} value={employee}>{employee}</option>)}
                </select>
              </div>
            </Field>

            <Field label="Submitted To Admin" name="submittedToAdmin" error={errors.submittedToAdmin}>
              <select
                id="submittedToAdmin"
                value={form.submittedToAdmin}
                onChange={(event) => updateField("submittedToAdmin", event.target.value)}
                className={inputClass}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </Field>
          </div>

          {message && (
            <p role="status" className="mx-5 mb-5 flex items-center gap-2 rounded-xl border border-brand-teal-soft bg-brand-teal-soft px-4 py-3 text-sm font-medium text-brand-teal-dark sm:mx-7">
              <CheckCircle2 size={17} />
              {message}
            </p>
          )}

          <div className="flex justify-end border-t border-border-default px-5 py-4 sm:px-7">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-teal px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-teal-dark focus:outline-none focus:ring-4 focus:ring-brand-teal/20"
            >
              <Save size={17} />
              Save Payment
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
