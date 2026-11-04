
import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  Users,
  Save,
  Search,
} from "lucide-react";

const initialEmployees = [
  { id: 1, name: "Admin", designation: "Intern", department: "Engineering" },
  { id: 2, name: "Anna Here", designation: "Intern", department: "Design" },
  { id: 3, name: "Bhagwati Verma", designation: "Intern", department: "HR" },
  { id: 4, name: "Cora Shellie", designation: "Intern", department: "Marketing" },
  { id: 5, name: "D D", designation: "Intern", department: "Engineering" },
  { id: 6, name: "Harpreet Singh", designation: "Marketing Executive", department: "Marketing" },
  { id: 7, name: "John Carter", designation: "Senior Software Engineer", department: "Engineering" },
  { id: 8, name: "John Connor", designation: "Digital Marketing Executive", department: "Marketing" },
];

const attendanceOptions = [
  {
    label: "Present",
    value: "Present",
    color: "bg-success",
    active: "ring-2 ring-success ring-offset-2",
  },
  {
    label: "Short Day",
    value: "Short Day",
    color: "bg-warning",
    active: "ring-2 ring-warning ring-offset-2",
  },
  {
    label: "Half Day",
    value: "Half Day",
    color: "bg-info",
    active: "ring-2 ring-info ring-offset-2",
  },
  {
    label: "Quarter Day",
    value: "Quarter Day",
    color: "bg-surface-subtle0",
    active: "ring-2 ring-neutral-500 ring-offset-2",
  },
  {
    label: "Absent",
    value: "Absent",
    color: "bg-danger",
    active: "ring-2 ring-danger-dark ring-offset-2",
  },
];

const getInitials = (name) =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const getLocalDate = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000)
    .toISOString()
    .split("T")[0];
};

