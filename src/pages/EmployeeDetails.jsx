import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  ContactRound,
  GraduationCap,
  Loader2,
  MapPin,
  UserRound,
  UsersRound,
} from "lucide-react";

import Button from "../components/common/Button";
import { fetchEmployeeById } from "../redux/actions/employeeActions";

const detailSections = [
  {
    title: "Personal information",
    icon: UserRound,
    fields: [
      { label: "First name", keys: ["first_name", "firstName"] },
      { label: "Last name", keys: ["last_name", "lastName"] },
      { label: "Date of birth", keys: ["dob", "date_of_birth", "dateOfBirth"] },
      { label: "Gender", keys: ["gender"] },
      { label: "Personal email", keys: ["personal_email_address", "personalEmail"] },
      { label: "Official email", keys: ["official_email_address", "officialEmail"] },
      { label: "Login email", keys: ["email", "login_email", "loginEmail"] },
      { label: "Mobile number", keys: ["mobile", "mobile_number", "phone"] },
      { label: "Alternate number", keys: ["alternate_number", "alternateNumber"] },
    ],
  },
  {
    title: "Employment",
    icon: BriefcaseBusiness,
    fields: [
      { label: "Employee ID", keys: ["employee_code", "employeeCode", "id"] },
      { label: "Role", keys: ["role_label", "role"] },
      { label: "Department", keys: ["department", "department_name"] },
      { label: "Designation", keys: ["designation", "designation_name"] },
      { label: "Work type", keys: ["work_type", "workType"] },
      { label: "Branch", keys: ["branch"] },
      { label: "Joining date", keys: ["joining_date", "joiningDate"] },
      { label: "Probation period", keys: ["probation_period", "probationPeriod"] },
      { label: "Attendance code", keys: ["attendance_code", "attendanceCode"] },
      { label: "Card number", keys: ["card_number", "cardNumber"] },
      {
        label: "Background verification",
        keys: ["background_verification", "backgroundVerification"],
      },
      { label: "Trainer", keys: ["is_trainer", "isTrainer"] },
      { label: "Intern", keys: ["is_intern", "isIntern"] },
    ],
  },
  {
    title: "Address and emergency contact",
    icon: MapPin,
    fields: [
      { label: "Address", keys: ["address", "permanent_address", "permanentAddress"] },
      { label: "City", keys: ["city"] },
      { label: "State", keys: ["state"] },
      { label: "Postal code", keys: ["pincode", "postal_code", "zip_code"] },
      { label: "Emergency contact", keys: ["emergency_contact_name", "emergencyContactName"] },
      {
        label: "Emergency contact relation",
        keys: ["emergency_contact_relation", "emergencyContactRelation"],
      },
      {
        label: "Emergency contact number",
        keys: ["emergency_contact_number", "emergencyContactNumber"],
      },
    ],
  },
  {
    title: "Education and experience",
    icon: GraduationCap,
    fields: [
      { label: "College", keys: ["college"] },
      { label: "Qualification", keys: ["qualification"] },
      { label: "Interview date", keys: ["interview_date", "interviewDate"] },
      { label: "Passout year", keys: ["passout_year", "passoutYear"] },
      { label: "Pursuing year", keys: ["pursuing_year", "pursuingYear"] },
      {
        label: "Previous experience",
        keys: ["previous_experience", "previousExperience"],
      },
    ],
  },
  {
    title: "Additional information",
    icon: ContactRound,
    fields: [
      { label: "Notes", keys: ["notes", "received_remarks", "receivedRemarks"] },
    ],
  },
];

