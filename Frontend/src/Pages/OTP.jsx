import React, { useState } from "react";
import { Mail, ArrowRight, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OTP = ({ isDark, toggleTheme }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    setServerError("");
    setServerSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setServerError("");
      setServerSuccess("");

      const response = await axios.post( import.meta.env.OAPI_URL , {
        otp: otp,
      });

      setServerSuccess("Email verified successfully!");

      if (response.data.token) {
        localStorage.setItem("token", response.data.token)
      }

      setTimeout(() => {
        navigate("/home");
      }, 1500);

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setServerError(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }

  };

  const handleResend = () => {
    setOtp("");

    // Yahan backend se OTP resend karne ki API connect hogi
    console.log("Resend OTP requested");
  };

  return (
    <div
      className={`${isDark ? "dark" : ""} min-h-screen flex items-center justify-center p-4 transition-colors duration-300`}
      style={{
        backgroundColor: "var(--page-bg)",
        color: "var(--text-color)",
      }}
    >
      <div
        className="w-full max-w-md rounded-3xl border p-8 sm:p-10 shadow-xl backdrop-blur-xl"
        style={{
          backgroundColor: "var(--card-glass)",
          borderColor: "var(--border-color)",
        }}
      >
        {/* Email Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: "var(--accent-soft)",
              color: "var(--accent-color)",
            }}
          >
            <Mail size={30} strokeWidth={1.8} />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Verify Your Email
          </h1>

          <p
            className="mt-3 text-sm leading-6"
            style={{ color: "var(--muted-text)" }}
          >
            We've sent a verification code to your email address.
            Enter the 6-digit code below to continue.
          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="otp"
            className="mb-3 block text-sm font-semibold"
          >
            Verification Code
          </label>

          <input
            id="otp"
            name="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            value={otp}
            onChange={handleChange}
            maxLength={6}
            required
            disabled={loading}
            className="w-full rounded-2xl border px-4 py-4 text-center text-2xl font-bold tracking-[0.7em] outline-none transition-all focus:ring-2"
            style={{
              backgroundColor: "var(--input-bg)",
              borderColor: "var(--border-color)",
              color: "var(--text-color)",
              "--tw-ring-color": "var(--accent-color)",
            }}
          />

          <p
            className="mt-3 text-xs"
            style={{ color: "var(--muted-text)" }}
          >
            Enter the 6-digit code you received.
          </p>

          {/* Verify Button */}
         <button
            type="submit"
            disabled={loading || otp.length !== 6} // 6 digits se kam par button disable
            className={`mt-7 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 font-semibold transition-all duration-200 ${
              loading || otp.length !== 6 ? "opacity-60 cursor-not-allowed" : "hover:opacity-90 active:scale-[0.98]"
            }`}
            style={{
              backgroundColor: "var(--accent-color)",
              color: "#ffffff",
            }}
          >
            <span>{loading ? "Verifying..." : "Verify OTP"}</span>
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="mt-7 text-center">
          <p
            className="text-sm"
            style={{ color: "var(--muted-text)" }}
          >
            Didn't receive the code?
          </p>

          <button
            type="button"
            onClick={handleResend}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-75"
            style={{ color: "var(--accent-text)" }}
          >
            <RefreshCw size={15} />
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTP;