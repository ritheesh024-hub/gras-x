import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Bot,
  Briefcase,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Map as MapIcon,
  Menu,
  Moon,
  Sun,
  Target,
  Terminal,
  Trophy,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Route } from "../App";

interface StudentProfile {
  fullName?: string;
  email?: string;
  targetRole?: string;
}

function getProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem("ppp_user");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function getInitials(name?: string): string {
  if (!name) return "ST";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const roleLabels: Record<string, string> = {
  sde: "Software Dev",
  aiml: "AIML Engineer",
  data: "Data Analyst",
  core: "Core (Non-IT)",
};

type NavGroup = {
  label: string;
  items: {
    path: Route;
    label: string;
    icon: React.FC<{ className?: string }>;
  }[];
};

const navGroups: NavGroup[] = [
  {
    label: "NAVIGATION",
    items: [
      { path: "/", label: "Home", icon: LayoutDashboard },
      { path: "/roadmap", label: "Skill Roadmap", icon: MapIcon },
      { path: "/code-editor", label: "Code Practice", icon: Terminal },
      { path: "/practice", label: "Quizzzzzz", icon: Trophy },
      { path: "/ai-assistant", label: "AI Assistant", icon: Bot },
    ],
  },
  {
    label: "TOOLS",
    items: [
      { path: "/gap-analyzer", label: "Gap Analyzer", icon: Target },
      { path: "/resume", label: "Resume Builder", icon: FileText },
      { path: "/internships", label: "Internships", icon: Briefcase },
      { path: "/student", label: "ST (Student)", icon: GraduationCap },
    ],
  },
];

const allNavItems = navGroups.flatMap((g) => g.items);

interface LayoutProps {
  children: React.ReactNode;
  currentRoute: Route;
  navigate: (route: Route) => void;
  onLogout: () => void;
}

function NavItem({
  path: _path,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  path: Route;
  label: string;
  icon: React.FC<{ className?: string }>;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 w-full text-left group",
        active
          ? "bg-primary/10 text-primary"
          : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
      )}
    >
      {/* Active left border accent */}
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />
      )}
      <span
        className={cn(
          "w-7 h-7 rounded-md flex items-center justify-center transition-all duration-150 shrink-0",
          active
            ? "gradient-brand shadow-brand"
            : "bg-sidebar-accent/40 group-hover:bg-sidebar-accent",
        )}
      >
        <Icon
          className={cn(
            "w-3.5 h-3.5",
            active ? "text-white" : "text-sidebar-foreground/60",
          )}
        />
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
}

