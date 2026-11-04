import { useState } from "react";
import { CheckCircle2, Save } from "lucide-react";

const employees = [
  { id: "EMP001", name: "Harpreet Singh", email: "harpreet@trigvent.com", department: "Marketing Executive", role: "HR" },
  { id: "EMP002", name: "Priya Sharma", email: "priya@trigvent.com", department: "Human Resources", role: "HR Manager" },
  { id: "EMP003", name: "Amit Kumar", email: "amit@trigvent.com", department: "Engineering", role: "Employee" },
];

const roles = ["Admin", "HR", "HR Manager", "Manager", "Employee"];

export default function ManageRoles() {
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0].id);
  const [selectedRole, setSelectedRole] = useState(employees[0].role);
  const [message, setMessage] = useState("");
  const employee = employees.find((item) => item.id === selectedEmployee) || employees[0];

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage(`Role updated to ${selectedRole} for ${employee.name}.`);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Manage Roles</h1>
        <p className="mt-1 text-sm text-neutral-500">Assign application roles to employees.</p>
      </div>
      <section className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-border-default bg-white p-5 shadow-sm">
          <label htmlFor="employee" className="mb-2 block text-sm font-medium text-text-secondary">Employee</label>
          <select
            id="employee"
            value={selectedEmployee}
            onChange={(event) => {
              setSelectedEmployee(event.target.value);
              setSelectedRole(employees.find((item) => item.id === event.target.value)?.role || "Employee");
              setMessage("");
            }}
            className="w-full rounded-xl border border-border-default bg-white px-3.5 py-2.5 text-sm text-brand-navy outline-none focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10"
          >
            {employees.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border-default bg-white shadow-sm">
          <div className="bg-brand-navy px-5 py-3 text-sm font-semibold text-white">Employee Details</div>
          <dl className="grid gap-4 p-5 md:grid-cols-2">
            <div><dt className="text-xs text-neutral-500">Employee ID</dt><dd className="mt-1 font-medium text-brand-navy">{employee.id}</dd></div>
            <div><dt className="text-xs text-neutral-500">Name</dt><dd className="mt-1 font-medium text-brand-navy">{employee.name}</dd></div>
            <div><dt className="text-xs text-neutral-500">Email</dt><dd className="mt-1 font-medium text-text-secondary">{employee.email}</dd></div>
            <div><dt className="text-xs text-neutral-500">Department</dt><dd className="mt-1 font-medium text-text-secondary">{employee.department}</dd></div>
          </dl>
          <form onSubmit={handleSubmit} className="border-t border-border-default p-5">
            <label htmlFor="role" className="mb-2 block text-sm font-medium text-text-secondary">Change Role</label>
            <select
              id="role"
              value={selectedRole}
              onChange={(event) => setSelectedRole(event.target.value)}
              className="w-full max-w-md rounded-xl border border-border-default bg-white px-3.5 py-2.5 text-sm text-brand-navy focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10"
            >
              {roles.map((role) => <option key={role} value={role}>{role}</option>)}
            </select>
            {message && <p role="status" className="mt-4 flex items-center gap-2 text-sm text-brand-teal-dark"><CheckCircle2 size={17} />{message}</p>}
            <button type="submit" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-teal px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-teal-dark">
              <Save size={17} /> Update Role
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
