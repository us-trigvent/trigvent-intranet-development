const isTrue = (value) =>
  value === true ||
  value === 1 ||
  ["1", "true"].includes(String(value).toLowerCase());

const displayValue = (value) => {
  if (value && typeof value === "object") {
    return value.name ?? value.label ?? value.title ?? value.id ?? "";
  }
  return value ?? "";
};

const formatRole = (value) =>
  String(displayValue(value))
    .trim()
    .split(/(\s+)/)
    .map((word) =>
      word.toLowerCase() === "hr"
        ? "HR"
        : `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`
    )
    .join("");

export const normalizeEmployee = (employee = {}) => ({
  ...employee,
  employeeCode: displayValue(employee.employee_code ?? employee.employeeCode),
  name: displayValue(
    employee.name ||
      [employee.first_name, employee.last_name].filter(Boolean).join(" ")
  ),
  email: displayValue(employee.email),
  role: isTrue(employee.is_intern)
    ? "Intern"
    : formatRole(employee.role_label ?? employee.role),
  department: displayValue(employee.department),
  designation: displayValue(employee.designation),
  workType: formatRole(employee.work_type ?? employee.workType),
  createdAt: displayValue(employee.created_at ?? employee.createdAt),
  joiningDate: displayValue(employee.joining_date ?? employee.joiningDate),
  active: isTrue(employee.status),
  isTrainer: isTrue(employee.is_trainer),
  isIntern: isTrue(employee.is_intern),
  archived: isTrue(employee.is_archive),
});
