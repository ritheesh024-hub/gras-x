import { GradientProgress } from "@/components/GradientProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useInternshipApplications,
  useRoadmapProgress,
  useSkills,
  useUserProfile,
} from "@/hooks/useQueries";
import {
  ArrowRight,
  Bot,
  Brain,
  Briefcase,
  CheckCircle2,
  Code2,
  FileText,
  Flame,
  Map as MapIcon,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import type { Route } from "../App";

const ROADMAP_MONTHS = [
  "C Programming Basics",
  "C++ Fundamentals",
  "Python Basics",
  "HTML + CSS",
  "JavaScript Basics",
  "Data Structures",
  "Advanced DSA",
  "OOPS in Java",
  "Git & GitHub",
  "Oracle SQL",
  "Aptitude Prep",
  "Mini Project + Resume",
];

const quickLinks: {
  path: Route;
  label: string;
  icon: React.FC<{ className?: string }>;
  desc: string;
  iconClass: string;
  bgClass: string;
}[] = [
  {
    path: "/roadmap",
    label: "Skill Roadmap",
    icon: MapIcon,
    desc: "12-month learning plan",
    iconClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-500/10",
  },
  {
    path: "/code-editor",
    label: "Code Practice",
    icon: Code2,
    desc: "Write & run code online",
    iconClass: "text-violet-600 dark:text-violet-400",
    bgClass: "bg-violet-500/10",
  },
  {
    path: "/practice",
    label: "Quiz Arena",
    icon: Trophy,
    desc: "Test your knowledge",
    iconClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-500/10",
  },
  {
    path: "/gap-analyzer",
    label: "Gap Analyzer",
    icon: Target,
    desc: "Find missing skills",
    iconClass: "text-rose-600 dark:text-rose-400",
    bgClass: "bg-rose-500/10",
  },
  {
    path: "/resume",
    label: "Resume Builder",
    icon: FileText,
    desc: "Build ATS-friendly CV",
    iconClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-500/10",
  },
  {
    path: "/internships",
    label: "Internship Tracker",
    icon: Briefcase,
    desc: "Track applications",
    iconClass: "text-orange-600 dark:text-orange-400",
    bgClass: "bg-orange-500/10",
  },
  {
    path: "/ai-assistant",
    label: "AI Assistant",
    icon: Bot,
    desc: "Chat & get placement help",
    iconClass: "text-teal-600 dark:text-teal-400",
    bgClass: "bg-teal-500/10",
  },
];

interface DashboardProps {
  navigate?: (route: Route) => void;
}

export function Dashboard({ navigate = () => {} }: DashboardProps) {
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: skills = [] } = useSkills();
  const { data: internships = [] } = useInternshipApplications();
  const currentMonth = new Date().getMonth();
  const { data: roadmapProgress } = useRoadmapProgress(
    Math.min(currentMonth, 11),
  );

  const streak = profile ? Number(profile.currentStreak) : 0;
  const totalSolved = profile ? Number(profile.totalSolvedQuestions) : 0;

  const skillsCompleted =
    skills.length > 0
      ? Math.round(
          skills.reduce((sum, s) => sum + Number(s.progressPercent), 0) /
            skills.length,
        )
      : 0;

  const internshipsApplied = internships.length;
  const currentRoadmapPercent = roadmapProgress
    ? Number(roadmapProgress.completionPercent)
    : 0;
  const currentMonthName = ROADMAP_MONTHS[Math.min(currentMonth, 11)];

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const userName = profile?.name || "Student";

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const stats = [
    {
      icon: Flame,
      label: "Day Streak",
      value: streak,
      unit: "days",
      iconColor: "text-orange-500",
      iconBg: "bg-orange-500/10",
    },
    {
      icon: Code2,
      label: "Questions Solved",
      value: totalSolved,
      unit: "total",
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
    },
    {
      icon: Brain,
      label: "Skill Progress",
      value: `${skillsCompleted}%`,
      unit: "avg",
      iconColor: "text-violet-500",
      iconBg: "bg-violet-500/10",
    },
    {
      icon: Briefcase,
      label: "Applications",
      value: internshipsApplied,
      unit: "applied",
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="p-5 sm:p-6 space-y-5 max-w-7xl mx-auto stagger-children">
      {/* ── Today's Focus hero card ── */}
      <div className="relative rounded-2xl overflow-hidden gradient-brand p-5 sm:p-6">
        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        {/* Soft glow blob */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-white/60" />
              <span className="text-white/60 text-[11px] font-medium tracking-widest uppercase">
                Today's Focus
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-white leading-tight">
              {greeting},{" "}
              {profileLoading ? (
                <span className="opacity-50">...</span>
              ) : (
                userName
              )}
              !
            </h1>
            <p className="text-white/50 text-xs mt-1.5">{today}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Streak pill */}
            <div className="flex items-center gap-2.5 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/10">
              <Flame className="w-5 h-5 text-orange-300" />
              <div>
                <p className="text-white/50 text-[10px] leading-none font-medium">
                  Streak
                </p>
                <p className="text-white font-display font-bold text-lg leading-none mt-0.5">
                  {profileLoading ? "—" : streak}{" "}
                  <span className="text-xs font-normal opacity-60">days</span>
                </p>
              </div>
            </div>

            {/* CTA — hidden on mobile */}
            <button
              type="button"
              onClick={() => navigate("/practice")}
              className="hidden sm:flex items-center gap-2 bg-white text-primary rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-white/90 active:scale-95 transition-all duration-150 shadow-sm"
            >
              <Zap className="w-4 h-4" />
              Practice Now
            </button>
          </div>
        </div>

        {/* Mobile CTA */}
        <button
          type="button"
          onClick={() => navigate("/practice")}
          className="sm:hidden mt-4 w-full flex items-center justify-center gap-2 bg-white/15 text-white rounded-xl px-4 py-2.5 text-sm font-semibold backdrop-blur-sm border border-white/20 active:scale-95 transition-all duration-150"
        >
          <Zap className="w-4 h-4" />
          Start Today's Practice
        </button>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="card-hover border-border/60 overflow-hidden"
          >
            <CardContent className="p-4 sm:p-5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${stat.iconBg}`}
              >
                <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
              </div>
              {profileLoading ? (
                <Skeleton className="h-7 w-16 mt-1" />
              ) : (
                <>
                  <p className="text-2xl font-display font-bold leading-none">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground text-xs mt-1.5 leading-tight">
                    {stat.label}
                    <span className="text-muted-foreground/50 ml-1">
                      · {stat.unit}
                    </span>
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Roadmap Progress ── */}
      <Card className="border-border/60 card-elevated overflow-hidden">
        <div className="gradient-brand-soft px-5 pt-5 pb-4 border-b border-border/30">
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-brand shrink-0">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="font-display font-bold text-sm leading-tight">
                  Monthly Roadmap Progress
                </h2>
                <p className="text-muted-foreground text-xs mt-0.5 truncate">
                  Month {Math.min(currentMonth + 1, 12)}: {currentMonthName}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/roadmap")}
              className="text-xs font-semibold text-primary flex items-center gap-1 hover:gap-1.5 transition-all duration-150 shrink-0 whitespace-nowrap group"
            >
              View all
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-150" />
            </button>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-bold gradient-brand-text">
                {currentRoadmapPercent}%
              </span>
            </div>
            <GradientProgress value={currentRoadmapPercent} height={6} />
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-1.5">
            {ROADMAP_MONTHS.map((month, monthIdx) => (
              <span
                key={month}
                className={`text-[11px] px-2 py-1 rounded-md font-medium transition-all duration-150 leading-tight ${
                  monthIdx < currentMonth
                    ? "gradient-brand text-white"
                    : monthIdx === currentMonth
                      ? "border border-primary/60 text-primary bg-primary/10 font-semibold"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {monthIdx + 1}. {month.split(" ").slice(0, 2).join(" ")}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Quick Access ── */}
      <div>
        <h2 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <Trophy className="w-3.5 h-3.5" />
          Quick Access
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickLinks.map(
            ({ path, label, icon: Icon, desc, iconClass, bgClass }) => (
              <button
                type="button"
                key={path}
                onClick={() => navigate(path)}
                className="text-left rounded-xl bg-card border border-border/60 p-4 transition-all duration-200 hover:border-border hover:shadow-card-md active:scale-[0.98] group card-hover"
              >
                <div
                  className={`w-9 h-9 rounded-xl ${bgClass} flex items-center justify-center mb-3 transition-transform duration-150 group-hover:scale-105`}
                >
                  <Icon className={`w-4 h-4 ${iconClass}`} />
                </div>
                <div className="flex items-start justify-between gap-1">
                  <h3 className="font-display font-bold text-xs sm:text-sm leading-tight">
                    {label}
                  </h3>
                  <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-150 shrink-0 mt-0.5" />
                </div>
                <p className="text-muted-foreground text-[11px] mt-1 leading-snug hidden sm:block">
                  {desc}
                </p>
              </button>
            ),
          )}
        </div>
      </div>

      {/* ── Upcoming Goals ── */}
      <Card className="border-border/60 card-elevated">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="font-display text-sm flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Upcoming Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5 space-y-3">
          {[
            {
              text: "Complete 5 coding problems this week",
              period: "This Week",
              done: false,
            },
            {
              text: `Finish Month ${Math.min(currentMonth + 1, 12)}: ${currentMonthName}`,
              period: "This Month",
              done: false,
            },
            {
              text: "Apply to 3 internship positions",
              period: "This Month",
              done: internshipsApplied >= 3,
            },
            {
              text: "Update your skills progress",
              period: "Ongoing",
              done: skillsCompleted > 50,
            },
          ].map((goal) => (
            <div key={goal.text} className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                  goal.done ? "border-success bg-success" : "border-border"
                }`}
              >
                {goal.done && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white fill-white" />
                )}
              </div>
              <span
                className={`text-sm flex-1 leading-snug ${goal.done ? "line-through text-muted-foreground" : "text-foreground"}`}
              >
                {goal.text}
              </span>
              <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                {goal.period}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground py-4 border-t border-border/40">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
