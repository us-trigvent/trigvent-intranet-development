import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  Loader2,
  UserRound,
} from "lucide-react";

import Button from "../components/common/Button";
import { fetchRelievementById } from "../redux/actions/relievementActions";

const readValue = (record, keys) => {
  for (const key of keys) {
    const value = record?.[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return "—";
};

const formatValue = (value) => {
  if (value === "—") return value;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value && typeof value === "object") {
    return String(value.name ?? value.label ?? value.title ?? value.full_name ?? "—");
  }
  return String(value);
};

const formatDate = (value) => {
  if (!value || value === "—") return "—";
  const date = new Date(
    typeof value === "string" && value.includes("T")
      ? value
      : `${value}T00:00:00`
  );
  return Number.isNaN(date.getTime())
    ? formatValue(value)
    : new Intl.DateTimeFormat("en-GB").format(date);
};

const initialsFor = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "E";

function DetailSection({ title, icon: Icon, fields, record }) {
  return (
    <section className="rounded-2xl border border-border-default/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3 border-b border-border-light pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-teal-soft text-brand-teal-dark">
          <Icon size={20} />
        </div>
        <h2 className="text-base font-semibold text-brand-navy">{title}</h2>
      </div>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        {fields.map(({ label, keys, date }) => {
          const value = readValue(record, keys);
          return (
            <div key={label} className="min-w-0">
              <dt className="text-xs font-medium text-neutral-500">{label}</dt>
              <dd className="mt-1 break-words text-sm font-medium text-text-secondary">
                {date ? formatDate(value) : formatValue(value)}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}

export default function ReleasedEmployeeDetails() {
  const { relievementId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { detail, detailLoading, detailError } = useSelector(
    (state) => state.relievements
  );

  useEffect(() => {
    dispatch(fetchRelievementById(relievementId));
  }, [dispatch, relievementId]);

  const loadDetails = () => dispatch(fetchRelievementById(relievementId));
  const employee = detail?.employee || detail?.employee_detail || {};
  const employeeName = formatValue(
    readValue(detail, ["employee_name", "name"]) !== "—"
      ? readValue(detail, ["employee_name", "name"])
      : employee.name || employee.full_name ||
          [employee.first_name, employee.last_name].filter(Boolean).join(" ") ||
          "Released employee"
  );
  const mode = formatValue(readValue(detail, ["mode", "relievement_mode"]));
  const modeClass =
    mode === "Terminated"
      ? "bg-danger-soft text-danger"
      : mode === "Lay off"
        ? "bg-warning-soft text-warning-dark"
        : "bg-info-soft text-info";

  const employeeFields = [
    { label: "Employee ID", keys: ["employee_code"] },
    { label: "Department", keys: ["department"] },
    { label: "Designation", keys: ["designation"] },
    { label: "Status", keys: ["user_status_label", "status"] },
  ];
  const exitFields = [
    { label: "Mode", keys: ["mode", "relievement_mode"] },
    { label: "Resignation date", keys: ["date_of_resignation", "resignation_date"], date: true },
    { label: "Service end date", keys: ["end_of_services", "service_end_date", "release_date"], date: true },
    { label: "Leaving reason", keys: ["leaving_reason", "reason", "release_reason"] },
  ];
  const notesFields = [
    { label: "Remarks", keys: ["remarks", "remark"] },
    { label: "Created at", keys: ["created_at"], date: true },
    { label: "Updated at", keys: ["updated_at"], date: true },
  ];

  return (
    <main className="min-h-screen bg-page px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate("/hr/released-employees")}>
            <ArrowLeft size={16} />
            Released employees
          </Button>
          <p className="mt-5 text-xs font-medium text-neutral-500">
            Trigvent / Human Resources / Released Employees / Details
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">
            Released employee details
          </h1>
        </div>

        {detailLoading ? (
          <div className="flex min-h-72 items-center justify-center rounded-2xl border border-border-default bg-white">
            <Loader2 className="animate-spin text-brand-teal" size={28} />
            <span className="ml-3 text-sm text-neutral-500">Loading released employee details...</span>
          </div>
        ) : detailError ? (
          <div className="rounded-2xl border border-danger/20 bg-white p-8 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-brand-navy">Unable to load released employee details</h2>
            <p role="alert" className="mt-2 text-sm text-danger">{detailError}</p>
            <Button className="mt-5" onClick={loadDetails}>Try again</Button>
          </div>
        ) : detail ? (
          <>
            <section className="mb-6 overflow-hidden rounded-2xl border border-border-default/80 bg-white shadow-sm">
              <div className="h-1.5 bg-gradient-to-r from-brand-navy via-brand-teal to-brand-teal-light" />
              <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-brand-teal-soft text-2xl font-semibold text-brand-teal-dark">
                  {initialsFor(employeeName)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold tracking-tight text-brand-navy sm:text-2xl">{employeeName}</h2>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${modeClass}`}>{mode}</span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">{formatValue(readValue(detail, ["designation"]))}</p>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-500">
                    <span className="inline-flex items-center gap-2"><BriefcaseBusiness size={15} className="text-brand-teal" />{formatValue(readValue(detail, ["department"]))}</span>
                    <span className="inline-flex items-center gap-2"><CalendarDays size={15} className="text-brand-teal" />Service end: {formatDate(readValue(detail, ["end_of_services", "service_end_date", "release_date"]))}</span>
                  </div>
                </div>
                <div className="rounded-xl bg-surface-subtle px-4 py-3 text-sm"><p className="text-xs text-neutral-500">Employee ID</p><p className="mt-1 font-semibold text-brand-navy">{formatValue(readValue(detail, ["employee_code", "employee_id"]))}</p></div>
              </div>
            </section>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <DetailSection title="Employee information" icon={UserRound} fields={employeeFields} record={{ ...employee, ...detail }} />
              <DetailSection title="Exit information" icon={BriefcaseBusiness} fields={exitFields} record={detail} />
              <DetailSection title="Record notes" icon={FileText} fields={notesFields} record={detail} />
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-border-default bg-white p-8 text-center text-sm text-neutral-500">No released employee details are available.</div>
        )}
      </div>
    </main>
  );
}
