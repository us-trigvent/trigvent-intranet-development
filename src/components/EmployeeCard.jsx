
import {
  Mail,
  Phone,
  ArrowUpRight,
  BriefcaseBusiness,
} from "lucide-react";

const avatarColors = [
  "bg-teal-100 text-teal-700",
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
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
      border border-slate-200/80 bg-white
      shadow-sm transition-all duration-200
      hover:-translate-y-1 hover:border-teal-200
      hover:shadow-lg"
    >
      {/* Card accent */}
      <div className="h-1.5 bg-gradient-to-r
        from-[#203D61] via-[#0D9999] to-[#54C8BD]"
      />

      <div className="p-5">
        {/* Employee identity */}
        <div className="flex items-start gap-3">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="h-14 w-14 shrink-0 rounded-2xl
              border border-slate-100 object-cover"
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
              tracking-tight text-[#203D61]"
              title={name}
            >
              {name}
            </h3>

            <p
              className="mt-1 line-clamp-2 text-sm
              leading-5 text-slate-500"
            >
              {designation}
            </p>

            <span
              className="mt-2 inline-flex max-w-full
              items-center gap-1.5 rounded-md
              bg-[#E8F7F6] px-2 py-1 text-xs
              font-medium text-[#087F80]"
            >
              <BriefcaseBusiness size={12} />
              <span className="truncate">{department}</span>
            </span>
          </div>
        </div>

        {/* Contact details */}
        <div className="mt-5 space-y-3 border-t
          border-slate-100 pt-4"
        >
          <div className="flex items-center gap-2.5">
            <Mail
              size={16}
              className="shrink-0 text-slate-400"
            />

            {email ? (
              <a
                href={`mailto:${email}`}
                className="truncate text-sm text-slate-600
                transition-colors hover:text-[#0D9999]"
                title={email}
              >
                {email}
              </a>
            ) : (
              <span className="text-sm text-slate-400">
                Email not available
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <Phone
              size={16}
              className="shrink-0 text-slate-400"
            />

            {phone ? (
              <a
                href={`tel:${phone}`}
                className="truncate text-sm text-slate-600
                transition-colors hover:text-[#0D9999]"
              >
                {phone}
              </a>
            ) : (
              <span className="text-sm text-slate-400">
                Phone not available
              </span>
            )}
          </div>
        </div>

        {/* Footer action */}
        <div className="mt-5 flex items-center
          justify-between border-t border-slate-100 pt-4"
        >
          <span className="text-xs font-medium text-slate-400">
            ID: TRG-{String(id).padStart(4, "0")}
          </span>

          <button
            type="button"
            onClick={() => onViewProfile?.(employee)}
            className="inline-flex items-center gap-1
            text-sm font-semibold text-[#0D9999]
            transition-colors hover:text-[#087F80]"
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
