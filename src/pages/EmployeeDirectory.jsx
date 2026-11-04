
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  UserPlus,
  UsersRound,
  X,
  Mail,
  Phone,
  BriefcaseBusiness,
  Building2,
} from "lucide-react";

import EmployeeCard from "../components/EmployeeCard";

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

export default function EmployeeDirectory() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch =
        !query ||
        employee.name.toLowerCase().includes(query) ||
        employee.designation.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        employee.department.toLowerCase().includes(query);

      const matchesDepartment =
        department === "All Departments" ||
        employee.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [search, department]);

  return (
    <div className="min-h-screen bg-[#F5F8FC] px-4 pb-8
      pt-20 sm:px-6 sm:pt-20 lg:px-8 lg:pt-8"
    >
      {/* Page Header */}
      <header className="mb-7 flex flex-col justify-between
        gap-5 sm:flex-row sm:items-center"
      >
        <div>
          <div className="mb-2 flex items-center gap-2
            text-xs font-medium text-slate-500"
          >
            <span>Trigvent</span>
            <span className="text-slate-300">/</span>
            <span className="text-[#0D9999]">
              Employee Directory
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight
            text-[#203D61] sm:text-3xl"
          >
            Employee Directory
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Find and connect with your teammates across Trigvent.
          </p>
        </div>

        <Link
          to="/hr/add-employee"
          className="inline-flex w-fit items-center
            justify-center gap-2 rounded-xl bg-[#0D9999]
            px-4 py-3 text-sm font-semibold text-white
            shadow-sm transition-colors hover:bg-[#087F80]
            focus:outline-none focus:ring-2
            focus:ring-[#0D9999] focus:ring-offset-2"
        >
          <UserPlus size={18} />
          Add Employee
        </Link>
      </header>

      {/* Directory Summary */}
      {/* <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl
          border border-slate-200/80 bg-white p-5 shadow-sm"
        >
          <div className="flex h-12 w-12 items-center
            justify-center rounded-xl bg-[#E8F7F6]
            text-[#0D9999]"
          >
            <UsersRound size={23} />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Total Employees
            </p>
            <p className="mt-1 text-2xl font-semibold text-[#203D61]">
              {employees.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl
          border border-slate-200/80 bg-white p-5 shadow-sm"
        >
          <div className="flex h-12 w-12 items-center
            justify-center rounded-xl bg-blue-50 text-blue-700"
          >
            <Building2 size={23} />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Departments
            </p>
            <p className="mt-1 text-2xl font-semibold text-[#203D61]">
              {new Set(employees.map((employee) => employee.department)).size}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl
          border border-slate-200/80 bg-white p-5 shadow-sm"
        >
          <div className="flex h-12 w-12 items-center
            justify-center rounded-xl bg-violet-50 text-violet-700"
          >
            <BriefcaseBusiness size={23} />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Matching Employees
            </p>
            <p className="mt-1 text-2xl font-semibold text-[#203D61]">
              {filteredEmployees.length}
            </p>
          </div>
        </div>
      </div> */}

      {/* Search and Filter */}
      <section className="mb-6 rounded-2xl border
        border-slate-200/80 bg-white p-4 shadow-sm sm:p-5"
      >
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2
                -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, designation, email..."
              aria-label="Search employees"
              className="h-12 w-full rounded-xl border
                border-slate-200 bg-slate-50/70 pl-11 pr-4
                text-sm text-slate-700 outline-none
                transition placeholder:text-slate-400
                focus:border-[#0D9999] focus:bg-white
                focus:ring-4 focus:ring-[#0D9999]/10"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              aria-label="Filter by department"
              className="h-12 min-w-0 rounded-xl border
                border-slate-200 bg-white px-4 text-sm
                text-slate-700 outline-none transition
                focus:border-[#0D9999] focus:ring-4
                focus:ring-[#0D9999]/10 sm:min-w-[210px]"
            >
              {departments.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {(search || department !== "All Departments") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setDepartment("All Departments");
                }}
                className="inline-flex h-12 items-center
                  justify-center gap-2 rounded-xl
                  border border-slate-200 px-4 text-sm
                  font-medium text-slate-600 transition
                  hover:bg-slate-50"
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
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filteredEmployees.length}
            </span>{" "}
            of {employees.length} employees
          </p>

          <span className="inline-flex items-center gap-2
            text-xs font-medium text-slate-500"
          >
            <span className="h-2 w-2 rounded-full bg-[#0D9999]" />
            Employee directory
          </span>
        </div>
      </section>

      {/* Employee Cards */}
      {filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 gap-5
          sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
          {filteredEmployees.map((employee) => (
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
          border border-dashed border-slate-300
          bg-white px-6 py-12 text-center"
        >
          <div className="mb-4 flex h-14 w-14 items-center
            justify-center rounded-2xl bg-[#E8F7F6]
            text-[#0D9999]"
          >
            <UsersRound size={27} />
          </div>

          <h2 className="text-lg font-semibold text-[#203D61]">
            No employees found
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Try another name or designation, or choose a different department.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setDepartment("All Departments");
            }}
            className="mt-5 rounded-xl bg-[#203D61]
              px-4 py-2.5 text-sm font-medium
              text-white transition hover:bg-[#294767]"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Employee Profile Modal */}
      {selectedEmployee && (
        <div
          className="fixed inset-0 z-[60] flex items-center
            justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
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
              rounded-2xl border border-slate-200
              bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between
              border-b border-slate-100 px-5 py-4"
            >
              <h2
                id="employee-profile-title"
                className="text-lg font-semibold text-[#203D61]"
              >
                Employee Profile
              </h2>

              <button
                type="button"
                onClick={() => setSelectedEmployee(null)}
                aria-label="Close employee profile"
                className="rounded-lg p-2 text-slate-400
                  transition hover:bg-slate-100 hover:text-slate-700"
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
                    justify-center rounded-2xl bg-[#E8F7F6]
                    text-2xl font-semibold text-[#087F80]"
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

                <h3 className="mt-4 text-xl font-semibold text-[#203D61]">
                  {selectedEmployee.name}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedEmployee.designation}
                </p>

                <span className="mt-3 rounded-full
                  bg-[#E8F7F6] px-3 py-1.5 text-xs
                  font-medium text-[#087F80]"
                >
                  {selectedEmployee.department}
                </span>
              </div>

              <div className="mt-6 space-y-4 rounded-xl
                bg-slate-50 p-4"
              >
                <div className="flex items-start gap-3">
                  <Mail size={18} className="mt-0.5 text-[#0D9999]" />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">Email address</p>
                    <p className="mt-1 break-all text-sm text-slate-700">
                      {selectedEmployee.email || "Not available"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={18} className="mt-0.5 text-[#0D9999]" />
                  <div>
                    <p className="text-xs text-slate-400">Phone number</p>
                    <p className="mt-1 text-sm text-slate-700">
                      {selectedEmployee.phone || "Not available"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BriefcaseBusiness
                    size={18}
                    className="mt-0.5 text-[#0D9999]"
                  />
                  <div>
                    <p className="text-xs text-slate-400">Employee ID</p>
                    <p className="mt-1 text-sm text-slate-700">
                      TRG-{String(selectedEmployee.id).padStart(4, "0")}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEmployee(null)}
                className="mt-5 w-full rounded-xl
                  bg-[#203D61] px-4 py-3 text-sm
                  font-semibold text-white transition
                  hover:bg-[#294767]"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-8 border-t border-slate-200
        pt-5 text-center text-xs text-slate-400"
      >
        Trigvent Solutions · Employee Directory
      </footer>
    </div>
  );
}
