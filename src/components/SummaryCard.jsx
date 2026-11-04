
export default function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  color = "teal",
}) {
  const colorStyles = {
    teal: {
      icon: "bg-brand-teal-soft text-brand-teal-dark",
      decoration: "bg-brand-teal-soft",
    },
    amber: {
      icon: "bg-warning-soft text-warning-dark",
      decoration: "bg-warning-soft",
    },
    violet: {
      icon: "bg-violet-soft text-violet-dark",
      decoration: "bg-violet-soft",
    },
    rose: {
      icon: "bg-danger-soft text-danger-dark",
      decoration: "bg-danger-soft",
    },
  };

  const styles = colorStyles[color] || colorStyles.teal;

  return (
    <div
      className="group relative overflow-hidden rounded-2xl
        border border-border-default/80 bg-white p-5
        shadow-sm transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Decorative background */}
      <div
        className={`absolute -right-5 -top-8 h-24 w-24
          rounded-full opacity-70 transition-transform
          duration-300 group-hover:scale-110
          ${styles.decoration}`}
      />

      <div className="relative flex items-start justify-between gap-4">
        {/* Card information */}
        <div className="min-w-0">
          <p className="text-sm font-medium leading-5 text-neutral-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-tight text-brand-navy">
            {value}
          </p>

          {description && (
            <p className="mt-2 text-xs leading-5 text-neutral-500">
              {description}
            </p>
          )}
        </div>

        {/* Icon */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center
            justify-center rounded-xl transition-transform
            duration-200 group-hover:scale-105 ${styles.icon}`}
        >
          {Icon && <Icon size={21} strokeWidth={1.8} />}
        </div>
      </div>
    </div>
  );
}
