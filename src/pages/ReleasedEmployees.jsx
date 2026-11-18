import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Eye,
  Pencil,
  Plus,
  Trash2,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";

import DataTable from "../components/common/DataTable";
import DeleteConfirmationDialog from "../components/common/DeleteConfirmationDialog";

const initialReleasedEmployees = [
  {
    id: 1,
    name: "Gagandeep Singh",
    employeeCode: "16",
    resignationDate: "01-03-2026",
    serviceEndDate: "01-04-2026",
    mode: "Release",
    reason: "Better Opportunity",
    remarks: "Best of Luck",
    type: "Employee",
  },
  {
    id: 2,
    name: "Rahul Gupta",
    employeeCode: "1234",
    resignationDate: "01-07-2025",
    serviceEndDate: "31-07-2025",
    mode: "Release",
    reason: "For testing purpose",
    remarks: "For testing purpose",
    type: "Employee",
  },
  {
    id: 3,
    name: "Anne Here",
    employeeCode: "1231232566",
    resignationDate: "10-12-2024",
    serviceEndDate: "10-12-2024",
    mode: "Release",
    reason: "Test",
    remarks: "Test",
    type: "Employee",
  },
  {
    id: 4,
    name: "B B",
    employeeCode: "1231232131",
    resignationDate: "03-12-2024",
    serviceEndDate: "10-12-2024",
    mode: "Terminated",
    reason: "Test",
    remarks: "Test1",
    type: "Employee",
  },
  {
    id: 5,
    name: "A B",
    employeeCode: "24680",
    resignationDate: "07-12-2024",
    serviceEndDate: "07-12-2024",
    mode: "Release",
    reason: "Test",
    remarks: "Test",
    type: "Employee",
  },
  {
    id: 6,
    name: "A B",
    employeeCode: "98123",
    resignationDate: "20-11-2024",
    serviceEndDate: "26-11-2024",
    mode: "Lay off",
    reason: "Test",
    remarks: "Test",
    type: "Employee",
  },
  {
    id: 7,
    name: "A B",
    employeeCode: "65789",
    resignationDate: "01-11-2024",
    serviceEndDate: "21-11-2024",
    mode: "Lay off",
    reason: "Other",
    remarks: "—",
    type: "Employee",
  },
  {
    id: 8,
    name: "A B",
    employeeCode: "66644",
    resignationDate: "06-12-2024",
    serviceEndDate: "07-12-2024",
    mode: "Terminated",
    reason: "Test",
    remarks: "Test",
    type: "Employee",
  },
];

const modeStyles = {
  Release: "bg-info-soft text-info",
  Terminated: "bg-danger-soft text-danger",
  "Lay off": "bg-warning-soft text-warning-dark",
};

