import { useState } from "react";
import AuthInput from "../components/AuthInput";
import AuthLayout from "../components/AuthLayout";
import { LockKeyhole, Mail } from "lucide-react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Login = ({ isDark, toggleTheme }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      setServerError("");

      const response = await axios.post( import.meta.env.LAPI_URL, {
        email: formData.email,
        password: formData.password
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/home");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout isDark={isDark} toggleTheme={toggleTheme}>
      {({ isDark: dark }) => (
        <div
          className="transition-colors duration-300"
          style={{ color: "var(--text-color)" }}
        >
          {/* Login / Signup Switch */}
          <div
            className="my-5 flex w-fit items-center justify-between rounded-full border p-1"
            style={{
              backgroundColor: "var(--chip-bg)",
              borderColor: "var(--border-color)",
            }}
          >
            <button
              type="button"
              className="rounded-full px-7 py-3 text-center text-sm font-medium"
              style={{
                backgroundColor: "var(--button-bg)",
                color: "var(--button-text)",
              }}
            >
              Log In
            </button>

            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="rounded-full px-7 py-3 text-center text-sm transition-colors"
              style={{ color: "var(--muted-text)" }}
            >
              Sign Up
            </button>
          </div>

          {/* Heading */}
          <div>
            <h1 className="font-jakarta text-4xl font-semibold sm:text-4xl">
              Welcome back
            </h1>

            <p
              className="mt-5 text-sm"
              style={{ color: "var(--muted-text)" }}
            >
              Log in to see what is due today.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <AuthInput
              label="Email"
              name="email"
              type="email"
              placeholder="alikhan@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={Mail}
              autoComplete="email"
              showStrength={false}
              isDark={dark}
            />

            <AuthInput
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={LockKeyhole}
              autoComplete="current-password"
              showStrength={false}
              isDark={dark}
            />


            {/* Server Error Message */}
            {serverError && (
              <div className="mt-4 text-sm font-medium text-red-500">
                {serverError}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading} 
              className={`my-8 flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-3.5 font-semibold transition-all duration-300 ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-0.5 hover:shadow-xl"
              }`}
              style={{
                backgroundColor: "var(--button-bg)",
                color: "var(--button-text)",
              }}
            >
              <span>{loading ? "Logging in..." : "Log in"}</span>
              {!loading && <FaArrowRight />}
            </button>
          </form>
        </div>
      )}
    </AuthLayout>
  );
};

export default Login;