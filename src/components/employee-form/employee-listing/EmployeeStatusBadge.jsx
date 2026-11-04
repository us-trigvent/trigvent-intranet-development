
export default function EmployeeStatusBadge({ active }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1
        text-xs font-semibold ${
          active
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
            : "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200"
        }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-rose-500"
        }`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}
