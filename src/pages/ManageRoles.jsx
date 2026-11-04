import { useState } from "react";
import {
  CheckCircle2,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const employees = [
  {
    id: "EMP001",
    name: "Harpreet Singh",
    email: "harpreet@trigvent.com",
    department: "Marketing Executive (Sales & Marketing)",
    role: "HR",
  },
  {
    id: "EMP002",
    name: "Priya Sharma",
    email: "priya@trigvent.com",
    department: "HR Manager (Human Resources)",
    role: "HR Manager",
  },
  {
    id: "EMP003",
    name: "Amit Kumar",
    email: "amit@trigvent.com",
    department: "Software Engineer (Engineering)",
    role: "Employee",
  },
];

const roles = ["Admin", "HR", "HR Manager", "Manager", "Employee"];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#203D61] outline-none transition focus:border-[#0D9999] focus:ring-4 focus:ring-[#0D9999]/10";

export default function ManageRoles() {
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0].id);
  const [selectedRole, setSelectedRole] = useState(employees[0].role);
  const [message, setMessage] = useState("");

  const employee = employees.find((item) => item.id === selectedEmployee) || employees[0];

  const handleEmployeeChange = (event) => {
    const nextEmployee = employees.find((item) => item.id === event.target.value);
    setSelectedEmployee(event.target.value);
    setSelectedRole(nextEmployee?.role || "");
    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedRole) return;
    setMessage(`${employee.name}'s role updated to ${selectedRole}.`);
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <header className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
          <span>Trigvent</span>
          <span className="text-slate-300">/</span>
          <span>Administration</span>
          <span className="text-slate-300">/</span>
          <span className="text-[#0D9999]">Manage Roles</span>
        </div>

        <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-[#203D61] sm:text-3xl">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F7F6] text-[#0D9999]">
            <ShieldCheck size={23} />
          </span>
          Manage Roles
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Select an employee and update their assigned application role.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="p-5 sm:p-6 lg:p-7">
          <div className="mb-6 max-w-md">
            <label htmlFor="employee" className="mb-2 block text-sm font-medium text-slate-700">
              Select Employee
            </label>
            <select
              id="employee"
              value={selectedEmployee}
              onChange={handleEmployeeChange}
              className={inputClass}
            >
              {employees.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="bg-[#203D61] px-5 py-3 text-sm font-semibold text-white">
              Employee Details
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-[120px_minmax(0,1fr)] md:items-start sm:p-6">
              <div className="flex h-28 w-28 items-center justify-center rounded-xl border border-slate-200 bg-[#E8F7F6] text-[#0D9999]">
                <UserRound size={52} strokeWidth={1.5} />
              </div>

              <dl className="grid grid-cols-[120px_minmax(0,1fr)] gap-x-4 gap-y-3 text-sm">
                <dt className="text-slate-500">Name</dt>
                <dd className="font-medium text-[#203D61]">{employee.name}</dd>
                <dt className="text-slate-500">Email</dt>
                <dd className="text-slate-700">{employee.email}</dd>
                <dt className="text-slate-500">Department &amp; Designation</dt>
                <dd className="text-slate-700">{employee.department}</dd>
                <dt className="text-slate-500">Current Role</dt>
                <dd className="font-medium text-[#087F80]">{employee.role}</dd>
              </dl>
            </div>

            <form onSubmit={handleSubmit} noValidate className="border-t border-slate-200 p-5 sm:p-6">
              <div className="max-w-xl">
                <label htmlFor="role" className="mb-2 block text-sm font-medium text-slate-700">
                  Change Role
                </label>
                <select
                  id="role"
                  value={selectedRole}
                  onChange={(event) => {
                    setSelectedRole(event.target.value);
                    setMessage("");
                  }}
                  className={inputClass}
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              {message && (
                <p role="status" className="mt-5 flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800">
                  <CheckCircle2 size={17} />
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0D9999] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#087F80] focus:outline-none focus:ring-4 focus:ring-[#0D9999]/20"
              >
                <Save size={17} />
                Update Role
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
