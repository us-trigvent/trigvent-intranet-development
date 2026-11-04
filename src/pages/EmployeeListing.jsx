import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  GraduationCap,
  RotateCcw,
} from "lucide-react";

import EmployeeTable from "../components/employee-form/employee-listing/EmployeeTable";

const initialEmployees = [
  {
    id: 87564,
    employeeCode: "87564",
    name: "A B",
    email: "qualityanalyst8295@gmail.com",
    role: "Employee",
    department: "Management",
    workType: "Onsite",
    active: false,
    isTrainer: false,
    type: "Employee",
  },
  {
    id: 5345355,
    employeeCode: "5345355",
    name: "Admin",
    email: "nitinsaluja@trigvent.com",
    role: "Super-Admin",
    department: "Miscellaneous",
    workType: "Onsite",
    active: true,
    isTrainer: false,
    type: "Employee",
  },
  {
    id: 6,
    employeeCode: "6",
    name: "Harpreet Singh",
    email: "harpreet@trigvent.com",
    role: "HR",
    department: "Sales & Marketing",
    workType: "Onsite",
    active: true,
    isTrainer: true,
    type: "Employee",
  },
  {
    id: 5,
    employeeCode: "5",
    name: "John Carter",
    email: "john.carter@trigvent.com",
    role: "Employee",
    department: "Mobile Development",
    workType: "Remote",
    active: true,
    isTrainer: false,
    type: "Employee",
  },
  {
    id: 62,
    employeeCode: "62",
    name: "Kaim Chawla",
    email: "kamakshi+895@trigvent.com",
    role: "HR",
    department: "Quality Assurance",
    workType: "Remote",
    active: true,
    isTrainer: false,
    type: "Employee",
  },
  {
    id: 703,
    employeeCode: "703",
    name: "New Intern",
    email: "intern@gmail.com",
    role: "Intern",
    department: "Business Development",
    workType: "Onsite",
    active: true,
    isTrainer: false,
    type: "Intern",
  },
  {
    id: 98765,
    employeeCode: "98765",
    name: "Office Admin",
    email: "officeadmin@trigvent.com",
    role: "Employee",
    department: "Management",
    workType: "Onsite",
    active: true,
    isTrainer: false,
    type: "Employee",
  },
];

const filterClass =
  "min-w-0 w-full rounded-xl border border-border-default bg-white px-3.5 py-3 text-sm text-text-secondary outline-none transition focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10";

