
import { forwardRef } from "react";

const FormField = forwardRef(function FormField(
  {
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder = "",
    options = [],
    required = false,
    error,
    icon: Icon,
    disabled = false,
    accept,
    rows = 3,
    min,
    max,
    hint,
  },
  ref
) {
  const baseClass =
    "w-full min-w-0 rounded-xl border bg-white px-3.5 py-2.5 " +
    "text-sm text-text-secondary outline-none transition " +
    "placeholder:text-neutral-400 focus:border-brand-teal " +
    "focus:ring-4 focus:ring-brand-teal/10 disabled:cursor-not-allowed " +
    "disabled:bg-surface-muted";

  const hasError = Boolean(error);

  const inputClass = `${baseClass} ${
    hasError ? "border-danger" : "border-border-default"
  }`;

  return (
    <div className="min-w-0">
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-text-secondary"
      >
        {label}
        {required && (
          <span className="ml-1 text-danger" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2
              -translate-y-1/2 text-neutral-400"
          />
        )}

        {type === "select" ? (
          <select
            ref={ref}
            id={name}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            required={required}
            disabled={disabled}
            aria-invalid={hasError}
            className={`${inputClass} ${
              Icon ? "pl-10" : ""
            }`}
          >
            <option value="">{placeholder || `Select ${label}`}</option>

            {options.map((option) => {
              const item =
                typeof option === "string"
                  ? { label: option, value: option }
                  : option;

              return (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              );
            })}
          </select>
        ) : type === "textarea" ? (
          <textarea
            ref={ref}
            id={name}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            aria-invalid={hasError}
            className={`${inputClass} resize-y ${
              Icon ? "pl-10" : ""
            }`}
          />
        ) : type === "radio" ? (
          <div className="flex min-h-11 flex-wrap items-center gap-5">
            {options.map((option) => {
              const item =
                typeof option === "string"
                  ? { label: option, value: option }
                  : option;

              return (
                <label
                  key={item.value}
                  className="inline-flex cursor-pointer items-center gap-2
                    text-sm text-neutral-600"
                >
                  <input
                    type="radio"
                    name={name}
                    value={item.value}
                    checked={value === item.value}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    className="h-4 w-4 accent-brand-teal"
                  />
                  {item.label}
                </label>
              );
            })}
          </div>
        ) : type === "file" ? (
          <input
            ref={ref}
            id={name}
            name={name}
            type="file"
            accept={accept}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={`${inputClass} file:mr-3 file:cursor-pointer
              file:rounded-lg file:border-0 file:bg-brand-teal-soft
              file:px-3 file:py-1.5 file:text-xs
              file:font-semibold file:text-brand-teal-dark`}
          />
        ) : (
          <input
            ref={ref}
            id={name}
            name={name}
            type={type}
            value={value ?? ""}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            accept={accept}
            min={min}
            max={max}
            aria-invalid={hasError}
            className={`${inputClass} ${
              Icon ? "pl-10" : ""
            }`}
          />
        )}
      </div>

      {hint && !error && (
        <p className="mt-1.5 text-xs text-neutral-400">{hint}</p>
      )}

      {error && (
        <p role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
});

export default FormField;
