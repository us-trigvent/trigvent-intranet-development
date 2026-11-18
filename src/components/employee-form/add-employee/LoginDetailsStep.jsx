import { Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import FormField from "../FormField";
import FormSection from "../FormSection";

export default function LoginDetailsStep({
  field,
  form,
  errors,
  updateField,
  showPassword,
  setShowPassword,
}) {
  return (
    <FormSection
      title="Login Credentials"
      description="Set up the employee's account credentials."
      icon={KeyRound}
      columns={2}
    >
      <FormField
        label="Login Email Address"
        type="email"
        placeholder="employee@trigvent.com"
        required
        {...field("loginEmail")}
      />

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-text-secondary"
        >
          Password
        </label>

        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={updateField}
            placeholder="Optional; minimum 8 characters"
            autoComplete="new-password"
            className={`w-full rounded-xl border bg-white
              px-3.5 py-2.5 pr-11 text-sm text-text-secondary
              outline-none transition placeholder:text-neutral-400
              focus:border-brand-teal focus:ring-4
              focus:ring-brand-teal/10 ${
                errors.password ? "border-danger" : "border-border-default"
              }`}
          />

          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2
              -translate-y-1/2 text-neutral-400
              hover:text-text-secondary"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {errors.password && (
          <p className="mt-1.5 text-xs text-danger">{errors.password}</p>
        )}

        <p className="mt-1.5 text-xs text-neutral-400">
          Optional. If provided, use at least 8 characters.
        </p>
      </div>

      <div className="rounded-xl border border-brand-teal-light-soft
        bg-brand-teal-soft/70 p-4 md:col-span-2"
      >
        <div className="flex items-start gap-3">
          <ShieldCheck
            size={20}
            className="mt-0.5 shrink-0 text-brand-teal-dark"
          />
          <div>
            <p className="text-sm font-semibold text-brand-navy">
              Account security
            </p>
            <p className="mt-1 text-sm leading-6 text-neutral-600">
              In production, create accounts through your secure backend. Never
              store plaintext passwords or expose them in logs.
            </p>
          </div>
        </div>
      </div>
    </FormSection>
  );
}
