import { Check } from "lucide-react";
import { employeeSteps } from "./employeeFormConfig";

export default function StepNavigation({ activeStep, onStepClick }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
      {employeeSteps.map((step, index) => {
        const Icon = step.icon;
        const active = activeStep === index;
        const completed = activeStep > index;

        return (
          <button
            key={step.label}
            type="button"
            onClick={() => onStepClick(index)}
            aria-current={active ? "step" : undefined}
            className={`flex min-w-0 items-center gap-2.5 rounded-xl
              border px-3 py-3 text-left transition sm:px-4 ${
                active
                  ? "border-brand-teal bg-brand-teal-soft text-brand-teal-dark"
                  : completed
                    ? "border-brand-teal-light-soft bg-brand-teal-soft/50 text-brand-teal-dark"
                    : "border-border-default bg-white text-neutral-500 hover:border-border-strong"
              }`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center
                justify-center rounded-lg ${
                  active
                    ? "bg-brand-teal text-white"
                    : completed
                      ? "bg-brand-teal-light-soft text-brand-teal-dark"
                      : "bg-surface-muted text-neutral-500"
                }`}
            >
              {completed ? <Check size={18} /> : <Icon size={18} />}
            </span>

            <span className="min-w-0">
              <span className="block text-[10px] font-medium uppercase
                tracking-wider opacity-70"
              >
                Step {index + 1}
              </span>
              <span className="mt-0.5 block truncate text-xs
                font-semibold sm:text-sm"
              >
                {step.label}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
