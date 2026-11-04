
export default function DashboardCard({
  title,
  subtitle,
  icon: Icon,
  action,
  children,
  className = "",
}) {
  return (
    <section
      className={`min-w-0 rounded-2xl border
        border-border-default/80 bg-white p-5
        shadow-[0_2px_8px_rgba(15,23,42,0.035)]
        transition-shadow duration-200 hover:shadow-md
        sm:p-6 ${className}`}
    >
      {/* Card header */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {/* Icon container */}
          {Icon && (
            <div
              className="flex h-10 w-10 shrink-0
                items-center justify-center rounded-xl
                bg-brand-teal-soft text-brand-teal"
            >
              <Icon size={20} strokeWidth={1.8} />
            </div>
          )}

          {/* Title and subtitle */}
          <div className="min-w-0">
            <h2 className="text-base font-semibold
              tracking-tight text-brand-navy"
            >
              {title}
            </h2>

            {subtitle && (
              <p className="mt-1 text-sm leading-5 text-neutral-500">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Optional action, badge, or link */}
        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </div>

      {/* Dynamic card content */}
      <div>
        {children}
      </div>
    </section>
  );
}
