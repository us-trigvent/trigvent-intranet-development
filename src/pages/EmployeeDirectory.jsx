
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  UserPlus,
  UsersRound,
  X,
  Mail,
  Phone,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  ArrowUpDown,
} from "lucide-react";

import EmployeeCard from "../components/EmployeeCard";
import axiosInstance from "../api/axiosInstance";

// Sample data: replace with your employee API response.
const employees = [
  {
    id: 1,
    name: "Krishna Chopra",
    designation: "Software Engineer",
    department: "Engineering",
    email: "krishna.chopra@trigvent.com",
    phone: "+91 9756674382",
  },
  {
    id: 2,
    name: "Rohan Singh",
    designation: "Senior Software Engineer",
    department: "Engineering",
    email: "rohan.singh@trigvent.com",
    phone: "+91 9792557870",
  },
  {
    id: 3,
    name: "Ananya Gupta",
    designation: "Engineering Manager",
    department: "Engineering",
    email: "ananya.gupta@trigvent.com",
    phone: "+91 9828441358",
  },
  {
    id: 4,
    name: "Aadhya Rao",
    designation: "Product Designer",
    department: "Design",
    email: "aadhya.rao@trigvent.com",
    phone: "+91 9864324845",
  },
  {
    id: 5,
    name: "Isha Rao",
    designation: "UX Lead",
    department: "Design",
    email: "isha.rao@trigvent.com",
    phone: "+91 9812345678",
  },
  {
    id: 6,
    name: "Meera Sharma",
    designation: "HR Executive",
    department: "HR",
    email: "meera.sharma@trigvent.com",
    phone: "+91 9876543210",
  },
  {
    id: 7,
    name: "Riya Das",
    designation: "HR Manager",
    department: "HR",
    email: "riya.das@trigvent.com",
    phone: "+91 9876501234",
  },
  {
    id: 8,
    name: "Kiara Joshi",
    designation: "Sales Executive",
    department: "Sales",
    email: "kiara.joshi@trigvent.com",
    phone: "+91 9876512340",
  },
];

const departments = [
  "All Departments",
  "Engineering",
  "Design",
  "HR",
  "Sales",
  "Marketing",
  "Finance",
  "QA",
  "Operations",
];

const relationName = (value) =>
  typeof value === "object" && value !== null
    ? value.name || value.title || ""
    : value || "";

const field = (item, names) => {
  for (const name of names) {
    if (item?.[name] !== undefined && item?.[name] !== null) return item[name];
  }
  return undefined;
};

const normalizeEmployee = (item = {}) => ({
  ...item,
  id: field(item, ["id", "employee_id", "employeeId"]),
  name: field(item, ["name", "full_name", "employee_name"]) || "Unknown employee",
  email: field(item, ["email", "company_email"]) || "",
  phone: field(item, ["phone", "phone_number", "mobile", "contact_number"]) || "",
  avatar: field(item, ["avatar", "profile_photo", "profile_photo_url", "image"]) || "",
  department: relationName(field(item, ["department", "department_details"])),
  designation: relationName(field(item, ["designation", "designation_details"])),
});

const employeeRows = (payload) => {
  const candidates = [
    payload?.employees,
    payload?.data?.employees,
    payload?.data?.data,
    payload?.data,
  ];
  const rows = candidates.find(Array.isArray) || [];
  return rows.map(normalizeEmployee);
};

const normalizeOptions = (value) => {
  const rows = Array.isArray(value)
    ? value
    : Array.isArray(value?.data)
      ? value.data
      : [];
  return rows.map((item) => typeof item === "object"
    ? { id: item.id ?? item.value, name: item.name || item.title || item.label }
    : { id: item, name: String(item) })
    .filter((item) => item.id !== undefined && item.name);
};

const paginationData = (payload, fallbackPerPage) => {
  const container = payload?.data && !Array.isArray(payload.data) ? payload.data : {};
  const source = payload?.pagination || payload?.meta || container?.pagination ||
    container?.meta || container || {};
  return {
    page: Number(source.current_page || source.page || 1),
    perPage: Number(source.per_page || source.perPage || fallbackPerPage),
    total: Number(source.total || source.total_rec || source.total_records || 0),
    lastPage: Number(source.last_page || source.lastPage || 1),
  };
};

