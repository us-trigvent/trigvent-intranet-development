
export default function LookupDropdown({
  label,
  value,
  options = [],
  placeholder = "Select an option",
  loading = false,
  disabled = false,
  error = "",
  onChange,
  required = false,
  className = "",
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-brand-navy">
          {label}
          {required && <span className="ml-1 text-danger">*</span>}
        </label>
      )}

      <select
        value={value ?? ""}
        disabled={disabled || loading}
        required={required}
        onChange={(event) => onChange?.(event.target.value)}
        className="w-full rounded-xl border border-border-default bg-white px-3.5 py-3 text-sm text-text-secondary outline-none transition focus:border-brand-teal disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:opacity-70"
      >
        <option value="">
          {loading ? "Loading..." : placeholder}
        </option>

        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
