
export default function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  color = "teal",
}) {
  const colorStyles = {
    teal: {
      icon: "bg-teal-50 text-teal-700",
      decoration: "bg-teal-50",
    },
    amber: {
      icon: "bg-amber-50 text-amber-700",
      decoration: "bg-amber-50",
    },
    violet: {
      icon: "bg-violet-50 text-violet-700",
      decoration: "bg-violet-50",
    },
    rose: {
      icon: "bg-rose-50 text-rose-700",
      decoration: "bg-rose-50",
    },
  };

  const styles = colorStyles[color] || colorStyles.teal;

  return (
    <div
      className="group relative overflow-hidden rounded-2xl
        border border-slate-200/80 bg-white p-5
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
          <p className="text-sm font-medium leading-5 text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-tight text-[#203D61]">
            {value}
          </p>

          {description && (
            <p className="mt-2 text-xs leading-5 text-slate-500">
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
