import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  CircleMinus,
  CirclePlus,
  Save,
  SlidersHorizontal,
  X,
} from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#203D61] outline-none transition placeholder:text-slate-400 focus:border-[#0D9999] focus:ring-4 focus:ring-[#0D9999]/10";

const initialSettings = {
  companyName: "Trigvent Solutions",
  companyAddress:
    "First Floor, 41, Shastri Colony, Yamunanagar, Haryana (135001)",
  basicSalary: "40.00",
  hra: "20.00",
  specialAllowance: "30.00",
  conveyanceAllowance: "10.00",
  pf: "0.00",
};

export default function PaySlipsSetting() {
  const [form, setForm] = useState(initialSettings);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setMessage("");
  };

  const handleCancel = () => {
    setForm(initialSettings);
    setErrors({});
    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const requiredFields = [
      "companyName",
      "companyAddress",
      "basicSalary",
      "hra",
      "specialAllowance",
      "conveyanceAllowance",
      "pf",
    ];

    const nextErrors = {};
    requiredFields.forEach((field) => {
      if (String(form[field]).trim() === "") {
        nextErrors[field] = "This field is required.";
      } else if (Number(form[field]) < 0) {
        nextErrors[field] = "Value cannot be negative.";
      }
    });

    setErrors(nextErrors);
    setMessage(
      Object.keys(nextErrors).length === 0
        ? "Pay slip settings saved successfully."
        : ""
    );
  };

  const PercentageField = ({ label, name, required = true, error }) => (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          id={name}
          type="number"
          min="0"
          step="0.01"
          value={form[name]}
          onChange={(event) => updateField(name, event.target.value)}
          className={`${inputClass} pr-12`}
        />
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
          %
        </span>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );

  const SectionTitle = ({ icon: Icon, title, tone = "teal" }) => (
    <div className="mb-5 flex items-center gap-2 border-b border-slate-200 pb-3">
      <Icon
        size={18}
        className={tone === "rose" ? "text-rose-500" : "text-[#0D9999]"}
      />
      <h3 className={`text-base font-semibold ${tone === "rose" ? "text-rose-600" : "text-[#203D61]"}`}>
        {title}
      </h3>
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
          <span className="text-[#0D9999]">PaySlips Setting</span>
        </div>

        <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-[#203D61] sm:text-3xl">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F7F6] text-[#0D9999]">
            <SlidersHorizontal size={23} />
          </span>
          PaySlips Setting
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Configure company details and pay slip calculation values.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-5 sm:p-6 lg:p-7">
            <SectionTitle icon={Building2} title="Company Details" />
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <label htmlFor="companyName" className="mb-2 block text-sm font-medium text-slate-700">
                  Company Name <span className="ml-1 text-red-500">*</span>
                </label>
                <input
                  id="companyName"
                  value={form.companyName}
                  onChange={(event) => updateField("companyName", event.target.value)}
                  className={inputClass}
                />
                {errors.companyName && <p className="mt-1.5 text-xs text-red-500">{errors.companyName}</p>}
              </div>

              <div>
                <label htmlFor="companyAddress" className="mb-2 block text-sm font-medium text-slate-700">
                  Company Address <span className="ml-1 text-red-500">*</span>
                </label>
                <input
                  id="companyAddress"
                  value={form.companyAddress}
                  onChange={(event) => updateField("companyAddress", event.target.value)}
                  className={inputClass}
                />
                {errors.companyAddress && <p className="mt-1.5 text-xs text-red-500">{errors.companyAddress}</p>}
              </div>
            </div>

            <div className="mt-7">
              <SectionTitle icon={CirclePlus} title="Earnings Calculations" />
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <PercentageField label="Basic Salary (Basic Salary %)" name="basicSalary" error={errors.basicSalary} />
                <PercentageField label="House Rent Allowance (HRA %)" name="hra" error={errors.hra} />
                <PercentageField label="Special Allowance (DA %) " name="specialAllowance" error={errors.specialAllowance} />
                <PercentageField label="Conveyance Allowance (%)" name="conveyanceAllowance" error={errors.conveyanceAllowance} />
              </div>
            </div>

            <div className="mt-7">
              <SectionTitle icon={CircleMinus} title="Deductions Calculations" tone="rose" />
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <PercentageField label="Provident Fund (PF %) " name="pf" error={errors.pf} />
              </div>
            </div>
          </div>

          {message && (
            <p role="status" className="mx-5 mb-5 flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800 sm:mx-7">
              <CheckCircle2 size={17} />
              {message}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <X size={17} />
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D9999] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#087F80] focus:outline-none focus:ring-4 focus:ring-[#0D9999]/20"
            >
              <Save size={17} />
              Save Settings
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
