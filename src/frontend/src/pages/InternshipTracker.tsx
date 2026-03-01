import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddInternshipApplication,
  useDeleteInternshipApplication,
  useInternshipApplications,
  useUpdateInternshipApplication,
} from "@/hooks/useQueries";
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircuitBoard,
  Clock,
  Code2,
  Database,
  Edit2,
  ExternalLink,
  Filter,
  IndianRupee,
  Lightbulb,
  Loader2,
  MapPin,
  Plus,
  Search,
  Shield,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { InternshipApplication } from "../backend.d";

/* ─────────────────── Status Config ─────────────────── */
const STATUS_OPTIONS = [
  "Applied",
  "Shortlisted",
  "Interview Scheduled",
  "Rejected",
  "Offer Received",
];

const STATUS_COLORS: Record<string, string> = {
  Applied: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  Shortlisted:
    "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  "Interview Scheduled":
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Rejected: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  "Offer Received":
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
};

const STATUS_DOT: Record<string, string> = {
  Applied: "bg-blue-500",
  Shortlisted: "bg-yellow-500",
  "Interview Scheduled": "bg-amber-500",
  Rejected: "bg-red-500",
  "Offer Received": "bg-emerald-500",
};

/* ─────────────────── Internship Category Data ─────────────────── */
interface CategoryData {
  id: string;
  title: string;
  tagline: string;
  stipend: string;
  duration: string;
  eligibility: string;
  roleOverview: string;
  requiredSkills: string[];
  topCompanies: string[];
  prepTopics: string[];
  roadmap: string[];
  accentColor: string;
  bgColor: string;
}

