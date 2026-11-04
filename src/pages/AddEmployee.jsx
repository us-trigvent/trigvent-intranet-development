
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  UserRoundPlus,
  UserRound,
  KeyRound,
  Landmark,
  NotebookPen,
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Save,
  CalendarDays,
  ShieldCheck,
  CircleCheck,
  Info,
  X,
} from "lucide-react";

import FormField from "../components/employee-form/FormField";
import FormSection from "../components/employee-form/FormSection";

const steps = [
  { label: "Personal Details", icon: UserRound },
  { label: "Login Details", icon: KeyRound },
  { label: "Bank Details", icon: Landmark },
  { label: "Notes & Review", icon: NotebookPen },
];

const initialForm = {
  firstName: "",
  lastName: "",
  fatherName: "",
  dob: "",
  gender: "Male",
  profileImage: null,

  mobile: "",
  alternateNumber: "",
  officialEmail: "",
  personalEmail: "",
  teamsId: "",
  linkedIn: "",

  permanentAddress: "",
  temporaryAddress: "",
  state: "",
  city: "",

  department: "",
  designation: "",
  joiningDate: "",
  workType: "",
  branch: "Mohali",
  employeeCode: "",
  probationPeriod: "",
  attendanceCode: "",
  cardNumber: "",
  githubUsername: "",
  backgroundVerification: "",
  receivedRemarks: "",

  loginEmail: "",
  password: "",

  accountHolderName: "",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  aadhaarNumber: "",
  panNumber: "",

  notes: [""],
};

const requiredByStep = {
  0: [
    ["firstName", "First name"],
    ["dob", "Date of birth"],
    ["gender", "Gender"],
    ["mobile", "Mobile number"],
    ["alternateNumber", "Alternate number"],
    ["personalEmail", "Personal email"],
    ["department", "Department"],
    ["designation", "Designation"],
    ["joiningDate", "Joining date"],
    ["workType", "Work type"],
    ["branch", "Branch"],
    ["employeeCode", "Employee code"],
    ["cardNumber", "Card number"],
  ],
  1: [
    ["loginEmail", "Login email"],
    ["password", "Password"],
  ],
  2: [
    ["aadhaarNumber", "Aadhaar number"],
    ["panNumber", "PAN number"],
  ],
};

const departmentOptions = [
  "Engineering",
  "Design",
  "Human Resources",
  "Sales",
  "Marketing",
  "Finance",
  "QA",
  "Operations",
];

const designationOptions = [
  "Software Engineer",
  "Senior Software Engineer",
  "Engineering Manager",
  "Frontend Developer",
  "Backend Developer",
  "UI/UX Designer",
  "HR Executive",
  "HR Manager",
  "Sales Executive",
  "Marketing Executive",
  "Intern",
];

const stateOptions = [
  "Haryana",
  "Punjab",
  "Delhi",
  "Himachal Pradesh",
  "Uttar Pradesh",
  "Rajasthan",
  "Maharashtra",
  "Karnataka",
];

const workTypeOptions = [
  "Full Time",
  "Part Time",
  "Internship",
  "Contract",
  "Remote",
  "Hybrid",
];

const probationOptions = [
  "Not Applicable",
  "1 Month",
  "3 Months",
  "6 Months",
];

const verificationOptions = [
  "Pending",
  "In Progress",
  "Verified",
  "Rejected",
];

