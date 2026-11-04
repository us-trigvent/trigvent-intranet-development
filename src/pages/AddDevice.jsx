import { useState } from "react";
import {
  CheckCircle2,
  Monitor,
  Plus,
} from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-border-default bg-white px-3.5 py-2.5 text-sm text-brand-navy outline-none transition placeholder:text-neutral-400 focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10";

const initialForm = {
  category: "Desktop",
  serialNumber: "",
  deviceCode: "",
  brand: "",
  condition: "Faulted",
  issued: "No",
};

export default function AddDevice() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setMessage("");
  };

  const field = (name) => ({
    name,
    value: form[name],
    onChange: updateField,
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!form.category) nextErrors.category = "Please select a category.";
    if (!form.serialNumber.trim()) nextErrors.serialNumber = "Serial number is required.";
    if (!form.brand.trim()) nextErrors.brand = "Brand is required.";
    if (!form.condition) nextErrors.condition = "Please select a condition.";
    if (!form.issued) nextErrors.issued = "Please select issue status.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setMessage("Device added successfully.");
    } else {
      setMessage("");
    }
  };

  const Field = ({ label, name, required = false, error, children }) => (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-text-secondary">
        {label}
        {required && <span className="ml-1 text-danger">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );

  const RadioGroup = ({ label, name, options }) => (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-text-secondary">
        {label} <span className="text-danger">*</span>
      </legend>
      <div className="flex min-h-10.5 flex-wrap items-center gap-5">
        {options.map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
            <input
              type="radio"
              name={name}
              value={option}
              checked={form[name] === option}
              onChange={updateField}
              className="h-4 w-4 accent-brand-teal"
            />
            {option}
          </label>
        ))}
      </div>
      {errors[name] && <p className="mt-1.5 text-xs text-danger">{errors[name]}</p>}
    </fieldset>
  );

  return (
    <div className="min-h-screen bg-page px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <header className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-neutral-500">
          <span>Trigvent</span>
          <span className="text-neutral-300">/</span>
          <span>IT Management</span>
          <span className="text-neutral-300">/</span>
          <span className="text-brand-teal">Add Device</span>
        </div>

        <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-teal-soft text-brand-teal">
            <Monitor size={23} />
          </span>
          Add Device
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Enter device details for the IT inventory.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-border-default/80 bg-white shadow-sm">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:p-6 lg:grid-cols-2 lg:p-7">
            <Field label="Category" name="category" required error={errors.category}>
              <select {...field("category")} id="category" className={inputClass}>
                <option value="Desktop">Desktop</option>
                <option value="Laptop">Laptop</option>
                <option value="Monitor">Monitor</option>
                <option value="Mobile">Mobile</option>
                <option value="Tablet">Tablet</option>
                <option value="Printer">Printer</option>
                <option value="Accessory">Accessory</option>
              </select>
            </Field>

            <Field label="Serial Number" name="serialNumber" required error={errors.serialNumber}>
              <input {...field("serialNumber")} id="serialNumber" placeholder="Enter serial number" className={inputClass} />
            </Field>

            <Field label="Device Code" name="deviceCode">
              <input {...field("deviceCode")} id="deviceCode" placeholder="Enter device code" className={inputClass} />
            </Field>

            <Field label="Brand" name="brand" required error={errors.brand}>
              <input {...field("brand")} id="brand" placeholder="Enter brand" className={inputClass} />
            </Field>

            <RadioGroup label="Condition" name="condition" options={["Working", "Faulted"]} />
            <RadioGroup label="Is Issued?" name="issued" options={["No", "Yes"]} />
          </div>

          {message && (
            <p role="status" className="mx-5 mb-5 flex items-center gap-2 rounded-xl border border-brand-teal-soft bg-brand-teal-soft px-4 py-3 text-sm font-medium text-brand-teal-dark sm:mx-7">
              <CheckCircle2 size={17} />
              {message}
            </p>
          )}

          <div className="flex justify-center border-t border-border-default px-5 py-4 sm:px-7">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-teal px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-teal-dark focus:outline-none focus:ring-4 focus:ring-brand-teal/20"
            >
              <Plus size={17} />
              Add Device
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
