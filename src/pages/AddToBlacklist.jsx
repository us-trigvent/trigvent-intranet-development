import { useState } from "react";
import { ShieldCheck } from "lucide-react";

const initialForm = {
  entryType: "Employee",
  employee: "",
  email: "",
  department: "",
  designation: "",
  date: new Date().toISOString().slice(0, 10),
  mobileNumber: "",
  referenceId: "",
  aadhar: "",
  pan: "",
  linkedin: "",
  reason: "",
};

const employees = [
  {
    id: "EMP001",
    name: "Rahul Gupta",
    email: "rahul@trigvent.com",
    department: "Engineering",
    designation: "Software Engineer",
    mobileNumber: "9876543210",
  },
  {
    id: "EMP002",
    name: "Priya Sharma",
    email: "priya@trigvent.com",
    department: "Human Resources",
    designation: "HR Executive",
    mobileNumber: "9876543211",
  },
];

const departments = [
  "Engineering",
  "Design",
  "Human Resources",
  "Sales",
  "Marketing",
  "Finance",
  "QA",
  "Operations",
];

const designations = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Software Engineer",
  "HR Executive",
  "Intern",
];

const fields = [
  {
    name: "entryType",
    label: "Entry Type",
    type: "select",
    required: true,
    placeholder: "Select from Employee",
    options: ["Employee", "Intern"],
  },
  {
    name: "employee",
    label: "Select Employee",
    type: "employee",
    required: true,
    placeholder: "Select Employee",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    placeholder: "Enter email address",
  },
  {
    name: "department",
    label: "Department",
    type: "select",
    required: true,
    placeholder: "Select department",
    options: departments,
  },
  {
    name: "designation",
    label: "Designation",
    type: "select",
    required: true,
    placeholder: "Select designation",
    options: designations,
  },
  {
    name: "date",
    label: "Date",
    type: "date",
    required: true,
    disabled: true,
  },
  {
    name: "mobileNumber",
    label: "Mobile Number",
    type: "tel",
    required: true,
    placeholder: "Enter mobile number",
  },
  {
    name: "referenceId",
    label: "Reference ID",
    type: "text",
    required: true,
    placeholder: "Enter reference ID",
  },
  {
    name: "aadhar",
    label: "Aadhaar Number",
    type: "password",
    required: true,
    placeholder: "Enter 12-digit Aadhaar number",
  },
  {
    name: "pan",
    label: "PAN Number",
    type: "text",
    required: true,
    placeholder: "Enter PAN number (e.g., ABCDE1234F)",
  },
  {
    name: "linkedin",
    label: "LinkedIn",
    type: "url",
    placeholder: "Enter LinkedIn profile URL",
  },
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#203D61] outline-none transition placeholder:text-slate-400 focus:border-[#0D9999] focus:ring-4 focus:ring-[#0D9999]/10 disabled:cursor-not-allowed disabled:bg-slate-100";

function FormField({ label, required, error, children }) {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-xs text-rose-600">{error}</p>
      )}
    </div>
  );
}

function SelectField({ value, onChange, placeholder, options }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={inputClass}
    >
      <option value="">{placeholder}</option>

      {options.map((option) => (
        <option
          key={typeof option === "string" ? option : option.id}
          value={typeof option === "string" ? option : option.id}
        >
          {typeof option === "string" ? option : option.name}
        </option>
      ))}
    </select>
  );
}

