import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useResumeData, useUpdateResumeData } from "@/hooks/useQueries";
import {
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Code2,
  Download,
  FileText,
  Loader2,
  Plus,
  Printer,
  Sparkles,
  Trash2,
  User,
  Wrench,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProjectItem {
  id: string;
  name: string;
  techStack: string;
  description: string;
  link: string;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
  // education structured
  degree: string;
  institution: string;
  yearRange: string;
  cgpa: string;
  // education flat (backend compat)
  education: string;
  // skills categorised
  languages: string;
  frameworks: string;
  tools: string;
  // skills flat (backend compat)
  skills: string;
  // projects
  projectsList: ProjectItem[];
  projects: string; // serialised for backend
  // exp & achievements
  experience: string;
  achievements: string;
}

function newProject(): ProjectItem {
  return {
    id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: "",
    techStack: "",
    description: "",
    link: "",
  };
}

const DEFAULT_FORM: FormData = {
  fullName: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
  portfolio: "",
  summary: "",
  degree: "",
  institution: "",
  yearRange: "",
  cgpa: "",
  education: "",
  languages: "",
  frameworks: "",
  tools: "",
  skills: "",
  projectsList: [newProject()],
  projects: "",
  experience: "",
  achievements: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStudentProfile() {
  try {
    const raw =
      localStorage.getItem("garsxStudentProfile") ||
      localStorage.getItem("ppp_user");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function parseCSV(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function serializeEducation(d: FormData): string {
  const parts = [
    d.degree,
    d.institution,
    d.yearRange,
    d.cgpa ? `CGPA: ${d.cgpa}` : "",
  ].filter(Boolean);
  return parts.join("\n");
}

function generateSummary(formData: FormData): string {
  const profile = getStudentProfile();
  const targetRole: string =
    profile.targetRole || profile.role || "Software Developer";
  const branch: string = profile.branch || "Computer Science";
  const year: string = profile.year || "1st";

  const allSkills = [
    ...parseCSV(formData.languages),
    ...parseCSV(formData.frameworks),
    ...parseCSV(formData.tools),
  ];

  const top3 =
    allSkills.slice(0, 3).join(", ") || "programming and problem-solving";
  const domain =
    formData.frameworks.toLowerCase().includes("react") ||
    formData.frameworks.toLowerCase().includes("node") ||
    formData.frameworks.toLowerCase().includes("django")
      ? "full-stack development"
      : allSkills.some((s) =>
            ["python", "ml", "tensorflow", "pytorch"].includes(s.toLowerCase()),
          )
        ? "machine learning and AI"
        : "software engineering";

  return `Motivated ${year} year B.Tech ${branch} student with strong skills in ${top3}. Seeking opportunities as a ${targetRole} to apply ${allSkills[0] || "technical skills"} in real-world projects. Passionate about ${domain} and committed to continuous learning and growth.`;
}

// ─── Resume Strength ──────────────────────────────────────────────────────────

function computeStrength(f: FormData): { score: number; missing: string[] } {
  const sections: { label: string; filled: boolean }[] = [
    { label: "Full Name", filled: !!f.fullName.trim() },
    { label: "Email address", filled: !!f.email.trim() },
    { label: "Phone number", filled: !!f.phone.trim() },
    { label: "LinkedIn URL", filled: !!f.linkedin.trim() },
    { label: "GitHub URL", filled: !!f.github.trim() },
    { label: "Professional Summary", filled: !!f.summary.trim() },
    { label: "Education details", filled: !!(f.degree || f.institution) },
    { label: "Programming languages", filled: !!f.languages.trim() },
    { label: "Frameworks/Libraries", filled: !!f.frameworks.trim() },
    {
      label: "At least one project",
      filled: f.projectsList.some((p) => !!p.name),
    },
    { label: "Experience or internships", filled: !!f.experience.trim() },
    { label: "Achievements/Certifications", filled: !!f.achievements.trim() },
  ];
  const filled = sections.filter((s) => s.filled).length;
  const score = Math.round((filled / sections.length) * 100);
  const missing = sections
    .filter((s) => !s.filled)
    .slice(0, 4)
    .map((s) => s.label);
  return { score, missing };
}

// ─── Step definitions ─────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Personal", icon: User, shortLabel: "Info" },
  { id: 2, label: "Education", icon: BookOpen, shortLabel: "Edu" },
  { id: 3, label: "Skills", icon: Wrench, shortLabel: "Skills" },
  { id: 4, label: "Projects", icon: Code2, shortLabel: "Proj" },
  { id: 5, label: "Experience", icon: Briefcase, shortLabel: "Exp" },
];

// ─── Tag Pill ─────────────────────────────────────────────────────────────────

function TagPills({ value }: { value: string }) {
  const tags = parseCSV(value);
  if (!tags.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

// ─── Strength Indicator ───────────────────────────────────────────────────────

function StrengthIndicator({ formData }: { formData: FormData }) {
  const { score, missing } = computeStrength(formData);
  const color =
    score >= 70
      ? "bg-emerald-500"
      : score >= 40
        ? "bg-amber-500"
        : "bg-red-500";
  const label = score >= 70 ? "Strong" : score >= 40 ? "Good" : "Needs Work";

  return (
    <Card className="border-border/60 shadow-[var(--shadow-card)]">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              Resume Strength
            </span>
          </div>
          <span
            className={`text-sm font-bold ${score >= 70 ? "text-emerald-500" : score >= 40 ? "text-amber-500" : "text-red-500"}`}
          >
            {score}% — {label}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${color}`}
            style={{ width: `${score}%` }}
          />
        </div>
        {missing.length > 0 && (
          <div className="mt-3 space-y-1">
            <p className="text-xs text-muted-foreground font-medium">
              Complete to improve score:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {missing.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/60"
                >
                  <Circle className="w-2 h-2" />
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Step Progress Bar ────────────────────────────────────────────────────────

function StepProgress({
  currentStep,
  onStepClick,
}: {
  currentStep: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between relative">
        {/* connector line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-border mx-8 z-0" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-primary z-0 transition-all duration-500"
          style={{
            left: "2rem",
            right: `${((STEPS.length - currentStep) / (STEPS.length - 1)) * 100 - (2 / STEPS.length) * 100}%`,
          }}
        />

        {STEPS.map((step) => {
          const Icon = step.icon;
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepClick(step.id)}
              className="relative z-10 flex flex-col items-center gap-1 group"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : isActive
                      ? "bg-primary border-primary text-primary-foreground shadow-[0_0_0_3px_oklch(var(--primary)/0.2)]"
                      : "bg-card border-border text-muted-foreground group-hover:border-primary/60"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium leading-tight hidden sm:block ${
                  isActive
                    ? "text-primary"
                    : isCompleted
                      ? "text-primary/70"
                      : "text-muted-foreground"
                }`}
              >
                {step.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 1: Personal Details ─────────────────────────────────────────────────

function Step1Personal({
  formData,
  update,
}: {
  formData: FormData;
  update: (field: keyof FormData, value: string) => void;
}) {
  return (
    <div className="space-y-5 animate-fade-in-up">
      <div>
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          Personal Details
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Your contact information for the resume header
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="fullName"
            className="text-xs font-semibold text-foreground/80"
          >
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fullName"
            placeholder="Rahul Sharma"
            value={formData.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            className="h-10 bg-background border-border/70 focus-visible:ring-primary/30"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-xs font-semibold text-foreground/80"
            >
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="rahul@college.edu"
              value={formData.email}
              onChange={(e) => update("email", e.target.value)}
              className="h-10 bg-background border-border/70"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="phone"
              className="text-xs font-semibold text-foreground/80"
            >
              Phone
            </Label>
            <Input
              id="phone"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="h-10 bg-background border-border/70"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="linkedin"
              className="text-xs font-semibold text-foreground/80"
            >
              LinkedIn URL
            </Label>
            <Input
              id="linkedin"
              placeholder="linkedin.com/in/rahulsharma"
              value={formData.linkedin}
              onChange={(e) => update("linkedin", e.target.value)}
              className="h-10 bg-background border-border/70"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="github"
              className="text-xs font-semibold text-foreground/80"
            >
              GitHub URL
            </Label>
            <Input
              id="github"
              placeholder="github.com/rahulsharma"
              value={formData.github}
              onChange={(e) => update("github", e.target.value)}
              className="h-10 bg-background border-border/70"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="portfolio"
            className="text-xs font-semibold text-foreground/80"
          >
            Portfolio URL
          </Label>
          <Input
            id="portfolio"
            placeholder="rahulsharma.dev"
            value={formData.portfolio}
            onChange={(e) => update("portfolio", e.target.value)}
            className="h-10 bg-background border-border/70"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Education ────────────────────────────────────────────────────────

function Step2Education({
  formData,
  update,
}: {
  formData: FormData;
  update: (field: keyof FormData, value: string) => void;
}) {
  return (
    <div className="space-y-5 animate-fade-in-up">
      <div>
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          Education
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Your academic background and qualifications
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="degree"
            className="text-xs font-semibold text-foreground/80"
          >
            Degree / Program <span className="text-destructive">*</span>
          </Label>
          <Input
            id="degree"
            placeholder="B.Tech in Computer Science & Engineering"
            value={formData.degree}
            onChange={(e) => update("degree", e.target.value)}
            className="h-10 bg-background border-border/70"
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="institution"
            className="text-xs font-semibold text-foreground/80"
          >
            Institution / University <span className="text-destructive">*</span>
          </Label>
          <Input
            id="institution"
            placeholder="XYZ Institute of Technology, Pune"
            value={formData.institution}
            onChange={(e) => update("institution", e.target.value)}
            className="h-10 bg-background border-border/70"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="yearRange"
              className="text-xs font-semibold text-foreground/80"
            >
              Year Range
            </Label>
            <Input
              id="yearRange"
              placeholder="2024 – 2028"
              value={formData.yearRange}
              onChange={(e) => update("yearRange", e.target.value)}
              className="h-10 bg-background border-border/70"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="cgpa"
              className="text-xs font-semibold text-foreground/80"
            >
              CGPA / Percentage
            </Label>
            <Input
              id="cgpa"
              placeholder="8.5 / 10 or 85%"
              value={formData.cgpa}
              onChange={(e) => update("cgpa", e.target.value)}
              className="h-10 bg-background border-border/70"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Skills ───────────────────────────────────────────────────────────

const QUICK_LANGUAGES = [
  "C",
  "C++",
  "Python",
  "Java",
  "JavaScript",
  "TypeScript",
  "Kotlin",
  "SQL",
];
const QUICK_FRAMEWORKS = [
  "React",
  "Node.js",
  "Express",
  "Django",
  "Spring Boot",
  "Flutter",
  "Angular",
  "Vue",
];
const QUICK_TOOLS = [
  "Git",
  "GitHub",
  "VS Code",
  "Docker",
  "Linux",
  "Postman",
  "MySQL",
  "MongoDB",
];

function QuickAddButtons({
  options,
  current,
  onAdd,
}: {
  options: string[];
  current: string;
  onAdd: (skill: string) => void;
}) {
  const currentList = parseCSV(current);
  return (
    <div className="flex flex-wrap gap-1.5 mt-1.5">
      {options.map((skill) => {
        const already = currentList.some(
          (s) => s.toLowerCase() === skill.toLowerCase(),
        );
        return (
          <button
            type="button"
            key={skill}
            onClick={() => !already && onAdd(skill)}
            disabled={already}
            className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
              already
                ? "border-primary/40 bg-primary/10 text-primary cursor-default"
                : "border-border/60 hover:border-primary/60 hover:bg-accent/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {already ? "✓" : "+"} {skill}
          </button>
        );
      })}
    </div>
  );
}

function Step3Skills({
  formData,
  update,
}: {
  formData: FormData;
  update: (field: keyof FormData, value: string) => void;
}) {
  const addSkill = (field: keyof FormData, skill: string) => {
    const current = formData[field] as string;
    const list = parseCSV(current);
    if (!list.map((s) => s.toLowerCase()).includes(skill.toLowerCase())) {
      update(field, [...list, skill].join(", "));
    }
  };

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div>
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Wrench className="w-4 h-4 text-primary" />
          Technical Skills
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Categorised skills are ATS-friendly and easier to scan
        </p>
      </div>

      <div className="space-y-5">
        {/* Languages */}
        <div className="space-y-1.5 p-4 rounded-xl border border-border/60 bg-muted/20">
          <Label
            htmlFor="languages"
            className="text-xs font-bold text-foreground/80 uppercase tracking-wide"
          >
            Programming Languages
          </Label>
          <Input
            id="languages"
            placeholder="C, C++, Python, Java, JavaScript"
            value={formData.languages}
            onChange={(e) => update("languages", e.target.value)}
            className="h-10 bg-background border-border/70"
          />
          <TagPills value={formData.languages} />
          <QuickAddButtons
            options={QUICK_LANGUAGES}
            current={formData.languages}
            onAdd={(s) => addSkill("languages", s)}
          />
        </div>

        {/* Frameworks */}
        <div className="space-y-1.5 p-4 rounded-xl border border-border/60 bg-muted/20">
          <Label
            htmlFor="frameworks"
            className="text-xs font-bold text-foreground/80 uppercase tracking-wide"
          >
            Frameworks & Libraries
          </Label>
          <Input
            id="frameworks"
            placeholder="React, Node.js, Django, Spring Boot"
            value={formData.frameworks}
            onChange={(e) => update("frameworks", e.target.value)}
            className="h-10 bg-background border-border/70"
          />
          <TagPills value={formData.frameworks} />
          <QuickAddButtons
            options={QUICK_FRAMEWORKS}
            current={formData.frameworks}
            onAdd={(s) => addSkill("frameworks", s)}
          />
        </div>

        {/* Tools */}
        <div className="space-y-1.5 p-4 rounded-xl border border-border/60 bg-muted/20">
          <Label
            htmlFor="tools"
            className="text-xs font-bold text-foreground/80 uppercase tracking-wide"
          >
            Tools & Technologies
          </Label>
          <Input
            id="tools"
            placeholder="Git, Docker, VS Code, MySQL, Postman"
            value={formData.tools}
            onChange={(e) => update("tools", e.target.value)}
            className="h-10 bg-background border-border/70"
          />
          <TagPills value={formData.tools} />
          <QuickAddButtons
            options={QUICK_TOOLS}
            current={formData.tools}
            onAdd={(s) => addSkill("tools", s)}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Projects ─────────────────────────────────────────────────────────

function Step4Projects({
  formData,
  updateProjects,
}: {
  formData: FormData;
  updateProjects: (list: ProjectItem[]) => void;
}) {
  const update = (idx: number, field: keyof ProjectItem, value: string) => {
    updateProjects(
      formData.projectsList.map((p, i) =>
        i === idx ? { ...p, [field]: value } : p,
      ),
    );
  };

  const addProject = () => {
    updateProjects([...formData.projectsList, newProject()]);
  };

  const removeProject = (idx: number) => {
    if (formData.projectsList.length <= 1) return;
    updateProjects(formData.projectsList.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div>
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Code2 className="w-4 h-4 text-primary" />
          Projects
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Showcase your work — projects are the most important part for freshers
        </p>
      </div>

      <div className="space-y-4">
        {formData.projectsList.map((project, idx) => (
          <div
            key={project.id}
            className="p-4 rounded-xl border border-border/60 bg-muted/10 space-y-3 relative"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary uppercase tracking-wide">
                Project {idx + 1}
              </span>
              {formData.projectsList.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProject(idx)}
                  className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Remove project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground/80">
                Project Name *
              </Label>
              <Input
                placeholder="Student Portal Web App"
                value={project.name}
                onChange={(e) => update(idx, "name", e.target.value)}
                className="h-10 bg-background border-border/70"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground/80">
                Tech Stack
              </Label>
              <Input
                placeholder="React, Node.js, MongoDB, JWT"
                value={project.techStack}
                onChange={(e) => update(idx, "techStack", e.target.value)}
                className="h-10 bg-background border-border/70"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground/80">
                Description
              </Label>
              <Textarea
                placeholder="Built a full-stack student management system with JWT authentication. Implemented role-based access control for admin and students."
                value={project.description}
                onChange={(e) => update(idx, "description", e.target.value)}
                rows={3}
                className="bg-background border-border/70 text-sm resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground/80">
                Project Link
              </Label>
              <Input
                placeholder="github.com/rahul/student-portal"
                value={project.link}
                onChange={(e) => update(idx, "link", e.target.value)}
                className="h-10 bg-background border-border/70"
              />
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addProject}
          className="w-full border-dashed border-primary/40 text-primary hover:bg-primary/5 hover:border-primary gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Another Project
        </Button>
      </div>
    </div>
  );
}

// ─── Step 5: Experience & Achievements ───────────────────────────────────────

function Step5Experience({
  formData,
  update,
  onGenerateSummary,
}: {
  formData: FormData;
  update: (field: keyof FormData, value: string) => void;
  onGenerateSummary: () => void;
}) {
  return (
    <div className="space-y-5 animate-fade-in-up">
      <div>
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-primary" />
          Experience & Achievements
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Internships, work experience, and certifications
        </p>
      </div>

      {/* Professional Summary */}
      <div className="space-y-1.5 p-4 rounded-xl border border-primary/20 bg-primary/5">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="summary"
            className="text-xs font-bold text-foreground/80 uppercase tracking-wide"
          >
            Professional Summary
          </Label>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onGenerateSummary}
            className="h-7 px-3 text-xs gap-1.5 text-primary hover:text-primary hover:bg-primary/10"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Auto-Generate
          </Button>
        </div>
        <Textarea
          id="summary"
          placeholder="Motivated first-year B.Tech CSE student with strong fundamentals in Python and C++. Seeking opportunities to apply technical skills in real-world projects."
          value={formData.summary}
          onChange={(e) => update("summary", e.target.value)}
          rows={4}
          className="bg-background border-border/70 text-sm"
        />
        <p className="text-[11px] text-muted-foreground">
          {formData.summary.length} characters — keep under 400 for ATS
        </p>
      </div>

      {/* Experience */}
      <div className="space-y-1.5">
        <Label
          htmlFor="experience"
          className="text-xs font-semibold text-foreground/80"
        >
          Work Experience / Internships
        </Label>
        <p className="text-[11px] text-muted-foreground">
          Include company name, role, duration, and key responsibilities
        </p>
        <Textarea
          id="experience"
          placeholder={
            "Web Development Intern — Acme Corp, Pune\nJune 2024 – August 2024\n• Developed REST APIs using Node.js and Express\n• Collaborated with a 4-member team using Git and Agile methodology"
          }
          value={formData.experience}
          onChange={(e) => update("experience", e.target.value)}
          rows={5}
          className="bg-background border-border/70 text-sm"
        />
      </div>

      {/* Achievements */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Award className="w-3.5 h-3.5 text-primary" />
          <Label
            htmlFor="achievements"
            className="text-xs font-semibold text-foreground/80"
          >
            Achievements & Certifications
          </Label>
        </div>
        <Textarea
          id="achievements"
          placeholder={
            "• Solved 200+ problems on LeetCode\n• Winner – Hackathon 2024, XYZ College\n• Certified: Python for Data Science — Coursera\n• 5★ in C on HackerRank"
          }
          value={formData.achievements}
          onChange={(e) => update("achievements", e.target.value)}
          rows={5}
          className="bg-background border-border/70 text-sm"
        />
      </div>
    </div>
  );
}

// ─── Resume Preview ───────────────────────────────────────────────────────────

function ResumePreview({ formData }: { formData: FormData }) {
  const languages = parseCSV(formData.languages);
  const frameworksList = parseCSV(formData.frameworks);
  const toolsList = parseCSV(formData.tools);
  const hasSkills =
    languages.length > 0 || frameworksList.length > 0 || toolsList.length > 0;

  const validProjects = formData.projectsList.filter((p) => p.name);

  const achievementLines = formData.achievements
    .split("\n")
    .map((l) => l.replace(/^[•\-*]\s*/, "").trim())
    .filter(Boolean);

  const experienceLines = formData.experience
    .split("\n")
    .map((l) => l.replace(/^[•\-*]\s*/, "").trim())
    .filter(Boolean);

  const section = (title: string) => (
    <div
      style={{
        borderBottom: "1.5px solid #111",
        paddingBottom: "3px",
        marginBottom: "8px",
        marginTop: "16px",
      }}
    >
      <span
        style={{
          fontFamily: "'Cabinet Grotesk', 'Arial', sans-serif",
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          color: "#111",
        }}
      >
        {title}
      </span>
    </div>
  );

  return (
    <div
      id="resume-preview"
      style={{
        fontFamily: "'Plus Jakarta Sans', 'Arial', sans-serif",
        background: "#ffffff",
        color: "#111111",
        padding: "40px 44px",
        minHeight: "297mm",
        width: "794px",
        maxWidth: "794px",
        margin: "0 auto",
        fontSize: "12px",
        lineHeight: "1.55",
        boxSizing: "border-box" as const,
      }}
    >
      {/* ── Header ── */}
      <div style={{ marginBottom: "14px" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 800,
            margin: "0 0 6px 0",
            color: "#111",
            letterSpacing: "-0.02em",
            fontFamily: "'Cabinet Grotesk', 'Arial', sans-serif",
          }}
        >
          {formData.fullName || "Your Full Name"}
        </h1>

        <div
          style={{
            fontSize: "11px",
            color: "#333",
            display: "flex",
            flexWrap: "wrap" as const,
            gap: "4px 0",
            lineHeight: "1.5",
          }}
        >
          {[
            formData.email,
            formData.phone,
            formData.linkedin,
            formData.github,
            formData.portfolio,
          ]
            .filter(Boolean)
            .join("  |  ")}
        </div>
      </div>

      {/* ── Summary ── */}
      {formData.summary && (
        <div>
          {section("Professional Summary")}
          <p style={{ margin: "0", color: "#222", fontSize: "11.5px" }}>
            {formData.summary}
          </p>
        </div>
      )}

      {/* ── Education ── */}
      {(formData.degree || formData.institution) && (
        <div>
          {section("Education")}
          <div>
            <div style={{ fontWeight: 700, fontSize: "12px", color: "#111" }}>
              {formData.institution}
            </div>
            <div style={{ color: "#222", fontSize: "11.5px" }}>
              {formData.degree}
            </div>
            <div style={{ color: "#444", fontSize: "11px" }}>
              {[
                formData.yearRange,
                formData.cgpa ? `CGPA: ${formData.cgpa}` : "",
              ]
                .filter(Boolean)
                .join("  •  ")}
            </div>
          </div>
        </div>
      )}

      {/* ── Skills ── */}
      {hasSkills && (
        <div>
          {section("Technical Skills")}
          <div style={{ display: "grid", gap: "3px" }}>
            {languages.length > 0 && (
              <div style={{ fontSize: "11.5px", color: "#111" }}>
                <span style={{ fontWeight: 700 }}>Languages:</span>{" "}
                {languages.join(", ")}
              </div>
            )}
            {frameworksList.length > 0 && (
              <div style={{ fontSize: "11.5px", color: "#111" }}>
                <span style={{ fontWeight: 700 }}>Frameworks:</span>{" "}
                {frameworksList.join(", ")}
              </div>
            )}
            {toolsList.length > 0 && (
              <div style={{ fontSize: "11.5px", color: "#111" }}>
                <span style={{ fontWeight: 700 }}>Tools:</span>{" "}
                {toolsList.join(", ")}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Projects ── */}
      {validProjects.length > 0 && (
        <div>
          {section("Projects")}
          <div style={{ display: "grid", gap: "10px" }}>
            {validProjects.map((proj) => (
              <div key={proj.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    flexWrap: "wrap" as const,
                    gap: "4px",
                  }}
                >
                  <span
                    style={{ fontWeight: 700, fontSize: "12px", color: "#111" }}
                  >
                    {proj.name}
                  </span>
                  {proj.techStack && (
                    <span
                      style={{
                        fontStyle: "italic",
                        fontSize: "11px",
                        color: "#444",
                      }}
                    >
                      {proj.techStack}
                    </span>
                  )}
                </div>
                {proj.description && (
                  <div style={{ marginTop: "2px" }}>
                    {proj.description
                      .split(/\n|(?<=\.)\s+/)
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .map((line) => (
                        <div
                          key={`${proj.id}-${line.slice(0, 20)}`}
                          style={{
                            display: "flex",
                            gap: "6px",
                            fontSize: "11.5px",
                            color: "#222",
                          }}
                        >
                          <span style={{ flexShrink: 0, marginTop: "1px" }}>
                            •
                          </span>
                          <span>{line}</span>
                        </div>
                      ))}
                  </div>
                )}
                {proj.link && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#555",
                      marginTop: "2px",
                    }}
                  >
                    {proj.link}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Experience ── */}
      {formData.experience && (
        <div>
          {section("Work Experience")}
          <div>
            {experienceLines.map((line, i) => {
              const isBold =
                i === 0 || (i > 0 && experienceLines[i - 1] === "");
              return (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: experience lines are text-only with no stable id
                  key={`exp-${i}`}
                  style={{
                    fontSize: "11.5px",
                    color: "#222",
                    fontWeight: isBold && !line.startsWith("•") ? 700 : 400,
                    display: line.startsWith("•") ? "flex" : "block",
                    gap: "6px",
                    marginTop: i === 0 ? "0" : "1px",
                  }}
                >
                  {line}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Achievements ── */}
      {achievementLines.length > 0 && (
        <div>
          {section("Achievements & Certifications")}
          <div style={{ display: "grid", gap: "3px" }}>
            {achievementLines.map((line, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: achievement lines are text-only with no stable id
                key={`ach-${i}`}
                style={{
                  display: "flex",
                  gap: "6px",
                  fontSize: "11.5px",
                  color: "#222",
                }}
              >
                <span style={{ flexShrink: 0 }}>•</span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Download DOC ─────────────────────────────────────────────────────────────

function downloadDOC(formData: FormData) {
  const previewEl = document.getElementById("resume-preview");
  if (!previewEl) return;

  const content = `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; font-size: 12px; color: #111; margin: 40px; }
          h1 { font-size: 22px; font-weight: bold; }
        </style>
      </head>
      <body>${previewEl.innerHTML}</body>
    </html>
  `;
  const blob = new Blob([content], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${formData.fullName || "resume"}_resume.doc`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ResumeBuilder() {
  const { data: savedResume } = useResumeData();
  const updateResume = useUpdateResumeData();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Load saved resume data
  useEffect(() => {
    if (savedResume) {
      // Try to parse projects from saved string
      let projectsList: ProjectItem[] = [newProject()];
      if (savedResume.projects) {
        try {
          const parsed = JSON.parse(savedResume.projects);
          if (Array.isArray(parsed)) {
            // Ensure each project has an id
            projectsList = parsed.map(
              (p: Omit<ProjectItem, "id"> & { id?: string }) => ({
                id:
                  p.id ||
                  `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                name: p.name || "",
                techStack: p.techStack || "",
                description: p.description || "",
                link: p.link || "",
              }),
            );
          }
        } catch {
          // Legacy format: split by ---
          const blocks = savedResume.projects.split("\n---\n");
          if (blocks.length > 0 && blocks[0].trim()) {
            projectsList = blocks.map((block) => {
              const lines = block.trim().split("\n");
              return {
                id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                name: lines[0] || "",
                techStack: lines[1]?.replace("Tech Stack: ", "") || "",
                description: lines.slice(2, -1).join("\n"),
                link: lines[lines.length - 1]?.replace("Link: ", "") || "",
              };
            });
          }
        }
      }

      // Parse education
      const eduLines = (savedResume.education || "").split("\n");
      const skillsParts = (savedResume.skills || "").split("|");

      setFormData((prev) => ({
        ...prev,
        fullName: savedResume.fullName || "",
        email: savedResume.email || "",
        phone: savedResume.phone || "",
        summary: savedResume.summary || "",
        education: savedResume.education || "",
        degree: eduLines[0] || "",
        institution: eduLines[1] || "",
        yearRange: eduLines[2] || "",
        cgpa: eduLines[3]?.replace("CGPA: ", "") || "",
        skills: savedResume.skills || "",
        languages: skillsParts[0]?.trim() || "",
        frameworks: skillsParts[1]?.trim() || "",
        tools: skillsParts[2]?.trim() || "",
        projects: savedResume.projects || "",
        projectsList,
      }));
    }
  }, [savedResume]);

  const update = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateProjects = (list: ProjectItem[]) => {
    setFormData((prev) => ({ ...prev, projectsList: list }));
  };

  const handleGenerateSummary = () => {
    const summary = generateSummary(formData);
    update("summary", summary);
    toast.success("Summary generated!");
  };

  const saveResume = async () => {
    // Compute backend-compat fields
    const skillsFlat = [formData.languages, formData.frameworks, formData.tools]
      .filter(Boolean)
      .join(" | ");
    const projectsFlat = JSON.stringify(formData.projectsList);
    const educationFlat = serializeEducation(formData);

    try {
      await updateResume.mutateAsync({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        summary: formData.summary,
        education: educationFlat,
        skills: skillsFlat,
        projects: projectsFlat,
      });
      toast.success("Resume saved successfully!");
    } catch {
      toast.error("Failed to save resume");
    }
  };

  const handlePrint = () => window.print();
  const handleDownloadPDF = () => window.print();
  const handleDownloadDOC = () => downloadDOC(formData);

  return (
    <>
      {/* Print styles injected */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #resume-preview {
            display: block !important;
            position: fixed !important;
            top: 0 !important; left: 0 !important;
            width: 100% !important;
            z-index: 99999 !important;
            background: white !important;
            color: black !important;
          }
        }
      `}</style>

      <div className="p-4 sm:p-6 pb-10 max-w-[1400px] mx-auto">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-5 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center gradient-brand shadow-brand shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Resume Builder
              </h1>
              <p className="text-xs text-muted-foreground">
                ATS-friendly · Professional · One-page format
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 h-9 text-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPDF}
              className="gap-1.5 h-9 text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadDOC}
              className="gap-1.5 h-9 text-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              DOC
            </Button>
            <Button
              size="sm"
              onClick={saveResume}
              disabled={updateResume.isPending}
              className="gradient-brand text-white border-0 shadow-brand gap-1.5 h-9 text-xs"
            >
              {updateResume.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : null}
              {updateResume.isPending ? "Saving..." : "Save Resume"}
            </Button>
          </div>
        </div>

        {/* ── Strength Indicator ── */}
        <div className="mb-6">
          <StrengthIndicator formData={formData} />
        </div>

        {/* ── Two-column layout ── */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── LEFT: Form ── */}
          <div className="w-full lg:max-w-[520px] shrink-0">
            <Card className="border-border/60 shadow-[var(--shadow-card-md)]">
              <CardContent className="p-5 sm:p-6">
                {/* Step progress */}
                <StepProgress
                  currentStep={currentStep}
                  onStepClick={setCurrentStep}
                />

                {/* Step content */}
                <div className="min-h-[340px]">
                  {currentStep === 1 && (
                    <Step1Personal formData={formData} update={update} />
                  )}
                  {currentStep === 2 && (
                    <Step2Education formData={formData} update={update} />
                  )}
                  {currentStep === 3 && (
                    <Step3Skills formData={formData} update={update} />
                  )}
                  {currentStep === 4 && (
                    <Step4Projects
                      formData={formData}
                      updateProjects={updateProjects}
                    />
                  )}
                  {currentStep === 5 && (
                    <Step5Experience
                      formData={formData}
                      update={update}
                      onGenerateSummary={handleGenerateSummary}
                    />
                  )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6 pt-5 border-t border-border/60">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                    disabled={currentStep === 1}
                    className="gap-1.5 h-9 text-xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </Button>

                  <span className="text-xs text-muted-foreground font-medium">
                    Step {currentStep} of {STEPS.length}
                  </span>

                  {currentStep < STEPS.length ? (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        setCurrentStep((s) => Math.min(STEPS.length, s + 1))
                      }
                      className="gradient-brand text-white border-0 gap-1.5 h-9 text-xs"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      onClick={saveResume}
                      disabled={updateResume.isPending}
                      className="gradient-brand text-white border-0 gap-1.5 h-9 text-xs"
                    >
                      {updateResume.isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : null}
                      Save Resume
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Mobile: preview toggle */}
            <div className="lg:hidden mt-4">
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => setShowMobilePreview((v) => !v)}
              >
                <FileText className="w-4 h-4" />
                {showMobilePreview ? "Hide Preview" : "Preview Resume"}
              </Button>

              {showMobilePreview && (
                <div className="mt-4 border border-border/60 rounded-2xl overflow-hidden bg-white shadow-[var(--shadow-card-md)] overflow-x-auto">
                  <div className="min-w-[794px]">
                    <ResumePreview formData={formData} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Live Resume Preview (desktop only) ── */}
          <div className="hidden lg:block flex-1 min-w-0" ref={previewRef}>
            <div className="sticky top-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Live Preview
                </span>
              </div>
              <div className="border border-border/60 rounded-2xl overflow-hidden bg-white shadow-[var(--shadow-card-md)] overflow-y-auto max-h-[calc(100vh-12rem)] overflow-x-auto">
                <div className="min-w-[794px]">
                  <ResumePreview formData={formData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
