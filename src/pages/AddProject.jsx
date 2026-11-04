import { useState } from "react";
import { BriefcaseBusiness, FolderPlus, Send } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-border-default bg-white px-3.5 py-2.5 text-sm text-brand-navy outline-none transition placeholder:text-neutral-400 focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 disabled:cursor-not-allowed disabled:bg-surface-muted";

const initialForm = {
  projectName: "",
  clientCode: "",
  description: "",
  tags: "",
  po: "",
  teamMembers: "",
  salesManager: "",
  currency: "",
  dealAmount: "",
  type: "",
};

const teamMembers = [
  "Rahul Gupta",
  "Priya Sharma",
  "Amit Kumar",
  "Neha Singh",
];

export default function AddProject() {
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
      "projectName",
      "description",
      "po",
      "salesManager",
      "currency",
      "dealAmount",
      "type",
    ];

    const nextErrors = {};
    requiredFields.forEach((field) => {
      if (!String(form[field]).trim()) nextErrors[field] = "This field is required.";
    });

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setMessage("");
      return;
    }

    setMessage("Project added successfully.");
  };

  const Field = ({ label, name, required, children, error }) => (
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
          <span>Projects</span>
          <span className="text-neutral-300">/</span>
          <span className="text-brand-teal">Add Project</span>
        </div>

        <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-teal-soft text-brand-teal">
            <BriefcaseBusiness size={23} />
          </span>
          Add Project
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Create a project and assign its commercial and delivery details.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-border-default/80 bg-white shadow-sm">
        <div className="border-b border-border-default bg-surface-subtle/70 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-teal-soft text-brand-teal">
              <FolderPlus size={20} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-brand-navy">Project Information</h2>
              <p className="mt-1 text-sm text-neutral-500">Enter the project and client details.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:p-6 lg:grid-cols-2 lg:p-7">
            <Field label="Project Name" name="projectName" required error={errors.projectName}>
              <input
                id="projectName"
                value={form.projectName}
                onChange={(event) => updateField("projectName", event.target.value)}
                placeholder="Enter project name"
                className={inputClass}
              />
            </Field>

            <Field label="Client Code" name="clientCode">
              <input
                id="clientCode"
                value={form.clientCode}
                onChange={(event) => updateField("clientCode", event.target.value)}
                placeholder="Enter client code"
                className={inputClass}
              />
            </Field>

            <div className="lg:col-span-2">
              <Field label="Description" name="description" required error={errors.description}>
                <textarea
                  id="description"
                  rows={4}
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  placeholder="Describe the project..."
                  className={`${inputClass} resize-y`}
                />
              </Field>
            </div>

            <div className="lg:col-span-2">
              <Field label="Tags" name="tags">
                <input
                  id="tags"
                  value={form.tags}
                  onChange={(event) => updateField("tags", event.target.value)}
                  placeholder="Enter tags"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Select PO" name="po" required error={errors.po}>
              <select id="po" value={form.po} onChange={(event) => updateField("po", event.target.value)} className={inputClass}>
                <option value="">Select PO</option>
                <option value="PO-001">PO-001</option>
                <option value="PO-002">PO-002</option>
                <option value="PO-003">PO-003</option>
              </select>
            </Field>

            <Field label="Select Team Members" name="teamMembers">
              <select id="teamMembers" value={form.teamMembers} onChange={(event) => updateField("teamMembers", event.target.value)} className={inputClass}>
                <option value="">Select Team Members</option>
                {teamMembers.map((member) => (
                  <option key={member} value={member}>{member}</option>
                ))}
              </select>
            </Field>

            <Field label="Select Sales Managers" name="salesManager" required error={errors.salesManager}>
              <select id="salesManager" value={form.salesManager} onChange={(event) => updateField("salesManager", event.target.value)} className={inputClass}>
                <option value="">Select Sales Manager</option>
                <option value="sales-manager-1">Sales Manager 1</option>
                <option value="sales-manager-2">Sales Manager 2</option>
              </select>
            </Field>

            <Field label="Currency" name="currency" required error={errors.currency}>
              <select id="currency" value={form.currency} onChange={(event) => updateField("currency", event.target.value)} className={inputClass}>
                <option value="">Select Currency</option>
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </Field>

            <Field label="Deal Amount" name="dealAmount" required error={errors.dealAmount}>
              <input
                id="dealAmount"
                type="number"
                min="0"
                value={form.dealAmount}
                onChange={(event) => updateField("dealAmount", event.target.value)}
                placeholder="Enter deal amount"
                className={inputClass}
              />
            </Field>

            <Field label="Type" name="type" required error={errors.type}>
              <select id="type" value={form.type} onChange={(event) => updateField("type", event.target.value)} className={inputClass}>
                <option value="">Select Type</option>
                <option value="Fixed Price">Fixed Price</option>
                <option value="Time and Material">Time & Material</option>
                <option value="Retainer">Retainer</option>
              </select>
            </Field>
          </div>

          {message && (
            <p role="status" className="mx-5 mb-5 rounded-xl border border-brand-teal-soft bg-brand-teal-soft px-4 py-3 text-sm text-brand-teal-dark sm:mx-7">
              {message}
            </p>
          )}

          <div className="flex justify-end border-t border-border-default px-5 py-4 sm:px-7">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-teal px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-teal-dark focus:outline-none focus:ring-4 focus:ring-brand-teal/20"
            >
              <Send size={17} />
              Add Project
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
