import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ShieldBan, ShieldCheck, UsersRound } from "lucide-react";
import DataTable from "../components/common/DataTable";

const blacklistRecords = [
  {
    id: 1,
    referenceId: "BL-2026-001",
    employee: "Rahul Gupta",
    entryType: "Employee",
    email: "rahul@trigvent.com",
    department: "Engineering",
    designation: "Software Engineer",
    date: "29-10-2026",
    mobileNumber: "9876543210",
    status: "Active",
    reason: "Policy violation and repeated misconduct",
  },
  {
    id: 2,
    referenceId: "BL-2026-002",
    employee: "Priya Sharma",
    entryType: "Employee",
    email: "priya@trigvent.com",
    department: "Human Resources",
    designation: "HR Executive",
    date: "28-10-2026",
    mobileNumber: "9876543211",
    status: "Active",
    reason: "Background verification discrepancy",
  },
  {
    id: 3,
    referenceId: "BL-2026-003",
    employee: "Arjun Mehta",
    entryType: "Intern",
    email: "arjun@trigvent.com",
    department: "Design",
    designation: "Intern",
    date: "25-10-2026",
    mobileNumber: "9876543212",
    status: "Removed",
    reason: "Record reviewed and blacklist removed",
  },
];

export default function BlacklistListing() {
  const navigate = useNavigate();
  const [entryType, setEntryType] = useState("All");
  const [status, setStatus] = useState("All");

  const filteredRecords = useMemo(
    () =>
      blacklistRecords.filter((record) => {
        const matchesType = entryType === "All" || record.entryType === entryType;
        const matchesStatus = status === "All" || record.status === status;
        return matchesType && matchesStatus;
      }),
    [entryType, status]
  );

  const columns = useMemo(
    () => [
      { field: "referenceId", headerName: "Reference ID" },
      {
        field: "employee",
        headerName: "Employee",
        render: (value, row) => (
          <div>
            <p className="font-semibold text-brand-navy">{value}</p>
            <p className="mt-0.5 text-xs text-neutral-500">{row.entryType}</p>
          </div>
        ),
      },
      { field: "email", headerName: "Email" },
      { field: "department", headerName: "Department" },
      { field: "designation", headerName: "Designation" },
      { field: "date", headerName: "Blacklisted On" },
      {
        field: "status",
        headerName: "Status",
        align: "center",
        render: (value) => (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
              value === "Active"
                ? "bg-danger-soft text-danger-dark"
                : "bg-success-soft text-success-dark"
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        field: "reason",
        headerName: "Reason",
        render: (value) => (
          <span className="block max-w-xs whitespace-normal leading-5" title={value}>
            {value}
          </span>
        ),
      },
    ],
    []
  );

  const activeCount = blacklistRecords.filter((record) => record.status === "Active").length;

  return (
    <main className="min-h-screen bg-page px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-neutral-500">
        <span>Trigvent</span>
        <span className="text-neutral-300">/</span>
        <span>Human Resources</span>
        <span className="text-neutral-300">/</span>
        <span className="text-brand-teal">Blacklist Listing</span>
      </div>

      <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-teal-soft text-brand-teal">
              <ShieldBan size={23} />
            </span>
            Blacklist Listing
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Review and manage employee and intern blacklist records.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/hr/add-to-blacklist")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-teal px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-teal-dark"
        >
          <Plus size={18} />
          Add to Blacklist
        </button>
      </header>

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Records", value: blacklistRecords.length, icon: UsersRound, tone: "bg-info-soft text-info" },
          { label: "Active Blacklist", value: activeCount, icon: ShieldBan, tone: "bg-danger-soft text-danger" },
          { label: "Removed", value: blacklistRecords.length - activeCount, icon: ShieldCheck, tone: "bg-success-soft text-success" },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="flex items-center justify-between rounded-2xl border border-border-default/80 bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm text-neutral-500">{label}</p>
              <p className="mt-2 text-2xl font-bold text-brand-navy">{value}</p>
            </div>
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
              <Icon size={21} />
            </span>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-border-default/80 bg-white shadow-sm">
        <div className="border-b border-border-light px-5 py-5 sm:px-6">
          <h2 className="text-base font-semibold text-brand-navy">Blacklist Records</h2>
          <p className="mt-1 text-sm text-neutral-500">Search records and filter by entry type or status.</p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <select
              value={entryType}
              onChange={(event) => setEntryType(event.target.value)}
              aria-label="Filter by entry type"
              className="rounded-xl border border-border-default bg-white px-3.5 py-3 text-sm text-text-secondary outline-none focus:border-brand-teal"
            >
              <option value="All">All Entry Types</option>
              <option value="Employee">Employee</option>
              <option value="Intern">Intern</option>
            </select>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              aria-label="Filter by status"
              className="rounded-xl border border-border-default bg-white px-3.5 py-3 text-sm text-text-secondary outline-none focus:border-brand-teal"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Removed">Removed</option>
            </select>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <DataTable
            columns={columns}
            rows={filteredRecords}
            rowKey="id"
            rowsPerPage={10}
            showSearch
            searchPlaceholder="Search blacklist records..."
          />
        </div>
      </section>
    </main>
  );
}
