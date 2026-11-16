
import {
  Pencil,
  Eye,
  Mail,
  Loader2,
} from "lucide-react";

import EmployeeStatusBadge from "./EmployeeStatusBadge";
import DataTable from "../../common/DataTable";

export default function EmployeeTable({
  employees = [],
  onEdit,
  onView,
  sortBy,
  sortOrder,
  onSort,
  loading = false,
  pagination,
  initialSearchValue,
  onSearch,
  searchDebounce,
  employeeStatus,
  employeeType,
  trainerType,
  onFilterChange,
  onToggleTrainer,
  trainerUpdating = {},
}) {
  const sortProps = (field) => ({
    sortable: true,
    sortActive: sortBy === field,
    sortDirection: sortOrder,
    onSort: () => onSort?.(field),
  });

  const tableColumns = [
    { field: "serialNumber", headerName: "SL", cellSx: { width: 70, color: "#94A3B8" }, render: (_, __, index) => index + 1 },
    { field: "id", headerName: "ID", ...sortProps("id") },
    { field: "employeeCode", headerName: "Employee ID", ...sortProps("employee_code"), render: (_, employee) => employee.employeeCode || employee.id },
    { field: "name", headerName: "Name", ...sortProps("name"), render: (_, employee) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-teal-soft text-xs font-bold text-brand-teal-dark">
          {employee.name?.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "NA"}
        </div>
        <div><p className="whitespace-nowrap font-semibold text-brand-navy">{employee.name}</p><p className="mt-0.5 text-xs text-neutral-400">{employee.designation || employee.role || "Team member"}</p></div>
      </div>
    )},
 
    { field: "email", headerName: "Email", ...sortProps("email"), render: (value) => <span className="flex items-center gap-2 whitespace-nowrap"><Mail size={14} className="shrink-0 text-neutral-400" />{value}</span> },
    { field: "role", headerName: "Role" },
    { field: "department", headerName: "Department", render: (value) => <span className="inline-flex whitespace-nowrap rounded-lg bg-surface-muted px-2.5 py-1 text-xs font-medium text-neutral-600">{value || "Unassigned"}</span> },
      { field: "joiningDate", headerName: "Joining Date", ...sortProps("joining_date"), cellSx: { whiteSpace: "nowrap" } },
    { field: "createdAt", headerName: "Created At", ...sortProps("created_at"), cellSx: { whiteSpace: "nowrap" } },
    { field: "workType", headerName: "Work Type" },
    { field: "active", headerName: "Status", render: (_, employee) => <EmployeeStatusBadge active={employee.active} /> },
    { field: "isTrainer", headerName: "Trainer", align: "center", render: (_, employee) => (
      trainerUpdating[employee.id] ? (
        <Loader2
          className="mx-auto animate-spin text-brand-teal"
          size={20}
          aria-label="Updating trainer status"
        />
      ) : (
        <label className="inline-flex cursor-pointer items-center justify-center">
          <input
            type="checkbox"
            checked={employee.isTrainer}
            onChange={(event) => onToggleTrainer?.(employee, event.target.checked)}
            aria-label={`${employee.isTrainer ? "Remove" : "Set"} ${employee.name} ${employee.isTrainer ? "as" : "as a"} trainer`}
            className="peer sr-only"
          />
          <span className="relative h-6 w-11 rounded-full bg-neutral-200 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:bg-brand-teal peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-teal" />
        </label>
      )
    )},
    { field: "actions", headerName: "Actions", align: "center", render: (_, employee) => (
      <div className="flex items-center justify-center gap-1.5">
        <button type="button" onClick={() => onEdit?.(employee)} title="Edit employee" aria-label={`Edit ${employee.name}`} className="rounded-lg border border-border-default bg-white p-2 text-info shadow-sm transition hover:bg-info-soft"><Pencil size={15} /></button>
        <button type="button" onClick={() => onView?.(employee)} title="View employee" aria-label={`View ${employee.name}`} className="rounded-lg border border-border-default bg-white p-2 text-brand-teal-dark shadow-sm transition hover:bg-brand-teal-soft"><Eye size={15} /></button>
      </div>
    )},
  ];

  return (
    <>
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <select
          aria-label="Filter by employee status"
          value={employeeStatus}
          onChange={(event) => onFilterChange?.("status", event.target.value)}
          className="min-w-0 rounded-full border border-border-default bg-white px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-teal"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
        <select
          aria-label="Filter by employee type"
          value={employeeType}
          onChange={(event) => onFilterChange?.("employeeType", event.target.value)}
          className="min-w-0 rounded-full border border-border-default bg-white px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-teal"
        >
          <option value="all">All</option>
          <option value="employees">Employees</option>
          <option value="interns">Interns</option>
        </select>
        <select
          aria-label="Filter by trainer status"
          value={trainerType}
          onChange={(event) => onFilterChange?.("trainerType", event.target.value)}
          className="min-w-0 rounded-full border border-border-default bg-white px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-teal"
        >
          <option value="all">All</option>
          <option value="non-trainers">Non Trainers</option>
          <option value="trainers">Trainers</option>
        </select>
      </div>
      <DataTable
        columns={tableColumns}
        rows={employees}
        rowKey="id"
        rowsPerPage={pagination?.perPage || employees.length || 1}
        minWidth={1100}
        loading={loading}
        pagination={pagination}
        search
        initialSearchValue={initialSearchValue}
        onSearch={onSearch}
        searchDebounce={searchDebounce}
        searchPlaceholder="Search employees by name, ID, email or department..."
      />
    </>
  );
}
