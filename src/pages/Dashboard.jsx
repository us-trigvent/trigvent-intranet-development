
import { useState } from "react";

import {
  UsersRound,
  CalendarClock,
  PartyPopper,
  Cake,
  CalendarCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Sparkles,
  Palmtree,
  BriefcaseBusiness,
  Gift,
  CircleCheck,
  TrendingUp,
} from "lucide-react";

import SummaryCard from "../components/SummaryCard";
import DashboardCard from "../components/DashboardCard";

// -----------------------------------------
// Sample dashboard data
// Replace this data with API responses later
// -----------------------------------------

const dashboardStats = [
  {
    title: "Employees on Leave",
    value: 0,
    description: "All available today",
    icon: UsersRound,
    color: "teal",
  },
  {
    title: "Upcoming Leaves",
    value: 1,
    description: "Scheduled leave records",
    icon: CalendarClock,
    color: "amber",
  },
  {
    title: "Upcoming Events",
    value: 0,
    description: "Company activities",
    icon: PartyPopper,
    color: "violet",
  },
  {
    title: "Birthdays This Month",
    value: 0,
    description: "Employee celebrations",
    icon: Cake,
    color: "rose",
  },
];

const upcomingLeaves = [
  {
    id: 1,
    name: "Shekhar",
    department: "Engineering",
    startDate: "30 Oct 2026",
    endDate: "30 Oct 2026",
    duration: "Full day",
    initials: "SH",
  },
];

const holidays = [
  {
    name: "Lohri",
    date: "13 January 2026",
    day: "Tuesday",
    month: "JAN",
    dayNumber: "13",
    description:
      "Celebrating warmth, harvest and new beginnings.",
    theme: "from-orange-dark via-orange-dark to-warning",
  },
  {
    name: "Republic Day",
    date: "26 January 2026",
    day: "Monday",
    month: "JAN",
    dayNumber: "26",
    description:
      "Honouring the spirit and values of our nation.",
    theme: "from-cyan-dark via-brand-teal-dark to-warning",
  },
  {
    name: "Holi",
    date: "4 March 2026",
    day: "Wednesday",
    month: "MAR",
    dayNumber: "04",
    description:
      "A joyful celebration of colour and togetherness.",
    theme: "from-violet-dark via-violet to-rose",
  },
];

// -----------------------------------------
// Reusable empty state
// -----------------------------------------

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div
      className="flex min-h-[112px] flex-col items-center
      justify-center rounded-xl border border-dashed
      border-border-default bg-surface-subtle/70 px-4 py-5 text-center"
    >
      <div
        className="mb-3 flex h-10 w-10 items-center
        justify-center rounded-full bg-white text-neutral-400
        shadow-sm ring-1 ring-border-light"
      >
        <Icon size={19} strokeWidth={1.7} />
      </div>

      <p className="text-sm font-medium text-text-secondary">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-neutral-500">
        {description}
      </p>
    </div>
  );
}

// -----------------------------------------
// Upcoming leaves list
// -----------------------------------------

function LeaveList({ leaves }) {
  if (!leaves.length) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="No upcoming leaves"
        description="Approved leave records will appear here."
      />
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {leaves.map((leave) => (
        <div
          key={leave.id}
          className="flex flex-col gap-4 py-4
          first:pt-0 last:pb-0 sm:flex-row
          sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0
              items-center justify-center rounded-full
              bg-brand-teal-soft text-sm font-semibold
              text-brand-teal-dark"
            >
              {leave.initials ||
                leave.name.slice(0, 2).toUpperCase()}
            </div>

            <div>
              <p className="text-sm font-semibold text-text-strong">
                {leave.name}
              </p>

              <p className="mt-1 text-xs text-neutral-500">
                {leave.department}
              </p>

              <p className="mt-1 text-xs text-neutral-500">
                {leave.startDate === leave.endDate
                  ? leave.startDate
                  : `${leave.startDate} – ${leave.endDate}`}
              </p>
            </div>
          </div>

          <span
            className="flex w-fit items-center gap-2
            rounded-lg bg-warning-soft px-3 py-2
            text-xs font-medium text-warning-dark"
          >
            <Clock3 size={14} />
            {leave.duration}
          </span>
        </div>
      ))}
    </div>
  );
}

// -----------------------------------------
// Holiday calendar
// -----------------------------------------