export default function EmployeeDirectory() {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [directoryEmployees, setDirectoryEmployees] = useState(employees);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 25,
    total: 0,
    lastPage: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get("/directory/employees", {
        params: {
          search,
          department_id: department || undefined,
          designation_id: designation || undefined,
          sort,
          order,
          page,
          per_page: perPage,
        },
      });
      const payload = response.data;
      const container = payload?.data && !Array.isArray(payload.data) ? payload.data : payload;
      setDirectoryEmployees(employeeRows(payload));
      setDepartmentOptions(normalizeOptions(
        container?.departments || container?.filters?.departments
      ));
      setDesignationOptions(normalizeOptions(
        container?.designations || container?.filters?.designations
      ));
      setPagination(paginationData(payload, perPage));
    } catch (requestError) {
      setDirectoryEmployees([]);
      setError(requestError.response?.data?.message || "Failed to load employees.");
    } finally {
      setLoading(false);
    }
  }, [department, designation, order, page, perPage, search, sort]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  const currentDepartments = useMemo(() => {
    if (departmentOptions.length) return departmentOptions;
    const apiFallback = [...new Map(directoryEmployees.map((item) => [
      item.department,
      { id: item.department, name: item.department },
    ])).values()].filter((item) => item.name);
    const staticFallback = departments
      .filter((name) => name !== "All Departments")
      .map((name) => ({ id: name, name }));
    return apiFallback.length ? apiFallback : staticFallback;
  }, [departmentOptions, directoryEmployees]);

  const currentDesignations = useMemo(() => {
    if (designationOptions.length) return designationOptions;
    return [...new Map(directoryEmployees.map((item) => [
      item.designation,
      { id: item.designation, name: item.designation },
    ])).values()].filter((item) => item.name);
  }, [designationOptions, directoryEmployees]);

  return (
    <div className="min-h-screen bg-page px-4 pb-8
      pt-20 sm:px-6 sm:pt-20 lg:px-8 lg:pt-8"
    >
      {/* Page Header */}
      <header className="mb-7 flex flex-col justify-between
        gap-5 sm:flex-row sm:items-center"
      >
        <div>
          <div className="mb-2 flex items-center gap-2
            text-xs font-medium text-neutral-500"
          >
            <span>Trigvent</span>
            <span className="text-neutral-300">/</span>
            <span className="text-brand-teal">
              Employee Directory
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight
            text-brand-navy sm:text-3xl"
          >
            Employee Directory
          </h1>

          <p className="mt-2 text-sm text-neutral-500 sm:text-base">
            Find and connect with your teammates across Trigvent.
          </p>
        </div>

        <Link
          to="/hr/add-employee"
          className="inline-flex w-fit items-center
            justify-center gap-2 rounded-xl bg-brand-teal
            px-4 py-3 text-sm font-semibold text-white
            shadow-sm transition-colors hover:bg-brand-teal-dark
            focus:outline-none focus:ring-2
            focus:ring-brand-teal focus:ring-offset-2"
        >
          <UserPlus size={18} />
          Add Employee
        </Link>
      </header>

      {/* Directory Summary */}
      {/* <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl
          border border-border-default/80 bg-white p-5 shadow-sm"
        >
          <div className="flex h-12 w-12 items-center
            justify-center rounded-xl bg-brand-teal-soft
            text-brand-teal"
          >
            <UsersRound size={23} />
          </div>

          <div>
            <p className="text-sm text-neutral-500">
              Total Employees
            </p>
            <p className="mt-1 text-2xl font-semibold text-brand-navy">
              {pagination.total || employees.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl
          border border-border-default/80 bg-white p-5 shadow-sm"
        >
          <div className="flex h-12 w-12 items-center
            justify-center rounded-xl bg-info-soft text-info-dark"
          >
            <Building2 size={23} />
          </div>

          <div>
            <p className="text-sm text-neutral-500">
              Departments
            </p>
            <p className="mt-1 text-2xl font-semibold text-brand-navy">
              {currentDepartments.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl
          border border-border-default/80 bg-white p-5 shadow-sm"
        >
          <div className="flex h-12 w-12 items-center
            justify-center rounded-xl bg-violet-soft text-violet-dark"
          >
            <BriefcaseBusiness size={23} />
          </div>

          <div>
            <p className="text-sm text-neutral-500">
              Matching Employees
            </p>
            <p className="mt-1 text-2xl font-semibold text-brand-navy">
              {directoryEmployees.length}
            </p>
          </div>
        </div>
      </div> */}

      {/* Search and Filter */}
      <section className="mb-6 rounded-2xl border
        border-border-default/80 bg-white p-4 shadow-sm sm:p-5"
      >
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2
                -translate-y-1/2 text-neutral-400"
            />

            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by name, designation, email..."
              aria-label="Search employees"
              className="h-12 w-full rounded-xl border
                border-border-default bg-surface-subtle/70 pl-11 pr-4
                text-sm text-text-secondary outline-none
                transition placeholder:text-neutral-400
                focus:border-brand-teal focus:bg-white
                focus:ring-4 focus:ring-brand-teal/10"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={department}
              onChange={(event) => {
                setDepartment(event.target.value);
                setPage(1);
              }}
              aria-label="Filter by department"
              className="h-12 min-w-0 rounded-xl border
                border-border-default bg-white px-4 text-sm
                text-text-secondary outline-none transition
                focus:border-brand-teal focus:ring-4
                focus:ring-brand-teal/10 sm:min-w-[210px]"
            >
              <option value="">All Departments</option>
              {currentDepartments.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <select
              value={designation}
              onChange={(event) => {
                setDesignation(event.target.value);
                setPage(1);
              }}
              aria-label="Filter by designation"
              className="h-12 min-w-0 rounded-xl border border-border-default bg-white px-4 text-sm text-text-secondary outline-none transition focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 sm:min-w-[210px]"
            >
              <option value="">All Designations</option>
              {currentDesignations.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
                setPage(1);
              }}
              aria-label="Sort employees"
              className="h-12 rounded-xl border border-border-default bg-white px-4 text-sm text-text-secondary outline-none transition focus:border-brand-teal"
            >
              <option value="name">Sort by name</option>
              <option value="designation">Sort by designation</option>
              <option value="department">Sort by department</option>
              <option value="email">Sort by email</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setOrder((current) => current === "asc" ? "desc" : "asc");
                setPage(1);
              }}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border-default px-4 text-sm font-medium text-neutral-600 transition hover:bg-surface-subtle"
              aria-label={`Sort ${order === "asc" ? "descending" : "ascending"}`}
            >
              <ArrowUpDown size={16} />
              {order === "asc" ? "Ascending" : "Descending"}
            </button>

            {(searchInput || department || designation) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSearchInput("");
                  setDepartment("");
                  setDesignation("");
                  setPage(1);
                }}
                className="inline-flex h-12 items-center
                  justify-center gap-2 rounded-xl
                  border border-border-default px-4 text-sm
                  font-medium text-neutral-600 transition
                  hover:bg-surface-subtle"
              >
                <X size={16} />
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center
          justify-between gap-3"
        >
          <p className="text-sm text-neutral-500">
            Showing{" "}
            <span className="font-semibold text-text-secondary">
              {directoryEmployees.length}
            </span>{" "}
            of {pagination.total || employees.length} employees
          </p>

          <span className="inline-flex items-center gap-2
            text-xs font-medium text-neutral-500"
          >
            <span className="h-2 w-2 rounded-full bg-brand-teal" />
            Employee directory
          </span>
        </div>
      </section>

      {/* Employee Cards */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-border-default bg-white">
          <LoaderCircle className="animate-spin text-brand-teal" size={30} />
          <span className="ml-3 text-sm text-neutral-500">Loading employees...</span>
        </div>
      ) : error ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-danger-soft bg-white px-6 text-center">
          <h2 className="text-lg font-semibold text-brand-navy">Unable to load employees</h2>
          <p className="mt-2 text-sm text-danger">{error}</p>
          <button type="button" onClick={loadEmployees} className="mt-5 rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-medium text-white">
            Try again
          </button>
        </div>
      ) : directoryEmployees.length > 0 ? (
        <div className="grid grid-cols-1 gap-5
          sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
          {directoryEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onViewProfile={setSelectedEmployee}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[300px] flex-col
          items-center justify-center rounded-2xl
          border border-dashed border-border-strong
          bg-white px-6 py-12 text-center"
        >
          <div className="mb-4 flex h-14 w-14 items-center
            justify-center rounded-2xl bg-brand-teal-soft
            text-brand-teal"
          >
            <UsersRound size={27} />
          </div>

          <h2 className="text-lg font-semibold text-brand-navy">
            No employees found
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
            Try another name or designation, or choose a different department.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSearchInput("");
              setDepartment("");
              setDesignation("");
            }}
            className="mt-5 rounded-xl bg-brand-navy
              px-4 py-2.5 text-sm font-medium
              text-white transition hover:bg-navy-light"
          >
            Reset filters
          </button>
        </div>
      )}

      {!loading && !error && pagination.total > 0 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-border-default bg-white px-4 py-3 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span>Rows per page</span>
            <select
              value={perPage}
              onChange={(event) => {
                setPerPage(Number(event.target.value));
                setPage(1);
              }}
              className="rounded-lg border border-border-default px-2 py-1.5 text-text-secondary outline-none"
              aria-label="Rows per page"
            >
              {[10, 25, 50].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-500">
              Page {pagination.page || page} of {Math.max(pagination.lastPage || 1, 1)}
            </span>
            <button
              type="button"
              disabled={(pagination.page || page) <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded-lg border border-border-default p-2 text-neutral-600 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              disabled={(pagination.page || page) >= (pagination.lastPage || 1)}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-lg border border-border-default p-2 text-neutral-600 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Employee Profile Modal */}
      {selectedEmployee && (
        <div
          className="fixed inset-0 z-[60] flex items-center
            justify-center bg-navy-dark/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedEmployee(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="employee-profile-title"
            className="w-full max-w-md overflow-hidden
              rounded-2xl border border-border-default
              bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between
              border-b border-border-light px-5 py-4"
            >
              <h2
                id="employee-profile-title"
                className="text-lg font-semibold text-brand-navy"
              >
                Employee Profile
              </h2>

              <button
                type="button"
                onClick={() => setSelectedEmployee(null)}
                aria-label="Close employee profile"
                className="rounded-lg p-2 text-neutral-400
                  transition hover:bg-surface-muted hover:text-text-secondary"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col items-center text-center">
                {selectedEmployee.avatar ? (
                  <img
                    src={selectedEmployee.avatar}
                    alt={selectedEmployee.name}
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center
                    justify-center rounded-2xl bg-brand-teal-soft
                    text-2xl font-semibold text-brand-teal-dark"
                  >
                    {selectedEmployee.name
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                )}

                <h3 className="mt-4 text-xl font-semibold text-brand-navy">
                  {selectedEmployee.name}
                </h3>

                <p className="mt-1 text-sm text-neutral-500">
                  {selectedEmployee.designation}
                </p>

                <span className="mt-3 rounded-full
                  bg-brand-teal-soft px-3 py-1.5 text-xs
                  font-medium text-brand-teal-dark"
                >
                  {selectedEmployee.department}
                </span>
              </div>

              <div className="mt-6 space-y-4 rounded-xl
                bg-surface-subtle p-4"
              >
                <div className="flex items-start gap-3">
                  <Mail size={18} className="mt-0.5 text-brand-teal" />
                  <div className="min-w-0">
                    <p className="text-xs text-neutral-400">Email address</p>
                    <p className="mt-1 break-all text-sm text-text-secondary">
                      {selectedEmployee.email || "Not available"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={18} className="mt-0.5 text-brand-teal" />
                  <div>
                    <p className="text-xs text-neutral-400">Phone number</p>
                    <p className="mt-1 text-sm text-text-secondary">
                      {selectedEmployee.phone || "Not available"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BriefcaseBusiness
                    size={18}
                    className="mt-0.5 text-brand-teal"
                  />
                  <div>
                    <p className="text-xs text-neutral-400">Employee ID</p>
                    <p className="mt-1 text-sm text-text-secondary">
                      TRG-{String(selectedEmployee.id).padStart(4, "0")}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEmployee(null)}
                className="mt-5 w-full rounded-xl
                  bg-brand-navy px-4 py-3 text-sm
                  font-semibold text-white transition
                  hover:bg-navy-light"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-8 border-t border-border-default
        pt-5 text-center text-xs text-neutral-400"
      >
        Trigvent Solutions · Employee Directory
      </footer>
    </div>
  );
}
