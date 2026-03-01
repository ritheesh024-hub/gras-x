import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  GraduationCap,
  Info,
  Lock,
  Mail,
  Monitor,
  Moon,
  Pencil,
  Phone,
  Plus,
  Save,
  Settings,
  Shield,
  Sun,
  Target,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface StudentProfile {
  fullName?: string;
  email?: string;
  college?: string;
  branch?: string;
  year?: string;
  targetRole?: string;
  skillLevel?: string;
  phone?: string;
  dob?: string;
  gender?: string;
}

interface Reminder {
  id: string;
  title: string;
  time: string;
  enabled: boolean;
}

function getProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem("ppp_user");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProfile(data: StudentProfile) {
  const existing = getProfile();
  localStorage.setItem("ppp_user", JSON.stringify({ ...existing, ...data }));
}

function getReminders(): Reminder[] {
  try {
    const raw = localStorage.getItem("gx_reminders");
    return raw
      ? JSON.parse(raw)
      : [
          {
            id: "1",
            title: "Daily Coding Practice",
            time: "09:00",
            enabled: true,
          },
          {
            id: "2",
            title: "Weekly Goal Review",
            time: "18:00",
            enabled: true,
          },
          { id: "3", title: "Interview Prep", time: "20:00", enabled: false },
        ];
  } catch {
    return [];
  }
}

function saveReminders(reminders: Reminder[]) {
  localStorage.setItem("gx_reminders", JSON.stringify(reminders));
}

const roleLabels: Record<string, string> = {
  sde: "Software Developer",
  aiml: "AIML Engineer",
  data: "Data Analyst",
  core: "Core (Non-IT)",
};

const yearLabels: Record<string, string> = {
  "1": "1st Year",
  "2": "2nd Year",
  "3": "3rd Year",
  "4": "4th Year",
};

type ThemeMode = "dark" | "light" | "system";