function HolidayCalendar() {
  const [holidayIndex, setHolidayIndex] = useState(0);

  const holiday = holidays[holidayIndex];

  const changeHoliday = (direction) => {
    setHolidayIndex(
      (current) =>
        (current + direction + holidays.length) %
        holidays.length
    );
  };

  return (
    <DashboardCard
      title="Holiday Calendar"
      subtitle="Public holidays · 2026"
      icon={Palmtree}
      action={
        <span
          className="rounded-lg border border-border-default
          bg-surface-subtle px-3 py-1.5 text-xs font-semibold
          text-neutral-600"
        >
          2026
        </span>
      }
    >
      {/* Holiday Banner */}
      <div
        className={`relative overflow-hidden rounded-2xl
        bg-gradient-to-br ${holiday.theme}
        p-6 text-white sm:p-8`}
      >
        <div
          className="absolute -right-10 -top-16 h-48
          w-48 rounded-full border border-white/15"
        />

        <div
          className="absolute -right-2 -top-8 h-32
          w-32 rounded-full border border-white/15"
        />

        <div
          className="absolute -bottom-20 -left-8 h-44
          w-44 rounded-full border border-white/15"
        />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <span
              className="inline-flex items-center gap-2
              rounded-full border border-white/25
              bg-white/10 px-3 py-1.5 text-[10px]
              font-semibold uppercase tracking-[0.16em]"
            >
              <Sparkles size={13} />
              Company Holiday
            </span>

            <h3
              className="mt-5 text-3xl font-bold
              tracking-tight sm:text-4xl"
            >
              {holiday.name}
            </h3>

            <p
              className="mt-2 max-w-xs text-sm
              leading-6 text-white/80"
            >
              {holiday.description}
            </p>
          </div>

          <div
            className="flex h-[76px] w-[68px] shrink-0
            flex-col items-center justify-center
            rounded-xl bg-white/15 ring-1 ring-white/20"
          >
            <span
              className="text-[10px] font-semibold
              tracking-[0.18em]"
            >
              {holiday.month}
            </span>

            <span className="text-3xl font-bold">
              {holiday.dayNumber}
            </span>
          </div>
        </div>

        <div
          className="relative mt-7 flex flex-wrap
          items-center justify-between gap-4
          border-t border-white/20 pt-4"
        >
          <div
            className="flex items-center gap-2
            text-sm text-white/90"
          >
            <CalendarDays size={16} />
            {holiday.day}, {holiday.date}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => changeHoliday(-1)}
              aria-label="Previous holiday"
              className="flex h-9 w-9 items-center
              justify-center rounded-lg border
              border-white/30 bg-white/10
              transition hover:bg-white/20"
            >
              <ChevronLeft size={19} />
            </button>

            <button
              type="button"
              onClick={() => changeHoliday(1)}
              aria-label="Next holiday"
              className="flex h-9 w-9 items-center
              justify-center rounded-lg border
              border-white/30 bg-white/10
              transition hover:bg-white/20"
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          {holidays.map((item, index) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setHolidayIndex(index)}
              aria-label={`Show ${item.name}`}
              className={`h-1.5 rounded-full transition-all ${
                index === holidayIndex
                  ? "w-7 bg-brand-teal"
                  : "w-1.5 bg-neutral-200 hover:bg-neutral-400"
              }`}
            />
          ))}
        </div>

        <p className="text-xs text-neutral-400">
          {holidayIndex + 1} of {holidays.length} holidays
        </p>
      </div>
    </DashboardCard>
  );
}

// -----------------------------------------
// Main Dashboard
// -----------------------------------------

