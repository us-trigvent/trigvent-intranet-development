import { useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  DollarSign,
  Mail,
  Save,
  UserRound,
  UsersRound,
} from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-border-default bg-white px-3.5 py-2.5 text-sm text-brand-navy outline-none transition placeholder:text-neutral-400 focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10";

const initialForm = {
  candidateName: "",
  phone: "",
  email: "",
  linkedin: "",
  location: "",
  branch: "",
  experience: "",
  techStack: "",
  position: "",
  currentSalary: "",
  expectedSalary: "",
  reference: "",
  employmentMode: "",
  round1Date: "",
  round1Interviewer: "",
  round1Feedback: "",
  round2Date: "",
  round2GivenBy: "",
  round2Feedback: "",
  round3Date: "",
  round3Interviewer: "",
  round3Feedback: "",
};

const interviewers = ["Rahul Sharma", "Priya Gupta", "Amit Kumar", "Neha Singh"];

export default function AddInterview() {
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

    const required = [
      "candidateName",
      "phone",
      "email",
      "branch",
      "techStack",
      "position",
      "employmentMode",
    ];
    const nextErrors = {};

    required.forEach((name) => {
      if (!String(form[name]).trim()) nextErrors[name] = "This field is required.";
    });

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setMessage("Interview added successfully.");
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

  const SectionTitle = ({ icon: Icon, title }) => (
    <div className="mb-5 flex items-center gap-2 border-b border-border-default pb-3">
      <Icon size={18} className="text-brand-teal" />
      <h2 className="text-base font-semibold text-brand-navy">{title}</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-page px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <header className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-neutral-500">
          <span>Trigvent</span>
          <span className="text-neutral-300">/</span>
          <span>Recruitment</span>
          <span className="text-neutral-300">/</span>
          <span className="text-brand-teal">Add Interview</span>
        </div>

        <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-teal-soft text-brand-teal">
            <UserRound size={23} />
          </span>
          Add Interview
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Enter candidate and interview details.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-border-default/80 bg-white shadow-sm">
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-5 sm:p-6 lg:p-7">
            <SectionTitle icon={UserRound} title="Contact Information" />
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <Field label="Candidate Name" name="candidateName" required error={errors.candidateName}>
                <input {...field("candidateName")} placeholder="Enter candidate name" className={inputClass} />
              </Field>
              <Field label="Phone" name="phone" required error={errors.phone}>
                <input {...field("phone")} inputMode="tel" placeholder="Enter phone" className={inputClass} />
              </Field>
              <Field label="Email" name="email" required error={errors.email}>
                <input {...field("email")} type="email" placeholder="Enter email" className={inputClass} />
              </Field>
              <Field label="LinkedIn" name="linkedin">
                <input {...field("linkedin")} placeholder="https://www.linkedin.com/in/username" className={inputClass} />
              </Field>
              <Field label="Location" name="location">
                <input {...field("location")} placeholder="Enter location" className={inputClass} />
              </Field>
              <Field label="Branch" name="branch" required error={errors.branch}>
                <select {...field("branch")} className={inputClass}>
                  <option value="">Select Branch</option>
                  <option value="Mohali">Mohali</option>
                  <option value="Yamunanagar">Yamunanagar</option>
                  <option value="Remote">Remote</option>
                </select>
              </Field>
            </div>

            <div className="mt-8">
              <SectionTitle icon={BriefcaseBusiness} title="Work Experience" />
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <Field label="Years of Experience" name="experience">
                  <input {...field("experience")} inputMode="decimal" placeholder="Enter total experience" className={inputClass} />
                </Field>
                <Field label="Tech Stack" name="techStack" required error={errors.techStack}>
                  <input {...field("techStack")} placeholder="Enter tech stack" className={inputClass} />
                </Field>
                <div className="lg:col-span-1">
                  <Field label="Position Applied For" name="position" required error={errors.position}>
                    <input {...field("position")} placeholder="Enter position applied for" className={inputClass} />
                  </Field>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <SectionTitle icon={DollarSign} title="Salary" />
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <Field label="Current Salary" name="currentSalary">
                  <input {...field("currentSalary")} type="number" min="0" placeholder="Enter current salary" className={inputClass} />
                </Field>
                <Field label="Expected Salary" name="expectedSalary">
                  <input {...field("expectedSalary")} type="number" min="0" placeholder="Enter expected salary" className={inputClass} />
                </Field>
              </div>
            </div>

            <div className="mt-8">
              <SectionTitle icon={Mail} title="Additional" />
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <Field label="Reference" name="reference">
                  <select {...field("reference")} className={inputClass}>
                    <option value="">Select Reference</option>
                    <option value="Employee Referral">Employee Referral</option>
                    <option value="Job Portal">Job Portal</option>
                    <option value="Consultant">Consultant</option>
                    <option value="Direct">Direct</option>
                  </select>
                </Field>
                <Field label="Mode of Employment" name="employmentMode" required error={errors.employmentMode}>
                  <select {...field("employmentMode")} className={inputClass}>
                    <option value="">Select Mode</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </Field>
              </div>
            </div>

            <div className="mt-8">
              <SectionTitle icon={UsersRound} title="Interview Rounds" />
              <div className="space-y-5">
                {[
                  { number: 1, title: "Round 1 (Telephonic)", person: "round1Interviewer", date: "round1Date", feedback: "round1Feedback", placeholder: "Select Interviewer" },
                  { number: 2, title: "Round 2 (Assignment Test)", person: "round2GivenBy", date: "round2Date", feedback: "round2Feedback", placeholder: "Given By" },
                  { number: 3, title: "Round 3 (Machine Test)", person: "round3Interviewer", date: "round3Date", feedback: "round3Feedback", placeholder: "Select Interviewer" },
                ].map((round) => (
                  <div key={round.number}>
                    <p className="mb-2 text-sm font-medium text-text-secondary">{round.title}</p>
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(150px,0.8fr)_minmax(180px,1fr)_minmax(220px,1fr)]">
                      <input {...field(round.date)} type="date" aria-label={`${round.title} date`} className={inputClass} />
                      <select {...field(round.person)} aria-label={`${round.title} interviewer`} className={inputClass}>
                        <option value="">{round.placeholder}</option>
                        {interviewers.map((person) => <option key={person} value={person}>{person}</option>)}
                      </select>
                      <textarea {...field(round.feedback)} rows={1} placeholder="Feedback" className={`${inputClass} resize-y`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
              <Save size={17} />
              Add Interview
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
