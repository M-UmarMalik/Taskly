import { useState } from "react";
import AuthInput from "../components/AuthInput";
import AuthLayout from "../components/AuthLayout";
import {
  LockKeyhole,
  Mail,
  UserRound,
  AtSign,
} from "lucide-react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = ({ isDark, toggleTheme }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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
      ...(name === "password" ? { confirmPassword: "" } : {}),
    }));

    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      setServerError("");

      const response = await axios.post( import.meta.env.SAPI_URL, {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token)
      }

      navigate("/OTP");

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
              onClick={() => navigate("/login")}
              className="rounded-full px-7 py-3 text-center text-sm transition-colors"
              style={{ color: "var(--muted-text)" }}
            >
              Log In
            </button>

            <button
              type="button"
              className="rounded-full px-7 py-3 text-center text-sm font-medium"
              style={{
                backgroundColor: "var(--button-bg)",
                color: "var(--button-text)",
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Heading */}
          <div>
            <h1 className="font-jakarta text-4xl font-semibold sm:text-4xl">
              Create your account
            </h1>

            <p
              className="mt-5 text-sm"
              style={{ color: "var(--muted-text)" }}
            >
              Start planning in under a minute. No card needed.
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit}>
            <AuthInput
              label="Full Name"
              name="name"
              type="text"
              placeholder="Ali Khan"
              value={formData.name}
              onchange={handleChange}
              error={errors.name}
              icon={UserRound}
              autocomplete="name"
              isDark={dark}
            />

            <AuthInput
              label="Username"
              name="username"
              type="text"
              placeholder="alikhan"
              value={formData.username}
              onchange={handleChange}
              error={errors.username}
              icon={AtSign}
              autocomplete="username"
              isDark={dark}
            />

            <AuthInput
              label="Email"
              name="email"
              type="email"
              placeholder="alikhan@example.com"
              value={formData.email}
              onchange={handleChange}
              error={errors.email}
              icon={Mail}
              autocomplete="email"
              isDark={dark}
            />

            <AuthInput
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onchange={handleChange}
              error={errors.password}
              icon={LockKeyhole}
              autocomplete="new-password"
              showStrength={true}
              isDark={dark}
            />

            <AuthInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onchange={handleChange}
              error={errors.confirmPassword}
              autocomplete="new-password"
              showStrength={false}
              isDark={dark}
            />

            {/* Create Account Button */}
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
              <span>{loading ? "Creating account..." : "Create an account"}</span>
              {!loading && <FaArrowRight />}
            </button>
          </form>
        </div>
      )}
    </AuthLayout>
  );
};

export default Signup;