export default function AddToBlacklist() {
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
    }));

    setFeedback("");
  };

  const handleEmployeeChange = (employeeId) => {
    const employee = employees.find(
      (item) => item.id === employeeId
    );

    setForm((current) => ({
      ...current,
      employee: employeeId,
      email: employee?.email || "",
      department: employee?.department || "",
      designation: employee?.designation || "",
      mobileNumber: employee?.mobileNumber || "",
    }));

    setErrors({});
    setFeedback("");
  };

  const validate = () => {
    const nextErrors = {};

    fields.forEach((field) => {
      if (
        field.required &&
        !String(form[field.name] || "").trim()
      ) {
        nextErrors[field.name] = `${field.label} is required.`;
      }
    });

    if (
      form.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (
      form.mobileNumber &&
      !/^[6-9]\d{9}$/.test(form.mobileNumber)
    ) {
      nextErrors.mobileNumber =
        "Enter a valid 10-digit mobile number.";
    }

    if (form.aadhar && !/^\d{12}$/.test(form.aadhar)) {
      nextErrors.aadhar =
        "Enter a valid 12-digit Aadhaar number.";
    }

    if (
      form.pan &&
      !/^[A-Z]{5}\d{4}[A-Z]$/.test(form.pan)
    ) {
      nextErrors.pan = "Enter a valid PAN number.";
    }

    if (!form.reason.trim()) {
      nextErrors.reason = "Reason is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      setFeedback("");
      return;
    }

    // Connect the blacklist creation API here.
    // Do not log Aadhaar or other sensitive personal data.
    setFeedback(
      "Validation successful. Connect the backend API to save this record."
    );
  };

  const renderField = (field) => {
    const value = form[field.name] ?? "";

    if (field.type === "select") {
      return (
        <SelectField
          value={value}
          placeholder={field.placeholder}
          options={field.options}
          onChange={(event) =>
            updateField(field.name, event.target.value)
          }
        />
      );
    }

    if (field.type === "employee") {
      return (
        <SelectField
          value={value}
          placeholder={field.placeholder}
          options={employees.map((employee) => ({
            id: employee.id,
            name: employee.name,
          }))}
          onChange={(event) =>
            handleEmployeeChange(event.target.value)
          }
        />
      );
    }

    return (
      <input
        type={field.type}
        value={value}
        disabled={field.disabled}
        placeholder={field.placeholder || ""}
        maxLength={
          field.name === "aadhar"
            ? 12
            : field.name === "pan"
              ? 10
              : undefined
        }
        onChange={(event) => {
          let nextValue = event.target.value;

          if (field.name === "mobileNumber") {
            nextValue = nextValue.replace(/\D/g, "").slice(0, 10);
          }

          if (field.name === "aadhar") {
            nextValue = nextValue.replace(/\D/g, "").slice(0, 12);
          }

          if (field.name === "pan") {
            nextValue = nextValue.toUpperCase();
          }

          updateField(field.name, nextValue);
        }}
        className={inputClass}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] px-4 pb-8 pt-20 sm:px-6 sm:pt-20 lg:px-8 lg:pt-8">
      {/* Page heading */}
      <header className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
          <span>Trigvent</span>
          <span className="text-slate-300">/</span>
          <span>Human Resources</span>
          <span className="text-slate-300">/</span>
          <span className="text-[#0D9999]">Add to Blacklist</span>
        </div>

        <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-[#203D61] sm:text-3xl">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F7F6] text-[#0D9999]">
            <ShieldCheck size={23} />
          </span>
          Add to Blacklist
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Record employee or intern blacklist details for HR review.
        </p>
      </header>

      {/* Main form card */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-4 sm:px-7">
          <h2 className="text-base font-semibold text-[#203D61]">
            Blacklist Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Enter the relevant identification and reference details.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:p-6 lg:grid-cols-2 lg:p-7">
            {fields.map((field) => (
              <FormField
                key={field.name}
                label={field.label}
                required={field.required}
                error={errors[field.name]}
              >
                {renderField(field)}
              </FormField>
            ))}

            <div className="lg:col-span-2">
              <FormField
                label="Reason"
                required
                error={errors.reason}
              >
                <textarea
                  value={form.reason}
                  onChange={(event) =>
                    updateField("reason", event.target.value)
                  }
                  placeholder="Enter the reason for blacklisting..."
                  rows={4}
                  className={`${inputClass} min-h-28 resize-y`}
                />
              </FormField>
            </div>
          </div>

          {feedback && (
            <div
              role="status"
              className="mx-5 mb-5 rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-teal-800 sm:mx-7"
            >
              {feedback}
            </div>
          )}

          <div className="flex justify-end border-t border-slate-100 px-5 py-4 sm:px-7">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D9999] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#087F80] focus:outline-none focus:ring-4 focus:ring-[#0D9999]/20"
            >
              <ShieldCheck size={17} />
              Add to Blacklist
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