function SidebarNav({
  currentRoute,
  handleNav,
}: {
  currentRoute: Route;
  handleNav: (path: Route) => void;
}) {
  return (
    <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
      {navGroups.map((group) => (
        <div key={group.label}>
          <p className="text-[10px] font-semibold text-sidebar-foreground/30 tracking-widest px-3 mb-1.5 uppercase select-none">
            {group.label}
          </p>
          <div className="space-y-0.5">
            {group.items.map(({ path, label, icon: Icon }) => (
              <NavItem
                key={path}
                path={path}
                label={label}
                icon={Icon}
                active={currentRoute === path}
                onClick={() => handleNav(path)}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

function SidebarAccount({
  profile,
  isDark,
  currentRoute,
  handleNav,
  onToggleTheme,
  onLogout,
}: {
  profile: StudentProfile;
  isDark: boolean;
  currentRoute: Route;
  handleNav: (path: Route) => void;
  onToggleTheme: () => void;
  onLogout: () => void;
}) {
  return (
    <>
      <div className="mx-4 h-px bg-sidebar-border" />
      <div className="p-3 space-y-0.5 pb-4">
        <p className="text-[10px] font-semibold text-sidebar-foreground/30 tracking-widest px-3 mb-2 mt-1 uppercase select-none">
          ACCOUNT
        </p>

        {/* Profile card — navigates to /student */}
        <button
          type="button"
          onClick={() => handleNav("/student")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group",
            currentRoute === "/student"
              ? "bg-primary/10"
              : "hover:bg-sidebar-accent/50",
          )}
        >
          <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center shrink-0 shadow-brand ring-2 ring-sidebar">
            <span className="text-white text-[11px] font-bold leading-none">
              {getInitials(profile.fullName)}
            </span>
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-sidebar-foreground text-xs font-semibold truncate leading-tight">
              {profile.fullName || "Student"}
            </p>
            <p className="text-sidebar-foreground/40 text-[10px] truncate leading-tight mt-0.5">
              {profile.targetRole
                ? (roleLabels[profile.targetRole] ?? profile.targetRole)
                : "View profile →"}
            </p>
          </div>
        </button>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-150"
        >
          <span className="w-7 h-7 rounded-md bg-sidebar-accent/40 flex items-center justify-center shrink-0">
            {isDark ? (
              <Sun className="w-3.5 h-3.5" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
          </span>
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-xs text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-all duration-150"
        >
          <span className="w-7 h-7 rounded-md bg-sidebar-accent/40 flex items-center justify-center shrink-0">
            <LogOut className="w-3.5 h-3.5" />
          </span>
          Logout
        </button>
      </div>
    </>
  );
}

export function Layout({
  children,
  currentRoute,
  navigate,
  onLogout,
}: LayoutProps) {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profile = getProfile();

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const handleNav = (path: Route) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const toggleTheme = () => setIsDark((d) => !d);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-sidebar border-r border-sidebar-border">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-sidebar-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center gradient-brand shadow-brand shrink-0">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sidebar-foreground font-display font-bold text-sm leading-tight tracking-tight">
                GrasX
              </p>
              <p className="text-sidebar-foreground/40 text-[10px] leading-tight truncate">
                Crack Placements Faster
              </p>
            </div>
          </div>
        </div>

        <SidebarNav currentRoute={currentRoute} handleNav={handleNav} />

        <SidebarAccount
          profile={profile}
          isDark={isDark}
          currentRoute={currentRoute}
          handleNav={handleNav}
          onToggleTheme={toggleTheme}
          onLogout={onLogout}
        />
      </aside>

      {/* ── Mobile overlay ── */}
      {mobileMenuOpen && (
        <div
          role="presentation"
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMobileMenuOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-sidebar flex flex-col transition-transform duration-300 shadow-2xl",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="px-5 py-4 border-b border-sidebar-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center gradient-brand shadow-brand">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <p className="text-sidebar-foreground font-display font-bold text-sm">
              GrasX
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sidebar-foreground/60 h-7 w-7 shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <SidebarNav currentRoute={currentRoute} handleNav={handleNav} />

        <SidebarAccount
          profile={profile}
          isDark={isDark}
          currentRoute={currentRoute}
          handleNav={handleNav}
          onToggleTheme={toggleTheme}
          onLogout={onLogout}
        />
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-card border-b border-border shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
            className="h-8 w-8"
          >
            <Menu className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center gradient-brand shadow-brand">
              <GraduationCap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-sm">GrasX</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8"
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>

        {/* Mobile bottom navigation */}
        <nav className="lg:hidden flex items-stretch bg-card border-t border-border px-1 pb-safe shrink-0">
          {allNavItems.slice(0, 5).map(({ path, label, icon: Icon }) => {
            const active = currentRoute === path;
            return (
              <button
                type="button"
                key={path}
                onClick={() => handleNav(path)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 py-2 px-1 relative transition-colors duration-150 min-w-0",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-b-full gradient-brand" />
                )}
                <span
                  className={cn(
                    "w-9 h-7 rounded-lg flex items-center justify-center transition-all duration-150",
                    active ? "gradient-brand shadow-brand" : "bg-transparent",
                  )}
                >
                  <Icon className={cn("w-4 h-4", active ? "text-white" : "")} />
                </span>
                <span
                  className={cn(
                    "text-[9px] font-semibold leading-none truncate max-w-full",
                    active ? "text-primary" : "",
                  )}
                >
                  {label.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
