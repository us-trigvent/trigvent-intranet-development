
export default function EmployeeStatusBadge({ active }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1
        text-xs font-semibold ${
          active
            ? "bg-success-soft text-success-dark ring-1 ring-inset ring-success-soft"
            : "bg-danger-soft text-danger-dark ring-1 ring-inset ring-danger-soft"
        }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-success" : "bg-danger-soft0"
        }`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}