function getThemeMode(): ThemeMode {
  const stored = localStorage.getItem("theme");
  if (stored === "dark") return "dark";
  if (stored === "light") return "light";
  return "system";
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === "dark") {
    root.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else if (mode === "light") {
    root.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    localStorage.removeItem("theme");
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
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

/* ─────────────────────── Settings Modal ─────────────────────── */
function SettingsModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<
    "theme" | "reminders" | "policy" | "about"
  >("theme");
  const [themeMode, setThemeMode] = useState<ThemeMode>(getThemeMode);
  const [reminders, setReminders] = useState<Reminder[]>(getReminders);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("09:00");

  const handleTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
    applyTheme(mode);
  };

  const toggleReminder = (id: string) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, enabled: !r.enabled } : r,
    );
    setReminders(updated);
    saveReminders(updated);
  };

  const addReminder = () => {
    if (!newTitle.trim()) return;
    const updated = [
      ...reminders,
      {
        id: Date.now().toString(),
        title: newTitle.trim(),
        time: newTime,
        enabled: true,
      },
    ];
    setReminders(updated);
    saveReminders(updated);
    setNewTitle("");
    setNewTime("09:00");
  };

  const deleteReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    saveReminders(updated);
  };

  const tabs = [
    { id: "theme" as const, label: "Theme", icon: Sun },
    { id: "reminders" as const, label: "Reminders", icon: Bell },
    { id: "policy" as const, label: "Policy", icon: Shield },
    { id: "about" as const, label: "About", icon: Info },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        role="presentation"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center shadow-brand">
              <Settings className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-foreground leading-tight">
                Settings
              </h2>
              <p className="text-muted-foreground text-xs">
                Manage your preferences
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab strip */}
        <div className="flex border-b border-border px-4 shrink-0">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium border-b-2 transition-colors duration-150 ${
                activeTab === id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Theme */}
          {activeTab === "theme" && (
            <div className="space-y-2.5">
              <p className="text-xs text-muted-foreground mb-3">
                Choose how GrasX looks to you.
              </p>
              {(
                [
                  {
                    mode: "light" as ThemeMode,
                    icon: Sun,
                    label: "Light Mode",
                    desc: "Clean bright interface",
                  },
                  {
                    mode: "dark" as ThemeMode,
                    icon: Moon,
                    label: "Dark Mode",
                    desc: "Easy on the eyes at night",
                  },
                  {
                    mode: "system" as ThemeMode,
                    icon: Monitor,
                    label: "System Default",
                    desc: "Follow your device setting",
                  },
                ] as const
              ).map(({ mode, icon: Icon, label, desc }) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => handleTheme(mode)}
                  className={`w-full flex items-center gap-4 p-3.5 rounded-xl border-2 text-left transition-all duration-150 ${
                    themeMode === mode
                      ? "border-primary gradient-brand-soft"
                      : "border-border hover:border-primary/40 bg-muted/20"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      themeMode === mode
                        ? "gradient-brand shadow-brand"
                        : "bg-accent"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        themeMode === mode
                          ? "text-white"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">
                      {label}
                    </p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  {themeMode === mode && (
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Reminders */}
          {activeTab === "reminders" && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Manage your study reminders.
              </p>
              <div className="flex gap-2 p-3 rounded-xl bg-muted/40 border border-border">
                <Input
                  placeholder="Reminder title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="flex-1 text-sm h-8"
                  onKeyDown={(e) => e.key === "Enter" && addReminder()}
                />
                <Input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-24 text-sm h-8"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={addReminder}
                  className="gradient-brand text-white h-8 px-3 shadow-brand"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="space-y-2">
                {reminders.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
                  >
                    <Bell
                      className={`w-4 h-4 shrink-0 ${
                        r.enabled ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          r.enabled
                            ? "text-foreground"
                            : "text-muted-foreground line-through"
                        }`}
                      >
                        {r.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{r.time}</p>
                    </div>
                    <Switch
                      checked={r.enabled}
                      onCheckedChange={() => toggleReminder(r.id)}
                    />
                    <button
                      type="button"
                      onClick={() => deleteReminder(r.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-150"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {reminders.length === 0 && (
                  <p className="text-center text-muted-foreground text-sm py-8">
                    No reminders yet. Add one above!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Policy */}
          {activeTab === "policy" && (
            <div className="space-y-2.5">
              <p className="text-xs text-muted-foreground mb-3">
                Read our policies and terms.
              </p>
              {[
                {
                  icon: Shield,
                  label: "Privacy Policy",
                  desc: "How we handle your data",
                },
                {
                  icon: FileText,
                  label: "Terms & Conditions",
                  desc: "Rules for using GrasX",
                },
                {
                  icon: Lock,
                  label: "Data Security",
                  desc: "All data stored locally on your device",
                },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 p-3.5 rounded-xl border border-border bg-muted/20 hover:border-primary/30 transition-colors duration-150 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">
                      {label}
                    </p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* About */}
          {activeTab === "about" && (
            <div className="space-y-5">
              <div className="flex flex-col items-center text-center py-4">
                <div className="rounded-2xl overflow-hidden shadow-lg mb-3 w-full max-w-xs">
                  <img
                    src="/assets/generated/grasx-logo-banner.dim_1280x640.png"
                    alt="GrasX Placement Guider"
                    className="w-full h-auto object-cover"
                    style={{ imageRendering: "crisp-edges" }}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                {[
                  { label: "App Name", value: "GrasX" },
                  { label: "Version", value: "1.0.0" },
                  { label: "Platform", value: "Web (Internet Computer)" },
                  {
                    label: "Description",
                    value:
                      "Comprehensive placement prep for students — roadmap, quizzes, coding, resume, and more.",
                  },
                  { label: "Developer", value: "GrasX Team" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex gap-3 p-3 rounded-lg bg-muted/40"
                  >
                    <span className="text-xs text-muted-foreground w-24 shrink-0 pt-0.5">
                      {label}
                    </span>
                    <span className="text-xs text-foreground font-medium">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Info Row ─────────────────────── */
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.FC<{ className?: string }>;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-primary/80" />
      </div>
      <span className="text-xs font-medium text-muted-foreground w-28 shrink-0">
        {label}
      </span>
      <span className="text-sm text-foreground font-medium leading-snug flex-1 min-w-0 truncate">
        {value || (
          <span className="text-muted-foreground/40 font-normal">—</span>
        )}
      </span>
    </div>
  );
}

/* ─────────────────────── Main Component ─────────────────────── */
export function StudentDetails() {
  const [profile, setProfile] = useState<StudentProfile>(getProfile);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<StudentProfile>({});
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "edit">("overview");

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  const startEdit = () => {
    setForm({ ...profile });
    setActiveTab("edit");
    setSaved(false);
  };

  const handleSave = () => {
    saveProfile(form);
    setProfile((prev) => ({ ...prev, ...form }));
    setActiveTab("overview");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setActiveTab("overview");
  };

  const field = (key: keyof StudentProfile) => form[key] ?? "";
  const set =
    (key: keyof StudentProfile) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const selectClass =
    "w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-colors duration-150";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        {/* ── Profile Hero ── */}
        <div className="rounded-2xl overflow-hidden mb-6 bg-card border border-border shadow-card">
          {/* Cover — subtle muted style */}
          <div className="h-28 bg-muted/60 dark:bg-muted/30 relative overflow-hidden border-b border-border">
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, currentColor 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            />
            {/* Settings button positioned in cover */}
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="absolute top-3 right-3 flex items-center gap-1.5 bg-background/80 hover:bg-background text-foreground text-xs font-medium px-3 py-1.5 rounded-lg backdrop-blur-sm border border-border transition-all duration-150"
            >
              <Settings className="w-3.5 h-3.5" />
              Settings
            </button>
          </div>

          {/* Avatar + name row */}
          <div className="px-5 pb-5">
            <div className="flex items-end justify-between -mt-10 mb-4">
              {/* Large circular avatar with white ring */}
              <div className="w-[76px] h-[76px] rounded-full gradient-brand shadow-brand flex items-center justify-center ring-4 ring-card shrink-0">
                <span className="text-white text-2xl font-bold font-display leading-none">
                  {getInitials(profile.fullName)}
                </span>
              </div>
              {/* Edit button — only in overview */}
              {activeTab === "overview" && (
                <Button
                  type="button"
                  size="sm"
                  onClick={startEdit}
                  className="h-8 text-xs gap-1.5 gradient-brand text-white shadow-brand hover:opacity-90 active:scale-95 transition-all duration-150 mb-0.5"
                >
                  <Pencil className="w-3 h-3" />
                  Edit Profile
                </Button>
              )}
            </div>

            {/* Name + email */}
            <div className="mb-4">
              <h1 className="text-xl font-display font-bold text-foreground leading-tight tracking-tight">
                {profile.fullName || "Student Name"}
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {profile.email || "—"}
              </p>
            </div>

            {/* Badge strip */}
            <div className="flex flex-wrap gap-1.5">
              {profile.year && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  {yearLabels[profile.year] ?? `${profile.year} Year`}
                </span>
              )}
              {profile.branch && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground border border-border/50">
                  {profile.branch}
                </span>
              )}
              {profile.targetRole && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Target className="w-3 h-3" />
                  {roleLabels[profile.targetRole] ?? profile.targetRole}
                </span>
              )}
              {profile.skillLevel && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 capitalize">
                  {profile.skillLevel}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            if (v === "edit") startEdit();
            else setActiveTab("overview");
          }}
        >
          <TabsList className="w-full mb-5 bg-muted/60 h-9">
            <TabsTrigger
              value="overview"
              className="flex-1 text-xs font-medium"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex-1 text-xs font-medium">
              Edit Profile
            </TabsTrigger>
          </TabsList>

          {/* ── Overview tab ── */}
          <TabsContent value="overview" className="mt-0">
            <div className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
              {/* Contact Info group */}
              <div className="px-5 pt-4 pb-0">
                <p className="text-[10px] font-semibold text-muted-foreground/50 tracking-widest uppercase">
                  Contact Info
                </p>
              </div>
              <div className="px-5 pb-1">
                <InfoRow icon={Mail} label="Email" value={profile.email} />
                <Separator className="opacity-40" />
                <InfoRow icon={Phone} label="Mobile" value={profile.phone} />
              </div>

              <Separator />

              {/* Academic Info group */}
              <div className="px-5 pt-4 pb-0">
                <p className="text-[10px] font-semibold text-muted-foreground/50 tracking-widest uppercase">
                  Academic Info
                </p>
              </div>
              <div className="px-5 pb-3">
                <InfoRow
                  icon={Building2}
                  label="College"
                  value={profile.college}
                />
                <Separator className="opacity-40" />
                <InfoRow
                  icon={BookOpen}
                  label="Branch"
                  value={profile.branch}
                />
                <Separator className="opacity-40" />
                <InfoRow
                  icon={GraduationCap}
                  label="Year"
                  value={
                    profile.year
                      ? (yearLabels[profile.year] ?? `${profile.year} Year`)
                      : undefined
                  }
                />
                <Separator className="opacity-40" />
                <InfoRow
                  icon={Calendar}
                  label="Date of Birth"
                  value={profile.dob}
                />
                <Separator className="opacity-40" />
                <InfoRow
                  icon={Users}
                  label="Gender"
                  value={
                    profile.gender === "male"
                      ? "Male"
                      : profile.gender === "female"
                        ? "Female"
                        : profile.gender === "other"
                          ? "Other"
                          : profile.gender === "prefer_not"
                            ? "Prefer not to say"
                            : profile.gender
                  }
                />
                <Separator className="opacity-40" />
                <InfoRow
                  icon={User}
                  label="Target Role"
                  value={
                    profile.targetRole
                      ? (roleLabels[profile.targetRole] ?? profile.targetRole)
                      : undefined
                  }
                />
              </div>
            </div>
          </TabsContent>

          {/* ── Edit tab ── */}
          <TabsContent value="edit" className="mt-0">
            <div className="rounded-2xl bg-card border border-border shadow-card p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="fullName"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={field("fullName")}
                    onChange={set("fullName")}
                    placeholder="Your full name"
                    className="h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={field("email")}
                    onChange={set("email")}
                    placeholder="you@example.com"
                    className="h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="college"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    College
                  </Label>
                  <Input
                    id="college"
                    value={field("college")}
                    onChange={set("college")}
                    placeholder="College name"
                    className="h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="branch"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Branch
                  </Label>
                  <Input
                    id="branch"
                    value={field("branch")}
                    onChange={set("branch")}
                    placeholder="e.g. CSE, ECE"
                    className="h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="phone"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Mobile Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={field("phone")}
                    onChange={set("phone")}
                    placeholder="+91 XXXXX XXXXX"
                    className="h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="dob"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Date of Birth
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    value={field("dob")}
                    onChange={set("dob")}
                    className="h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="gender"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Gender
                  </Label>
                  <select
                    id="gender"
                    value={field("gender")}
                    onChange={set("gender")}
                    className={selectClass}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not">Prefer not to say</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="year"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Year
                  </Label>
                  <select
                    id="year"
                    value={field("year")}
                    onChange={set("year")}
                    className={selectClass}
                  >
                    <option value="">Select year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label
                    htmlFor="targetRole"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Target Role
                  </Label>
                  <select
                    id="targetRole"
                    value={field("targetRole")}
                    onChange={set("targetRole")}
                    className={selectClass}
                  >
                    <option value="">Select target role</option>
                    <option value="sde">Software Developer</option>
                    <option value="aiml">AIML Engineer</option>
                    <option value="data">Data Analyst</option>
                    <option value="core">Core (Non-IT)</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <Button
                  type="button"
                  onClick={handleSave}
                  className="gradient-brand text-white shadow-brand hover:opacity-90 active:scale-95 flex-1 h-9 transition-all duration-150"
                >
                  <Save className="w-3.5 h-3.5 mr-2" />
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 h-9"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground py-6 mt-2 border-t border-border/40">
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

      {/* Saved toast */}
      {saved && (
        <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-full shadow-lg text-sm font-medium">
          <CheckCircle2 className="w-4 h-4" />
          Profile saved successfully!
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
