import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

import { useToast } from "../components/ToastProvider";
import { fetchDepartments, fetchDesignations } from "../redux/actions/lookupActions";
import {
  createBlacklistEntry,
  fetchBlacklistEmployees,
} from "../redux/actions/blacklistActions";
import { clearDesignations } from "../redux/slices/lookupSlice";

const initialForm = {
  entryMode: "new",
  entryType: "employee",
  employeeId: "",
  name: "",
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
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}

function SelectField({
  value,
  onChange,
  placeholder,
  options,
  disabled = false,
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
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

const readEmployeeValue = (employee, keys) => {
  for (const key of keys) {
    const value = employee?.[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return "";
};

const lookupId = (value, options) => {
  if (value && typeof value === "object") {
    value = value.id ?? value.value ?? value.name;
  }
  if (value === undefined || value === null || value === "") return "";

  const stringValue = String(value);
  if (/^\d+$/.test(stringValue)) return stringValue;

  return (
    options.find(
      (option) => option.name.toLowerCase() === stringValue.toLowerCase()
    )?.id || ""
  );
};

const isInternEmployee = (employee) =>
  ["1", "true", "intern"].includes(
    String(
      employee?.is_intern ??
        employee?.isIntern ??
        employee?.entry_type ??
        ""
    ).toLowerCase()
  );

export default function AddToBlacklist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    employees,
    employeesLoading,
    employeesError,
    creating,
  } = useSelector((state) => state.blacklist);
  const { departments, designations } = useSelector(
    (state) => state.lookups
  );

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showAadhar, setShowAadhar] = useState(false);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (!form.department) return undefined;

    dispatch(fetchDesignations({ departmentId: form.department }));
    return undefined;
  }, [dispatch, form.department]);

  useEffect(() => {
    if (form.entryMode !== "employee") return undefined;

    dispatch(fetchBlacklistEmployees({ page: 1, perPage: 100 }));
    return undefined;
  }, [dispatch, form.entryMode]);

  const updateField = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "department" && value !== current.department
        ? { designation: "" }
        : {}),
    }));

    if (name === "department" && value !== form.department) {
      dispatch(clearDesignations());
    }

    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleEntryModeChange = (entryMode) => {
    setForm((current) => ({
      ...current,
      entryMode,
      entryType: "employee",
      employeeId: "",
      name: "",
      email: "",
      department: "",
      designation: "",
      mobileNumber: "",
      referenceId: "",
      aadhar: "",
      pan: "",
      linkedin: "",
    }));
    dispatch(clearDesignations());
    setErrors({});
  };

  const handleEmployeeChange = (employeeId) => {
    const employee = employees.find((item) => item.id === employeeId);
    if (!employee) {
      updateField("employeeId", "");
      return;
    }

    const departmentId = lookupId(
      readEmployeeValue(employee, ["department_id", "department"]),
      departments.records
    );
    const designationId = lookupId(
      readEmployeeValue(employee, ["designation_id", "designation"]),
      designations.records
    );
    const employeeType = isInternEmployee(employee) ? "intern" : "employee";

    setForm((current) => ({
      ...current,
      employeeId,
      entryType: employeeType,
      name: String(employee.name || ""),
      email: String(readEmployeeValue(employee, ["email", "official_email_address"])),
      department: departmentId,
      designation: designationId,
      mobileNumber: String(
        readEmployeeValue(employee, ["mobile_no", "mobile_number", "mobile", "phone"])
      ),
      aadhar: String(readEmployeeValue(employee, ["aadhar", "aadhar_number", "aadhaar_number"])),
      pan: String(readEmployeeValue(employee, ["pan", "pan_number"])).toUpperCase(),
      linkedin: String(readEmployeeValue(employee, ["linkedin", "linkedin_url"])),
    }));

    if (departmentId !== form.department) {
      dispatch(clearDesignations());
    } else if (departmentId) {
      dispatch(fetchDesignations({ departmentId }));
    }
    setErrors({});
  };

  const validate = () => {
    const nextErrors = {};
    const requiredFields = [
      ["entryType", "Record type"],
      ["email", "Email"],
      ["department", "Department"],
      ["designation", "Designation"],
      ["date", "Date"],
      ["mobileNumber", "Mobile number"],
      ["referenceId", "Reference ID"],
      ["aadhar", "Aadhaar number"],
      ["pan", "PAN number"],
      ["reason", "Reason"],
    ];

    for (const [name, label] of requiredFields) {
      if (!String(form[name] || "").trim()) {
        nextErrors[name] = `${label} is required.`;
      }
    }

    if (form.entryMode === "new" && !form.name.trim()) {
      nextErrors.name = "Employee name is required.";
    }
    if (form.entryMode === "employee" && !form.employeeId) {
      nextErrors.employeeId = "Select an employee.";
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (form.mobileNumber && !/^[6-9]\d{9}$/.test(form.mobileNumber)) {
      nextErrors.mobileNumber = "Enter a valid 10-digit mobile number.";
    }
    if (form.aadhar && !/^\d{12}$/.test(form.aadhar)) {
      nextErrors.aadhar = "Enter a valid 12-digit Aadhaar number.";
    }
    if (form.pan && !/^[A-Z]{5}\d{4}[A-Z]$/.test(form.pan)) {
      nextErrors.pan = "Enter a valid PAN number.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      entry_type: form.entryType,
      ...(form.entryMode === "employee"
        ? {
            employee_id: /^\d+$/.test(form.employeeId)
              ? Number(form.employeeId)
              : form.employeeId,
          }
        : {}),
      name: form.name.trim(),
      email: form.email.trim(),
      department: Number(form.department),
      designation: Number(form.designation),
      date: form.date,
      mobile_no: form.mobileNumber,
      reference_id: form.referenceId.trim(),
      aadhar: form.aadhar,
      pan: form.pan.toUpperCase(),
      linkedin: form.linkedin.trim(),
      reason: form.reason.trim(),
    };

    try {
      const response = await dispatch(createBlacklistEntry(payload)).unwrap();
      showToast({
        type: "success",
        title: "Blacklist entry created",
        message: response?.message || "The blacklist entry was created.",
      });
      navigate("/hr/blacklist-listing");
    } catch (error) {
      showToast({
        type: "error",
        title: "Unable to create blacklist entry",
        message:
          typeof error === "string"
            ? error
            : "Please check the blacklist details and try again.",
      });
    }
  };

  const renderField = (field) => {
    const value = form[field.name] ?? "";

    if (field.name === "department") {
      return (
        <SelectField
          value={value}
          placeholder={
            departments.loading ? "Loading departments..." : "Select department"
          }
          options={departments.records}
          disabled={departments.loading || Boolean(departments.error)}
          onChange={(event) => updateField(field.name, event.target.value)}
        />
      );
    }

    if (field.name === "designation") {
      return (
        <SelectField
          value={value}
          placeholder={
            !form.department
              ? "Select a department first"
              : designations.loading
                ? "Loading designations..."
                : "Select designation"
          }
          options={designations.records}
          disabled={
            !form.department ||
            designations.loading ||
            Boolean(designations.error)
          }
          onChange={(event) => updateField(field.name, event.target.value)}
        />
      );
    }

    if (field.name === "aadhar") {
      return (
        <div className="relative">
          <input
            type={showAadhar ? "text" : "password"}
            value={value}
            maxLength={12}
            onChange={(event) =>
              updateField(
                field.name,
                event.target.value.replace(/\D/g, "").slice(0, 12)
              )
            }
            placeholder={field.placeholder}
            className={`${inputClass} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowAadhar((current) => !current)}
            aria-label={showAadhar ? "Hide Aadhaar number" : "Show Aadhaar number"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-brand-navy"
          >
            {showAadhar ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      );
    }

    return (
      <input
        type={field.type}
        value={value}
        disabled={field.disabled}
        placeholder={field.placeholder || ""}
        maxLength={field.name === "pan" ? 10 : undefined}
        onChange={(event) => {
          let nextValue = event.target.value;
          if (field.name === "mobileNumber") {
            nextValue = nextValue.replace(/\D/g, "").slice(0, 10);
          }
          if (field.name === "pan") nextValue = nextValue.toUpperCase();
          updateField(field.name, nextValue);
        }}
        className={inputClass}
      />
    );
  };

  const fields = [
    { name: "email", label: "Email", type: "email", required: true, placeholder: "Enter email address" },
    { name: "department", label: "Department", type: "select", required: true },
    { name: "designation", label: "Designation", type: "select", required: true },
    { name: "date", label: "Date", type: "date", required: true, disabled: true },
    { name: "mobileNumber", label: "Mobile Number", type: "tel", required: true, placeholder: "Enter mobile number" },
    { name: "referenceId", label: "Reference ID", type: "text", required: true, placeholder: "Enter reference ID" },
    { name: "aadhar", label: "Aadhaar Number", type: "password", required: true, placeholder: "Enter 12-digit Aadhaar number" },
    { name: "pan", label: "PAN Number", type: "text", required: true, placeholder: "Enter PAN number (e.g., ABCDE1234F)" },
    { name: "linkedin", label: "LinkedIn", type: "url", placeholder: "Enter LinkedIn profile URL" },
  ];

  return (
    <div className="min-h-screen bg-page px-4 pb-8 pt-20 sm:px-6 sm:pt-20 lg:px-8 lg:pt-8">
      <header className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-neutral-500">
          <span>Trigvent</span>
          <span className="text-neutral-300">/</span>
          <span>Human Resources</span>
          <span className="text-neutral-300">/</span>
          <span className="text-brand-teal">Add to Blacklist</span>
        </div>
        <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-teal-soft text-brand-teal">
            <ShieldCheck size={23} />
          </span>
          Add to Blacklist
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Record employee or intern blacklist details for HR review.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-border-default/80 bg-white shadow-sm">
        <div className="border-b border-border-default bg-surface-subtle/70 px-5 py-4 sm:px-7">
          <h2 className="text-base font-semibold text-brand-navy">
            Blacklist Information
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Enter the relevant identification and reference details.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:p-6 lg:grid-cols-2 lg:p-7">
            <FormField label="Entry Type" required error={errors.entryMode}>
              <SelectField
                value={form.entryMode}
                placeholder="Select entry type"
                options={[
                  { id: "new", name: "New Entry" },
                  { id: "employee", name: "Select from Employee" },
                ]}
                onChange={(event) => handleEntryModeChange(event.target.value)}
              />
            </FormField>

            {form.entryMode === "new" ? (
              <FormField
                label="Employee Name"
                required
                error={errors.name}
              >
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Enter employee name"
                  className={inputClass}
                />
              </FormField>
            ) : (
              <FormField
                label="Employee Name"
                required
                error={errors.employeeId || employeesError}
              >
                <SelectField
                  value={form.employeeId}
                  placeholder={
                    employeesLoading ? "Loading employees..." : "Select employee"
                  }
                  options={employees.map((employee) => ({
                    id: employee.id,
                    name: employee.email
                      ? `${employee.name} — ${employee.email}`
                      : employee.name,
                  }))}
                  disabled={employeesLoading || Boolean(employeesError)}
                  onChange={(event) => handleEmployeeChange(event.target.value)}
                />
              </FormField>
            )}

            {fields.map((field) => (
              <FormField
                key={field.name}
                label={field.label}
                required={field.required}
                error={
                  errors[field.name] ||
                  (field.name === "department" ? departments.error : "") ||
                  (field.name === "designation" ? designations.error : "")
                }
              >
                {renderField(field)}
              </FormField>
            ))}

            <div className="lg:col-span-2">
              <FormField label="Reason" required error={errors.reason}>
                <textarea
                  value={form.reason}
                  onChange={(event) => updateField("reason", event.target.value)}
                  placeholder="Enter the reason for blacklisting..."
                  rows={4}
                  className={`${inputClass} min-h-28 resize-y`}
                />
              </FormField>
            </div>
          </div>

          <div className="flex justify-end border-t border-border-light px-5 py-4 sm:px-7">
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-teal px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-teal-dark focus:outline-none focus:ring-4 focus:ring-brand-teal/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ShieldCheck size={17} />
              {creating ? "Adding..." : "Add to Blacklist"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
