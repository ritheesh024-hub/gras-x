import { Eye, EyeOff, Mail, Moon, Sun } from "lucide-react";
import { useState } from "react";

interface LoginPageProps {
  onLogin: () => void;
  onGoToSignup: () => void;
}

export function LoginPage({ onLogin, onGoToSignup }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark"),
  );

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (rememberMe) {
      localStorage.setItem("ppp_remember", "true");
    }
    localStorage.setItem("ppp_auth", "true");
    onLogin();
  };

  const handleGoogleLogin = () => {
    const clientId =
      "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com";
    const redirectUri = window.location.origin + window.location.pathname;
    const scope = "openid email profile";
    const state = btoa(JSON.stringify({ action: "login", ts: Date.now() }));
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
        <div className="animate-blob-1 absolute top-[-80px] left-[-80px] w-[380px] h-[380px] rounded-full bg-[#1e3a8a]/40 blur-3xl" />
        <div className="animate-blob-2 absolute top-[20%] right-[-100px] w-[320px] h-[320px] rounded-full bg-[#0891b2]/30 blur-3xl" />
        <div className="animate-blob-3 absolute bottom-[-60px] left-[30%] w-[280px] h-[280px] rounded-full bg-[#0d9488]/35 blur-3xl" />
        <div className="absolute top-[40%] left-[-60px] w-[220px] h-[220px] rounded-full bg-[#0369a1]/25 blur-2xl animate-pulse" />
      </div>

      {/* Grid overlay for texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Theme toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Top hero section */}
      <div className="relative z-10 flex flex-col items-center pt-8 pb-4 px-4 animate-fade-in-up">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center shadow-lg">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 2L14.5 7H20L15.5 10.5L17.5 16L12 12.5L6.5 16L8.5 10.5L4 7H9.5L12 2Z"
                fill="white"
                opacity="0.9"
              />
              <path
                d="M7 18L5 20M17 18L19 20M9 20H15"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M8.5 13.5L6 16L8.5 18.5M15.5 13.5L18 16L15.5 18.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.7"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight font-display">
              GrasX
            </h1>
          </div>
        </div>
        <p className="text-sm text-teal-200/80 text-center mb-3">
          Build Skills. Track Progress. Crack Placements.
        </p>

        {/* Hero illustration */}
        <img
          src="/assets/generated/student-coding-hero-transparent.dim_600x400.png"
          alt="Student coding on laptop"
          className="w-56 sm:w-72 md:w-80 drop-shadow-2xl"
          loading="eager"
        />
      </div>

      {/* Glassmorphism card */}
      <div className="relative z-10 w-full max-w-sm mx-auto px-4 pb-8">
        <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-8">
          <h2 className="text-white font-bold text-2xl font-display mb-1">
            Welcome back!
          </h2>
          <p className="text-white/60 text-sm mb-6">
            Sign in to continue your journey
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email field */}
            <div className="floating-label-group">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 z-10">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  id="login-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  autoComplete="email"
                  required
                  className="w-full pl-9 pr-4 pt-5 pb-2 rounded-xl bg-white/10 border border-white/25 text-white placeholder-transparent focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 transition-all duration-200 text-sm peer"
                />
                <label
                  htmlFor="login-email"
                  className="absolute left-9 top-3.5 text-white/50 text-sm pointer-events-none peer-focus:text-xs peer-focus:top-1.5 peer-focus:text-teal-300 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-teal-300 transition-all duration-200"
                >
                  Email address
                </label>
              </div>
            </div>

            {/* Password field */}
            <div className="floating-label-group">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  autoComplete="current-password"
                  required
                  className="w-full pl-4 pr-10 pt-5 pb-2 rounded-xl bg-white/10 border border-white/25 text-white placeholder-transparent focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 transition-all duration-200 text-sm peer"
                />
                <label
                  htmlFor="login-password"
                  className="absolute left-4 top-3.5 text-white/50 text-sm pointer-events-none peer-focus:text-xs peer-focus:top-1.5 peer-focus:text-teal-300 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-teal-300 transition-all duration-200"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 rounded border border-white/30 bg-white/10 peer-checked:bg-teal-400 peer-checked:border-teal-400 transition-all duration-200 flex items-center justify-center">
                    {rememberMe && (
                      <svg
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-white/70 text-sm">Remember me</span>
              </label>
              <button
                type="button"
                className="text-teal-300 text-sm hover:text-teal-200 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Login
            </button>
          </form>

          {/* OR divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/15" />
            <span className="text-white/40 text-xs font-medium tracking-wider">
              OR
            </span>
            <div className="flex-1 h-px bg-white/15" />
          </div>

          {/* Google login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
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

          {/* Sign up link */}
          <p className="text-center text-white/60 text-sm mt-5">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onGoToSignup}
              className="text-teal-300 font-semibold hover:text-teal-200 transition-colors"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
