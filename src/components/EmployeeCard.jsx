
import {
  Mail,
  Phone,
  ArrowUpRight,
  BriefcaseBusiness,
} from "lucide-react";

const avatarColors = [
  "bg-brand-teal-light-soft text-brand-teal-dark",
  "bg-info-soft text-info-dark",
  "bg-violet-soft text-violet-dark",
  "bg-warning-soft text-warning-dark",
  "bg-danger-soft text-danger-dark",
];

export default function EmployeeCard({
  employee,
  onViewProfile,
}) {
  const {
    id,
    name,
    designation,
    department,
    email,
    phone,
    avatar,
  } = employee;

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const avatarStyle =
    avatarColors[(Number(id) || 0) % avatarColors.length];

  return (
    <article
      className="group overflow-hidden rounded-2xl
      border border-border-default/80 bg-white
      shadow-sm transition-all duration-200
      hover:-translate-y-1 hover:border-brand-teal-soft
      hover:shadow-lg"
    >
      {/* Card accent */}
      <div className="h-1.5 bg-gradient-to-r
        from-brand-navy via-brand-teal to-brand-teal-light"
      />

      <div className="p-5">
        {/* Employee identity */}
        <div className="flex items-start gap-3">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="h-14 w-14 shrink-0 rounded-2xl
              border border-border-light object-cover"
            />
          ) : (
            <div
              className={`flex h-14 w-14 shrink-0
              items-center justify-center rounded-2xl
              text-lg font-semibold ${avatarStyle}`}
            >
              {initials}
            </div>
          )}

          <div className="min-w-0 flex-1 pt-0.5">
            <h3
              className="truncate text-base font-semibold
              tracking-tight text-brand-navy"
              title={name}
            >
              {name}
            </h3>

            <p
              className="mt-1 line-clamp-2 text-sm
              leading-5 text-neutral-500"
            >
              {designation}
            </p>

            <span
              className="mt-2 inline-flex max-w-full
              items-center gap-1.5 rounded-md
              bg-brand-teal-soft px-2 py-1 text-xs
              font-medium text-brand-teal-dark"
            >
              <BriefcaseBusiness size={12} />
              <span className="truncate">{department}</span>
            </span>
          </div>
        </div>

        {/* Contact details */}
        <div className="mt-5 space-y-3 border-t
          border-border-light pt-4"
        >
          <div className="flex items-center gap-2.5">
            <Mail
              size={16}
              className="shrink-0 text-neutral-400"
            />

            {email ? (
              <a
                href={`mailto:${email}`}
                className="truncate text-sm text-neutral-600
                transition-colors hover:text-brand-teal"
                title={email}
              >
                {email}
              </a>
            ) : (
              <span className="text-sm text-neutral-400">
                Email not available
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <Phone
              size={16}
              className="shrink-0 text-neutral-400"
            />

            {phone ? (
              <a
                href={`tel:${phone}`}
                className="truncate text-sm text-neutral-600
                transition-colors hover:text-brand-teal"
              >
                {phone}
              </a>
            ) : (
              <span className="text-sm text-neutral-400">
                Phone not available
              </span>
            )}
          </div>
        </div>

        {/* Footer action */}
        <div className="mt-5 flex items-center
          justify-between border-t border-border-light pt-4"
        >
          <span className="text-xs font-medium text-neutral-400">
            ID: TRG-{String(id).padStart(4, "0")}
          </span>

          <button
            type="button"
            onClick={() => onViewProfile?.(employee)}
            className="inline-flex items-center gap-1
            text-sm font-semibold text-brand-teal
            transition-colors hover:text-brand-teal-dark"
          >
            View Profile
            <ArrowUpRight
              size={16}
              className="transition-transform
              group-hover:translate-x-0.5
              group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>
    </article>
  );
}
