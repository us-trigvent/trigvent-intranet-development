
export default function FormSection({
  title,
  description,
  icon: Icon,
  children,
  columns = 3,
}) {
  const gridColumns = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  };

  return (
    <section className="rounded-2xl border border-border-default/80
      bg-white p-5 shadow-sm sm:p-6 lg:p-7"
    >
      <div className="mb-6 flex items-start gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center
          justify-center rounded-xl bg-brand-teal-soft text-brand-teal"
        >
          {Icon && <Icon size={21} strokeWidth={1.8} />}
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-tight text-brand-navy">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm leading-5 text-neutral-500">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className={`grid gap-x-5 gap-y-5 ${gridColumns[columns] || gridColumns[3]}`}>
        {children}
      </div>
    </section>
  );
}
