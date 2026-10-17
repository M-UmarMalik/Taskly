import { Moon, Sun } from "lucide-react";

import hills from "../assets/Group 1.png";
import logo from "../assets/logo12.png";

const AuthLayout = ({ children, isDark, toggleTheme }) => {
  return (
    <div
      className="min-h-screen p-3 transition-colors duration-300 md:p-5"
      style={{
        backgroundColor: "var(--page-bg)",
        backgroundImage: `var(--bg-glow),
        )`,
        color: "var(--text-color)",
      }}
    >
      <div className="mx-auto grid min-h-[95vh] max-w-[1200px] grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left Authentication Panel */}
        <div
          className="relative flex w-full flex-col rounded-3xl border p-6 transition-colors duration-300 sm:p-10 md:p-12 lg:p-10 xl:p-15"
          style={{
            backgroundColor: "var(--card-solid)",
            borderColor: "var(--border-color)",
            color: "var(--text-color)",
            
          }}
        >
          {/* Logo and Theme Toggle */}
          <div className="flex items-center justify-between">
            <h2 className="flex items-center text-xl font-bold tracking-tight">
              <img
                className="mr-2 h-7 w-7 object-contain"
                src={logo}
                alt="Taskly Logo"
              />
              Taskly
            </h2>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              className="flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 hover:opacity-80"
              style={{
                backgroundColor: "var(--chip-bg)",
                borderColor: "var(--border-color)",
                color: "var(--accent-text)",
              }}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Login / Signup Content */}
          <div className="my-auto w-full py-0">
            {typeof children === "function"
              ? children({ isDark })
              : children}
          </div>

          {/* Footer */}
          <p
            className="text-center text-xs"
            style={{ color: "var(--muted-text)" }}
          >
            © 2026 Taskly. Designer and Developer Muhammad Umar Malik.
          </p>
        </div>

        {/* Right Design Panel */}
        <div
          className="relative hidden min-h-[650px] flex-col overflow-hidden rounded-3xl border p-7 transition-colors duration-300 sm:p-10 lg:flex"
          style={{
            background: isDark
              ? "linear-gradient(to bottom, #273055, #1e2029)"
              : "linear-gradient(to bottom, #dee4fd, #f7f7fc)",
            borderColor: "var(--border-color)",
            color: "var(--text-color)",
          }}
        >
          {/* Heading */}
          <div className="relative z-10">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Plan it. Move
              <br />
              it. Finish it.
            </h1>

            <p
              className="mt-4 text-sm leading-relaxed"
              style={{ color: "var(--muted-text)" }}
            >
              One calm place for your tasks, deadlines and board.
              <br className="hidden sm:block" />
              See what matters today and move the rest forward.
            </p>
          </div>

          {/* Dashboard Preview */}
          <div className="relative z-10 mt-auto pt-16">
            {/* Statistics */}
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div
                className="flex min-h-[105px] animate-[float_2s_ease-in-out_infinite] items-center gap-3 rounded-3xl border p-4 backdrop-blur-md"
                style={{
                  backgroundColor: "var(--card-glass)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="h-14 w-14 shrink-0">
                  <div
                    className="h-full w-full rotate-[45deg] rounded-full border-[6px]"
                    style={{
                      borderColor: isDark ? "#3f4352" : "#dee4fd",
                      borderTopColor: "var(--accent-color)",
                      borderRightColor: "var(--accent-color)",
                      borderBottomColor: "var(--accent-color)",
                    }}
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-bold">75%</h2>
                  <p
                    className="text-xs"
                    style={{ color: "var(--muted-text)" }}
                  >
                    completed today
                  </p>
                </div>
              </div>

              {/* Task Status */}
              <div
                className="flex min-h-[105px] animate-[float_2s_ease-in-out_infinite] flex-col justify-center gap-2 rounded-3xl border p-4 text-xs backdrop-blur-md [animation-delay:0.5s]"
                style={{
                  backgroundColor: "var(--card-glass)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span style={{ color: "var(--muted-text)" }}>
                    ● To Do
                  </span>
                  <span className="font-bold">4</span>
                </div>

                <div className="flex items-center justify-between">
                  <span style={{ color: "var(--accent-text)" }}>
                    ● In Progress
                  </span>
                  <span className="font-bold">3</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-emerald-500">● Completed</span>
                  <span className="font-bold">5</span>
                </div>
              </div>
            </div>

            {/* Task List Preview */}
            <div
              className="relative animate-[float_2s_ease-in-out_infinite] overflow-hidden rounded-3xl border p-4 backdrop-blur-md [animation-delay:1s]"
              style={{
                backgroundColor: "var(--card-glass)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="relative z-10 space-y-3">
                <div
                  className="flex items-center justify-between gap-3 border-b border-dashed pb-3"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <div>
                    <h3 className="text-sm font-semibold">
                      Prepare presentation
                    </h3>
                    <p
                      className="mt-1 text-xs"
                      style={{ color: "var(--muted-text)" }}
                    >
                      Due Dec 20 · Work
                    </p>
                  </div>

                  <span
                    className="shrink-0 rounded-full px-3 py-1 text-xs"
                    style={{
                      backgroundColor: "var(--accent-soft)",
                      color: "var(--accent-text)",
                    }}
                  >
                    In Progress
                  </span>
                </div>

                <div
                  className="flex items-center justify-between gap-3 border-b border-dashed pb-3"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <div>
                    <h3 className="text-sm font-semibold">
                      Review project plan
                    </h3>
                    <p
                      className="mt-1 text-xs"
                      style={{ color: "var(--muted-text)" }}
                    >
                      Due Dec 21 · Work
                    </p>
                  </div>

                  <span
                    className="shrink-0 rounded-full px-3 py-1 text-xs"
                    style={{
                      backgroundColor: isDark ? "#263b32" : "#dcfce7",
                      color: isDark ? "#86efac" : "#166534",
                    }}
                  >
                    Completed
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold">
                      Budget approval
                    </h3>
                    <p
                      className="mt-1 text-xs"
                      style={{ color: "var(--muted-text)" }}
                    >
                      Due Dec 25 · Finance
                    </p>
                  </div>

                  <span
                    className="shrink-0 rounded-full px-3 py-1 text-xs"
                    style={{
                      backgroundColor: isDark ? "#442b33" : "#fee2e2",
                      color: isDark ? "#fda4af" : "#b91c1c",
                    }}
                  >
                    High
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Hills Image */}
          <img
            src={hills}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-1/2 z-0 w-[330px] max-w-none -translate-x-1/2 opacity-80 sm:left-3/4 sm:w-[430px]"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;