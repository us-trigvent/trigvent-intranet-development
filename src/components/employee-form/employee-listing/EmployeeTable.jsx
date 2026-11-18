
import {
  Archive,
  ArchiveRestore,
  Pencil,
  Eye,
  Mail,
  Loader2,
} from "lucide-react";

import EmployeeStatusBadge from "./EmployeeStatusBadge";
import Button from "../../common/Button";
import DataTable from "../../common/DataTable";

export default function EmployeeTable({
  employees = [],
  onEdit,
  onView,
  onArchive,
  onUnarchive,
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
  onToggleStatus,
  trainerUpdating = {},
  statusUpdating = {},
  archiving = {},
  unarchiving = {},
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
    { field: "active", headerName: "Status", align: "center", render: (_, employee) => (
      <button
        type="button"
        onClick={() => onToggleStatus?.(employee, !employee.active)}
        disabled={Boolean(statusUpdating[employee.id])}
        aria-label={`Set ${employee.name} as ${
          employee.active ? "inactive" : "active"
        }`}
        title={`Click to set ${employee.active ? "inactive" : "active"}`}
        className="rounded-full focus:outline-none focus:ring-2
          focus:ring-brand-teal focus:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-60"
      >
        {statusUpdating[employee.id] ? (
          <span className="inline-flex items-center gap-1.5 rounded-full
            bg-surface-muted px-2.5 py-1 text-xs font-semibold text-neutral-500"
          >
            <Loader2
              className="animate-spin"
              size={14}
              aria-hidden="true"
            />
            Updating
          </span>
        ) : (
          <EmployeeStatusBadge active={employee.active} />
        )}
      </button>
    )},
    { field: "isTrainer", headerName: "Trainer", align: "center", render: (_, employee) => (
      trainerUpdating[employee.id] ? (
        <Loader2
          className="mx-auto animate-spin text-brand-teal"
          size={20}
          aria-label="Updating trainer status"
        />
      ) : (
      <label className="relative inline-flex items-center cursor-pointer shrink-0">
  <input
    type="checkbox"
    checked={employee.isTrainer}
    onChange={(event) =>
      onToggleTrainer?.(employee, event.target.checked)
    }
    aria-label={`Set ${employee.name} as trainer`}
    className="peer sr-only"
  />

  <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500
    after:content-[''] after:absolute after:top-0.5 after:left-0.5
    after:bg-white after:rounded-full after:h-5 after:w-5
    after:transition-all peer-checked:after:translate-x-5">
  </div>
</label>
      )
    )},
    { field: "actions", headerName: "Actions", align: "center", render: (_, employee) => (
      <div className="flex items-center justify-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit?.(employee)}
          title="Edit employee"
          aria-label={`Edit ${employee.name}`}
          className="text-info hover:bg-info-soft"
        >
          <Pencil size={15} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onView?.(employee)}
          title="View employee"
          aria-label={`View ${employee.name}`}
          className="text-brand-teal-dark hover:bg-brand-teal-soft"
        >
          <Eye size={15} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            employee.archived
              ? onUnarchive?.(employee)
              : onArchive?.(employee)
          }
          title={employee.archived ? "Unarchive employee" : "Archive employee"}
          aria-label={`${employee.archived ? "Unarchive" : "Archive"} ${employee.name}`}
          disabled={
            employee.archived
              ? Boolean(unarchiving[employee.id])
              : Boolean(archiving[employee.id])
          }
          className={
            employee.archived
              ? "text-brand-teal-dark hover:bg-brand-teal-soft"
              : "text-warning-dark hover:bg-warning-soft"
          }
        >
          {archiving[employee.id] || unarchiving[employee.id] ? (
            <Loader2 size={15} className="animate-spin" />
          ) : employee.archived ? (
            <ArchiveRestore size={15} />
          ) : (
            <Archive size={15} />
          )}
        </Button>
      </div>
    )},
  ];

  return (
    <>
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label className="flex min-w-0 flex-col gap-1.5 text-sm font-medium text-neutral-600">
          Employee status
          <select
            value={employeeStatus}
            onChange={(event) => onFilterChange?.("status", event.target.value)}
            className="min-w-0 rounded-full border border-border-default bg-white px-3 py-2 text-sm font-normal text-brand-navy outline-none focus:border-brand-teal"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label className="flex min-w-0 flex-col gap-1.5 text-sm font-medium text-neutral-600">
          Employee type
          <select
            value={employeeType}
            onChange={(event) => onFilterChange?.("employeeType", event.target.value)}
            className="min-w-0 rounded-full border border-border-default bg-white px-3 py-2 text-sm font-normal text-brand-navy outline-none focus:border-brand-teal"
          >
            <option value="all">All</option>
            <option value="employees">Employees</option>
            <option value="interns">Interns</option>
          </select>
        </label>
        <label className="flex min-w-0 flex-col gap-1.5 text-sm font-medium text-neutral-600">
          Trainer status
          <select
            value={trainerType}
            onChange={(event) => onFilterChange?.("trainerType", event.target.value)}
            className="min-w-0 rounded-full border border-border-default bg-white px-3 py-2 text-sm font-normal text-brand-navy outline-none focus:border-brand-teal"
          >
            <option value="all">All</option>
            <option value="non-trainers">Non Trainers</option>
            <option value="trainers">Trainers</option>
          </select>
        </label>
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