function SummaryCard({ title, value, icon: Icon, tone }) {
  const tones = {
    navy: "bg-info-soft text-brand-navy",
    teal: "bg-brand-teal-soft text-brand-teal-dark",
    green: "bg-success-soft text-success-dark",
    red: "bg-danger-soft text-danger",
  };

  return (
    <div className="rounded-2xl border border-border-default/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
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

export default function EmployeeListing() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState(initialEmployees);
  const [employeeType, setEmployeeType] = useState("All");
  const [status, setStatus] = useState("All");
  const [department, setDepartment] = useState("All");
  const [workType, setWorkType] = useState("All");
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("10");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const departments = useMemo(
    () => [...new Set(employees.map((item) => item.department).filter(Boolean))],
    [employees]
  );

  const filteredEmployees = useMemo(() => {
    const query = keyword.trim().toLowerCase();

    return employees
      .filter((employee) => {
        const matchesType =
          employeeType === "All" || employee.type === employeeType;

        const matchesStatus =
          status === "All" ||
          (status === "Active" && employee.active) ||
          (status === "Inactive" && !employee.active);

        const matchesDepartment =
          department === "All" || employee.department === department;

        const matchesWorkType =
          workType === "All" || employee.workType === workType;

        const matchesKeyword =
          !query ||
          [
            employee.name,
            employee.email,
            employee.employeeCode,
            employee.role,
            employee.department,
          ].some((value) => String(value || "").toLowerCase().includes(query));

        return (
          matchesType &&
          matchesStatus &&
          matchesDepartment &&
          matchesWorkType &&
          matchesKeyword
        );
      })
      .sort((a, b) => {
        const first = String(a[sortBy] ?? "").toLowerCase();
        const second = String(b[sortBy] ?? "").toLowerCase();

        const comparison = first.localeCompare(second, undefined, {
          numeric: true,
        });

        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [
    employees,
    employeeType,
    status,
    department,
    workType,
    keyword,
    sortBy,
    sortOrder,
  ]);

  const activeCount = employees.filter((employee) => employee.active).length;
  const inactiveCount = employees.length - activeCount;
  const internCount = employees.filter((employee) => employee.type === "Intern").length;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEmployees.length / Number(pageSize))
  );

  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * Number(pageSize);

  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + Number(pageSize)
  );

  const updateFilter = (setter) => (event) => {
    setter(event.target.value);
    setPage(1);
  };

  const resetFilters = () => {
    setEmployeeType("All");
    setStatus("All");
    setDepartment("All");
    setWorkType("All");
    setKeyword("");
    setPage(1);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder((current) => current === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleToggleTrainer = (employee) => {
    setEmployees((current) =>
      current.map((item) =>
        item.id === employee.id
          ? { ...item, isTrainer: !item.isTrainer }
          : item
      )
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    setEmployees((current) =>
      current.filter((employee) => employee.id !== deleteTarget.id)
    );

    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-page px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      {/* Page heading */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 text-xs font-medium text-neutral-500">
            Trigvent / Human Resources / Employee Listing
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">
            Employee Listing
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Manage employee and intern records from one place.
          </p>
        </div>

        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-border-default bg-white px-4 py-2.5 text-sm font-semibold text-neutral-600 transition hover:bg-surface-subtle sm:self-auto"
        >
          <RotateCcw size={16} />
          Reset filters
        </button>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Records" value={employees.length} icon={Users} tone="navy" />
        <SummaryCard title="Active" value={activeCount} icon={UserCheck} tone="green" />
        <SummaryCard title="Inactive" value={inactiveCount} icon={UserX} tone="red" />
        <SummaryCard title="Interns" value={internCount} icon={GraduationCap} tone="teal" />
      </div>

      {/* Listing panel */}
      <section className="overflow-hidden rounded-2xl border border-border-default/80 bg-white shadow-sm">
        <div className="border-b border-border-light p-4 sm:p-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-brand-navy">
              All employee records
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Search, filter and manage your workforce.
            </p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <select
              value={employeeType}
              onChange={updateFilter(setEmployeeType)}
              className={filterClass}
              aria-label="Filter by employee type"
            >
              <option value="All">All employee types</option>
              <option value="Employee">Employees</option>
              <option value="Intern">Interns</option>
            </select>

            <select
              value={status}
              onChange={updateFilter(setStatus)}
              className={filterClass}
              aria-label="Filter by status"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              value={department}
              onChange={updateFilter(setDepartment)}
              className={filterClass}
              aria-label="Filter by department"
            >
              <option value="All">All departments</option>
              {departments.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <select
              value={workType}
              onChange={updateFilter(setWorkType)}
              className={filterClass}
              aria-label="Filter by work type"
            >
              <option value="All">All work types</option>
              <option value="Onsite">Onsite</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          {/* Search */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <input
                type="search"
                value={keyword}
                onChange={(event) => {
                  setKeyword(event.target.value);
                  setPage(1);
                }}
                placeholder="Search by name, employee ID, email or department..."
                className="w-full rounded-xl border border-border-default bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-sm text-neutral-500">
                Show
              </span>

              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(event.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-border-default bg-white px-3 py-3 text-sm text-text-secondary outline-none focus:border-brand-teal"
                aria-label="Rows per page"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reusable table */}
        <EmployeeTable
          employees={paginatedEmployees}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onEdit={(employee) => navigate(`/hr/edit-employee/${employee.id}`)}
          onView={(employee) => navigate(`/hr/employee/${employee.id}`)}
          onDelete={(employee) => setDeleteTarget(employee)}
          onToggleTrainer={handleToggleTrainer}
        />
      </section>

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-navy-dark/40 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-danger-soft text-danger">
              <UserX size={23} />
            </div>

            <h2 id="delete-title" className="mt-4 text-lg font-semibold text-brand-navy">
              Delete employee?
            </h2>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-text-secondary">
                {deleteTarget.name}
              </span>
              ? This will remove the record from this UI's local state.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-border-default px-4 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-surface-subtle"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl bg-danger px-4 py-2.5 text-sm font-semibold text-white hover:bg-danger-dark"
              >
                Delete record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
