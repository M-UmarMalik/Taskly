
import { useState, useEffect, useRef } from "react";

import logo from "../assets/logo12.png";

import {
  Moon,
  Sun,
  CircleUser,
  House,
  SquareText,
  LogOut,
  UserRound,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

const DashLayout = ({ children, isDark, toggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const navItems = [
    {
      label: "Home",
      icon: House,
      path: "/home",
    },
    {
      label: "Tasks",
      icon: SquareText,
      path: "/task",
    },
  ];

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Logout logic
  const handleLogout = () => {
    // Clear authentication data if stored in localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    // Clear authentication data if stored in sessionStorage
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("isLoggedIn");

    setIsProfileOpen(false);

    // Navigate to the root route
    navigate("/", { replace: true });
  };

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden font-jakarta pb-20 sm:pb-0"
      style={{
        backgroundColor: "var(--page-bg)",
        backgroundImage: "var(--bg-glow)",
        color: "var(--text-color)",
      }}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-3 min-[380px]:px-4 sm:px-6 lg:px-10">

        {/* Navbar */}
        <nav className="relative flex min-h-20 flex-wrap items-center justify-between gap-x-3 gap-y-4 py-4 sm:gap-4 sm:py-5">

          {/* Logo */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <img
              className="h-6 w-6 shrink-0 object-contain"
              src={logo}
              alt="Taskly logo"
            />

            <span className="text-lg font-semibold min-[380px]:text-xl">
              Taskly
            </span>
          </div>

          {/* Tasks Completed */}
          <div
            className="order-3 w-full rounded-2xl border px-3 py-2.5 text-center text-xs sm:order-none sm:absolute sm:left-1/2 sm:top-1/2 sm:w-auto sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-full sm:px-5 sm:py-3 sm:text-sm"
            style={{
              backgroundColor: "var(--card-glass)",
              borderColor: "var(--border-color)",
            }}
          >
            <p>
              <span
                className="font-semibold"
                style={{ color: "var(--accent-text)" }}
              >
                0%
              </span>{" "}
              <span style={{ color: "var(--muted-text)" }}>
                of tasks completed today
              </span>
            </p>
          </div>

          {/* Profile and Theme Switch */}
          <div className="ml-auto flex items-center gap-2">

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                aria-label="User profile"
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
                onClick={() =>
                  setIsProfileOpen((prev) => !prev)
                }
                className="rounded-full border p-2.5 transition hover:opacity-75 sm:p-3"
                style={{
                  backgroundColor: "var(--chip-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-color)",
                }}
              >
                <CircleUser size={20} />
              </button>

              {isProfileOpen && (
                <div
                  className="absolute right-0 top-full z-[60] mt-3 w-48 overflow-hidden rounded-2xl border p-1.5 shadow-xl"
                  style={{
                    backgroundColor: "var(--page-bg)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-color)",
                  }}
                >

                  {/* Log Out */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 transition hover:bg-red-500/10"
                  >
                    <LogOut size={18} />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Desktop Theme Switch */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                isDark
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              className="hidden rounded-full border p-3 hover:opacity-75 sm:block"
              style={{
                backgroundColor: "var(--chip-bg)",
                borderColor: "var(--border-color)",
                color: "var(--accent-text)",
              }}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="flex flex-1 gap-4 py-3 sm:gap-6 sm:py-6">

          {/* Desktop Sidebar */}
          <aside className="hidden w-16 shrink-0 flex-col items-center gap-4 sm:flex">
            {navItems.map(({ label, icon: Icon, path }) => {
              const isActive = location.pathname === path;

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => navigate(path)}
                  aria-label={label}
                  title={label}
                  className="rounded-2xl border p-3 hover:border-[var(--accent-color)]"
                  style={{
                    backgroundColor: isActive
                      ? "var(--accent-soft)"
                      : "var(--card-glass)",
                    borderColor: "var(--border-color)",
                    color: isActive
                      ? "var(--accent-text)"
                      : "var(--muted-text)",
                  }}
                >
                  <Icon size={20} />
                </button>
              );
            })}
          </aside>

          {/* Main Content */}
          <main
            className="min-h-[70vh] min-w-0 flex-1 rounded-2xl p-3 min-[380px]:p-4 sm:min-h-[80vh] sm:rounded-3xl sm:p-6 lg:p-8"
            style={{
              color: "var(--text-color)",
            }}
          >
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t sm:hidden"
        style={{
          backgroundColor: "var(--page-bg)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="mx-auto flex min-h-[64px] w-full max-w-[500px] items-center justify-around px-2">
          {navItems.map(({ label, icon: Icon, path }) => {
            const isActive = location.pathname === path;

            return (
              <button
                key={label}
                type="button"
                onClick={() => navigate(path)}
                aria-label={label}
                className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2"
                style={{
                  color: isActive
                    ? "var(--accent-text)"
                    : "var(--muted-text)",
                }}
              >
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.5 : 2}
                />

                <span className="text-[10px] min-[380px]:text-[11px]">
                  {label}
                </span>
              </button>
            );
          })}

          {/* Mobile Theme Switch */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2"
            style={{
              color: "var(--accent-text)",
            }}
          >
            {isDark ? <Sun size={21} /> : <Moon size={21} />}

            <span className="text-[10px] min-[380px]:text-[11px]">
              {isDark ? "Light" : "Dark"}
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default DashLayout;
