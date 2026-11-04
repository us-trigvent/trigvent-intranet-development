
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ContactRound,
  KeyRound,
  GraduationCap,
  Landmark,
  NotebookPen,
  UserRoundPlus,
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Save,
  ShieldCheck,
  CircleCheck,
  Info,
  X,
} from "lucide-react";

import FormField from "../components/employee-form/FormField";
import FormSection from "../components/employee-form/FormSection";

const steps = [
  { label: "Contact Details", icon: ContactRound },
  { label: "Login Details", icon: KeyRound },
  { label: "Intern Details", icon: GraduationCap },
  { label: "Bank Details", icon: Landmark },
  { label: "Notes", icon: NotebookPen },
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
  permanentAddress: "",
  temporaryAddress: "",
  state: "",
  city: "",

  department: "",
  designation: "",
  joiningDate: "",
  teamsId: "",
  workType: "Internship",
  branch: "Mohali",
  employeeCode: "",

  loginEmail: "",
  password: "",

  college: "",
  qualification: "",
  pursuingYear: "",
  passoutYear: "",
  interviewDate: "",
  previousExperience: "No",

  accountHolderName: "",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  aadhaarNumber: "",
  panNumber: "",

  notes: [""],
};

const requiredFields = {
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
    ["employeeCode", "Intern code"],
  ],
  1: [
    ["loginEmail", "Login email"],
    ["password", "Password"],
  ],
  2: [
    ["college", "College"],
    ["qualification", "Qualification"],
  ],
  3: [
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
  "Frontend Developer Intern",
  "Backend Developer Intern",
  "Full Stack Developer Intern",
  "Python Developer Intern",
  "UI/UX Design Intern",
  "Software Development Intern",
  "Marketing Intern",
  "HR Intern",
  "Data Analyst Intern",
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

function validateStep(step, form) {
  const errors = {};

  for (const [key, label] of requiredFields[step] || []) {
    if (!String(form[key] ?? "").trim()) {
      errors[key] = `${label} is required.`;
    }
  }

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (step === 0 && form.personalEmail &&
      !validEmail.test(form.personalEmail)) {
    errors.personalEmail = "Enter a valid personal email.";
  }

  if (step === 1 && form.loginEmail &&
      !validEmail.test(form.loginEmail)) {
    errors.loginEmail = "Enter a valid login email.";
  }

  if (step === 1 && form.password && form.password.length < 8) {
    errors.password = "Password must contain at least 8 characters.";
  }

  if (step === 2) {
    const currentYear = new Date().getFullYear();

    if (
      form.pursuingYear &&
      (!/^\d{4}$/.test(form.pursuingYear) ||
        Number(form.pursuingYear) < 1950 ||
        Number(form.pursuingYear) > currentYear + 10)
    ) {
      errors.pursuingYear = "Enter a valid year.";
    }

    if (
      form.passoutYear &&
      (!/^\d{4}$/.test(form.passoutYear) ||
        Number(form.passoutYear) < 1950 ||
        Number(form.passoutYear) > currentYear + 10)
    ) {
      errors.passoutYear = "Enter a valid year.";
    }
  }

  if (step === 3 && form.aadhaarNumber &&
      !/^\d{12}$/.test(form.aadhaarNumber)) {
    errors.aadhaarNumber = "Enter a valid 12-digit Aadhaar number.";
  }

  if (step === 3 && form.panNumber &&
      !/^[A-Z]{5}\d{4}[A-Z]$/.test(form.panNumber.toUpperCase())) {
    errors.panNumber = "Enter a valid PAN format.";
  }

  return errors;
}

function StepNavigation({ activeStep, onStepClick }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
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
            className={`flex min-w-0 items-center gap-2 rounded-xl
              border px-3 py-3 text-left transition ${
                active
                  ? "border-brand-teal bg-brand-teal-soft text-brand-teal-dark"
                  : completed
                    ? "border-brand-teal-light-soft bg-brand-teal-soft/50 text-brand-teal-dark"
                    : "border-border-default bg-white text-neutral-500 hover:border-border-strong"
              }`}
          >
            <span className={`flex h-9 w-9 shrink-0 items-center
              justify-center rounded-lg ${
                active
                  ? "bg-brand-teal text-white"
                  : completed
                    ? "bg-brand-teal-light-soft text-brand-teal-dark"
                    : "bg-surface-muted text-neutral-500"
              }`}
            >
              {completed ? <Check size={17} /> : <Icon size={17} />}
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

export default function AddIntern() {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

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

    setFeedback("");
  };

  const field = (name) => ({
    name,
    value: form[name],
    onChange: updateField,
    error: errors[name],
  });

  const goToStep = (nextStep) => {
    if (nextStep < 0 || nextStep >= steps.length) return;

    if (nextStep > activeStep) {
      const nextErrors = validateStep(activeStep, form);
      setErrors(nextErrors);

      if (Object.keys(nextErrors).length) return;
    }

    setActiveStep(nextStep);
    setFeedback("");
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
      ...validateStep(3, form),
    };

    setErrors(allErrors);

    if (Object.keys(allErrors).length) {
      const firstInvalidStep = [0, 1, 2, 3].find(
        (step) => Object.keys(validateStep(step, form)).length > 0
      );

      setActiveStep(firstInvalidStep ?? 0);
      setConfirmOpen(false);
      return;
    }

    // UI prototype: connect the intern creation API here.
    // Do not log passwords or sensitive identity/bank details.
    console.log("Intern form ready for submission", {
      firstName: form.firstName,
      lastName: form.lastName,
      employeeCode: form.employeeCode,
      department: form.department,
      designation: form.designation,
      college: form.college,
    });

    setConfirmOpen(false);
    setFeedback(
      "Validation successful. Connect your backend API to save this intern."
    );
  };

  return (
    <div className="min-h-screen bg-page px-4 pb-8
      pt-20 sm:px-6 sm:pt-20 lg:px-8 lg:pt-8"
    >
      {/* Header */}
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
            <span className="text-brand-teal">Add Intern</span>
          </div>

          <h1 className="flex items-center gap-3 text-2xl
            font-semibold tracking-tight text-brand-navy sm:text-3xl"
          >
            <span className="flex h-11 w-11 items-center
              justify-center rounded-xl bg-brand-teal-soft text-brand-teal"
            >
              <UserRoundPlus size={23} />
            </span>
            Intern Management
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Register a new intern and manage their academic and employment details.
          </p>
        </div>

        <span className="flex w-fit items-center gap-2 rounded-xl
          border border-border-default bg-white px-3.5 py-2.5
          text-xs font-medium text-neutral-600 shadow-sm"
        >
          <ShieldCheck size={17} className="text-brand-teal" />
          Intern registration
        </span>
      </header>

      {/* Form */}
      <div className="overflow-hidden rounded-2xl border
        border-border-default/80 bg-white shadow-sm"
      >
        <div className="border-b border-border-default p-4 sm:p-6">
          <StepNavigation
            activeStep={activeStep}
            onStepClick={goToStep}
          />

          <div className="mt-5 flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              Step {activeStep + 1} of {steps.length}
            </span>
            <span className="text-xs font-semibold text-brand-teal-dark">
              {Math.round(((activeStep + 1) / steps.length) * 100)}% complete
            </span>
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
            {/* STEP 1: CONTACT DETAILS */}
            {activeStep === 0 && (
              <>
                <FormSection
                  title="Contact Information"
                  description="Enter personal, contact and placement details."
                  icon={ContactRound}
                >
                  <FormField label="First Name"
                    placeholder="Enter first name" required
                    {...field("firstName")} />

                  <FormField label="Last Name"
                    placeholder="Enter last name"
                    {...field("lastName")} />

                  <FormField label="Father's Name"
                    placeholder="Enter father's name"
                    {...field("fatherName")} />

                  <FormField label="Date of Birth" type="date"
                    max={new Date().toISOString().split("T")[0]}
                    required {...field("dob")} />

                  <FormField label="Gender" type="radio"
                    options={["Male", "Female", "Other"]}
                    required {...field("gender")} />

                  <FormField label="Profile Image" type="file"
                    name="profileImage" accept="image/*"
                    onChange={updateField}
                    hint="Optional profile picture." />

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
                    placeholder="Enter personal email" required
                    {...field("personalEmail")} />

                  <FormField label="Permanent Address"
                    placeholder="Enter permanent address"
                    {...field("permanentAddress")} />

                  <FormField label="Temporary Address"
                    placeholder="Enter temporary address"
                    {...field("temporaryAddress")} />

                  <FormField label="State" type="select"
                    options={stateOptions} placeholder="Select state"
                    {...field("state")} />

                  <FormField label="City"
                    placeholder="Enter city"
                    {...field("city")} />

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

                  <FormField label="Official MS Teams ID"
                    placeholder="Enter MS Teams ID"
                    {...field("teamsId")} />

                  <FormField label="Work Type" type="select"
                    options={["Internship", "Full Time", "Part Time", "Hybrid", "Remote"]}
                    required {...field("workType")} />

                  <FormField label="Branch" type="select"
                    options={["Mohali", "Yamuna Nagar", "Remote"]}
                    required {...field("branch")} />

                  <FormField label="Intern Code"
                    placeholder="Enter intern code" required
                    {...field("employeeCode")} />
                </FormSection>
              </>
            )}

            {/* STEP 2: LOGIN DETAILS */}
            {activeStep === 1 && (
              <FormSection
                title="Login Credentials"
                description="Set up login credentials for the intern's portal account."
                icon={KeyRound}
                columns={2}
              >
                <FormField label="Email Address" type="email"
                  placeholder="intern@trigvent.com" required
                  {...field("loginEmail")} />

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
                      autoComplete="new-password"
                      placeholder="Minimum 8 characters"
                      aria-invalid={Boolean(errors.password)}
                      className={`w-full rounded-xl border bg-white
                        px-3.5 py-2.5 pr-11 text-sm outline-none
                        transition focus:border-brand-teal
                        focus:ring-4 focus:ring-brand-teal/10 ${
                          errors.password ? "border-danger" : "border-border-default"
                        }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2
                        -translate-y-1/2 text-neutral-400 hover:text-text-secondary"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-1.5 text-xs text-danger">
                      {errors.password}
                    </p>
                  )}
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
                        Create the account securely through your backend.
                        Passwords should never be stored in plaintext or
                        included in application logs.
                      </p>
                    </div>
                  </div>
                </div>
              </FormSection>
            )}

            {/* STEP 3: INTERN DETAILS */}
            {activeStep === 2 && (
              <FormSection
                title="Intern Details"
                description="Capture academic qualifications and previous experience."
                icon={GraduationCap}
                columns={2}
              >
                <FormField label="College / University"
                  placeholder="Enter college name" required
                  {...field("college")} />

                <FormField label="Qualification"
                  placeholder="e.g. B.Tech Computer Science" required
                  {...field("qualification")} />

                <FormField label="Pursuing Year"
                  type="number" min="1950" max={String(new Date().getFullYear() + 10)}
                  placeholder="e.g. 2026"
                  {...field("pursuingYear")} />

                <FormField label="Passout Year"
                  type="number" min="1950" max={String(new Date().getFullYear() + 10)}
                  placeholder="e.g. 2027"
                  {...field("passoutYear")} />

                <FormField label="Interview Date"
                  type="date" {...field("interviewDate")} />

                <FormField label="Previous Work / Internship Experience"
                  type="select"
                  options={[
                    { label: "No", value: "No" },
                    { label: "Yes", value: "Yes" },
                  ]}
                  {...field("previousExperience")} />

                <div className="rounded-xl border border-border-light
                  bg-surface-subtle/80 p-4 md:col-span-2"
                >
                  <p className="text-sm font-semibold text-brand-navy">
                    Academic information
                  </p>
                  <p className="mt-1 text-sm leading-6 text-neutral-500">
                    Add the college, qualification and expected graduation
                    year to help HR maintain the intern's academic record.
                  </p>
                </div>
              </FormSection>
            )}

            {/* STEP 4: BANK DETAILS */}
            {activeStep === 3 && (
              <>
                <FormSection
                  title="Banking Information"
                  description="Bank details for stipend processing, where applicable."
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
                    placeholder="Enter IFSC code"
                    {...field("ifscCode")} />
                </FormSection>

                <FormSection
                  title="Identity Information"
                  description="Identity details required by your HR policy."
                  icon={ShieldCheck}
                  columns={2}
                >
                  <FormField label="Aadhaar Number"
                    placeholder="Enter 12-digit Aadhaar number"
                    required {...field("aadhaarNumber")} />

                  <FormField label="PAN Card Number"
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
                    Only collect identity and banking information when
                    necessary. Restrict access and transmit it securely.
                    These fields are not sent to a backend by this UI yet.
                  </p>
                </div>
              </>
            )}

            {/* STEP 5: NOTES */}
            {activeStep === 4 && (
              <>
                <FormSection
                  title="Additional Notes"
                  description="Add interview feedback, onboarding information or other HR notes."
                  icon={NotebookPen}
                  columns={1}
                >
                  <div className="space-y-3">
                    {form.notes.map((note, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <textarea
                          value={note}
                          onChange={(event) =>
                            updateNote(index, event.target.value)
                          }
                          rows={3}
                          placeholder={`Enter note ${index + 1}...`}
                          aria-label={`Intern note ${index + 1}`}
                          className="min-w-0 flex-1 resize-y rounded-xl
                            border border-border-default px-4 py-3 text-sm
                            text-text-secondary outline-none transition
                            placeholder:text-neutral-400 focus:border-brand-teal
                            focus:ring-4 focus:ring-brand-teal/10"
                        />

                        {form.notes.length > 1 && (
                          <button type="button"
                            onClick={() => removeNote(index)}
                            aria-label={`Remove note ${index + 1}`}
                            className="mt-2 rounded-lg p-2 text-neutral-400
                              transition hover:bg-danger-soft hover:text-danger"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>
                    ))}

                    <button type="button" onClick={addNote}
                      className="inline-flex items-center gap-2 rounded-lg
                        px-3 py-2 text-sm font-semibold text-brand-teal-dark
                        transition hover:bg-brand-teal-soft"
                    >
                      <span className="text-lg leading-none">+</span>
                      Add New Note
                    </button>
                  </div>
                </FormSection>

                <FormSection
                  title="Review Intern Details"
                  description="Review the main details before submitting."
                  icon={CircleCheck}
                  columns={2}
                >
                  {[
                    ["Intern Name", `${form.firstName} ${form.lastName}`.trim()],
                    ["Intern Code", form.employeeCode],
                    ["Department", form.department],
                    ["Designation", form.designation],
                    ["College", form.college],
                    ["Qualification", form.qualification],
                    ["Login Email", form.loginEmail],
                    ["Joining Date", form.joiningDate],
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
                      Confirm the information is correct and follow your
                      organization's data-handling policy.
                    </p>
                  </div>
                </FormSection>
              </>
            )}

            {feedback && (
              <div role="status"
                className="rounded-xl border border-brand-teal-soft
                  bg-brand-teal-soft p-4 text-sm leading-6 text-brand-teal-dark"
              >
                {feedback}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex flex-col-reverse justify-between gap-3
              border-t border-border-light pt-5 sm:flex-row sm:items-center"
            >
              <button
                type="button"
                onClick={() => {
                  if (activeStep === 0) {
                    navigate("/employees");
                  } else {
                    setActiveStep((step) => step - 1);
                    setFeedback("");
                  }
                }}
                className="inline-flex items-center justify-center gap-2
                  rounded-xl border border-border-default bg-white px-5 py-3
                  text-sm font-semibold text-neutral-600 transition hover:bg-surface-subtle"
              >
                <ArrowLeft size={17} />
                {activeStep === 0 ? "Cancel" : "Previous"}
              </button>

              {activeStep < steps.length - 1 ? (
                <button type="button"
                  onClick={() => goToStep(activeStep + 1)}
                  className="inline-flex items-center justify-center gap-2
                    rounded-xl bg-brand-teal px-5 py-3 text-sm
                    font-semibold text-white shadow-sm transition
                    hover:bg-brand-teal-dark focus:outline-none focus:ring-4
                    focus:ring-brand-teal/20"
                >
                  Next: {steps[activeStep + 1].label}
                  <ArrowRight size={17} />
                </button>
              ) : (
                <button type="button"
                  onClick={() => setConfirmOpen(true)}
                  className="inline-flex items-center justify-center gap-2
                    rounded-xl bg-brand-teal px-5 py-3 text-sm
                    font-semibold text-white shadow-sm transition hover:bg-brand-teal-dark"
                >
                  <Save size={17} />
                  Save Intern Details
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-[70] flex items-center
          justify-center bg-navy-dark/40 p-4 backdrop-blur-sm"
        >
          <div role="dialog" aria-modal="true"
            aria-labelledby="confirm-intern-title"
            className="w-full max-w-md rounded-2xl border
              border-border-default bg-white p-6 shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center
              justify-center rounded-xl bg-brand-teal-soft text-brand-teal"
            >
              <GraduationCap size={23} />
            </div>

            <h2 id="confirm-intern-title"
              className="mt-4 text-lg font-semibold text-brand-navy"
            >
              Save intern details?
            </h2>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Confirm the registration for{" "}
              <span className="font-semibold text-text-secondary">
                {`${form.firstName} ${form.lastName}`.trim()}
              </span>
              .
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-xl border border-border-default
                  px-4 py-2.5 text-sm font-semibold text-neutral-600
                  hover:bg-surface-subtle"
              >
                Go Back
              </button>

              <button type="button"
                onClick={(event) => {
                  setConfirmOpen(false);
                  handleSubmit(event);
                }}
                className="inline-flex items-center justify-center
                  gap-2 rounded-xl bg-brand-teal px-4 py-2.5
                  text-sm font-semibold text-white hover:bg-brand-teal-dark"
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
