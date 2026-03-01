import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Code2,
  Menu,
  Rocket,
  Target,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface LandingPageProps {
  onGetStarted: () => void;
  onGoToCompiler: () => void;
}

// ── Scroll-aware fade-in hook ──────────────────────────────────────────────
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

// ── Navbar ─────────────────────────────────────────────────────────────────
function Navbar({
  onGetStarted,
  onGoToCompiler,
}: {
  onGetStarted: () => void;
  onGoToCompiler: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "background 0.3s ease, box-shadow 0.3s ease",
        background: scrolled ? "rgba(15, 23, 42, 0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 1px 30px rgba(0,0,0,0.3)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* Logo */}
        <button
          type="button"
          style={{
            fontFamily: "'Bricolage Grotesque', 'Cabinet Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: "1.5rem",
            background: "linear-gradient(135deg, #2dd4bf, #3b82f6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.02em",
            cursor: "pointer",
            border: "none",
            padding: 0,
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          GrasX
        </button>

        {/* Desktop Nav links */}
        <div
          className="hidden md:flex items-center gap-1"
          style={{ gap: "0.25rem" }}
        >
          {["Home", "Features"].map((link) => (
            <button
              key={link}
              type="button"
              onClick={() => {
                if (link === "Home")
                  window.scrollTo({ top: 0, behavior: "smooth" });
                if (link === "Features") {
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              style={{
                color: "rgba(255,255,255,0.8)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                borderRadius: "6px",
                transition: "all 0.2s ease",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.color = "#ffffff";
                (e.target as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.color =
                  "rgba(255,255,255,0.8)";
                (e.target as HTMLButtonElement).style.background = "none";
              }}
            >
              {link}
            </button>
          ))}
          <button
            type="button"
            onClick={onGoToCompiler}
            style={{
              color: "rgba(255,255,255,0.8)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              borderRadius: "6px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.color = "#2dd4bf";
              (e.target as HTMLButtonElement).style.background =
                "rgba(45,212,191,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.color =
                "rgba(255,255,255,0.8)";
              (e.target as HTMLButtonElement).style.background = "none";
            }}
          >
            Compiler
          </button>
          <button
            type="button"
            onClick={onGetStarted}
            style={{
              background: "linear-gradient(135deg, #2dd4bf, #3b82f6)",
              color: "#ffffff",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              borderRadius: "9999px",
              marginLeft: "0.5rem",
              transition: "all 0.2s ease",
              boxShadow: "0 0 20px rgba(45,212,191,0.3)",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.transform = "scale(1.05)";
              (e.target as HTMLButtonElement).style.boxShadow =
                "0 0 30px rgba(45,212,191,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.transform = "scale(1)";
              (e.target as HTMLButtonElement).style.boxShadow =
                "0 0 20px rgba(45,212,191,0.3)";
            }}
          >
            Get Started
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          style={{
            color: "white",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.5rem",
          }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          style={{
            background: "rgba(15, 23, 42, 0.98)",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            padding: "1rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {[
            {
              label: "Home",
              action: () => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setMobileOpen(false);
              },
            },
            {
              label: "Features",
              action: () => {
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" });
                setMobileOpen(false);
              },
            },
            {
              label: "Compiler",
              action: () => {
                onGoToCompiler();
                setMobileOpen(false);
              },
            },
          ].map(({ label, action }) => (
            <button
              key={label}
              type="button"
              onClick={action}
              style={{
                color: "rgba(255,255,255,0.8)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.75rem 0",
                fontSize: "1rem",
                fontWeight: 500,
                textAlign: "left",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              onGetStarted();
              setMobileOpen(false);
            }}
            style={{
              background: "linear-gradient(135deg, #2dd4bf, #3b82f6)",
              color: "#ffffff",
              border: "none",
              cursor: "pointer",
              padding: "0.75rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              borderRadius: "9999px",
              marginTop: "0.5rem",
              textAlign: "center",
            }}
          >
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
}

// ── Dashboard Card (mock) ─────────────────────────────────────────────────
function DashboardCard() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? "rotate(0deg) scale(1.05)" : "rotate(-8deg)",
        transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        background: "#ffffff",
        borderRadius: "24px",
        boxShadow: hovered
          ? "0 40px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.1)"
          : "0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)",
        padding: "1.5rem",
        width: "100%",
        maxWidth: "340px",
        cursor: "default",
      }}
    >
      {/* Card header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
        }}
      >
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: 700,
            color: "#0f172a",
            fontFamily: "'Bricolage Grotesque', sans-serif",
          }}
        >
          GrasX Dashboard
        </span>
        <div style={{ display: "flex", gap: "5px" }}>
          {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
            <div
              key={c}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: c,
              }}
            />
          ))}
        </div>
      </div>

      {/* Stats */}
      {[
        {
          label: "Placement Readiness",
          value: 78,
          color: "#3b82f6",
          text: "78%",
        },
        {
          label: "Daily Streak 🔥",
          value: 82,
          color: "#f59e0b",
          text: "12 days",
        },
        {
          label: "Skills Mastered",
          value: 60,
          color: "#2dd4bf",
          text: "6 / 10",
        },
      ].map(({ label, value, color, text }) => (
        <div key={label} style={{ marginBottom: "1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "4px",
            }}
          >
            <span
              style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 500 }}
            >
              {label}
            </span>
            <span style={{ fontSize: "0.7rem", color, fontWeight: 700 }}>
              {text}
            </span>
          </div>
          <div
            style={{
              height: "6px",
              background: "#f1f5f9",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${value}%`,
                background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                borderRadius: "999px",
                transition: "width 1s ease",
              }}
            />
          </div>
        </div>
      ))}

      {/* Tag chips */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginTop: "1.25rem",
        }}
      >
        {[
          { label: "Code Practice", color: "#3b82f6" },
          { label: "Roadmap", color: "#2dd4bf" },
          { label: "Quiz Arena", color: "#8b5cf6" },
          { label: "AI Guide", color: "#f59e0b" },
        ].map(({ label, color }) => (
          <span
            key={label}
            style={{
              fontSize: "0.65rem",
              fontWeight: 600,
              padding: "3px 8px",
              borderRadius: "999px",
              background: `${color}18`,
              color,
              border: `1px solid ${color}33`,
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Mini activity graph */}
      <div
        style={{
          marginTop: "1.25rem",
          display: "flex",
          gap: "3px",
          alignItems: "flex-end",
        }}
      >
        {[40, 65, 50, 80, 55, 90, 75].map((h, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static decorative bars
            key={i}
            style={{
              flex: 1,
              height: `${h * 0.4}px`,
              background:
                i === 5
                  ? "linear-gradient(180deg, #2dd4bf, #3b82f6)"
                  : "#e2e8f0",
              borderRadius: "3px 3px 0 0",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
      <p style={{ fontSize: "0.6rem", color: "#94a3b8", marginTop: "4px" }}>
        Weekly Activity
      </p>
    </div>
  );
}

// ── Feature Card ──────────────────────────────────────────────────────────
function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  delay,
}: {
  icon: React.FC<{ size?: number; color?: string }>;
  title: string;
  description: string;
  color: string;
  delay: number;
}) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "20px",
        padding: "1.75rem",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform =
          "translateY(-4px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 12px 40px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = visible
          ? "translateY(0)"
          : "translateY(32px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 24px rgba(0,0,0,0.06)";
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "14px",
          background: `${color}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <Icon size={22} color={color} />
      </div>
      <h3
        style={{
          fontSize: "1rem",
          fontWeight: 700,
          color: "#0f172a",
          marginBottom: "0.5rem",
          fontFamily: "'Bricolage Grotesque', sans-serif",
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.6 }}>
        {description}
      </p>
    </div>
  );
}

// ── Start Exploring Section ───────────────────────────────────────────────
function StartExploring({ onGetStarted }: { onGetStarted: () => void }) {
  const { ref, visible } = useFadeIn();
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <section
      style={{
        background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
        padding: "6rem 1.5rem",
        textAlign: "center",
      }}
    >
      <div
        ref={ref}
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background:
              "linear-gradient(135deg, rgba(45,212,191,0.12), rgba(59,130,246,0.12))",
            border: "1px solid rgba(45,212,191,0.3)",
            borderRadius: "999px",
            padding: "0.375rem 1rem",
            marginBottom: "1.5rem",
          }}
        >
          <Rocket size={14} color="#2dd4bf" />
          <span
            style={{ fontSize: "0.75rem", fontWeight: 600, color: "#0f172a" }}
          >
            Your journey begins here
          </span>
        </div>

        <h2
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 800,
            color: "#0f172a",
            fontFamily: "'Bricolage Grotesque', sans-serif",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: "1.25rem",
          }}
        >
          Start Exploring
        </h2>
        <p
          style={{
            fontSize: "1.125rem",
            color: "#475569",
            lineHeight: 1.7,
            marginBottom: "2.5rem",
          }}
        >
          Pick your path, track your skills, and practice daily with AI
          guidance. Your placement journey starts here — free to explore,
          designed to win.
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={onGetStarted}
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
            style={{
              padding: "0.875rem 2rem",
              fontSize: "1rem",
              fontWeight: 700,
              borderRadius: "9999px",
              border: btnHovered
                ? "2px solid transparent"
                : "2px solid #2dd4bf",
              background: btnHovered
                ? "linear-gradient(135deg, #2dd4bf, #3b82f6)"
                : "transparent",
              color: btnHovered ? "#ffffff" : "#2dd4bf",
              cursor: "pointer",
              transition: "all 0.25s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: btnHovered ? "0 0 30px rgba(45,212,191,0.35)" : "none",
            }}
          >
            Explore Now
            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            onClick={onGetStarted}
            style={{
              padding: "0.875rem 2rem",
              fontSize: "1rem",
              fontWeight: 700,
              borderRadius: "9999px",
              border: "none",
              background: "linear-gradient(135deg, #2dd4bf, #3b82f6)",
              color: "#ffffff",
              cursor: "pointer",
              transition: "all 0.25s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: "0 0 24px rgba(45,212,191,0.25)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1.04)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 40px rgba(45,212,191,0.45)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 24px rgba(45,212,191,0.25)";
            }}
          >
            Create Account
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Trust signals */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
            marginTop: "2.5rem",
            flexWrap: "wrap",
          }}
        >
          {[
            "AI Roadmaps",
            "Code Compiler",
            "Quiz Arena",
            "Internship Tracker",
          ].map((item) => (
            <div
              key={item}
              style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}
            >
              <CheckCircle2 size={14} color="#2dd4bf" />
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Main Landing Page ─────────────────────────────────────────────────────
export function LandingPage({
  onGetStarted,
  onGoToCompiler,
}: LandingPageProps) {
  const features = [
    {
      icon: Brain,
      title: "AI Placement Assistant",
      description:
        "Ask coding questions, get explanations, debug errors, and get personalized placement guidance — all powered by AI.",
      color: "#8b5cf6",
      delay: 0,
    },
    {
      icon: Target,
      title: "Skill Gap Analyzer",
      description:
        "Compare your current skills against TCS, Infosys, Amazon, Google requirements. Know exactly what to learn next.",
      color: "#3b82f6",
      delay: 100,
    },
    {
      icon: TrendingUp,
      title: "Month-Wise Roadmap",
      description:
        "Structured 6-month learning plan with topics, PDFs, YouTube videos in Telugu, Hindi & English, and quizzes.",
      color: "#2dd4bf",
      delay: 200,
    },
    {
      icon: Code2,
      title: "Code Practice",
      description:
        "VS Code-style editor with 11 languages, AI debug assistant, practice/interview/contest modes, and history.",
      color: "#f59e0b",
      delay: 300,
    },
    {
      icon: Zap,
      title: "Quiz & Company Prep",
      description:
        "Company-wise aptitude, technical, and HR round questions with gamification, XP, badges, and leaderboards.",
      color: "#ef4444",
      delay: 400,
    },
    {
      icon: BookOpen,
      title: "Resume Builder",
      description:
        "Modern templates, ATS compatibility scoring, auto skill suggestions, and AI-powered improvement tips.",
      color: "#22c55e",
      delay: 500,
    },
  ];

  return (
    <div
      style={{
        fontFamily: "'General Sans', 'Outfit', system-ui, sans-serif",
        overflowX: "hidden",
        background: "#ffffff",
      }}
    >
      <Navbar onGetStarted={onGetStarted} onGoToCompiler={onGoToCompiler} />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          background: "linear-gradient(115deg, #0f172a 55%, #f8fafc 45%)",
          display: "flex",
          alignItems: "center",
          paddingTop: "64px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Atmospheric glow */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "20%",
            width: "300px",
            height: "300px",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "4rem 1.5rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
            width: "100%",
          }}
          className="hero-grid"
        >
          {/* Left: Text content */}
          <div>
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(45,212,191,0.12)",
                border: "1px solid rgba(45,212,191,0.25)",
                borderRadius: "999px",
                padding: "0.375rem 1rem",
                marginBottom: "1.5rem",
              }}
            >
              <Zap size={13} color="#2dd4bf" />
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#2dd4bf",
                  letterSpacing: "0.02em",
                }}
              >
                AI-Powered Placement Prep
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                fontWeight: 800,
                color: "#ffffff",
                fontFamily:
                  "'Bricolage Grotesque', 'Cabinet Grotesk', sans-serif",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                marginBottom: "1.5rem",
              }}
            >
              A Smarter Way to{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #2dd4bf, #3b82f6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Crack, Learn
              </span>{" "}
              & Get Placements
            </h1>

            {/* Subheading */}
            <p
              style={{
                fontSize: "1.125rem",
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.75,
                marginBottom: "2.5rem",
                maxWidth: "520px",
              }}
            >
              AI-powered roadmap, real-time progress tracking, skill gap
              analysis, and built-in compiler — everything you need to land your
              dream placement.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={onGetStarted}
                style={{
                  background: "linear-gradient(135deg, #2dd4bf, #3b82f6)",
                  color: "#ffffff",
                  border: "none",
                  cursor: "pointer",
                  padding: "1rem 2rem",
                  fontSize: "1rem",
                  fontWeight: 700,
                  borderRadius: "9999px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "all 0.25s ease",
                  boxShadow: "0 0 32px rgba(45,212,191,0.4)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1.05)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 0 48px rgba(45,212,191,0.6)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 0 32px rgba(45,212,191,0.4)";
                }}
              >
                Create Account
                <ArrowRight size={18} />
              </button>
              <button
                type="button"
                onClick={onGoToCompiler}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  cursor: "pointer",
                  padding: "1rem 1.75rem",
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: "9999px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "all 0.25s ease",
                  backdropFilter: "blur(8px)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.14)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(255,255,255,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(255,255,255,0.18)";
                }}
              >
                <Code2 size={16} />
                Try Compiler
              </button>
            </div>

            {/* Social proof chips */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "2.5rem",
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "10+ Languages", icon: "💻" },
                { label: "AI Assistant", icon: "🤖" },
                { label: "Company Prep", icon: "🏢" },
              ].map(({ label, icon }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "0.8rem",
                  }}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Floating card */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: "2rem",
            }}
          >
            <DashboardCard />
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            color: "rgba(255,255,255,0.3)",
            fontSize: "0.7rem",
            animation: "bounce 2s infinite",
          }}
        >
          <span>Scroll down</span>
          <div
            style={{
              width: "1px",
              height: "40px",
              background:
                "linear-gradient(180deg, rgba(45,212,191,0.6), transparent)",
            }}
          />
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section
        id="features"
        style={{
          background: "#f8fafc",
          padding: "5rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                fontWeight: 800,
                color: "#0f172a",
                fontFamily: "'Bricolage Grotesque', sans-serif",
                letterSpacing: "-0.03em",
                marginBottom: "1rem",
              }}
            >
              Everything You Need to{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #2dd4bf, #3b82f6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Succeed
              </span>
            </h2>
            <p
              style={{
                fontSize: "1.125rem",
                color: "#64748b",
                maxWidth: "560px",
                margin: "0 auto",
              }}
            >
              GrasX brings AI-powered tools, structured roadmaps, and
              company-specific prep into one seamless platform.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── START EXPLORING ──────────────────────────────────────────────── */}
      <StartExploring onGetStarted={onGetStarted} />

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: "#0f172a",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "2rem 1.5rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 700,
            fontSize: "1.1rem",
            background: "linear-gradient(135deg, #2dd4bf, #3b82f6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "0.5rem",
          }}
        >
          GrasX
        </div>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.875rem" }}>
          © {new Date().getFullYear()} GrasX. Built for placement success.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgba(45,212,191,0.6)", textDecoration: "none" }}
          >
            Built with ♥ using caffeine.ai
          </a>
        </p>
      </footer>

      {/* Bounce animation for scroll indicator */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-8px); }
        }
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
            text-align: center;
          }
          .hero-grid > div:last-child {
            display: flex;
            justify-content: center;
            padding-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