export default function AddAttendance() {
  const [attendanceDate, setAttendanceDate] = useState(getLocalDate());

  const [employees, setEmployees] = useState(
    initialEmployees.map((employee) => ({
      ...employee,
      status: "",
    }))
  );

  const [search, setSearch] = useState("");

  const handleStatusChange = (employeeId, status) => {
    setEmployees((previous) =>
      previous.map((employee) =>
        employee.id === employeeId
          ? { ...employee, status }
          : employee
      )
    );
  };

  const filteredEmployees = employees.filter((employee) =>
    `${employee.name} ${employee.designation} ${employee.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const markedCount = employees.filter(
    (employee) => employee.status !== ""
  ).length;

  const handleSave = () => {
    const unmarked = employees.filter(
      (employee) => !employee.status
    );

    if (unmarked.length > 0) {
      alert(`Please mark attendance for all employees. ${unmarked.length} remaining.`);
      return;
    }

    const attendanceData = {
      date: attendanceDate,
      records: employees.map(({ id, status }) => ({
        employeeId: id,
        status,
      })),
    };

    // Connect attendance API here.
    console.log("Attendance Data:", attendanceData);

    alert("Attendance marked successfully!");
  };

  return (
    <div className="min-h-screen bg-page px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">

      {/* Page Header */}
      <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-neutral-500">
            <span>Trigvent</span>
            <span className="text-neutral-300">/</span>
            <span>Attendance</span>
            <span className="text-neutral-300">/</span>
            <span className="text-brand-teal">Add Attendance</span>
          </div>

          <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-teal-soft text-brand-teal">
              <CalendarDays size={23} />
            </span>
            Add Attendance
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Mark daily attendance for employees and interns.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-xl border border-border-default bg-white px-4 py-3 shadow-sm">
          <Users size={18} className="text-brand-teal" />
          <span className="text-sm font-medium text-neutral-600">
            {employees.length} Employees
          </span>
        </div>

      </header>

      {/* Main Container */}
      <div className="rounded-2xl border border-border-default/80 bg-white p-4 shadow-sm sm:p-6">

        {/* Toolbar */}
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

          <div>
            <h2 className="text-lg font-semibold text-brand-navy">
              Employee Attendance
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Select an attendance status for each employee.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                placeholder="Search employees..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-border-default bg-white py-2.5 pl-10 pr-4 text-sm text-text-secondary outline-none transition placeholder:text-neutral-400 focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 sm:w-60"
              />
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-border-default bg-white px-3">
              <CalendarDays size={17} className="text-brand-teal" />
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full border-0 bg-transparent py-2.5 text-sm text-neutral-600 outline-none"
              />
            </div>

          </div>
        </div>

        {/* Attendance Summary */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">

          <div className="rounded-xl border border-border-default bg-surface-subtle/70 p-4">
            <p className="text-xs text-neutral-500">Total Employees</p>
            <p className="mt-1 text-2xl font-semibold text-brand-navy">
              {employees.length}
            </p>
          </div>

          <div className="rounded-xl border border-brand-teal-light-soft bg-brand-teal-soft/50 p-4">
            <p className="text-xs text-neutral-500">Marked Attendance</p>
            <p className="mt-1 text-2xl font-semibold text-brand-teal-dark">
              {markedCount}
            </p>
          </div>

          <div className="col-span-2 rounded-xl border border-warning-soft bg-warning-soft/50 p-4 sm:col-span-1">
            <p className="text-xs text-neutral-500">Pending</p>
            <p className="mt-1 text-2xl font-semibold text-warning-dark">
              {employees.length - markedCount}
            </p>
          </div>

        </div>

        {/* Employee Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">

          {filteredEmployees.map((employee) => (

            <div
              key={employee.id}
              className="group rounded-2xl border border-border-default bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-teal/40 hover:shadow-lg"
            >

              {/* Card Date */}
              <div className="flex items-center justify-between border-b border-border-light pb-3">
                <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                  <CalendarDays size={15} className="text-brand-teal" />
                  {attendanceDate}
                </div>

                {employee.status ? (
                  <CheckCircle2 size={18} className="text-brand-teal" />
                ) : (
                  <Clock3 size={18} className="text-neutral-300" />
                )}
              </div>

              {/* Employee Profile */}
              <div className="flex flex-col items-center py-5">

                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-brand-teal-soft bg-brand-teal-soft text-2xl font-semibold text-brand-teal-dark">
                  {getInitials(employee.name)}
                </div>

                <h3 className="mt-3 text-sm font-semibold text-brand-navy">
                  {employee.name}
                </h3>

                <p className="mt-1 text-xs text-neutral-500">
                  {employee.designation}
                </p>

                <span className="mt-2 rounded-full bg-surface-muted px-3 py-1 text-[11px] font-medium text-neutral-600">
                  {employee.department}
                </span>

              </div>

              {/* Attendance Buttons */}
              <div className="flex flex-wrap justify-center gap-2 border-t border-border-light pt-4">

                {attendanceOptions.map((option) => (

                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      handleStatusChange(employee.id, option.value)
                    }
                    aria-pressed={employee.status === option.value}
                    className={`rounded-lg px-2.5 py-2 text-[11px] font-semibold text-white transition hover:opacity-90 ${option.color} ${
                      employee.status === option.value
                        ? option.active
                        : "opacity-75"
                    }`}
                  >
                    {option.label}
                  </button>

                ))}

              </div>

              {/* Selected Status */}
              <div className="mt-4 text-center">
                {employee.status ? (
                  <span className="text-xs font-medium text-brand-teal-dark">
                    Selected: {employee.status}
                  </span>
                ) : (
                  <span className="text-xs text-neutral-400">
                    Attendance not marked
                  </span>
                )}
              </div>

            </div>

          ))}

        </div>

        {/* Empty State */}
        {filteredEmployees.length === 0 && (
          <div className="rounded-xl border border-dashed border-border-default py-16 text-center">
            <Users size={32} className="mx-auto text-neutral-300" />
            <p className="mt-3 text-sm font-medium text-brand-navy">
              No employees found
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              Try searching with another name.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-7 flex flex-col justify-between gap-4 border-t border-border-light pt-5 sm:flex-row sm:items-center">

          <p className="text-xs text-neutral-500">
            {markedCount} of {employees.length} employees marked.
          </p>

          <button
            type="button"
            onClick={handleSave}
            disabled={markedCount !== employees.length}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-teal px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-teal-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={17} />
            Save Attendance
          </button>

        </div>

      </div>
    </div>
  );
}