const CATEGORIES: CategoryData[] = [
  {
    id: "sde",
    title: "Software Developer",
    tagline: "Build scalable software systems",
    stipend: "₹10,000–₹30,000/month",
    duration: "2–6 months",
    eligibility: "CS/IT students, 3rd year+ preferred",
    roleOverview:
      "Software Developer Interns write, test, and maintain code for real-world products. You'll work on features, fix bugs, and collaborate with senior engineers in an agile team environment.",
    requiredSkills: [
      "C++ / Java / Python",
      "DSA",
      "OOP",
      "Git",
      "Problem Solving",
      "SQL",
    ],
    topCompanies: [
      "Google",
      "Microsoft",
      "Amazon",
      "Flipkart",
      "Infosys",
      "Zoho",
    ],
    prepTopics: [
      "Data Structures",
      "Algorithms",
      "OOP Concepts",
      "System Design basics",
      "SQL & Databases",
      "Git & Version Control",
    ],
    roadmap: [
      "Master a core language (C++/Java/Python)",
      "Study DSA — arrays, trees, graphs, DP",
      "Build 2 projects on GitHub",
      "Practice 100+ LeetCode problems",
      "Apply via LinkedIn & company portals",
    ],
    accentColor: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10 border-blue-500/20",
  },
  {
    id: "aiml",
    title: "AIML Internship",
    tagline: "Train models, build intelligent systems",
    stipend: "₹15,000–₹40,000/month",
    duration: "3–6 months",
    eligibility: "CS/IT/ECE students with Python & math skills",
    roleOverview:
      "AI/ML Interns work on machine learning models, data preprocessing, and experimentation. You'll use Python, ML frameworks, and real datasets to solve meaningful business problems.",
    requiredSkills: [
      "Python",
      "NumPy / Pandas",
      "Scikit-learn",
      "TensorFlow / PyTorch",
      "Statistics",
      "Data Visualization",
    ],
    topCompanies: [
      "Google AI",
      "IBM",
      "Wipro AI Lab",
      "Mu Sigma",
      "Analytics Vidhya",
      "Fractal Analytics",
    ],
    prepTopics: [
      "Linear Algebra & Statistics",
      "Python for ML",
      "Supervised & Unsupervised Learning",
      "Deep Learning Basics",
      "Model Evaluation",
      "Kaggle Competitions",
    ],
    roadmap: [
      "Learn Python + NumPy/Pandas thoroughly",
      "Study Statistics & Linear Algebra",
      "Build projects with Scikit-learn",
      "Explore Deep Learning with TensorFlow/PyTorch",
      "Participate in Kaggle & share on GitHub",
    ],
    accentColor: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10 border-purple-500/20",
  },
  {
    id: "webdev",
    title: "Web Developer",
    tagline: "Craft modern, responsive web apps",
    stipend: "₹8,000–₹25,000/month",
    duration: "2–4 months",
    eligibility: "Any branch; JavaScript knowledge helpful",
    roleOverview:
      "Web Developer Interns build and maintain web interfaces and backend APIs. You'll work with HTML/CSS, JavaScript frameworks, and REST APIs to deliver responsive, user-friendly products.",
    requiredSkills: [
      "HTML / CSS",
      "JavaScript",
      "React",
      "Node.js",
      "REST APIs",
      "Git",
    ],
    topCompanies: [
      "Zomato",
      "Swiggy",
      "Razorpay",
      "Freshworks",
      "Startup agencies",
      "Myntra",
    ],
    prepTopics: [
      "Responsive Design",
      "JavaScript ES6+",
      "React Hooks & State",
      "API Integration",
      "Database Basics",
      "Deployment (Vercel/Netlify)",
    ],
    roadmap: [
      "Master HTML + CSS (Flexbox & Grid)",
      "Learn JavaScript ES6+ fundamentals",
      "Build projects with React",
      "Learn Node.js & Express basics",
      "Deploy a full-stack project",
    ],
    accentColor: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-500/10 border-teal-500/20",
  },
  {
    id: "datascience",
    title: "Data Science",
    tagline: "Turn raw data into insights",
    stipend: "₹12,000–₹35,000/month",
    duration: "3–6 months",
    eligibility: "CS/IT/ECE/Math students; Python & SQL needed",
    roleOverview:
      "Data Science Interns analyze large datasets, create dashboards, and build predictive models. You'll use Python, SQL, and visualization tools to help organizations make data-driven decisions.",
    requiredSkills: [
      "Python",
      "SQL",
      "Statistics",
      "Pandas / NumPy",
      "Tableau / Power BI",
      "Excel",
    ],
    topCompanies: [
      "Accenture",
      "TCS Analytics",
      "Mu Sigma",
      "Latent View",
      "Tiger Analytics",
      "Deloitte",
    ],
    prepTopics: [
      "SQL Queries & Joins",
      "Python for Analysis",
      "Statistics & Probability",
      "Data Visualization",
      "Machine Learning Basics",
      "Business Case Studies",
    ],
    roadmap: [
      "Learn Python + SQL fundamentals",
      "Study Statistics & Probability",
      "Master Pandas & data wrangling",
      "Create dashboards with Tableau/Power BI",
      "Build a capstone data project",
    ],
    accentColor: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-500/10 border-orange-500/20",
  },
  {
    id: "cybersec",
    title: "Cybersecurity",
    tagline: "Protect systems from threats",
    stipend: "₹10,000–₹30,000/month",
    duration: "3–6 months",
    eligibility: "CS/IT/ECE; networking knowledge beneficial",
    roleOverview:
      "Cybersecurity Interns assist with vulnerability assessments, penetration testing, and security audits. You'll learn to identify threats, patch vulnerabilities, and strengthen an organization's defenses.",
    requiredSkills: [
      "Networking Fundamentals",
      "Linux",
      "Python Scripting",
      "Ethical Hacking Basics",
      "OWASP Top 10",
      "Wireshark",
    ],
    topCompanies: [
      "TCS Cyber",
      "Wipro CyberSec",
      "KPMG",
      "Deloitte",
      "PwC India",
      "HackerOne",
    ],
    prepTopics: [
      "OSI Model & Networking",
      "Linux Commands",
      "Python for Automation",
      "Web Application Security",
      "CTF Challenges",
      "CEH Concepts",
    ],
    roadmap: [
      "Learn Networking & OSI model basics",
      "Get comfortable with Linux terminal",
      "Learn Python scripting for security",
      "Explore ethical hacking tools (Kali, Burp)",
      "Solve CTF challenges on TryHackMe/HackTheBox",
    ],
    accentColor: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-500/10 border-red-500/20",
  },
];

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  sde: Code2,
  aiml: Sparkles,
  webdev: CircuitBoard,
  datascience: BarChart3,
  cybersec: Shield,
};