const readField = (employee, keys) => {
  for (const key of keys) {
    const value = employee?.[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
};

const formatValue = (value) => {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    return value.map(formatValue).filter(Boolean).join(", ");
  }
  if (value && typeof value === "object") {
    return formatValue(
      value.name ??
        value.label ??
        value.title ??
        value.full_name ??
        value.value ??
        value.id ??
        "Details available"
    );
  }
  return String(value);
};

const formatYesNo = (value) => {
  if (value === 0 || value === "0") return "No";
  if (value === 1 || value === "1") return "Yes";
  return formatValue(value);
};

const initialsFor = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "E";

function DetailSection({ title, icon: Icon, fields, employee }) {
  const availableFields = fields
    .map((field) => ({ ...field, value: readField(employee, field.keys) }))
    .filter((field) => field.value !== undefined);

  if (!availableFields.length) return null;

  return (
    <section className="rounded-2xl border border-border-default/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3 border-b border-border-light pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-teal-soft text-brand-teal-dark">
          <Icon size={20} />
        </div>
        <h2 className="text-base font-semibold text-brand-navy">{title}</h2>
      </div>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        {availableFields.map(({ label, value }) => (
          <div key={label} className="min-w-0">
            <dt className="text-xs font-medium text-neutral-500">{label}</dt>
            <dd className="mt-1 break-words text-sm capitalize font-medium text-text-secondary">
              {label === "Trainer" || label === "Intern"
                ? formatYesNo(value)
                : formatValue(value)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function EmployeeDetails() {
  const { employeeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    employeeDetail,
    employeeDetailLoading,
    employeeDetailError,
  } = useSelector((state) => state.employees);

  useEffect(() => {
    dispatch(fetchEmployeeById(employeeId));
  }, [dispatch, employeeId]);

  const loadEmployee = () => dispatch(fetchEmployeeById(employeeId));
  const employee = employeeDetail;
  const employeeName = formatValue(
    readField(employee, ["name", "full_name", "employee_name"]) ||
    [employee?.first_name, employee?.last_name].filter(Boolean).join(" ") ||
    "Employee details"
  );
  const designation = formatValue(
    readField(employee, ["designation", "designation_name", "role_label", "role"]) ||
      ""
  );
  const department = formatValue(
    readField(employee, ["department", "department_name"]) || ""
  );
  const avatar = formatValue(
    readField(employee, [
      "profile_image_url",
      "profile_photo_url",
      "profile_image",
      "profile_photo",
      "avatar",
      "image",
    ]) || ""
  );
  const isArchived = ["1", "true", "yes"].includes(
    String(readField(employee, ["is_archive", "archived"]) ?? "").toLowerCase()
  );
  const statusValue = readField(employee, ["status", "active"]);
  const isActive = ["1", "true", "yes", "active"].includes(
    String(statusValue ?? "").toLowerCase()
  );
  const statusLabel = isArchived
    ? "Archived"
    : statusValue === undefined
      ? "Employee"
      : isActive
        ? "Active"
        : "Inactive";

  return (
    <div className="min-h-screen bg-page px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/hr/employee-listing")}
          >
            <ArrowLeft size={16} />
            Employee listing
          </Button>
          <p className="mt-5 text-xs font-medium text-neutral-500">
            Trigvent / Human Resources / Employee Listing / Details
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">
            Employee details
          </h1>
        </div>

        {employeeDetailLoading ? (
          <div className="flex min-h-72 items-center justify-center rounded-2xl border border-border-default bg-white">
            <Loader2 className="animate-spin text-brand-teal" size={28} />
            <span className="ml-3 text-sm text-neutral-500">
              Loading employee details...
            </span>
          </div>
        ) : employeeDetailError ? (
          <div className="rounded-2xl border border-danger/20 bg-white p-8 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-brand-navy">
              Unable to load employee details
            </h2>
            <p role="alert" className="mt-2 text-sm text-danger">
              {employeeDetailError}
            </p>
            <Button className="mt-5" onClick={loadEmployee}>
              Try again
            </Button>
          </div>
        ) : employee ? (
          <>
            <section className="mb-6 overflow-hidden rounded-2xl border border-border-default/80 bg-white shadow-sm">
              <div className="h-1.5 bg-gradient-to-r from-brand-navy via-brand-teal to-brand-teal-light" />
              <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
                {avatar ? (
                  <img
                    src={avatar}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-2xl border border-border-light object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-brand-teal-soft text-2xl font-semibold text-brand-teal-dark">
                    {initialsFor(employeeName)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold capitalize tracking-tight text-brand-navy sm:text-2xl">
                      {employeeName}
                    </h2>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isArchived
                          ? "bg-warning-soft text-warning-dark"
                          : isActive
                            ? "bg-success-soft text-success-dark"
                            : "bg-danger-soft text-danger-dark"
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">
                    {designation || "Designation not provided"}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral-500">
                    {department && (
                      <span className="inline-flex items-center gap-2">
                        <UsersRound size={15} className="text-brand-teal" />
                        {department}
                      </span>
                    )}
                    {readField(employee, ["joining_date", "joiningDate"]) && (
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays size={15} className="text-brand-teal" />
                        Joined{" "}
                        {formatValue(
                          readField(employee, ["joining_date", "joiningDate"])
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <div className="rounded-xl bg-surface-subtle px-4 py-3 text-sm">
                  <p className="text-xs text-neutral-500">Employee ID</p>
                  <p className="mt-1 font-semibold text-brand-navy">
                    {formatValue(
                      readField(employee, [
                        "employee_code",
                        "employeeCode",
                        "id",
                      ]) ?? employeeId
                    )}
                  </p>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              {detailSections.map((section) => (
                <DetailSection
                  key={section.title}
                  {...section}
                  employee={employee}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-border-default bg-white p-8 text-center text-sm text-neutral-500">
            No employee details are available.
          </div>
        )}
      </div>
    </div>
  );
}
