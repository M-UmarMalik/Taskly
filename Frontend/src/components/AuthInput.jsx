import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const AuthInput = ({
  label,
  name,
  type = "text",
  placeholder,
  value = "",
  onChange,
  error,
  icon: Icon,
  autocomplete,
  showStrength = false,
  isDark = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  const inputType = isPassword
    ? showPassword
      ? "text"
      : "password"
    : type;

  const password = value || "";

  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password) && /[a-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  const strength = checks.filter(Boolean).length;

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];

  const strengthColors = [
    "transparent",
    "#f87171",
    "#fb923c",
    "#facc15",
    "#34d399",
  ];

  return (
    <div className="my-5 w-full">
      {/* Label */}
      <label
        htmlFor={name}
        className="mb-3 block text-sm font-medium"
        style={{
          color: error ? "#f87171" : "var(--muted-text)",
        }}
      >
        {label}
      </label>

      {/* Input Container */}
      <div
        className="flex h-12 items-center gap-3 rounded-xl border px-4 transition-all duration-300 focus-within:border-[var(--accent-color)]"
        style={{
          backgroundColor: "var(--input-bg)",
          borderColor: error ? "#f87171" : "var(--border-color)",
        }}
      >
        {Icon && (
          <Icon
            size={17}
            className="shrink-0"
            style={{
              color: error ? "#f87171" : "var(--muted-text)",
            }}
          />
        )}

        {/* Input Field */}
        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autocomplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          className="h-full w-full min-w-0 bg-transparent text-sm outline-none"
          style={{
            color: "var(--text-color)",
          }}
        />

        {/* Password Show / Hide */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="shrink-0 transition-opacity hover:opacity-70"
            style={{ color: "var(--muted-text)" }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>

      {/* Placeholder styling */}
      <style>{`
        #${name}::placeholder {
          color: var(--muted-text);
          opacity: 0.75;
        }
      `}</style>

      {/* Error Message */}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}

      {/* Password Strength Indicator: Signup Only */}
      {isPassword && showStrength && password.length > 0 && (
        <div className="mt-3">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((bar) => (
              <div
                key={bar}
                className="h-1 flex-1 rounded-full transition-colors duration-300"
                style={{
                  backgroundColor:
                    strength >= bar
                      ? strengthColors[strength]
                      : isDark
                        ? "#3f4352"
                        : "#dee4fd",
                }}
              />
            ))}
          </div>

          <p
            className="mt-1 text-xs"
            style={{
              color:
                strength > 0 ? strengthColors[strength] : "var(--muted-text)",
            }}
          >
            Password strength: {strengthLabel}
          </p>

          <div
            className="mt-2 grid grid-cols-2 gap-2 text-xs"
            style={{ color: "var(--muted-text)" }}
          >
            <p>{checks[0] ? "✓" : "○"} At least 8 characters</p>
            <p>{checks[1] ? "✓" : "○"} Upper & lowercase</p>
            <p>{checks[2] ? "✓" : "○"} One number</p>
            <p>{checks[3] ? "✓" : "○"} One symbol</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthInput;