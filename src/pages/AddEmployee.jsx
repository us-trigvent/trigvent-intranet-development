
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";

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
import { useToast } from "../components/ToastProvider";
import { createEmployee } from "../redux/actions/employeeActions";

const steps = [
  { label: "Personal Details", icon: UserRound },
  { label: "Login Details", icon: KeyRound },
  { label: "Bank Details", icon: Landmark },
  { label: "Notes & Review", icon: NotebookPen },
];

const initialForm = {
  firstName: "",
  lastName: "",
  dob: "",
  gender: "male",
  profileImage: null,

  mobile: "",
  alternateNumber: "",
  officialEmail: "",
  personalEmail: "",

  permanentAddress: "",
  state: "",
  city: "",
  pincode: "",
  emergencyContactName: "",
  emergencyContactRelation: "",
  emergencyContactNumber: "",

  department: "",
  designation: "",
  joiningDate: "",
  workType: "",
  branch: "Mohali",
  employeeCode: "",
  role: "",
  status: "",
  isArchive: "",
  probationPeriod: "",
  attendanceCode: "",
  cardNumber: "",
  backgroundVerification: "",
  receivedRemarks: "",
  college: "",
  qualification: "",
  interviewDate: "",
  passoutYear: "",
  pursuingYear: "",
  previousExperience: "",

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
    ["cardNumber", "Card number"],
  ],
  1: [["loginEmail", "Login email"]],
  2: [
    ["aadhaarNumber", "Aadhaar number"],
    ["panNumber", "PAN number"],
  ],
};

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
  { label: "Remote", value: "remote" },
  { label: "Onsite", value: "onsite" },
  { label: "Hybrid", value: "hybrid" },
];

const probationOptions = [
  { label: "3 Months", value: "3" },
  { label: "6 Months", value: "6" },
];

const verificationOptions = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