function validateStep(step, form) {
  const errors = {};

  for (const [field, label] of requiredByStep[step] || []) {
    if (!String(form[field] ?? "").trim()) {
      errors[field] = `${label} is required.`;
    }
  }

  if (
    step === 0 &&
    form.personalEmail &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.personalEmail)
  ) {
    errors.personalEmail = "Enter a valid personal email address.";
  }

  if (
    step === 1 &&
    form.loginEmail &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.loginEmail)
  ) {
    errors.loginEmail = "Enter a valid login email address.";
  }

  if (step === 1 && form.password && form.password.length < 8) {
    errors.password = "Password must contain at least 8 characters.";
  }

  if (step === 2 && form.aadhaarNumber &&
      !/^\d{12}$/.test(form.aadhaarNumber)) {
    errors.aadhaarNumber = "Enter a valid 12-digit Aadhaar number.";
  }

  if (step === 2 && form.panNumber &&
      !/^[A-Z]{5}\d{4}[A-Z]$/.test(form.panNumber.toUpperCase())) {
    errors.panNumber = "Enter a valid PAN format.";
  }

  return errors;
}

function StepNavigation({ activeStep, onStepClick }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const active = activeStep === index;
        const completed = activeStep > index;

        return (
          <button
            key={step.label}
            type="button"
            onClick={() => onStepClick(index)}
            aria-current={active ? "step" : undefined}
            className={`flex min-w-0 items-center gap-2.5 rounded-xl
              border px-3 py-3 text-left transition sm:px-4 ${
                active
                  ? "border-brand-teal bg-brand-teal-soft text-brand-teal-dark"
                  : completed
                    ? "border-brand-teal-light-soft bg-brand-teal-soft/50 text-brand-teal-dark"
                    : "border-border-default bg-white text-neutral-500 hover:border-border-strong"
              }`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center
                justify-center rounded-lg ${
                  active
                    ? "bg-brand-teal text-white"
                    : completed
                      ? "bg-brand-teal-light-soft text-brand-teal-dark"
                      : "bg-surface-muted text-neutral-500"
                }`}
            >
              {completed ? <Check size={18} /> : <Icon size={18} />}
            </span>

            <span className="min-w-0">
              <span className="block text-[10px] font-medium uppercase
                tracking-wider opacity-70"
              >
                Step {index + 1}
              </span>

              <span className="mt-0.5 block truncate text-xs
                font-semibold sm:text-sm"
              >
                {step.label}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function AddEmployee() {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const updateField = (event) => {
    const { name, value, files } = event.target;

    setForm((current) => ({
      ...current,
      [name]: files ? files[0] || null : value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setSuccessMessage("");
  };

  const goToStep = (nextStep) => {
    if (nextStep < 0 || nextStep >= steps.length) return;

    if (nextStep > activeStep) {
      const nextErrors = validateStep(activeStep, form);
      setErrors(nextErrors);

      if (Object.keys(nextErrors).length > 0) {
        return;
      }
    }

    setActiveStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addNote = () => {
    setForm((current) => ({
      ...current,
      notes: [...current.notes, ""],
    }));
  };

  const updateNote = (index, value) => {
    setForm((current) => ({
      ...current,
      notes: current.notes.map((note, i) =>
        i === index ? value : note
      ),
    }));
  };

  const removeNote = (index) => {
    setForm((current) => ({
      ...current,
      notes: current.notes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const allErrors = {
      ...validateStep(0, form),
      ...validateStep(1, form),
      ...validateStep(2, form),
    };

    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      const firstInvalidStep = [0, 1, 2].find(
        (step) => Object.keys(validateStep(step, form)).length > 0
      );

      setActiveStep(firstInvalidStep ?? 0);
      return;
    }

    // UI prototype only. Connect your create-employee API here.
    // Use FormData when sending a profile image.
    console.log("Employee form data:", form);

    setReviewOpen(false);
    setSuccessMessage(
      "Form validation successful. Connect the employee creation API to save this record."
    );
  };

  const field = (name) => ({
    name,
    value: form[name],
    onChange: updateField,
    error: errors[name],
  });

  return (
    <div className="min-h-screen bg-page px-4 pb-8
      pt-20 sm:px-6 sm:pt-20 lg:px-8 lg:pt-8"
    >
      {/* Page heading */}
      <header className="mb-6 flex flex-col justify-between
        gap-4 sm:flex-row sm:items-center"
      >
        <div>
          <div className="mb-2 flex items-center gap-2
            text-xs font-medium text-neutral-500"
          >
            <span>Trigvent</span>
            <span className="text-neutral-300">/</span>
            <span>Human Resources</span>
            <span className="text-neutral-300">/</span>
            <span className="text-brand-teal">Add Employee</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight
            text-brand-navy sm:text-3xl"
          >
            Employee Management
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Create a new employee record and manage their details.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl
          border border-border-default bg-white px-3.5 py-2.5
          text-xs font-medium text-neutral-600 shadow-sm sm:self-auto"
        >
          <ShieldCheck size={17} className="text-brand-teal" />
          Employee information
        </div>
      </header>

      {/* Form container */}
      <div className="overflow-hidden rounded-2xl border
        border-border-default/80 bg-white shadow-sm"
      >
        {/* Progress header */}
        <div className="border-b border-border-default bg-white p-4 sm:p-6">
          <StepNavigation
            activeStep={activeStep}
            onStepClick={goToStep}
          />

          <div className="mt-5 flex items-center justify-between">
            <p className="text-xs text-neutral-500">
              Step {activeStep + 1} of {steps.length}
            </p>

            <p className="text-xs font-medium text-brand-teal-dark">
              {Math.round(((activeStep + 1) / steps.length) * 100)}% complete
            </p>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-brand-teal transition-all duration-300"
              style={{
                width: `${((activeStep + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-5 p-4 sm:p-6 lg:p-7">
            {activeStep === 0 && (
              <>
                <FormSection
                  title="Basic Information"
                  description="Enter the employee's personal and identification details."
                  icon={UserRound}
                >
                  <FormField label="First Name" placeholder="Enter first name"
                    required {...field("firstName")} />

                  <FormField label="Last Name" placeholder="Enter last name"
                    {...field("lastName")} />

                  <FormField label="Father's Name" placeholder="Enter father's name"
                    {...field("fatherName")} />

                  <FormField label="Date of Birth" type="date"
                    max={new Date().toISOString().split("T")[0]}
                    required {...field("dob")} />

                  <FormField label="Gender" type="radio" required
                    options={["Male", "Female", "Other"]}
                    {...field("gender")} />

                  <FormField label="Profile Image" type="file"
                    accept="image/*" name="profileImage"
                    onChange={updateField}
                    hint="Optional. Choose an image file." />
                </FormSection>

                <FormSection
                  title="Contact Information"
                  description="Employee contact details and professional profiles."
                  icon={UserRound}
                >
                  <FormField label="Mobile Number" type="tel"
                    placeholder="Enter mobile number" required
                    {...field("mobile")} />

                  <FormField label="Alternate Number" type="tel"
                    placeholder="Enter alternate number" required
                    {...field("alternateNumber")} />

                  <FormField label="Official Email" type="email"
                    placeholder="name@trigvent.com"
                    {...field("officialEmail")} />

                  <FormField label="Personal Email" type="email"
                    placeholder="name@example.com" required
                    {...field("personalEmail")} />

                  <FormField label="Official MS Teams ID"
                    placeholder="Enter Teams ID"
                    {...field("teamsId")} />

                  <FormField label="LinkedIn Profile" type="url"
                    placeholder="https://linkedin.com/in/..."
                    {...field("linkedIn")} />
                </FormSection>

                <FormSection
                  title="Address Information"
                  description="Residential address and location."
                  icon={CalendarDays}
                >
                  <FormField label="Permanent Address"
                    placeholder="Enter permanent address"
                    {...field("permanentAddress")} />

                  <FormField label="Temporary Address"
                    placeholder="Enter temporary address"
                    {...field("temporaryAddress")} />

                  <FormField label="State" type="select"
                    options={stateOptions}
                    placeholder="Select state"
                    {...field("state")} />

                  <FormField label="City"
                    placeholder="Enter city"
                    {...field("city")} />
                </FormSection>

                <FormSection
                  title="Employment Details"
                  description="Assign the employee's role, department and work information."
                  icon={BriefcaseIcon}
                >
                  <FormField label="Department" type="select"
                    options={departmentOptions}
                    placeholder="Select department" required
                    {...field("department")} />

                  <FormField label="Designation" type="select"
                    options={designationOptions}
                    placeholder="Select designation" required
                    {...field("designation")} />

                  <FormField label="Joining Date" type="date"
                    required {...field("joiningDate")} />

                  <FormField label="Work Type" type="select"
                    options={workTypeOptions}
                    placeholder="Select work type" required
                    {...field("workType")} />

                  <FormField label="Branch" type="select"
                    options={["Mohali", "Yamuna Nagar", "Remote"]}
                    required {...field("branch")} />

                  <FormField label="Employee Code"
                    placeholder="e.g. TRG-1005" required
                    {...field("employeeCode")} />

                  <FormField label="Probation Period" type="select"
                    options={probationOptions}
                    placeholder="Select probation period"
                    {...field("probationPeriod")} />

                  <FormField label="Attendance Code"
                    placeholder="Enter attendance code"
                    {...field("attendanceCode")} />

                  <FormField label="Card Number"
                    placeholder="Enter card number" required
                    {...field("cardNumber")} />

                  <FormField label="Official GitHub Username"
                    placeholder="Enter GitHub username"
                    {...field("githubUsername")} />

                  <FormField label="Background Verification"
                    type="select" options={verificationOptions}
                    placeholder="Select verification status"
                    {...field("backgroundVerification")} />

                  <FormField label="Remarks" type="textarea"
                    placeholder="Add employment remarks"
                    rows={3} {...field("receivedRemarks")} />
                </FormSection>
              </>
            )}

            {activeStep === 1 && (
              <FormSection
                title="Login Credentials"
                description="Set up the employee's account credentials."
                icon={KeyRound}
                columns={2}
              >
                <FormField
                  label="Login Email Address"
                  type="email"
                  placeholder="employee@trigvent.com"
                  required
                  {...field("loginEmail")}
                />

                <div>
                  <label htmlFor="password"
                    className="mb-2 block text-sm font-medium text-text-secondary"
                  >
                    Password <span className="text-danger">*</span>
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={updateField}
                      placeholder="Minimum 8 characters"
                      autoComplete="new-password"
                      className={`w-full rounded-xl border bg-white
                        px-3.5 py-2.5 pr-11 text-sm text-text-secondary
                        outline-none transition placeholder:text-neutral-400
                        focus:border-brand-teal focus:ring-4
                        focus:ring-brand-teal/10 ${
                          errors.password ? "border-danger" : "border-border-default"
                        }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2
                        -translate-y-1/2 text-neutral-400
                        hover:text-text-secondary"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-1.5 text-xs text-danger">
                      {errors.password}
                    </p>
                  )}

                  <p className="mt-1.5 text-xs text-neutral-400">
                    Use at least 8 characters.
                  </p>
                </div>

                <div className="rounded-xl border border-brand-teal-light-soft
                  bg-brand-teal-soft/70 p-4 md:col-span-2"
                >
                  <div className="flex items-start gap-3">
                    <ShieldCheck size={20}
                      className="mt-0.5 shrink-0 text-brand-teal-dark" />
                    <div>
                      <p className="text-sm font-semibold text-brand-navy">
                        Account security
                      </p>
                      <p className="mt-1 text-sm leading-6 text-neutral-600">
                        In production, create accounts through your secure
                        backend. Never store plaintext passwords or expose
                        them in logs.
                      </p>
                    </div>
                  </div>
                </div>
              </FormSection>
            )}

            {activeStep === 2 && (
              <>
                <FormSection
                  title="Banking Information"
                  description="Add the employee's bank details for payroll processing."
                  icon={Landmark}
                  columns={2}
                >
                  <FormField label="Account Holder Name"
                    placeholder="Enter account holder name"
                    {...field("accountHolderName")} />

                  <FormField label="Bank Name"
                    placeholder="Enter bank name"
                    {...field("bankName")} />

                  <FormField label="Account Number"
                    placeholder="Enter account number"
                    {...field("accountNumber")} />

                  <FormField label="IFSC Code"
                    placeholder="e.g. HDFC0001234"
                    {...field("ifscCode")} />
                </FormSection>

                <FormSection
                  title="Identity Information"
                  description="Provide identity details required for employee records."
                  icon={ShieldCheck}
                  columns={2}
                >
                  <FormField label="Aadhaar Number"
                    placeholder="Enter 12-digit Aadhaar number"
                    required {...field("aadhaarNumber")} />

                  <FormField label="PAN Number"
                    placeholder="e.g. ABCDE1234F"
                    required
                    {...field("panNumber")}
                    onChange={(event) => {
                      updateField({
                        target: {
                          name: "panNumber",
                          value: event.target.value.toUpperCase(),
                        },
                      });
                    }}
                  />
                </FormSection>

                <div className="flex items-start gap-3 rounded-xl
                  border border-warning-soft bg-warning-soft p-4"
                >
                  <Info size={19} className="mt-0.5 shrink-0 text-warning-dark" />
                  <p className="text-sm leading-6 text-warning-dark">
                    Bank account and identity information is sensitive.
                    Restrict access and transmit it securely to your backend.
                    Avoid storing these values in browser logs or unsecured storage.
                  </p>
                </div>
              </>
            )}

            {activeStep === 3 && (
              <>
                <FormSection
                  title="Additional Notes"
                  description="Add internal notes relevant to this employee's record."
                  icon={NotebookPen}
                  columns={1}
                >
                  <div className="space-y-3">
                    {form.notes.map((note, index) => (
                      <div key={index}
                        className="flex items-start gap-3"
                      >
                        <textarea
                          value={note}
                          onChange={(event) =>
                            updateNote(index, event.target.value)
                          }
                          rows={3}
                          placeholder={`Enter note ${index + 1}...`}
                          aria-label={`Employee note ${index + 1}`}
                          className="min-w-0 flex-1 resize-y
                            rounded-xl border border-border-default
                            px-4 py-3 text-sm text-text-secondary
                            outline-none transition placeholder:text-neutral-400
                            focus:border-brand-teal focus:ring-4
                            focus:ring-brand-teal/10"
                        />

                        {form.notes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeNote(index)}
                            aria-label={`Remove note ${index + 1}`}
                            className="mt-2 rounded-lg p-2
                              text-neutral-400 transition
                              hover:bg-danger-soft hover:text-danger"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addNote}
                      className="inline-flex items-center gap-2
                        rounded-lg px-3 py-2 text-sm font-semibold
                        text-brand-teal-dark transition hover:bg-brand-teal-soft"
                    >
                      <span className="text-lg leading-none">+</span>
                      Add another note
                    </button>
                  </div>
                </FormSection>

                <FormSection
                  title="Review Employee Details"
                  description="Check the information before submitting the employee record."
                  icon={CircleCheck}
                  columns={2}
                >
                  {[
                    ["Employee name", `${form.firstName} ${form.lastName}`.trim()],
                    ["Employee code", form.employeeCode],
                    ["Department", form.department],
                    ["Designation", form.designation],
                    ["Official email", form.officialEmail],
                    ["Login email", form.loginEmail],
                    ["Joining date", form.joiningDate],
                    ["Branch", form.branch],
                  ].map(([label, value]) => (
                    <div key={label}
                      className="rounded-xl border border-border-light
                        bg-surface-subtle/80 p-4"
                    >
                      <p className="text-xs font-medium text-neutral-500">
                        {label}
                      </p>
                      <p className="mt-1.5 break-words text-sm
                        font-semibold text-brand-navy"
                      >
                        {value || "Not provided"}
                      </p>
                    </div>
                  ))}

                  <div className="rounded-xl bg-warning-soft p-4 md:col-span-2">
                    <p className="text-sm font-semibold text-warning-dark">
                      Before submitting
                    </p>
                    <p className="mt-1 text-sm leading-6 text-warning-dark">
                      Confirm that the information is accurate and that
                      sensitive employee details will be handled securely.
                    </p>
                  </div>
                </FormSection>
              </>
            )}

            {/* Submission feedback */}
            {successMessage && (
              <div role="status"
                className="rounded-xl border border-brand-teal-soft
                  bg-brand-teal-soft p-4 text-sm leading-6 text-brand-teal-dark"
              >
                {successMessage}
              </div>
            )}

            {/* Footer actions */}
            <div className="flex flex-col-reverse justify-between
              gap-3 border-t border-border-light pt-5 sm:flex-row
              sm:items-center"
            >
              <button
                type="button"
                onClick={() => {
                  if (activeStep === 0) {
                    navigate("/employees");
                  } else {
                    setActiveStep((step) => step - 1);
                    setSuccessMessage("");
                  }
                }}
                className="inline-flex items-center justify-center
                  gap-2 rounded-xl border border-border-default
                  bg-white px-5 py-3 text-sm font-semibold
                  text-neutral-600 transition hover:bg-surface-subtle"
              >
                <ArrowLeft size={17} />
                {activeStep === 0 ? "Cancel" : "Previous"}
              </button>

              {activeStep < 3 ? (
                <button
                  type="button"
                  onClick={() => goToStep(activeStep + 1)}
                  className="inline-flex items-center justify-center
                    gap-2 rounded-xl bg-brand-teal px-5 py-3
                    text-sm font-semibold text-white shadow-sm
                    transition hover:bg-brand-teal-dark
                    focus:outline-none focus:ring-4
                    focus:ring-brand-teal/20"
                >
                  Continue to {steps[activeStep + 1].label}
                  <ArrowRight size={17} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setReviewOpen(true)}
                  className="inline-flex items-center justify-center
                    gap-2 rounded-xl bg-brand-teal px-5 py-3
                    text-sm font-semibold text-white shadow-sm
                    transition hover:bg-brand-teal-dark"
                >
                  <Save size={17} />
                  Save Employee
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation dialog */}
      {reviewOpen && (
        <div className="fixed inset-0 z-[70] flex items-center
          justify-center bg-navy-dark/40 p-4 backdrop-blur-sm"
        >
          <div role="dialog" aria-modal="true"
            aria-labelledby="confirm-title"
            className="w-full max-w-md rounded-2xl border
              border-border-default bg-white p-6 shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center
              justify-center rounded-xl bg-brand-teal-soft text-brand-teal"
            >
              <Save size={22} />
            </div>

            <h2 id="confirm-title"
              className="mt-4 text-lg font-semibold text-brand-navy"
            >
              Save employee details?
            </h2>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              You are about to submit the employee record for{" "}
              <span className="font-semibold text-text-secondary">
                {`${form.firstName} ${form.lastName}`.trim()}
              </span>
              . Please ensure the information is correct.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button"
                onClick={() => setReviewOpen(false)}
                className="rounded-xl border border-border-default
                  px-4 py-2.5 text-sm font-semibold
                  text-neutral-600 hover:bg-surface-subtle"
              >
                Go back
              </button>

              <button type="button"
                onClick={(event) => {
                  setReviewOpen(false);
                  handleSubmit(event);
                }}
                className="inline-flex items-center
                  justify-center gap-2 rounded-xl
                  bg-brand-teal px-4 py-2.5 text-sm
                  font-semibold text-white hover:bg-brand-teal-dark"
              >
                <Check size={17} />
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BriefcaseIcon(props) {
  return <UserRoundPlus {...props} />;
}
