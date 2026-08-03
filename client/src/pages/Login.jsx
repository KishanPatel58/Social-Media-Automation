import {
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import Countdown from "react-countdown";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowRightIcon,
  BadgeCheck,
  Loader2Icon,
  LockIcon,
  MailIcon,
  Moon,
  Sun,
  User2Icon,
} from "lucide-react";

import { themeContext } from "../context/theme/ThemeContext";
import { authContext } from "../context/auth/AuthContext";
import api from "../api/axios";

export default function Auth() {
  const renderer = ({ minutes, seconds }) => (
    <span>
      {String(minutes).padStart(2, "0")}:
      {String(seconds).padStart(2, "0")}
    </span>
  );

  const { theme, setTheme } = useContext(themeContext);
  const { setUser } = useContext(authContext);
  const navigate = useNavigate();

  // formType: "login" | "signup" | "otpverify" | "forgot" | "forgot-otp" | "reset-password"
  const [formType, setFormType] = useState("login");

  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otpLoading, setOtpLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  // ─────────────────────────────────────────────
  // Signup
  // ─────────────────────────────────────────────
  const handleSignup = async (e) => {
    e.preventDefault();
    const loadings = toast.loading("Please Wait...");
    try {
      setLoading(true);
      localStorage.setItem("formtype", "signup");
      const response = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });
      toast.dismiss(loadings);
      setFormType("otpverify");
      localStorage.setItem("email", email);
      localStorage.setItem("formtype", "otpverify");
      setOtpLoading(true);
      toast(response.data.message, { icon: "⚠️" });
    } catch (error) {
      toast.dismiss(loadings);
      toast(
        error?.response?.data?.message || error.message || "Problem to Signup",
        { icon: "🚨" }
      );
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Login
  // ─────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    const loadings = toast.loading("Please Wait...");
    try {
      setLoading(true);
      localStorage.setItem("formtype", "login");
      const response = await api.post("/api/auth/login", { email, password });
      toast.dismiss(loadings);
      toast(response.data.message, { icon: "🥳" });
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (error) {
      toast.dismiss(loadings);
      toast(
        error?.response?.data?.message || error.message || "Problem to Login",
        { icon: "🚨" }
      );
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Signup OTP verify
  // ─────────────────────────────────────────────
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    const loadings = toast.loading("Please Wait...");
    try {
      setLoading(true);
      localStorage.setItem("formtype", "otpverify");
      const response = await api.post("/api/auth/verifyemailandcreateuser", {
        email: localStorage.getItem("email") || email,
        otp,
      });
      toast.dismiss(loadings);
      localStorage.removeItem("email");
      localStorage.setItem("formtype", "login");
      toast(response.data.message, { icon: "😃" });
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (error) {
      toast.dismiss(loadings);
      toast(
        error?.response?.data?.message || error.message || "Problem to Verify",
        { icon: "🚨" }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    const loadings = toast.loading("Please Wait...");
    try {
      setOtpLoading(true);
      const response = await api.post("/api/auth/resendOtpverifyemail", {
        email: localStorage.getItem("email") || email,
      });
      toast.dismiss(loadings);
      toast(response.data.message, { icon: "🥳" });
    } catch (error) {
      toast.dismiss(loadings);
      toast(
        error?.response?.data?.message ||
          error.message ||
          "Problem to Resend Otp",
        { icon: "🚨" }
      );
      setOtpLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Forgot password — Step 1: send OTP
  // ─────────────────────────────────────────────
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const loadings = toast.loading("Sending OTP...");
    try {
      setLoading(true);
      const response = await api.post("/api/auth/forgot-password", { email });
      toast.dismiss(loadings);
      toast(response.data.message || "OTP sent to your email", { icon: "📧" });

      localStorage.setItem("email", email);
      localStorage.setItem("formtype", "forgot-otp");
      setFormType("forgot-otp");
      setOtp("");
      setOtpLoading(true);
    } catch (error) {
      toast.dismiss(loadings);
      toast(
        error?.response?.data?.message || error.message || "Failed to send OTP",
        { icon: "🚨" }
      );
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Forgot password — Step 2: verify OTP
  // ─────────────────────────────────────────────
  const handleForgotOtpVerify = async (e) => {
    e.preventDefault();
    const loadings = toast.loading("Verifying OTP...");
    try {
      setLoading(true);
      const response = await api.post("/api/auth/verify-forgot-otp", {
        email: localStorage.getItem("email") || email,
        otp,
      });
      toast.dismiss(loadings);
      toast(response.data.message || "OTP verified", { icon: "✅" });

      // Keep otp in memory only for reset call (optional safety)
      localStorage.setItem("formtype", "reset-password");
      setFormType("reset-password");
    } catch (error) {
      toast.dismiss(loadings);
      toast(
        error?.response?.data?.message || error.message || "Invalid OTP",
        { icon: "🚨" }
      );
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Forgot password — Step 3: reset password
  // ─────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const loadings = toast.loading("Resetting password...");
    try {
      setLoading(true);
      const response = await api.post("/api/auth/reset-password", {
        email: localStorage.getItem("email") || email,
        newPassword,
        otp, // optional but safer if your backend checks it
      });
      toast.dismiss(loadings);
      toast(response.data.message || "Password reset successfully", {
        icon: "🎉",
      });

      localStorage.removeItem("email");
      localStorage.setItem("formtype", "login");
      setFormType("login");
      setNewPassword("");
      setConfirmPassword("");
      setOtp("");
      setPassword("");
      setEmail("");
    } catch (error) {
      toast.dismiss(loadings);
      toast(
        error?.response?.data?.message ||
          error.message ||
          "Failed to reset password",
        { icon: "🚨" }
      );
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Resend forgot OTP
  // ─────────────────────────────────────────────
  const handleResendForgotOtp = async () => {
    const loadings = toast.loading("Please Wait...");
    try {
      setOtpLoading(true);
      const response = await api.post("/api/auth/resend-forgot-otp", {
        email: localStorage.getItem("email") || email,
      });
      toast.dismiss(loadings);
      toast(response.data.message, { icon: "🥳" });
    } catch (error) {
      toast.dismiss(loadings);
      toast(
        error?.response?.data?.message ||
          error.message ||
          "Problem to Resend Otp",
        { icon: "🚨" }
      );
      setOtpLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Theme
  // ─────────────────────────────────────────────
  const themeHandle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const stars = useMemo(() => {
    return [...Array(60)].map((_, i) => ({
      id: i,
      width: Math.random() * 4 + 1,
      height: Math.random() * 4 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      opacity: Math.random(),
      duration: Math.random() * 4 + 2,
    }));
  }, []);

  useEffect(() => {
    const currentFormType = localStorage.getItem("formtype");
    if (currentFormType) setFormType(currentFormType);
  }, []);

  useEffect(() => {
    const currentEmail = localStorage.getItem("email");
    if (currentEmail) setEmail(currentEmail);
  }, []);

  // ─────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────
  const getTitle = () => {
    switch (formType) {
      case "login":
        return "Sign in to your account";
      case "signup":
        return "Create your new account";
      case "otpverify":
        return "Verify Your Email";
      case "forgot":
        return "Forgot Password";
      case "forgot-otp":
        return "Enter Verification Code";
      case "reset-password":
        return "Reset Your Password";
      default:
        return "";
    }
  };

  const getSubmitHandler = () => {
    switch (formType) {
      case "login":
        return handleLogin;
      case "signup":
        return handleSignup;
      case "otpverify":
        return handleOtpVerify;
      case "forgot":
        return handleForgotPassword;
      case "forgot-otp":
        return handleForgotOtpVerify;
      case "reset-password":
        return handleResetPassword;
      default:
        return handleLogin;
    }
  };

  const getButtonText = () => {
    switch (formType) {
      case "login":
        return "Sign In";
      case "signup":
        return "Create Account";
      case "otpverify":
        return "Verify Email";
      case "forgot":
        return "Send OTP";
      case "forgot-otp":
        return "Verify OTP";
      case "reset-password":
        return "Reset Password";
      default:
        return "Submit";
    }
  };

  const inputClass = `
    w-full pl-11 pr-4 py-3 rounded-full border outline-none transition-all duration-300
    ${
      theme === "light"
        ? "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-300"
        : "bg-[#1a1a1a] border-[#ffffff10] text-white placeholder-slate-500 focus:border-[#ffffff20]"
    }
  `;

  const labelClass = `block mb-2 text-sm ${
    theme === "light" ? "text-slate-700" : "text-slate-300"
  }`;

  const iconClass = `absolute left-4 top-1/2 -translate-y-1/2 size-4 ${
    theme === "light" ? "text-slate-400" : "text-slate-500"
  }`;

  const linkClass = "text-red-500 hover:text-red-400";

  return (
    <div
      className={`
        relative min-h-screen overflow-hidden
        flex items-center justify-center
        px-4 py-10 transition-all duration-500
        ${theme === "light" ? "bg-slate-100" : "bg-[#030303]"}
      `}
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[650px] rounded-full bg-red-500/10 blur-3xl" />
        {theme === "dark" &&
          stars.map((star) => (
            <div
              key={star.id}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                width: star.width + "px",
                height: star.height + "px",
                top: star.top + "%",
                left: star.left + "%",
                opacity: star.opacity,
                animationDuration: `${star.duration}s`,
              }}
            />
          ))}
      </div>

      {/* THEME TOGGLE */}
      <button
        onClick={themeHandle}
        className={`
          absolute top-5 right-5 z-50 p-3 rounded-full border transition-all duration-300
          ${
            theme === "light"
              ? "bg-white border-slate-200 text-black hover:bg-slate-100"
              : "bg-[#111111] border-[#ffffff10] text-white hover:bg-[#1a1a1a]"
          }
        `}
      >
        {theme === "light" ? (
          <Moon className="size-5" />
        ) : (
          <Sun className="size-5" />
        )}
      </button>

      {/* CARD */}
      <div className="relative z-10 w-full max-w-md">
        <div
          className={`
            rounded-3xl border backdrop-blur-xl p-8 shadow-2xl transition-all duration-500
            ${
              theme === "light"
                ? "bg-white border-slate-200 shadow-slate-200/40"
                : "bg-[#111111]/95 border-[#ffffff10] shadow-black/40"
            }
          `}
        >
          {/* LOGO */}
          <div className="flex flex-col items-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="logo" className="size-7" />
              <h1
                className={`text-3xl ${
                  theme === "light" ? "text-slate-900" : "text-white"
                }`}
              >
                Scheduler
              </h1>
            </Link>
            <p
              className={`text-sm mt-2 ${
                theme === "light" ? "text-slate-500" : "text-slate-400"
              }`}
            >
              {getTitle()}
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={getSubmitHandler()} className="space-y-5">
            {/* NAME — signup only */}
            {formType === "signup" && (
              <div>
                <label className={labelClass}>Full Name</label>
                <div className="relative">
                  <User2Icon className={iconClass} />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {/* EMAIL — login / signup / forgot */}
            {(formType === "login" ||
              formType === "signup" ||
              formType === "forgot") && (
              <div>
                <label className={labelClass}>Email Address</label>
                <div className="relative">
                  <MailIcon className={iconClass} />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {/* PASSWORD — login / signup */}
            {(formType === "login" || formType === "signup") && (
              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <LockIcon className={iconClass} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                  />
                </div>

                {formType === "login" && (
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFormType("forgot");
                        localStorage.setItem("formtype", "forgot");
                      }}
                      className={`text-sm ${linkClass}`}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* OTP — signup verify + forgot verify */}
            {(formType === "otpverify" || formType === "forgot-otp") && (
              <div className="relative">
                <BadgeCheck className={iconClass} />
                <input
                  type="text"
                  required
                  placeholder="Enter Verification Code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={inputClass}
                />
              </div>
            )}

            {/* NEW + CONFIRM PASSWORD — reset */}
            {formType === "reset-password" && (
              <>
                <div>
                  <label className={labelClass}>New Password</label>
                  <div className="relative">
                    <LockIcon className={iconClass} />
                    <input
                      type="password"
                      required
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Confirm Password</label>
                  <div className="relative">
                    <LockIcon className={iconClass} />
                    <input
                      type="password"
                      required
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3 rounded-full
                bg-gradient-to-r from-red-600 to-red-500
                hover:from-red-500 hover:to-red-400
                text-white transition-all duration-300
                flex items-center justify-center gap-2
                disabled:opacity-60
              "
            >
              {loading ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {getButtonText()}
                  <ArrowRightIcon className="size-4" />
                </>
              )}
            </button>
          </form>

          {/* BOTTOM LINKS */}
          <div
            className={`mt-6 text-center text-sm ${
              theme === "light" ? "text-slate-500" : "text-slate-400"
            }`}
          >
            {formType === "login" && (
              <>
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setFormType("signup");
                    localStorage.setItem("formtype", "signup");
                  }}
                  className={linkClass}
                >
                  Create one
                </button>
              </>
            )}

            {formType === "signup" && (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setFormType("login");
                    localStorage.setItem("formtype", "login");
                  }}
                  className={linkClass}
                >
                  Sign In
                </button>
              </>
            )}

            {formType === "otpverify" && (
              <div className="flex items-center justify-center gap-2">
                {otpLoading ? (
                  <Countdown
                    onComplete={() => setOtpLoading(false)}
                    renderer={renderer}
                    date={Date.now() + 20000}
                  />
                ) : (
                  <>
                    Resend Otp?{" "}
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className={linkClass}
                    >
                      Click
                    </button>
                  </>
                )}
              </div>
            )}

            {formType === "forgot" && (
              <>
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setFormType("login");
                    localStorage.setItem("formtype", "login");
                  }}
                  className={linkClass}
                >
                  Sign In
                </button>
              </>
            )}

            {formType === "forgot-otp" && (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-center gap-2">
                  {otpLoading ? (
                    <Countdown
                      onComplete={() => setOtpLoading(false)}
                      renderer={renderer}
                      date={Date.now() + 20000}
                    />
                  ) : (
                    <>
                      Resend Otp?{" "}
                      <button
                        type="button"
                        onClick={handleResendForgotOtp}
                        className={linkClass}
                      >
                        Click
                      </button>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormType("forgot");
                    localStorage.setItem("formtype", "forgot");
                  }}
                  className={`${linkClass} text-xs`}
                >
                  Change Email
                </button>
              </div>
            )}

            {formType === "reset-password" && (
              <button
                type="button"
                onClick={() => {
                  setFormType("login");
                  localStorage.setItem("formtype", "login");
                  localStorage.removeItem("email");
                }}
                className={linkClass}
              >
                Back to Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}