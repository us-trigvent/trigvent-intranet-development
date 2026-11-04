import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  GraduationCap,
  IdCard,
  MoreHorizontal,
  Plus,
  Save,
  UserRoundPlus,
} from "lucide-react";

import FormSection from "../components/employee-form/FormSection";

function FormField({ label, required, error, children }) {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-sm font-medium text-text-secondary">
        {label}
        {required && <span className="ml-1 text-danger">*</span>}
      </label>
      <div className="[&_input:not([type=radio]):not([type=checkbox])]:w-full [&_input:not([type=radio]):not([type=checkbox])]:rounded-xl [&_input:not([type=radio]):not([type=checkbox])]:border [&_input:not([type=radio]):not([type=checkbox])]:border-border-default [&_input:not([type=radio]):not([type=checkbox])]:bg-white [&_input:not([type=radio]):not([type=checkbox])]:px-3.5 [&_input:not([type=radio]):not([type=checkbox])]:py-2.5 [&_input:not([type=radio]):not([type=checkbox])]:text-sm [&_input:not([type=radio]):not([type=checkbox])]:text-text-secondary [&_input:not([type=radio]):not([type=checkbox])]:outline-none [&_select]:w-full [&_select]:rounded-xl [&_select]:border [&_select]:border-border-default [&_select]:bg-white [&_select]:px-3.5 [&_select]:py-2.5 [&_select]:text-sm [&_select]:text-text-secondary [&_select]:outline-none [&_textarea]:w-full [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-border-default [&_textarea]:bg-white [&_textarea]:px-3.5 [&_textarea]:py-2.5 [&_textarea]:text-sm [&_textarea]:text-text-secondary [&_textarea]:outline-none">
        {children}
      </div>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}

const steps = [
  { label: "Personal Details", icon: IdCard },
  { label: "Course Details", icon: GraduationCap },
  { label: "Enrollment", icon: UserRoundPlus },
  { label: "Miscellaneous", icon: MoreHorizontal },
];

const initialForm = {
  firstName: "",
  lastName: "",
  fatherName: "",
  email: "",
  mobile: "",
  emergencyNumber: "",
  address: "",
  dob: "",
  studies: "",
  gender: "Male",
  duration: "",
  course: "",
  trainingMode: "",
  fee: "",
  joiningDate: "",
  batch: "",
  trainer: "",
  notes: "",
};

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
            className={`flex min-w-0 items-center gap-2.5 rounded-xl border px-3 py-3 text-left transition sm:px-4 ${
              active
                ? "border-brand-teal bg-brand-teal-soft text-brand-teal-dark"
                : completed
                  ? "border-brand-teal-light-soft bg-brand-teal-soft/50 text-brand-teal-dark"
                  : "border-border-default bg-white text-neutral-500 hover:border-border-strong"
            }`}
          >
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
              active
                ? "bg-brand-teal text-white"
                : completed
                  ? "bg-brand-teal-light-soft text-brand-teal-dark"
                  : "bg-surface-muted text-neutral-500"
            }`}>
              {completed ? <Check size={18} /> : <Icon size={18} />}
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-medium uppercase tracking-wider opacity-70">
                Step {index + 1}
              </span>
              <span className="mt-0.5 block truncate text-xs font-semibold sm:text-sm">
                {step.label}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function AddTrainee() {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState("");

  const requiredFields = {
    0: [
      ["firstName", "First name"],
      ["fatherName", "Father's name"],
      ["email", "Email address"],
      ["mobile", "Mobile number"],
      ["emergencyNumber", "Emergency number"],
      ["dob", "Date of birth"],
    ],
    1: [["duration", "Duration"], ["course", "Course"], ["trainingMode", "Mode of training"], ["fee", "Fee"]],
    2: [["joiningDate", "Date of joining"], ["batch", "Batch"], ["trainer", "Trainer"]],
  };

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setFeedback("");
  };

  const field = (name) => ({
    name,
    value: form[name],
    onChange: updateField,
    error: errors[name],
  });

  const validateStep = (step) => {
    const nextErrors = {};
    (requiredFields[step] || []).forEach(([name, label]) => {
      if (!String(form[name] ?? "").trim()) nextErrors[name] = `${label} is required.`;
    });
    if (step === 0 && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    return nextErrors;
  };

  const goToStep = (nextStep) => {
    if (nextStep < 0 || nextStep >= steps.length) return;
    if (nextStep > activeStep) {
      const nextErrors = validateStep(activeStep);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length) return;
    }
    setActiveStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const allErrors = {};
    [0, 1, 2].forEach((step) => {
      Object.assign(allErrors, validateStep(step));
    });
    setErrors(allErrors);
    if (Object.keys(allErrors).length === 0) {
      setFeedback("Trainee details saved successfully.");
    }
  };

  return (
    <div className="min-h-screen bg-page px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <header className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-neutral-500">
          <span>Trigvent</span>
          <span className="text-neutral-300">/</span>
          <span>Training</span>
          <span className="text-neutral-300">/</span>
          <span className="text-brand-teal">Add Trainee</span>
        </div>
        <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-teal-soft text-brand-teal">
            <UserRoundPlus size={23} />
          </span>
          Add Trainee
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Enter the trainee's personal, course and enrollment details.
        </p>
      </header>

      <StepNavigation activeStep={activeStep} onStepClick={goToStep} />

      <form onSubmit={handleSubmit} className="mt-5 space-y-5" noValidate>
        {activeStep === 0 && (
          <FormSection title="Personal Information" icon={IdCard}>
            <FormField label="First Name" required error={errors.firstName}>
              <input {...field("firstName")} placeholder="Enter first name" />
            </FormField>
            <FormField label="Last Name">
              <input {...field("lastName")} placeholder="Enter last name" />
            </FormField>
            <FormField label="Father's Name" required error={errors.fatherName}>
              <input {...field("fatherName")} placeholder="Enter father's name" />
            </FormField>
            <FormField label="Email Address" required error={errors.email}>
              <input {...field("email")} type="email" placeholder="Enter email address" />
            </FormField>
            <FormField label="Mobile Number" required error={errors.mobile}>
              <input {...field("mobile")} inputMode="tel" placeholder="Enter mobile number" />
            </FormField>
            <FormField label="Emergency Number" required error={errors.emergencyNumber}>
              <input {...field("emergencyNumber")} inputMode="tel" placeholder="Enter emergency number" />
            </FormField>
            <div className="xl:col-span-1">
              <FormField label="Address">
                <input {...field("address")} placeholder="Enter address" />
              </FormField>
            </div>
            <FormField label="D.O.B." required error={errors.dob}>
              <input {...field("dob")} type="date" />
            </FormField>
            <FormField label="Add Studies">
              <div className="flex gap-2">
                <input {...field("studies")} placeholder="Type here..." />
                <button type="button" className="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-xl bg-brand-teal-soft text-brand-teal" aria-label="Add study">
                  <Plus size={19} />
                </button>
              </div>
            </FormField>
            <div className="xl:col-span-3">
              <fieldset>
                <legend className="mb-2 text-sm font-medium text-text-secondary">Gender <span className="text-danger">*</span></legend>
                <div className="flex gap-6">
                  {["Male", "Female"].map((gender) => (
                    <label key={gender} className="flex items-center gap-2 text-sm text-text-secondary">
                      <input type="radio" name="gender" value={gender} checked={form.gender === gender} onChange={updateField} className="accent-brand-teal" />
                      {gender}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </FormSection>
        )}

        {activeStep === 1 && (
          <FormSection title="Course Details" icon={GraduationCap}>
            <FormField label="Duration" required error={errors.duration}>
              <select {...field("duration")}>
                <option value="">Select Duration</option>
                <option value="1 Month">1 Month</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
                <option value="12 Months">12 Months</option>
              </select>
            </FormField>
            <FormField label="Course" required error={errors.course}>
              <select {...field("course")}>
                <option value="">Select Course</option>
                <option value="Web Development">Web Development</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Data Analytics">Data Analytics</option>
              </select>
            </FormField>
            <FormField label="Mode of Training" required error={errors.trainingMode}>
              <select {...field("trainingMode")}>
                <option value="">Select Mode</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </FormField>
            <FormField label="Fee" required error={errors.fee}>
              <input {...field("fee")} type="number" min="0" placeholder="Enter fee" />
            </FormField>
          </FormSection>
        )}

        {activeStep === 2 && (
          <FormSection title="Enrollment" icon={UserRoundPlus}>
            <FormField label="Date of Joining" required error={errors.joiningDate}>
              <input {...field("joiningDate")} type="date" />
            </FormField>
            <FormField label="Batch Timing" required error={errors.batch}>
              <select {...field("batch")}>
                <option value="">Select Batch</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </FormField>
            <FormField label="Trainer" required error={errors.trainer}>
              <select {...field("trainer")}>
                <option value="">Select Trainer</option>
                <option value="Rahul Sharma">Rahul Sharma</option>
                <option value="Priya Gupta">Priya Gupta</option>
                <option value="Amit Kumar">Amit Kumar</option>
              </select>
            </FormField>
          </FormSection>
        )}

        {activeStep === 3 && (
          <FormSection title="Miscellaneous" icon={MoreHorizontal}>
            <div className="xl:col-span-3">
              <FormField label="Notes">
                <textarea {...field("notes")} rows={7} placeholder="Enter any notes" />
              </FormField>
            </div>
          </FormSection>
        )}

        {feedback && (
          <div role="status" className="flex items-center gap-2 rounded-xl border border-brand-teal-soft bg-brand-teal-soft px-4 py-3 text-sm font-medium text-brand-teal-dark">
            <Check size={17} />
            {feedback}
          </div>
        )}

        <div className="flex justify-between gap-3">
          <button
            type="button"
            onClick={() => goToStep(activeStep - 1)}
            disabled={activeStep === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-border-default bg-white px-5 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft size={17} />
            Previous
          </button>

          {activeStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => goToStep(activeStep + 1)}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-teal px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-teal-dark"
            >
              Next: {steps[activeStep + 1].label}
              <ArrowRight size={17} />
            </button>
          ) : (
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-teal px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-teal-dark"
            >
              <Save size={17} />
              Save Trainee Details
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