/* ─────────────────── localStorage Helpers ─────────────────── */
interface AppExtras {
  applicationLink: string;
  deadline: string;
}

function getAppExtras(): Record<string, AppExtras> {
  try {
    const raw = localStorage.getItem("gx_app_extras");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAppExtras(extras: Record<string, AppExtras>) {
  localStorage.setItem("gx_app_extras", JSON.stringify(extras));
}

function getChecklist(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem("gx_prep_checklist");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveChecklist(data: Record<string, boolean>) {
  localStorage.setItem("gx_prep_checklist", JSON.stringify(data));
}

/* ─────────────────── Deadline Helper ─────────────────── */
function getDeadlineBadge(
  deadline: string,
): { text: string; color: string } | null {
  if (!deadline) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dl = new Date(deadline);
  dl.setHours(0, 0, 0, 0);
  const diff = Math.round(
    (dl.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diff < 0)
    return {
      text: "Deadline overdue",
      color: "bg-red-600/15 text-red-600 dark:text-red-400",
    };
  if (diff === 0)
    return {
      text: "Deadline today!",
      color: "bg-red-600/15 text-red-600 dark:text-red-400",
    };
  if (diff <= 7)
    return {
      text: `Deadline in ${diff} day${diff === 1 ? "" : "s"}`,
      color: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    };
  return null;
}

/* ─────────────────── Default Form Value ─────────────────── */
const DEFAULT_APP: Omit<InternshipApplication, "id"> = {
  company: "",
  role: "",
  dateApplied: new Date().toISOString().split("T")[0],
  status: "Applied",
};

/* ─────────────────── App Form ─────────────────── */
function AppForm({
  initial,
  initialExtras,
  onSave,
  onCancel,
  isPending,
}: {
  initial: Omit<InternshipApplication, "id">;
  initialExtras: AppExtras;
  onSave: (data: Omit<InternshipApplication, "id">, extras: AppExtras) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [form, setForm] = useState(initial);
  const [extras, setExtras] = useState(initialExtras);
  const updateForm = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));
  const updateExtras = (field: keyof AppExtras, value: string) =>
    setExtras((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Company Name *</Label>
          <Input
            placeholder="Google, Microsoft..."
            value={form.company}
            onChange={(e) => updateForm("company", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Role *</Label>
          <Input
            placeholder="Software Engineer Intern"
            value={form.role}
            onChange={(e) => updateForm("role", e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date Applied</Label>
          <Input
            type="date"
            value={form.dateApplied}
            onChange={(e) => updateForm("dateApplied", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) => updateForm("status", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Application Link (optional)</Label>
          <Input
            type="url"
            placeholder="https://..."
            value={extras.applicationLink}
            onChange={(e) => updateExtras("applicationLink", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Application Deadline (optional)</Label>
          <Input
            type="date"
            value={extras.deadline}
            onChange={(e) => updateExtras("deadline", e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => onSave(form, extras)}
          disabled={isPending || !form.company || !form.role}
          className="gradient-brand text-white border-0 shadow-brand"
        >
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Application
        </Button>
      </div>
    </div>
  );
}

/* ─────────────────── Category Card ─────────────────── */
function CategoryCard({
  cat,
  isSelected,
  onToggle,
}: {
  cat: CategoryData;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const Icon = CATEGORY_ICONS[cat.id] ?? Briefcase;
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`text-left w-full rounded-2xl border-2 p-4 transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-primary gradient-brand-soft shadow-brand"
          : "border-border bg-card hover:border-primary/40"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
          isSelected ? "gradient-brand shadow-brand" : `${cat.bgColor} border`
        }`}
      >
        <Icon
          className={`w-5 h-5 ${isSelected ? "text-white" : cat.accentColor}`}
        />
      </div>
      <h3 className="font-display font-bold text-sm text-foreground leading-tight">
        {cat.title}
      </h3>
      <p className="text-xs text-muted-foreground mt-0.5 mb-2">{cat.tagline}</p>
      <span
        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${cat.bgColor} ${cat.accentColor} font-medium`}
      >
        <IndianRupee className="w-2.5 h-2.5" />
        {cat.stipend}
      </span>
    </button>
  );
}

/* ─────────────────── Category Detail Panel ─────────────────── */
function CategoryDetailPanel({ cat }: { cat: CategoryData }) {
  const Icon = CATEGORY_ICONS[cat.id] ?? Briefcase;
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden animate-fade-in">
      {/* Header */}
      <div className={`px-5 py-4 border-b border-border ${cat.bgColor}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-brand shadow-brand flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-foreground">
              {cat.title}
            </h2>
            <p className="text-xs text-muted-foreground">{cat.tagline}</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: IndianRupee, label: "Stipend", value: cat.stipend },
            { icon: Clock, label: "Duration", value: cat.duration },
            { icon: Users, label: "Eligibility", value: cat.eligibility },
          ].map(({ icon: I, label, value }) => (
            <div
              key={label}
              className="rounded-xl bg-muted/40 border border-border p-3 text-center"
            >
              <I className="w-4 h-4 mx-auto mb-1 text-primary" />
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                {label}
              </p>
              <p className="text-xs font-semibold text-foreground mt-0.5 leading-tight">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Role Overview */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Role Overview
          </h4>
          <p className="text-sm text-foreground leading-relaxed">
            {cat.roleOverview}
          </p>
        </div>

        {/* Required Skills */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5" /> Required Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {cat.requiredSkills.map((s) => (
              <span
                key={s}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${cat.bgColor} ${cat.accentColor}`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Top Companies */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" /> Top Companies Hiring
          </h4>
          <div className="flex flex-wrap gap-2">
            {cat.topCompanies.map((c) => (
              <span
                key={c}
                className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Prep Topics */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" /> Recommended Preparation Topics
          </h4>
          <ul className="space-y-1">
            {cat.prepTopics.map((t) => (
              <li
                key={t}
                className="flex items-center gap-2 text-sm text-foreground"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Roadmap */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> Mini Roadmap to Crack This
            Internship
          </h4>
          <div className="space-y-2">
            {cat.roadmap.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full gradient-brand shadow-brand flex items-center justify-center shrink-0">
                  <span className="text-white text-[10px] font-bold">
                    {i + 1}
                  </span>
                </div>
                <p className="text-sm text-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── Readiness Score ─────────────────── */
function ReadinessScore() {
  const [skills, setSkills] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [result, setResult] = useState<{
    percentage: number;
    matched: string[];
    missing: string[];
  } | null>(null);

  const analyze = () => {
    if (!skills.trim() || !selectedCategory) return;
    const cat = CATEGORIES.find((c) => c.id === selectedCategory);
    if (!cat) return;
    const userSkills = skills
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    const matched: string[] = [];
    const missing: string[] = [];
    for (const req of cat.requiredSkills) {
      const hit = userSkills.some(
        (us) =>
          req.toLowerCase().includes(us) ||
          us.includes(req.toLowerCase().split(" ")[0]),
      );
      if (hit) matched.push(req);
      else missing.push(req);
    }
    const percentage = Math.round(
      (matched.length / cat.requiredSkills.length) * 100,
    );
    setResult({ percentage, matched, missing });
  };

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="font-display text-base flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Internship Readiness Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1.5">
            <Label className="text-xs">Your Skills (comma-separated)</Label>
            <Input
              placeholder="Python, React, SQL, Git..."
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Internship Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          onClick={analyze}
          disabled={!skills.trim() || !selectedCategory}
          className="gradient-brand text-white border-0 shadow-brand w-full sm:w-auto"
        >
          <Target className="w-4 h-4 mr-2" />
          Analyze My Skills
        </Button>

        {result && (
          <div className="space-y-4 pt-2 border-t border-border">
            {/* Percentage bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Readiness Score
                </span>
                <span
                  className={`text-lg font-display font-bold ${
                    result.percentage >= 70
                      ? "text-emerald-600 dark:text-emerald-400"
                      : result.percentage >= 40
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {result.percentage}%
                </span>
              </div>
              <Progress value={result.percentage} className="h-3" />
              <p className="text-xs text-muted-foreground">
                {result.percentage >= 70
                  ? "🎉 Great match! You're well-prepared."
                  : result.percentage >= 40
                    ? "💪 Good start! Focus on the missing skills."
                    : "📚 Keep learning! You have room to grow."}
              </p>
            </div>

            {/* Matched + Missing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.matched.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Skills You Have (
                    {result.matched.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matched.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      >
                        ✅ {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {result.missing.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Skills to Learn (
                    {result.missing.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missing.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-full text-xs bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                      >
                        ❌ {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ─────────────────── AI Suggestions ─────────────────── */
function AISuggestions({ userSkills }: { userSkills: string }) {
  if (!userSkills.trim()) return null;

  const skills = userSkills
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const scored = CATEGORIES.map((cat) => {
    const matched = cat.requiredSkills.filter((req) =>
      skills.some(
        (us) =>
          req.toLowerCase().includes(us) ||
          us.includes(req.toLowerCase().split(" ")[0]),
      ),
    ).length;
    return {
      ...cat,
      score: Math.round((matched / cat.requiredSkills.length) * 100),
    };
  }).sort((a, b) => b.score - a.score);

  const top2 = scored.slice(0, 2);
  const best = top2[0];

  const plan = best
    ? [
        `Start with: ${best.prepTopics[0]}`,
        `Build a project using: ${best.requiredSkills.slice(0, 2).join(" & ")}`,
        `Apply to: ${best.topCompanies.slice(0, 2).join(", ")}`,
      ]
    : [];

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="font-display text-base flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          AI-Powered Internship Suggestions
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">
          Based on your skills from the Readiness Score analysis
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {top2.map((cat, idx) => {
            const Icon = CATEGORY_ICONS[cat.id] ?? Briefcase;
            return (
              <div
                key={cat.id}
                className={`rounded-xl border p-4 ${cat.bgColor}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${cat.accentColor}`} />
                    <span className="text-sm font-semibold text-foreground">
                      {cat.title}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      idx === 0
                        ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                        : "bg-blue-500/20 text-blue-700 dark:text-blue-300"
                    }`}
                  >
                    {idx === 0 ? "Best Match" : "Good Match"}
                  </span>
                </div>
                <Progress value={cat.score} className="h-2 mb-1.5" />
                <p className={`text-xs font-medium ${cat.accentColor}`}>
                  {cat.score}% skill match
                </p>
              </div>
            );
          })}
        </div>

        {plan.length > 0 && (
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
            <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" />
              Preparation Plan for {best?.title}
            </p>
            <ul className="space-y-1.5">
              {plan.map((step, i) => (
                <li
                  key={step}
                  className="flex items-start gap-2 text-xs text-foreground"
                >
                  <span className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ─────────────────── Prep Checklist ─────────────────── */
const CHECKLIST_ITEMS = [
  { id: "resume", label: "Resume ready" },
  { id: "github", label: "GitHub updated" },
  { id: "linkedin", label: "LinkedIn updated" },
  { id: "projects", label: "2 Projects completed" },
  { id: "dsa", label: "50 DSA problems solved" },
];

function PrepChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>(getChecklist);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      saveChecklist(next);
      return next;
    });
  };

  const done = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((done / CHECKLIST_ITEMS.length) * 100);

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Preparation Checklist
          </CardTitle>
          <span className="text-xs font-bold text-primary">
            {done}/{CHECKLIST_ITEMS.length}
          </span>
        </div>
        <div className="space-y-1.5 pt-1">
          <Progress value={pct} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {pct === 100
              ? "🎉 All done! You're ready to apply."
              : `${pct}% complete — keep going!`}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {CHECKLIST_ITEMS.map((item) => (
            <button
              type="button"
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border hover:bg-muted/50 transition-colors cursor-pointer w-full text-left"
              onClick={() => toggle(item.id)}
            >
              <Checkbox
                id={item.id}
                checked={!!checked[item.id]}
                onCheckedChange={() => toggle(item.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <span
                className={`text-sm select-none flex-1 ${
                  checked[item.id]
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {item.label}
              </span>
              {checked[item.id] && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─────────────────── Main Component ─────────────────── */
export function InternshipTracker() {
  const { data: apps = [], isLoading } = useInternshipApplications();
  const addApp = useAddInternshipApplication();
  const updateApp = useUpdateInternshipApplication();
  const deleteApp = useDeleteInternshipApplication();

  const [showAdd, setShowAdd] = useState(false);
  const [editingApp, setEditingApp] = useState<InternshipApplication | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleSearch, setRoleSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [readinessSkills, setReadinessSkills] = useState("");

  // localStorage extras
  const [appExtras, setAppExtras] =
    useState<Record<string, AppExtras>>(getAppExtras);
  const refreshExtras = () => setAppExtras(getAppExtras());

  const handleAdd = async (
    data: Omit<InternshipApplication, "id">,
    extras: AppExtras,
  ) => {
    try {
      const id = `app_${Date.now()}`;
      await addApp.mutateAsync({ ...data, id });
      const current = getAppExtras();
      saveAppExtras({ ...current, [id]: extras });
      refreshExtras();
      toast.success("Application added!");
      setShowAdd(false);
    } catch {
      toast.error("Failed to add application");
    }
  };

  const handleUpdate = async (
    data: Omit<InternshipApplication, "id">,
    extras: AppExtras,
  ) => {
    if (!editingApp) return;
    try {
      await updateApp.mutateAsync({ ...data, id: editingApp.id });
      const current = getAppExtras();
      saveAppExtras({ ...current, [editingApp.id]: extras });
      refreshExtras();
      toast.success("Application updated!");
      setEditingApp(null);
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteApp.mutateAsync(id);
      const current = getAppExtras();
      delete current[id];
      saveAppExtras(current);
      refreshExtras();
      toast.success("Application removed");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const filteredApps = apps
    .filter((a) => statusFilter === "All" || a.status === statusFilter)
    .filter(
      (a) =>
        !roleSearch.trim() ||
        a.role.toLowerCase().includes(roleSearch.toLowerCase()) ||
        a.company.toLowerCase().includes(roleSearch.toLowerCase()),
    )
    .sort(
      (a, b) =>
        new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime(),
    );

  const stats = {
    total: apps.length,
    interviews: apps.filter((a) => a.status === "Interview Scheduled").length,
    offers: apps.filter((a) => a.status === "Offer Received").length,
    successRate:
      apps.length > 0
        ? Math.round(
            (apps.filter((a) => a.status === "Offer Received").length /
              apps.length) *
              100,
          )
        : 0,
  };

  const selectedCat = CATEGORIES.find((c) => c.id === selectedCategory) ?? null;

  return (
    <div className="p-5 sm:p-6 space-y-8 max-w-5xl mx-auto">
      <PageHeader
        icon={Briefcase}
        title="Internship Tracker"
        subtitle="Explore categories, track applications, and measure your readiness"
        action={
          <Button
            onClick={() => setShowAdd(true)}
            className="gradient-brand text-white border-0 shadow-brand gap-2 h-9 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Application
          </Button>
        }
      />

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Applied",
            value: stats.total,
            color: "text-blue-600 dark:text-blue-400",
            icon: Briefcase,
          },
          {
            label: "Interviews",
            value: stats.interviews,
            color: "text-amber-600 dark:text-amber-400",
            icon: Users,
          },
          {
            label: "Offers",
            value: stats.offers,
            color: "text-emerald-600 dark:text-emerald-400",
            icon: CheckCircle2,
          },
          {
            label: "Success Rate",
            value: `${stats.successRate}%`,
            color: "text-primary",
            icon: TrendingUp,
          },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/60">
            <CardContent className="p-4 text-center">
              <stat.icon className={`w-5 h-5 mx-auto mb-1.5 ${stat.color}`} />
              <div className={`text-2xl font-display font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Internship Categories ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-4 h-4 text-primary" />
          <h2 className="font-display font-bold text-base text-foreground">
            Internship Categories
          </h2>
          <span className="text-xs text-muted-foreground">
            — click to explore
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              cat={cat}
              isSelected={selectedCategory === cat.id}
              onToggle={() =>
                setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
              }
            />
          ))}
        </div>

        {/* Detail panel */}
        {selectedCat && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ChevronDown className="w-4 h-4" />
                <span>
                  Showing details for <strong>{selectedCat.title}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <ChevronUp className="w-3.5 h-3.5" /> Collapse
              </button>
            </div>
            <CategoryDetailPanel cat={selectedCat} />
          </div>
        )}
      </section>

      {/* ── Filters ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="flex gap-2 flex-wrap">
            {["All", ...STATUS_OPTIONS].map((status) => (
              <button
                type="button"
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  statusFilter === status
                    ? "gradient-brand text-white shadow-brand"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {status}{" "}
                {status !== "All" &&
                  `(${apps.filter((a) => a.status === status).length})`}
              </button>
            ))}
          </div>
        </div>
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            className="pl-8 h-8 text-sm"
            placeholder="Filter by role or company..."
            value={roleSearch}
            onChange={(e) => setRoleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Applications list ── */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="font-display font-bold text-lg text-foreground">
            No applications yet
          </p>
          <p className="text-sm mt-1">Start tracking your internship hunt!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredApps.map((app) => {
            const extras = appExtras[app.id] ?? {
              applicationLink: "",
              deadline: "",
            };
            const deadlineBadge = getDeadlineBadge(extras.deadline);
            return (
              <Card key={app.id} className="border-border/60 card-hover">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl gradient-brand-soft flex items-center justify-center shrink-0">
                        <span className="font-display font-bold text-sm gradient-brand-text">
                          {app.company.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-display font-bold truncate">
                          {app.company}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {app.role}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-xs text-muted-foreground">
                            Applied:{" "}
                            {new Date(app.dateApplied).toLocaleDateString(
                              "en-IN",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                          <Badge
                            className={`text-xs ${STATUS_COLORS[app.status] || "bg-muted text-muted-foreground"}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${STATUS_DOT[app.status] || "bg-muted-foreground"}`}
                            />
                            {app.status}
                          </Badge>
                          {deadlineBadge && (
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${deadlineBadge.color}`}
                            >
                              ⏰ {deadlineBadge.text}
                            </span>
                          )}
                          {extras.applicationLink && (
                            <a
                              href={extras.applicationLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-0.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-3 h-3" /> Link
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditingApp(app)}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(app.id)}
                        disabled={deleteApp.isPending}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Readiness Score ── */}
      <ReadinessScore />

      {/* ── AI Suggestions (pass skills from readiness input) ── */}
      <AISuggestions userSkills={readinessSkills} />

      {/* Hidden input to sync skills for AI suggestions when typing in ReadinessScore */}
      {/* Note: AISuggestions reads from its own state; we expose a standalone version below */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Quick AI Suggestion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <Input
              placeholder="Enter your skills (Python, SQL, React...)"
              value={readinessSkills}
              onChange={(e) => setReadinessSkills(e.target.value)}
              className="flex-1"
            />
          </div>
          {readinessSkills.trim() && (
            <AISuggestions userSkills={readinessSkills} />
          )}
        </CardContent>
      </Card>

      {/* ── Prep Checklist ── */}
      <PrepChecklist />

      {/* ── Add dialog ── */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Add Application</DialogTitle>
          </DialogHeader>
          <AppForm
            initial={DEFAULT_APP}
            initialExtras={{ applicationLink: "", deadline: "" }}
            onSave={handleAdd}
            onCancel={() => setShowAdd(false)}
            isPending={addApp.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* ── Edit dialog ── */}
      <Dialog
        open={!!editingApp}
        onOpenChange={(open) => !open && setEditingApp(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Application</DialogTitle>
          </DialogHeader>
          {editingApp && (
            <AppForm
              initial={{
                company: editingApp.company,
                role: editingApp.role,
                dateApplied: editingApp.dateApplied,
                status: editingApp.status,
              }}
              initialExtras={
                appExtras[editingApp.id] ?? {
                  applicationLink: "",
                  deadline: "",
                }
              }
              onSave={handleUpdate}
              onCancel={() => setEditingApp(null)}
              isPending={updateApp.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