function SummaryCard({ title, value, icon: Icon, tone }) {
  const tones = {
    navy: "bg-info-soft text-brand-navy",
    green: "bg-success-soft text-success-dark",
    red: "bg-danger-soft text-danger",
    teal: "bg-brand-teal-soft text-brand-teal-dark",
  };

  return (
    <div className="rounded-2xl border border-border-default/80 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-brand-navy">
            {value}
          </p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

export default function ReleasedEmployeeListing() {
  const navigate = useNavigate();
  const [releasedEmployees, setReleasedEmployees] = useState(initialReleasedEmployees);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [employeeType, setEmployeeType] = useState("all");

  const filteredEmployees =
    employeeType === "all"
      ? releasedEmployees
      : releasedEmployees.filter(
          (employee) => employee.type.toLowerCase() === employeeType
        );

  const columns = [
    {
      field: "serialNumber",
      headerName: "SL",
      cellSx: { width: 70, color: "#94A3B8" },
      render: (_, __, index) => index + 1,
    },
    {
      field: "name",
      headerName: "Name",
      render: (value, employee) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-teal-soft text-xs font-bold text-brand-teal-dark">
            {value
              ?.split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")
              .toUpperCase() || "NA"}
          </div>
          <div>
            <p className="whitespace-nowrap font-semibold text-brand-navy">
              {value}
            </p>
            <p className="mt-0.5 text-xs text-neutral-400">
              {employee.type || "Team member"}
            </p>
          </div>
        </div>
      ),
    },
    { field: "employeeCode", headerName: "Employee ID" },
    { field: "resignationDate", headerName: "Resignation Date" },
    { field: "serviceEndDate", headerName: "Service End Date" },
    {
      field: "mode",
      headerName: "Mode",
      render: (value) => (
        <span
          className={`inline-flex whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold ${
            modeStyles[value] || "bg-surface-muted text-neutral-600"
          }`}
        >
          {value}
        </span>
      ),
    },
    { field: "reason", headerName: "Reason" },
    { field: "remarks", headerName: "Remarks" },
    {
      field: "actions",
      headerName: "Actions",
      align: "center",
      render: (_, employee) => (
        <div className="flex items-center justify-center gap-1.5">
          <button
            type="button"
            title={`Edit ${employee.name}`}
            aria-label={`Edit ${employee.name}`}
            onClick={() =>
              navigate(`/hr/released-employees/edit/${employee.id}`)
            }
            className="rounded-lg border border-border-default bg-white p-2 text-info shadow-sm transition hover:border-info-soft hover:bg-info-soft"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            title={`View ${employee.name}`}
            aria-label={`View ${employee.name}`}
            onClick={() =>
              navigate(`/hr/released-employees/view/${employee.id}`)
            }
            className="rounded-lg border border-border-default bg-white p-2 text-brand-teal-dark shadow-sm transition hover:border-brand-teal-soft hover:bg-brand-teal-soft"
          >
            <Eye size={15} />
          </button>
          <button
            type="button"
            title={`Delete ${employee.name}`}
            aria-label={`Delete ${employee.name}`}
            onClick={() => setDeleteTarget(employee)}
            className="rounded-lg border border-border-default bg-white p-2 text-danger shadow-sm transition hover:border-danger-soft hover:bg-danger-soft"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  const summaryCards = [
    { title: "Total Records", value: releasedEmployees.length, icon: Users, tone: "navy" },
    {
      title: "Released",
      value: releasedEmployees.filter((employee) => employee.mode === "Release").length,
      icon: UserCheck,
      tone: "green",
    },
    {
      title: "Terminated",
      value: releasedEmployees.filter((employee) => employee.mode === "Terminated").length,
      icon: UserX,
      tone: "red",
    },
    {
      title: "Lay off",
      value: releasedEmployees.filter((employee) => employee.mode === "Lay off").length,
      icon: BriefcaseBusiness,
      tone: "teal",
    },
  ];

  return (
    <main className="min-h-screen bg-page px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 text-xs font-medium text-neutral-500">
            Trigvent / Human Resources / Released Employees
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">
            Released Employee Listing
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Manage employee exits, release records, and service-end details.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/hr/released-employees/add")}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-brand-teal px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-teal-dark sm:self-auto"
        >
          <Plus size={18} />
          Add New
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-border-default/80 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="flex min-w-0 flex-col gap-1.5 text-sm font-medium text-neutral-600">
            Employee type
            <select
              value={employeeType}
              onChange={(event) => setEmployeeType(event.target.value)}
              className="min-w-0 rounded-full border border-border-default bg-white px-3 py-2 text-sm font-normal text-brand-navy outline-none focus:border-brand-teal"
            >
              <option value="all">All employee types</option>
              <option value="employee">Employees</option>
              <option value="intern">Interns</option>
            </select>
          </label>
          <p className="self-end pb-2 text-sm text-neutral-500">
            Showing {filteredEmployees.length} records
          </p>
        </div>

        <DataTable
          columns={columns}
          rows={filteredEmployees}
          rowKey="id"
          rowsPerPage={10}
          minWidth={1100}
          search
          searchPlaceholder="Search released employees..."
        />
      </section>

      <DeleteConfirmationDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          setReleasedEmployees((current) =>
            current.filter((employee) => employee.id !== deleteTarget.id)
          );
          setDeleteTarget(null);
        }}
        title="Delete released employee?"
        itemName={deleteTarget?.name}
        confirmLabel="Delete record"
      />
    </main>
  );
}