function validateStep(step, form) {
  const errors = {};

  for (const [field, label] of requiredByStep[step] || []) {
    if (!String(form[field] ?? "").trim()) {
      errors[field] = `${label} is required.`;
    }
  }

  if (step === 0) {
    const minimumDob = new Date();
    minimumDob.setFullYear(minimumDob.getFullYear() - 15);
    if (
      form.dob &&
      new Date(form.dob) > minimumDob
    ) {
      errors.dob = "Employee must be at least 15 years old.";
    }

    if (form.mobile && !/^\d{10,15}$/.test(form.mobile)) {
      errors.mobile = "Enter a valid 10-15 digit mobile number.";
    }

    if (form.alternateNumber && !/^\d{10,15}$/.test(form.alternateNumber)) {
      errors.alternateNumber = "Enter a valid 10-15 digit alternate number.";
    }

    if (form.department && !/^\d+$/.test(form.department)) {
      errors.department = "Enter a valid department ID.";
    }

    if (form.designation && !/^\d+$/.test(form.designation)) {
      errors.designation = "Enter a valid designation ID.";
    }

    if (form.attendanceCode && !/^\d{1,10}$/.test(form.attendanceCode)) {
      errors.attendanceCode = "Attendance code must be at most 10 digits.";
    }

    if (form.cardNumber && !/^\d{1,10}$/.test(form.cardNumber)) {
      errors.cardNumber = "Card number must be at most 10 digits.";
    }

    if (
      form.officialEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.officialEmail)
    ) {
      errors.officialEmail = "Enter a valid official email address.";
    }

    if (form.profileImage) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(form.profileImage.type)) {
        errors.profileImage = "Choose a JPEG, PNG, or WebP image.";
      } else if (form.profileImage.size > 2048 * 1024) {
        errors.profileImage = "Image must be 2048 KB or smaller.";
      }
    }

    if (
      form.dob &&
      form.joiningDate &&
      new Date(form.joiningDate) <= new Date(form.dob)
    ) {
      errors.joiningDate = "Joining date must be after date of birth.";
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

  if (step === 2 && form.panNumber &&
      !/^[A-Z]{5}\d{4}[A-Z]$/.test(form.panNumber.toUpperCase())) {
    errors.panNumber = "Enter a valid PAN format.";
  }

  if (step === 2 && form.aadhaarNumber && !/^\d{12}$/.test(form.aadhaarNumber)) {
    errors.aadhaarNumber = "Enter a valid 12-digit Aadhaar number.";
  }

  if (step === 2 && form.ifscCode && form.ifscCode.length > 11) {
    errors.ifscCode = "IFSC code must be at most 11 characters.";
  }

  if (step === 2 && form.accountNumber && form.accountNumber.length > 20) {
    errors.accountNumber = "Account number must be at most 20 characters.";
  }

  if (step === 3) {
    if (form.college.length > 150) {
      errors.college = "College must be 150 characters or fewer.";
    }
    if (form.qualification.length > 100) {
      errors.qualification = "Qualification must be 100 characters or fewer.";
    }
    for (const field of ["passoutYear", "pursuingYear"]) {
      if (form[field] && !/^\d{4}$/.test(form[field])) {
        errors[field] = "Enter a 4-digit year.";
      }
    }
    if (
      form.interviewDate &&
      Number.isNaN(new Date(form.interviewDate).getTime())
    ) {
      errors.interviewDate = "Enter a valid interview date.";
    }
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
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const creating = useSelector((state) => state.employees.creating);

  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  const formik = useFormik({
    initialValues: initialForm,
    validate: (values) => ({
      ...validateStep(0, values),
      ...validateStep(1, values),
      ...validateStep(2, values),
      ...validateStep(3, values),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        const fields = {
          is_intern: "false",
          first_name: values.firstName.trim(),
          last_name: values.lastName.trim(),
          email: values.loginEmail.trim(),
          personal_email_address: values.personalEmail.trim(),
          official_email_address: values.officialEmail.trim(),
          dob: values.dob,
          gender: values.gender,
          mobile_number: values.mobile,
          alternate_number: values.alternateNumber,
          department_id: values.department,
          designation_id: values.designation,
          joining_date: values.joiningDate,
          probation_period: values.probationPeriod,
          work_type: values.workType,
          branch: values.branch,
          employee_code: values.employeeCode.trim(),
          role: values.role.trim(),
          status: values.status.trim(),
          is_archive: values.isArchive,
          attendance_code: values.attendanceCode,
          CardNo: values.cardNumber,
          aadhar_number: values.aadhaarNumber,
          pan_number: values.panNumber.toUpperCase(),
          bank_ifsc_code: values.ifscCode.trim(),
          bank_account_number: values.accountNumber.trim(),
          bank_name: values.bankName.trim(),
          bank_account_name: values.accountHolderName.trim(),
          address: values.permanentAddress.trim(),
          city: values.city.trim(),
          state: values.state,
          pincode: values.pincode,
          emergency_contact_name: values.emergencyContactName.trim(),
          emergency_contact_relation: values.emergencyContactRelation.trim(),
          emergency_contact_number: values.emergencyContactNumber,
          received_remarks: values.receivedRemarks.trim(),
          is_background_verification_done: values.backgroundVerification,
          college: values.college.trim(),
          qualification: values.qualification.trim(),
          interview_date: values.interviewDate,
          passout_year: values.passoutYear,
          pursuing_year: values.pursuingYear,
          previous_experience: values.previousExperience.trim(),
          notes: values.notes.filter(Boolean).join("\n"),
          password: values.password,
        };

        Object.entries(fields).forEach(([key, value]) => {
          if (value !== "" && value !== undefined && value !== null) {
            formData.append(key, value);
          }
        });

        if (values.profileImage) {
          formData.append("image", values.profileImage);
        }

        await dispatch(createEmployee(formData)).unwrap();
        setReviewOpen(false);
        showToast({
          type: "success",
          title: "Employee created",
          message: "The employee record was created successfully.",
        });
        navigate("/hr/employee-listing");
      } catch (error) {
        showToast({
          type: "error",
          title: "Unable to create employee",
          message:
            typeof error === "string"
              ? error
              : "Please check the employee details and try again.",
        });
      }
    },
  });

  const form = formik.values;
  const errors = formik.errors;

  const updateField = (event) => {
    const { name, value, files } = event.target;
    formik.setFieldValue(name, files ? files[0] || null : value);
  };

  const goToStep = (nextStep) => {
    if (nextStep < 0 || nextStep >= steps.length) return;

    if (nextStep > activeStep) {
      const nextErrors = validateStep(activeStep, form);
      formik.setErrors({ ...formik.errors, ...nextErrors });

      if (Object.keys(nextErrors).length > 0) {
        return;
      }
    }

    setActiveStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addNote = () => {
    formik.setFieldValue("notes", [...form.notes, ""]);
  };

  const updateNote = (index, value) => {
    formik.setFieldValue(
      "notes",
      form.notes.map((note, i) => (i === index ? value : note))
    );
  };

  const removeNote = (index) => {
    formik.setFieldValue(
      "notes",
      form.notes.filter((_, i) => i !== index)
    );
  };

  const confirmSubmit = async () => {
    const allErrors = {
      ...validateStep(0, form),
      ...validateStep(1, form),
      ...validateStep(2, form),
      ...validateStep(3, form),
    };

    formik.setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      const firstInvalidStep = [0, 1, 2, 3].find(
        (step) => Object.keys(validateStep(step, form)).length > 0
      );

      setActiveStep(firstInvalidStep ?? 0);
      setReviewOpen(false);
      return;
    }

    await formik.submitForm();
  };

  const field = (name) => ({
    name,
    value: form[name],
    onChange: updateField,
    error: errors[name],
    onBlur: formik.handleBlur,
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

        <form onSubmit={formik.handleSubmit} noValidate>
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

                  <FormField label="Date of Birth" type="date"
                    max={new Date().toISOString().split("T")[0]}
                    required {...field("dob")} />

                  <FormField label="Gender" type="radio" required
                    options={[
                      { label: "Male", value: "male" },
                      { label: "Female", value: "female" },
                      { label: "Other", value: "other" },
                    ]}
                    {...field("gender")} />

                  <FormField label="Profile Image" type="file"
                    accept="image/jpeg,image/png,image/webp"
                    name="profileImage"
                    onChange={updateField}
                    error={errors.profileImage}
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

                </FormSection>

                <FormSection
                  title="Address Information"
                  description="Residential address and location."
                  icon={CalendarDays}
                >
                  <FormField label="Permanent Address"
                    placeholder="Enter permanent address"
                    {...field("permanentAddress")} />

                  <FormField label="State" type="select"
                    options={stateOptions}
                    placeholder="Select state"
                    {...field("state")} />

                  <FormField label="City"
                    placeholder="Enter city"
                    {...field("city")} />

                  <FormField label="PIN Code"
                    placeholder="Enter PIN code"
                    {...field("pincode")} />
                </FormSection>

                <FormSection
                  title="Emergency Contact"
                  description="Optional contact details for emergencies."
                  icon={UserRound}
                >
                  <FormField label="Contact Name"
                    placeholder="Enter contact name"
                    {...field("emergencyContactName")} />

                  <FormField label="Relationship"
                    placeholder="e.g. Spouse"
                    {...field("emergencyContactRelation")} />

                  <FormField label="Contact Number" type="tel"
                    placeholder="Enter contact number"
                    {...field("emergencyContactNumber")} />
                </FormSection>

                <FormSection
                  title="Employment Details"
                  description="Assign the employee's role, department and work information."
                  icon={BriefcaseIcon}
                >
                  <FormField label="Department ID" type="number"
                    placeholder="Enter department ID" min="1" required
                    hint="Use the department ID configured by your administrator."
                    {...field("department")} />

                  <FormField label="Designation ID" type="number"
                    placeholder="Enter designation ID" min="1" required
                    hint="Use the designation ID configured by your administrator."
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
                    placeholder="e.g. TRG-1005"
                    {...field("employeeCode")} />

                  <FormField label="Role"
                    placeholder="Enter employee role"
                    {...field("role")} />

                  <FormField label="Status"
                    placeholder="Enter employee status"
                    {...field("status")} />

                  <FormField label="Archive Record" type="select"
                    options={[
                      { label: "No", value: "0" },
                      { label: "Yes", value: "1" },
                    ]}
                    placeholder="Do not archive"
                    {...field("isArchive")} />

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
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={updateField}
                      placeholder="Optional; minimum 8 characters"
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
                    Optional. If provided, use at least 8 characters.
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

              </>
            )}

            {activeStep === 3 && (
              <>
                <FormSection
                  title="Education and Experience"
                  description="Optional education, interview and previous experience details."
                  icon={CalendarDays}
                  columns={2}
                >
                  <FormField label="College"
                    placeholder="Enter college or institution"
                    {...field("college")} />

                  <FormField label="Qualification"
                    placeholder="Enter qualification"
                    {...field("qualification")} />

                  <FormField label="Interview Date" type="datetime-local"
                    {...field("interviewDate")} />

                  <FormField label="Passout Year" type="text"
                    placeholder="YYYY" max="9999"
                    {...field("passoutYear")} />

                  <FormField label="Pursuing Year" type="text"
                    placeholder="YYYY" max="9999"
                    {...field("pursuingYear")} />

                  <FormField label="Previous Experience" type="textarea"
                    placeholder="Describe relevant experience"
                    rows={2} {...field("previousExperience")} />
                </FormSection>

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
                  disabled={creating}
                  className="inline-flex items-center justify-center
                    gap-2 rounded-xl bg-brand-teal px-5 py-3
                    text-sm font-semibold text-white shadow-sm
                    transition hover:bg-brand-teal-dark disabled:cursor-not-allowed
                    disabled:opacity-60"
                >
                  <Save size={17} />
                  {creating ? "Saving Employee..." : "Save Employee"}
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
                disabled={creating}
                className="rounded-xl border border-border-default
                  px-4 py-2.5 text-sm font-semibold
                  text-neutral-600 hover:bg-surface-subtle"
              >
                Go back
              </button>

              <button type="button"
                onClick={confirmSubmit}
                disabled={creating}
                className="inline-flex items-center
                  justify-center gap-2 rounded-xl
                  bg-brand-teal px-4 py-2.5 text-sm
                  font-semibold text-white hover:bg-brand-teal-dark
                  disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Check size={17} />
                {creating ? "Saving..." : "Confirm"}
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
