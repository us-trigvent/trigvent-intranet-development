
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/actions/authActions";
import { clearPasswordStatus } from "../redux/slices/authSlice";
import trigventLogo from "../assets/trigvent-logo.png";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { sidebarNavigations } from "../utils/sidebarnavigations";
import {
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  LogOut,
  KeyRound,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    user,
    loading: loggingOut,
  } = useSelector((state) => state.auth);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const userName = user?.name || "Priya Sharma";
  const userRole = user?.role_label || "HR Manager";
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const activeItem = sidebarNavigations
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

  const handleLogout = async () => {
    await dispatch(logoutUser()).unwrap().catch(() => undefined);
    setLogoutDialogOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg
        bg-brand-navy p-2.5 text-white shadow-lg lg:hidden"
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
        rounded-r-xl bg-brand-navy text-white
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
            {sidebarNavigations.map((item) => {
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
                        ? "bg-navy-muted font-semibold text-white"
                        : "text-border-muted hover:bg-navy-light"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-2.5
                      h-8 w-1 rounded-r-full bg-brand-teal-light" />
                    )}

                    <Icon
                      size={21}
                      strokeWidth={1.9}
                      className={`shrink-0 ${
                        isActive
                          ? "text-white"
                          : "text-neutral-300 group-hover:text-white"
                      }`}
                    />

                    <span className="flex-1 whitespace-nowrap">
                      {item.title}
                    </span>

                    {item.children &&
                      (isExpanded ? (
                        <ChevronUp
                          size={16}
                          className="text-neutral-300"
                        />
                      ) : (
                        <ChevronDown
                          size={16}
                          className="text-neutral-300"
                        />
                      ))}
                  </button>

                  {/* Submenu */}
                  {item.children && isExpanded && (
                    <ul className="ml-7 mt-2 space-y-1
                    border-l border-navy-light pl-4">
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
                                  ? "bg-navy-muted font-medium text-white"
                                  : "text-neutral-300 hover:bg-navy-light hover:text-white"
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
            type="button"
            onClick={() => {
              dispatch(clearPasswordStatus());
              setPasswordDialogOpen(true);
            }}
            className={`flex w-full items-center gap-3
            rounded-xl px-3 py-3 text-sm text-neutral-300 transition-colors hover:bg-navy-light hover:text-white`}
          >
            <KeyRound size={20} />
            <span>Change Password</span>
          </button>

          {/* Logged-in User */}
          <button
            type="button"
            onClick={() => setLogoutDialogOpen(true)}
            disabled={loggingOut}
            className="mt-3 flex w-full items-center gap-3
          rounded-xl bg-navy-light/70 p-3">
            <div className="flex h-10 w-10 shrink-0
            items-center justify-center rounded-full
            bg-brand-teal-light text-sm font-semibold text-white">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {userName}
              </p>

              <p className="text-xs text-neutral-300">
                {userRole}
              </p>
            </div>
            <LogOut size={18} className="shrink-0 text-neutral-300" />
          </button>
        </div>
      </aside>

      <ChangePasswordDialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
      />

      {logoutDialogOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-danger-soft text-danger">
              <LogOut size={21} />
            </div>
            <h2 id="logout-title" className="mt-4 text-lg font-semibold text-brand-navy">
              Log out of intranet?
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              Your current session will be ended on this device.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setLogoutDialogOpen(false)}
                disabled={loggingOut}
                className="rounded-xl border border-border-default px-4 py-2.5 text-sm font-medium text-text-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-xl bg-danger px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
              >
                {loggingOut ? "Logging out..." : "Log out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
