
import {
  Pencil,
  Eye,
  Trash2,
  Users,
  Mail,
} from "lucide-react";

import EmployeeStatusBadge from "./EmployeeStatusBadge";
import DataTable from "../../common/DataTable";

export default function EmployeeTable({
  employees = [],
  onEdit,
  onView,
  onDelete,
  onToggleTrainer,
  sortBy,
  sortOrder,
  onSort,
}) {
  const sortProps = (field) => ({
    sortable: true,
    sortActive: sortBy === field,
    sortDirection: sortOrder,
    onSort: () => onSort?.(field),
  });

  if (!employees.length) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-muted text-neutral-400">
          <Users size={26} />
        </div>

        <h3 className="mt-4 text-base font-semibold text-brand-navy">
          No employees found
        </h3>

        <p className="mt-1 max-w-sm text-sm text-neutral-500">
          Try changing your filters or search for another employee.
        </p>
      </div>
    );
  }

  const tableColumns = [
    { field: "serialNumber", headerName: "SL", cellSx: { width: 70, color: "#94A3B8" }, render: (_, __, index) => index + 1 },
    { field: "employeeCode", headerName: "Employee ID", ...sortProps("employeeCode"), render: (_, employee) => employee.employeeCode || employee.id },
    { field: "name", headerName: "Name", ...sortProps("name"), render: (_, employee) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-teal-soft text-xs font-bold text-brand-teal-dark">
          {employee.name?.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "NA"}
        </div>
        <div><p className="whitespace-nowrap font-semibold text-brand-navy">{employee.name}</p><p className="mt-0.5 text-xs text-neutral-400">{employee.designation || employee.role || "Team member"}</p></div>
      </div>
    )},
    { field: "email", headerName: "Email", ...sortProps("email"), render: (value) => <span className="flex items-center gap-2 whitespace-nowrap"><Mail size={14} className="shrink-0 text-neutral-400" />{value}</span> },
    { field: "role", headerName: "Role", ...sortProps("role") },
    { field: "department", headerName: "Department", ...sortProps("department"), render: (value) => <span className="inline-flex whitespace-nowrap rounded-lg bg-surface-muted px-2.5 py-1 text-xs font-medium text-neutral-600">{value || "Unassigned"}</span> },
    { field: "workType", headerName: "Work Type", ...sortProps("workType") },
    { field: "active", headerName: "Status", render: (_, employee) => <EmployeeStatusBadge active={employee.active} /> },
    { field: "isTrainer", headerName: "Trainer", align: "center", render: (_, employee) => (
      <input type="checkbox" checked={Boolean(employee.isTrainer)} onChange={() => onToggleTrainer?.(employee)} aria-label={`Toggle trainer for ${employee.name}`} className="h-4 w-4 cursor-pointer accent-brand-teal" />
    )},
    { field: "actions", headerName: "Actions", align: "center", render: (_, employee) => (
      <div className="flex items-center justify-center gap-1.5">
        <button type="button" onClick={() => onEdit?.(employee)} title="Edit employee" aria-label={`Edit ${employee.name}`} className="rounded-lg border border-border-default bg-white p-2 text-info shadow-sm transition hover:bg-info-soft"><Pencil size={15} /></button>
        <button type="button" onClick={() => onView?.(employee)} title="View employee" aria-label={`View ${employee.name}`} className="rounded-lg border border-border-default bg-white p-2 text-brand-teal-dark shadow-sm transition hover:bg-brand-teal-soft"><Eye size={15} /></button>
        <button type="button" onClick={() => onDelete?.(employee)} title="Delete employee" aria-label={`Delete ${employee.name}`} className="rounded-lg border border-border-default bg-white p-2 text-danger shadow-sm transition hover:bg-danger-soft"><Trash2 size={15} /></button>
      </div>
    )},
  ];

  return (
    <DataTable
      columns={tableColumns}
      rows={employees}
      rowKey="id"
      rowsPerPage={employees.length || 1}
      minWidth={1100}
      showPagination={false}
    />
  );
}