export default function Dashboard() {
  return (
    <div
      className="min-h-screen bg-page
      px-4 pb-8 pt-20 sm:px-6 sm:pt-20
      lg:px-8 lg:pt-8"
    >
      {/* Page Header */}
      <header
        className="mb-7 flex flex-col justify-between
        gap-5 sm:flex-row sm:items-center"
      >
        <div>
          <div
            className="mb-2 flex items-center gap-2
            text-xs font-medium text-neutral-500"
          >
            <span>Trigvent</span>
            <span className="text-neutral-300">/</span>
            <span className="text-brand-teal">Dashboard</span>
          </div>

          <h1
            className="text-2xl font-semibold
            tracking-tight text-navy-dark sm:text-3xl"
          >
            Good day!{" "}
            <span className="text-brand-teal">
              Welcome back.
            </span>
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Here's your company activity and upcoming celebrations.
          </p>
        </div>

        <div
          className="flex w-fit items-center gap-3
          rounded-xl border border-border-default
          bg-white px-4 py-3 shadow-sm"
        >
          <div
            className="flex h-9 w-9 items-center
            justify-center rounded-lg bg-brand-teal-soft
            text-brand-teal"
          >
            <CalendarDays size={19} />
          </div>

          <div>
            <p
              className="text-[11px] font-medium
              uppercase tracking-wider text-neutral-400"
            >
              Current month
            </p>

            <p className="mt-0.5 text-sm font-semibold text-text-strong">
              October 2026
            </p>
          </div>
        </div>
      </header>

      {/* Summary Cards: Data passed through props */}
      <div
        className="mb-6 grid grid-cols-1 gap-4
        sm:grid-cols-2 xl:grid-cols-4"
      >
        {dashboardStats.map((stat) => (
          <SummaryCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div
        className="grid grid-cols-1 items-start gap-5
        xl:grid-cols-[1.08fr_0.92fr] xl:gap-6"
      >
        {/* Left Column */}
        <div className="flex min-w-0 flex-col gap-5">
          <DashboardCard
            title="On Leave Today"
            subtitle="Employee availability for today"
            icon={CalendarCheck}
          >
            <EmptyState
              icon={CircleCheck}
              title="Everyone is available"
              description="There are no employees on leave today."
            />
          </DashboardCard>

          <DashboardCard
            title="Upcoming Leaves"
            subtitle="Employees scheduled to be away"
            icon={CalendarClock}
            action={
              <span
                className="rounded-full bg-brand-teal-soft
                px-2.5 py-1 text-xs font-semibold
                text-brand-teal-dark"
              >
                {upcomingLeaves.length} scheduled
              </span>
            }
          >
            <LeaveList leaves={upcomingLeaves} />
          </DashboardCard>

          <HolidayCalendar />
        </div>

        {/* Right Column */}
        <div className="flex min-w-0 flex-col gap-5">
          <DashboardCard
            title="Upcoming Events"
            subtitle="What's happening at Trigvent"
            icon={PartyPopper}
          >
            <EmptyState
              icon={CalendarDays}
              title="No upcoming events"
              description="Company events and activities will appear here."
            />
          </DashboardCard>

          <DashboardCard
            title="Birthdays This Month"
            subtitle="Celebrate your teammates"
            icon={Cake}
          >
            <EmptyState
              icon={Gift}
              title="No birthdays this month"
              description="Employee birthdays will be displayed here."
            />
          </DashboardCard>

          <DashboardCard
            title="Work Anniversaries"
            subtitle="Recognising employee milestones"
            icon={Sparkles}
          >
            <EmptyState
              icon={CalendarClock}
              title="No anniversaries this month"
              description="Work anniversaries will appear here."
            />
          </DashboardCard>

          {/* Company Information */}
          <div
            className="relative overflow-hidden
            rounded-2xl bg-brand-navy p-6 text-white"
          >
            <div
              className="absolute -right-8 -top-8
              h-32 w-32 rounded-full bg-white/5"
            />

            <div className="relative flex items-start gap-4">
              <div
                className="flex h-11 w-11 shrink-0
                items-center justify-center rounded-xl
                bg-white/10 text-[#77D9D2]"
              >
                <BriefcaseBusiness size={22} />
              </div>

              <div>
                <h3 className="text-sm font-semibold">
                  Your workplace at a glance
                </h3>

                <p className="mt-2 text-sm leading-6 text-neutral-300">
                  Keep up with team availability, company
                  holidays, and important employee milestones
                  from one place.
                </p>

                <div
                  className="mt-4 flex items-center gap-2
                  text-xs font-medium text-[#77D9D2]"
                >
                  <TrendingUp size={15} />
                  Trigvent Employee Portal
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="mt-8 flex flex-col items-center
        justify-between gap-2 border-t border-border-default
        pt-5 text-xs text-neutral-400 sm:flex-row"
      >
        <span>© 2026 Trigvent Solutions</span>

        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-teal" />
          Internal Employee Portal
        </span>
      </footer>
    </div>
  );
}
