import { DonutChart } from "@/components/DonutChart";
import { GradientProgress } from "@/components/GradientProgress";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { useSkills, useUpdateSkills } from "@/hooks/useQueries";
import { BarChart2, Calendar, Edit2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Skill } from "../backend.d";

const LEVEL_LABELS = ["Beginner", "Intermediate", "Advanced"];
const LEVEL_COLORS = [
  "bg-info/10 text-info border-info/20",
  "bg-warning/10 text-warning border-warning/20",
  "bg-success/10 text-success border-success/20",
];

const SKILL_EMOJIS: Record<string, string> = {
  Python: "🐍",
  C: "🔷",
  "C++": "🔶",
  Java: "☕",
  JavaScript: "⚡",
  "HTML/CSS": "🌐",
  DSA: "🌲",
  "Oracle SQL": "🗄️",
  "Git & GitHub": "🐙",
  Aptitude: "🧠",
};

function SkillCard({
  skill,
  onEdit,
}: { skill: Skill; onEdit: (s: Skill) => void }) {
  const level = Number(skill.level);
  const progress = Number(skill.progressPercent);
  const levelLabel = LEVEL_LABELS[Math.min(level, 2)];
  const levelColor = LEVEL_COLORS[Math.min(level, 2)];
  const emoji = SKILL_EMOJIS[skill.skillName] || "💻";

  const formattedDate = skill.lastPracticedDate
    ? new Date(skill.lastPracticedDate).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not practiced";

  return (
    <Card className="border-border/70 card-hover overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Donut */}
          <div className="shrink-0">
            <DonutChart
              percent={progress}
              size={72}
              strokeWidth={7}
              label={`${progress}%`}
            />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{emoji}</span>
                  <h3 className="font-display font-bold text-base">
                    {skill.skillName}
                  </h3>
                </div>
                <Badge className={`mt-1.5 text-xs ${levelColor}`}>
                  {levelLabel}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-8 w-8"
                onClick={() => onEdit(skill)}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span className="font-medium gradient-brand-text">
                  {progress}%
                </span>
              </div>
              <GradientProgress value={progress} height={5} />
            </div>

            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>Last practiced: {formattedDate}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Skills() {
  const { data: skills = [], isLoading } = useSkills();
  const updateSkills = useUpdateSkills();
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editLevel, setEditLevel] = useState(0);
  const [editProgress, setEditProgress] = useState(0);

  const openEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setEditLevel(Number(skill.level));
    setEditProgress(Number(skill.progressPercent));
  };

  const saveEdit = async () => {
    if (!editingSkill) return;
    const updatedSkills = skills.map((s) =>
      s.skillName === editingSkill.skillName
        ? {
            ...s,
            level: BigInt(editLevel),
            progressPercent: BigInt(editProgress),
            lastPracticedDate: new Date().toISOString().split("T")[0],
          }
        : s,
    );
    try {
      await updateSkills.mutateAsync(updatedSkills);
      toast.success(`${editingSkill.skillName} updated!`);
      setEditingSkill(null);
    } catch {
      toast.error("Failed to save");
    }
  };

  const avgProgress =
    skills.length > 0
      ? Math.round(
          skills.reduce((sum, s) => sum + Number(s.progressPercent), 0) /
            skills.length,
        )
      : 0;

  const advancedCount = skills.filter((s) => Number(s.level) === 2).length;

  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-5xl mx-auto">
      <PageHeader
        icon={BarChart2}
        title="Skills Tracker"
        subtitle="Track your progress across all core placement skills"
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Average Progress",
            value: `${avgProgress}%`,
            color: "text-primary",
          },
          {
            label: "Skills Tracked",
            value: `${skills.length}`,
            color: "text-brand-purple",
          },
          {
            label: "Advanced Level",
            value: `${advancedCount}`,
            color: "text-success",
          },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/60">
            <CardContent className="p-4 text-center">
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

      {/* Skills grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {skills.map((skill) => (
            <SkillCard key={skill.skillName} skill={skill} onEdit={openEdit} />
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={!!editingSkill}
        onOpenChange={(open) => !open && setEditingSkill(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              Update {editingSkill?.skillName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Skill Level</Label>
              <Select
                value={editLevel.toString()}
                onValueChange={(v) => setEditLevel(Number.parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Beginner</SelectItem>
                  <SelectItem value="1">Intermediate</SelectItem>
                  <SelectItem value="2">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Progress</Label>
                <span className="font-bold gradient-brand-text">
                  {editProgress}%
                </span>
              </div>
              <Slider
                min={0}
                max={100}
                step={5}
                value={[editProgress]}
                onValueChange={([v]) => setEditProgress(v)}
                className="w-full"
              />
              <div className="mt-2">
                <GradientProgress value={editProgress} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingSkill(null)}>
              Cancel
            </Button>
            <Button
              onClick={saveEdit}
              disabled={updateSkills.isPending}
              className="gradient-brand text-white border-0 shadow-brand"
            >
              {updateSkills.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
