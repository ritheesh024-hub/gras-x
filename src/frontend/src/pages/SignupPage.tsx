import {
  BookOpen,
  Building2,
  Calendar,
  ChevronLeft,
  Eye,
  EyeOff,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useState } from "react";

interface SignupPageProps {
  onSignup: () => void;
  onGoToLogin: () => void;
}

export function SignupPage({ onSignup, onGoToLogin }: SignupPageProps) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    college: "",
    branch: "",
    year: "",
    targetRole: "",
    skillLevel: "Beginner" as "Beginner" | "Intermediate",
    phone: "",
    dob: "",
    gender: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save student details to localStorage
    localStorage.setItem(
      "ppp_user",
      JSON.stringify({
        fullName: form.fullName,
        email: form.email,
        college: form.college,
        branch: form.branch,
        year: form.year,
        targetRole: form.targetRole,
        skillLevel: form.skillLevel,
        phone: form.phone,
        dob: form.dob,
        gender: form.gender,
      }),
    );
    localStorage.setItem("ppp_auth", "true");
    onSignup();
  };

  const handleGoogleSignup = () => {
    const clientId =
      "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com";
    const redirectUri = window.location.origin + window.location.pathname;
    const scope = "openid email profile";
    const state = btoa(JSON.stringify({ action: "signup", ts: Date.now() }));
    localStorage.setItem("google_oauth_state", state);

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "token",
      scope,
      state,
      include_granted_scopes: "true",
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-start bg-gradient-to-br from-[#0a1628] via-[#0c3050] to-[#0a5f62]">
      {/* Animated blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob-2 absolute top-[-100px] right-[-80px] w-[360px] h-[360px] rounded-full bg-[#0891b2]/30 blur-3xl" />
        <div className="animate-blob-1 absolute bottom-[10%] left-[-80px] w-[300px] h-[300px] rounded-full bg-[#1e3a8a]/40 blur-3xl" />
        <div className="animate-blob-3 absolute top-[30%] right-[-40px] w-[240px] h-[240px] rounded-full bg-[#0d9488]/25 blur-2xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm mx-auto px-4 py-6">
        {/* Back button */}
        <button
          type="button"
          onClick={onGoToLogin}
          className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors mb-4 text-sm"
        >
          <ChevronLeft size={18} />
          Back to Login
        </button>

        {/* Logo row */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center shadow-lg flex-shrink-0">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 2L14.5 7H20L15.5 10.5L17.5 16L12 12.5L6.5 16L8.5 10.5L4 7H9.5L12 2Z"
                fill="white"
                opacity="0.9"
              />
            </svg>
          </div>
          <span className="text-white font-bold font-display">GrasX</span>
        </div>

        {/* Card */}
        <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 rounded-3xl shadow-2xl p-6">
          <h2 className="text-white font-bold text-xl font-display mb-0.5">
            Create Account
          </h2>
          <p className="text-white/60 text-sm mb-5">
            Start your placement journey today
          </p>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <FloatingInput
              id="signup-name"
              type="text"
              value={form.fullName}
              onChange={update("fullName")}
              label="Full Name"
              icon={<User size={15} />}
              autoComplete="name"
              required
            />

            {/* Email */}
            <FloatingInput
              id="signup-email"
              type="email"
              value={form.email}
              onChange={update("email")}
              label="Email address"
              icon={<Mail size={15} />}
              autoComplete="email"
              required
            />

            {/* Password */}
            <FloatingInput
              id="signup-password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={update("password")}
              label="Password"
              autoComplete="new-password"
              required
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-white/50 hover:text-white/80 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />

            {/* Confirm Password */}
            <FloatingInput
              id="signup-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={update("confirmPassword")}
              label="Confirm Password"
              autoComplete="new-password"
              required
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="text-white/50 hover:text-white/80 transition-colors"
                  aria-label={showConfirmPassword ? "Hide" : "Show"}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={15} />
                  ) : (
                    <Eye size={15} />
                  )}
                </button>
              }
            />

            {/* College */}
            <FloatingInput
              id="signup-college"
              type="text"
              value={form.college}
              onChange={update("college")}
              label="College Name"
              icon={<Building2 size={15} />}
              autoComplete="organization"
            />

            {/* Branch */}
            <FloatingInput
              id="signup-branch"
              type="text"
              value={form.branch}
              onChange={update("branch")}
              label="Branch (e.g. CSE, ECE)"
              icon={<BookOpen size={15} />}
            />

            {/* Phone */}
            <FloatingInput
              id="signup-phone"
              type="tel"
              value={form.phone}
              onChange={update("phone")}
              label="Mobile Number"
              icon={<Phone size={15} />}
              autoComplete="tel"
            />

            {/* Date of Birth */}
            <FloatingInput
              id="signup-dob"
              type="date"
              value={form.dob}
              onChange={update("dob")}
              label="Date of Birth"
              icon={<Calendar size={15} />}
            />

            {/* Gender dropdown */}
            <div className="relative">
              <select
                value={form.gender}
                onChange={update("gender")}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/25 text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 transition-all duration-200 appearance-none cursor-pointer text-white/80"
                style={{ colorScheme: "dark" }}
              >
                <option value="" disabled className="bg-[#0c3050] text-white">
                  Gender
                </option>
                <option value="male" className="bg-[#0c3050] text-white">
                  Male
                </option>
                <option value="female" className="bg-[#0c3050] text-white">
                  Female
                </option>
                <option value="other" className="bg-[#0c3050] text-white">
                  Prefer not to say
                </option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 5L7 9L11 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Year dropdown */}
            <div className="relative">
              <select
                value={form.year}
                onChange={update("year")}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/25 text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 transition-all duration-200 appearance-none cursor-pointer text-white/80"
                style={{ colorScheme: "dark" }}
              >
                <option value="" disabled className="bg-[#0c3050] text-white">
                  Select Year
                </option>
                <option value="1st" className="bg-[#0c3050] text-white">
                  1st Year
                </option>
                <option value="2nd" className="bg-[#0c3050] text-white">
                  2nd Year
                </option>
                <option value="3rd" className="bg-[#0c3050] text-white">
                  3rd Year
                </option>
                <option value="4th" className="bg-[#0c3050] text-white">
                  4th Year
                </option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 5L7 9L11 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Target Role dropdown */}
            <div className="relative">
              <select
                value={form.targetRole}
                onChange={update("targetRole")}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/25 text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 transition-all duration-200 appearance-none cursor-pointer text-white/80"
                style={{ colorScheme: "dark" }}
              >
                <option value="" disabled className="bg-[#0c3050] text-white">
                  Target Role
                </option>
                <option value="sde" className="bg-[#0c3050] text-white">
                  Software Developer
                </option>
                <option value="aiml" className="bg-[#0c3050] text-white">
                  AIML Engineer
                </option>
                <option value="data" className="bg-[#0c3050] text-white">
                  Data Analyst
                </option>
                <option value="core" className="bg-[#0c3050] text-white">
                  Core (Non-IT)
                </option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 5L7 9L11 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Skill Level pill toggle */}
            <div>
              <p className="text-white/60 text-xs mb-2 ml-1">Skill Level</p>
              <div className="flex rounded-xl bg-white/10 border border-white/20 p-1 gap-1">
                {(["Beginner", "Intermediate"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, skillLevel: level }))
                    }
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      form.skillLevel === level
                        ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md"
                        : "text-white/60 hover:text-white/80"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Create Account button */}
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-1"
            >
              Create Account
            </button>
          </form>

          {/* OR divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-white/15" />
            <span className="text-white/40 text-xs font-medium tracking-wider">
              OR
            </span>
            <div className="flex-1 h-px bg-white/15" />
          </div>

          {/* Google signup */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full py-2.5 rounded-full bg-white text-gray-700 font-medium text-sm flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-white/60 text-sm mt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onGoToLogin}
              className="text-teal-300 font-semibold hover:text-teal-200 transition-colors"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// Reusable floating input component
interface FloatingInputProps {
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  autoComplete?: string;
  required?: boolean;
}

function FloatingInput({
  id,
  type,
  value,
  onChange,
  label,
  icon,
  rightIcon,
  autoComplete,
  required,
}: FloatingInputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 z-10 pointer-events-none">
          {icon}
        </div>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        autoComplete={autoComplete}
        required={required}
        className={`w-full ${icon ? "pl-9" : "pl-4"} ${rightIcon ? "pr-10" : "pr-4"} pt-5 pb-2 rounded-xl bg-white/10 border border-white/25 text-white placeholder-transparent focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 transition-all duration-200 text-sm peer`}
      />
      <label
        htmlFor={id}
        className={`absolute ${icon ? "left-9" : "left-4"} top-3.5 text-white/50 text-sm pointer-events-none peer-focus:text-xs peer-focus:top-1.5 peer-focus:text-teal-300 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-teal-300 transition-all duration-200`}
      >
        {label}
      </label>
      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
          {rightIcon}
        </div>
      )}
    </div>
  );
}
