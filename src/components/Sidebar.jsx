
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import trigventLogo from "../assets/trigvent-logo.png";
import {
  LayoutDashboard,
  UsersRound,
  UserRoundPlus,
  CalendarCheck,
  Clock,
  BriefcaseBusiness,
  ListTodo,
  ChevronDown,
  ChevronUp,
  UserPlus,
  UserRound,
  ShieldBan,
  CalendarDays,
  ClipboardList,
  FileClock,
  CircleDollarSign,
  Settings,
  Menu,
  X,
  Banknote,
  WalletCards,
  GraduationCap,
  CreditCard,
  ReceiptText,
  UserSearch,
  MessageSquareText,
  Monitor,
  Building2,
  Trophy,
  CalendarRange,
  Briefcase,
  Megaphone,
  PartyPopper,
  ScrollText,
  ShieldCheck,
  CircleUserRound,
  UploadCloud,
  CalendarCheck2,
  ListChecks,
  ClipboardCheck,
  Fingerprint,
  Inbox,
  FileBarChart,
  HandCoins,
  UserCheck,
} from "lucide-react";

const navigation = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Employee Directory",
    icon: UsersRound,
    path: "/employees",
  },
  {
    title: "Human Resource",
    icon: UserRoundPlus,
    children: [
      { title: "Add Employee", icon: UserPlus, path: "/hr/add-employee" },
      { title: "Add Intern", icon: UserRound, path: "/hr/add-intern" },
      { title: "Employee Listing", icon: UsersRound, path: "/hr/employee-listing" },
      { title: "Released Employees", icon: UserRound, path: "/hr/released-employees" },
      { title: "Add to Blacklist", icon: ShieldBan, path: "/hr/add-to-blacklist" },
      { title: "Blacklist Listing", icon: ClipboardList, path: "/hr/blacklist-listing" },
    ],
  },
  {
    title: "Leave Management",
    icon: CalendarCheck,
    path: "/leaves",
    children: [
      { title: "Add Leaves", icon: CalendarDays, path: "/leaves/add" },
      { title: "Leaves Listing", icon: ClipboardList, path: "/leaves/listing" },
      { title: "Add Comp Off Credit", icon: CircleDollarSign, path: "/leaves/add-comp-off" },
      { title: "Comp Off Records", icon: FileClock, path: "/leaves/comp-off-records" },
      { title: "Accrued Leaves Log", icon: Clock, path: "/leaves/accrued-log" },
    ],
  },
  {
    title: "Attendance",
    icon: CalendarCheck2,
    path: "/attendance",
    children: [
      { title: "Add Attendance", icon: UserCheck, path: "/attendance/add" },
      { title: "Upload Attendance", icon: UploadCloud, path: "/attendance/upload" },
      { title: "View Attendance", icon: ClipboardCheck, path: "/attendance/view" },
    ],
  },
  {
    title: "Projects",
    icon: BriefcaseBusiness,
    path: "/projects",
    children: [
      { title: "Project Listing", icon: ClipboardList, path: "/projects/listing" },
      { title: "Add Project", icon: UserPlus, path: "/projects/add" },
    ],
  },

  {
    title: "Tasks",
    icon: ListTodo,
    path: "/tasks",
    children: [
      { title: "Task Listing", icon: ClipboardList, path: "/tasks/listing" },
      { title: "Add Task", icon: UserPlus, path: "/tasks/add" },
      { title: "My Task", icon: ListChecks, path: "/tasks/my" },
      { title: "Task Requests", icon: Inbox, path: "/tasks/request" },
      { title: "DSR Reports", icon: FileBarChart, path: "/tasks/reports" },
    ],
  },
   {
    title: "Financial",
    icon: WalletCards,
    path: "/financial",
    children: [
      { title: "Add Loan", icon: HandCoins, path: "/financial/add-loan" },
      { title: "Loan Listings", icon: Banknote, path: "/financial/loan-listings" },
      { title: "Pay Slips", icon: ReceiptText, path: "/financial/pay-slips" },
      { title: "PaySlips Setting", icon: Settings, path: "/financial/payslips-settings" },
    ],
  },
   {
    title: "Training",
    icon: GraduationCap,
    path: "/training",
    children: [
      { title: "Add Trainee", icon: UserRoundPlus, path: "/trainee/add-trainee" },
      { title: "Trainee Listing", icon: UserPlus, path: "/trainee/trainee-listing" },
      { title: "Add Payment", icon: CreditCard, path: "/trainee/add-payment" },
      { title: "Payment Logs", icon: ReceiptText, path: "/trainee/payment-logs" },
    ],
  },
   {
    title: "Recruitment",
    icon: UserSearch,
    path: "/recruitment",
    children: [
      { title: "Add Interview", icon: CalendarCheck, path: "/recruitment/add-interview" },
      { title: "Interview Listing", icon: ClipboardList, path: "/recruitment/recruitment-listing" },
    ],
  },
   {
    title: "Feedback",
    icon: MessageSquareText,
    path: "/feedback",
    children: [
      { title: "Feedback Listing", icon: ClipboardList, path: "/feedback/feedback-listing" },
    ],
  },
     {
    title: "IT Management",
    icon: Monitor,
    path: "/it",
    children: [
      { title: "Add Device", icon: Monitor, path: "/it/add-device" },
      { title: "Device Listing", icon: ListChecks, path: "/it/device-listing" },
    ],
  },
     {
    title: "Company Settings",
    icon: Building2,
    path: "/settings",
    children: [
      { title: "Employee of the Month", icon: Trophy, path: "/settings/eom" },
      { title: "Device Listing", icon: Monitor, path: "/settings/iow" },
      { title: "Upcoming Events", icon: CalendarRange, path: "/settings/upcoming-events" },
      { title: "Job Openings", icon: Briefcase, path: "/settings/job-openings" },
      { title: "Announcements", icon: Megaphone, path: "/settings/announcements" },
      { title: "Celebrations", icon: PartyPopper, path: "/settings/celebrations" },
      { title: "Holidays", icon: CalendarDays, path: "/settings/holidays" },

    ],
  },
       {
    title: "Administration",
    icon: ShieldCheck,
    path: "/administration",
    children: [
      { title: "Activity Logs", icon: ScrollText, path: "/administration/activity-logs" },
      { title: "Manage Roles", icon: ShieldCheck, path: "/administration/manage-roles" },
    ],
  },
       {
    title: "Profile",
    icon: CircleUserRound,
    path: "/profile",
    children: [
      { title: "My Profile", icon: CircleUserRound, path: "/profile/my-profile" },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeItem = navigation
    .flatMap((item) => [item, ...(item.children || [])])
    .find((item) => item.path === location.pathname)?.title;

  const [expandedMenus, setExpandedMenus] = useState([]);

  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMenu = (title) => {
    setExpandedMenus((previous) =>
      previous.includes(title)
        ? previous.filter((item) => item !== title)
        : [...previous, title]
    );
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg
        bg-[#203D61] p-2.5 text-white shadow-lg lg:hidden"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <button
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen
        w-64 flex-col overflow-hidden
        rounded-r-xl bg-[#203D61] text-white
        transition-transform duration-300
        lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Section */}
        <div className="flex h-23 shrink-0 items-center border-b border-white/10 px-5">
          <img
            src={trigventLogo}
            alt="Trigvent Intranet"
            className="h-auto max-h-15 w-full object-contain"
          />
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-4 py-4
        [scrollbar-thin]
        [scrollbar-color:#426080_transparent]">
          <ul className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;

              const isExpanded =
                expandedMenus.includes(item.title);

              const isActive = activeItem === item.title;

              return (
                <li key={item.title}>
                  {/* Main Menu */}
                  <button
                    onClick={() =>
                      item.children
                        ? toggleMenu(item.title)
                        : handleNavigation(item.path)
                    }
                    className={`group relative flex w-full
                    items-center gap-3 rounded-xl px-3 py-3
                    text-left text-[15px] transition-colors
                    duration-200 ${
                      isActive
                        ? "bg-[#2B496D] font-semibold text-white"
                        : "text-[#D0DCEC] hover:bg-[#294767]"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-2.5
                      h-8 w-1 rounded-r-full bg-[#0DA6A6]" />
                    )}

                    <Icon
                      size={21}
                      strokeWidth={1.9}
                      className={`shrink-0 ${
                        isActive
                          ? "text-white"
                          : "text-[#C0D0E4] group-hover:text-white"
                      }`}
                    />

                    <span className="flex-1 whitespace-nowrap">
                      {item.title}
                    </span>

                    {item.children &&
                      (isExpanded ? (
                        <ChevronUp
                          size={16}
                          className="text-[#A9BED7]"
                        />
                      ) : (
                        <ChevronDown
                          size={16}
                          className="text-[#A9BED7]"
                        />
                      ))}
                  </button>

                  {/* Submenu */}
                  {item.children && isExpanded && (
                    <ul className="ml-7 mt-2 space-y-1
                    border-l border-[#355171] pl-4">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;

                        const childActive =
                          activeItem === child.title;

                        return (
                          <li key={child.title}>
                            <button
                              onClick={() =>
                                handleNavigation(child.path)
                              }
                              className={`flex w-full items-center
                              gap-2 rounded-lg px-2.5 py-2.5
                              text-left text-[14px]
                              transition-colors duration-200 ${
                                childActive
                                  ? "bg-[#2B496D] font-medium text-white"
                                  : "text-[#9CB4D2] hover:bg-[#294767] hover:text-white"
                              }`}
                            >
                              <ChildIcon
                                size={16}
                                className="shrink-0"
                                strokeWidth={1.8}
                              />

                              <span>{child.title}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="shrink-0 border-t border-white/10 p-4">
          <button
            onClick={() => handleNavigation("/settings")}
            className={`flex w-full items-center gap-3
            rounded-xl px-3 py-3 text-sm transition-colors ${
              activeItem === "Settings"
                ? "bg-[#2B496D] text-white"
                : "text-[#C0D0E4] hover:bg-[#294767] hover:text-white"
            }`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>

          {/* Logged-in User */}
          <div className="mt-3 flex items-center gap-3
          rounded-xl bg-[#294767]/70 p-3">
            <div className="flex h-10 w-10 shrink-0
            items-center justify-center rounded-full
            bg-[#0DA6A6] text-sm font-semibold text-white">
              PS
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                Priya Sharma
              </p>

              <p className="text-xs text-[#B6C8DF]">
                HR Manager
              </p>
            </div>
            <ChevronDown
              size={16}
              className="text-[#A9BED7]"
            />
          </div>
        </div>
      </aside>
    </>
  );
}
