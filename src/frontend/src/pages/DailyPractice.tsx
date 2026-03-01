import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useMarkQuestionSolved,
  usePracticeQuestions,
  useSolvedQuestions,
  useUserProfile,
} from "@/hooks/useQueries";
import { CheckCircle2, Clock, Filter, Flame, Loader2, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { PracticeQuestion } from "../backend.d";

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "bg-success/10 text-success border-success/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Hard: "bg-destructive/10 text-destructive border-destructive/20",
};

function WeeklyChart({
  solvedQuestions,
}: { solvedQuestions: Array<{ solvedDate: string }> }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1);

  const dayCounts = days.map((_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    const dayStr = day.toISOString().split("T")[0];
    return solvedQuestions.filter((q) => q.solvedDate.startsWith(dayStr))
      .length;
  });

  const maxCount = Math.max(1, ...dayCounts);

  return (
    <div className="flex items-end gap-2 h-24">
      {days.map((day, i) => {
        const count = dayCounts[i];
        const height = Math.max(4, (count / maxCount) * 100);
        const isToday = i === (today.getDay() === 0 ? 6 : today.getDay() - 1);
        return (
          <div key={day} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              {count || ""}
            </span>
            <div
              className="w-full rounded-t-md overflow-hidden flex flex-col justify-end"
              style={{ height: "80px" }}
            >
              <div
                className="w-full rounded-t-md transition-all duration-500"
                style={{
                  height: `${height}%`,
                  background: isToday
                    ? "linear-gradient(180deg, oklch(var(--brand-blue)), oklch(var(--brand-purple)))"
                    : count > 0
                      ? "linear-gradient(180deg, oklch(var(--brand-blue) / 0.5), oklch(var(--brand-purple) / 0.5))"
                      : "oklch(var(--border))",
                }}
              />
            </div>
            <span
              className={`text-[10px] font-medium ${isToday ? "text-primary" : "text-muted-foreground"}`}
            >
              {day}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function QuestionCard({
  question,
  isSolved,
  onSolve,
}: {
  question: PracticeQuestion;
  isSolved: boolean;
  onSolve: (q: PracticeQuestion) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const markSolved = useMarkQuestionSolved();

  const handleSolve = async () => {
    try {
      await onSolve(question);
    } catch {
      // error handled in parent
    }
  };

  return (
    <Card
      className={`border-border/60 card-hover overflow-hidden transition-all ${isSolved ? "opacity-75" : ""}`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                className={`text-xs ${DIFFICULTY_COLORS[question.difficulty] || "bg-muted text-muted-foreground"}`}
              >
                {question.difficulty}
              </Badge>
              <Badge
                variant="outline"
                className="text-xs text-muted-foreground"
              >
                {question.category}
              </Badge>
              {isSolved && (
                <Badge className="text-xs bg-success/10 text-success border-success/20">
                  ✓ Solved
                </Badge>
              )}
            </div>
            <h3 className="font-display font-bold mt-2 leading-snug">
              {question.title}
            </h3>
            {expanded && (
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {question.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {expanded ? "Hide" : "View"} details
          </Button>
          {!isSolved && (
            <Button
              size="sm"
              onClick={handleSolve}
              disabled={markSolved.isPending}
              className="ml-auto gradient-brand text-white border-0 text-xs shadow-brand"
            >
              {markSolved.isPending ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1.5" />
                  Mark Solved
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function DailyPractice() {
  const { data: questions = [], isLoading: questionsLoading } =
    usePracticeQuestions();
  const { data: solved = [], isLoading: solvedLoading } = useSolvedQuestions();
  const { data: profile } = useUserProfile();
  const markSolved = useMarkQuestionSolved();
  const [diffFilter, setDiffFilter] = useState("All");

  const streak = profile ? Number(profile.currentStreak) : 0;

  const solvedSet = useMemo(
    () => new Set(solved.map((s) => s.questionId)),
    [solved],
  );

  const filteredQuestions = useMemo(() => {
    if (diffFilter === "All") return questions;
    return questions.filter((q) => q.difficulty === diffFilter);
  }, [questions, diffFilter]);

  const handleMarkSolved = async (q: PracticeQuestion) => {
    try {
      await markSolved.mutateAsync({
        questionId: q.id,
        solvedDate: new Date().toISOString().split("T")[0],
        notes: "",
      });
      toast.success(`"${q.title}" marked as solved! 🎉`);
    } catch {
      toast.error("Failed to mark as solved");
    }
  };

  const solvedToday = solved.filter((s) =>
    s.solvedDate.startsWith(new Date().toISOString().split("T")[0]),
  ).length;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <PageHeader
        icon={Zap}
        title="Daily Practice"
        subtitle="Solve problems daily to maintain your streak"
        action={
          streak > 0 ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-bold text-orange-500">
                {streak} Day Streak
              </span>
            </div>
          ) : undefined
        }
      />

      {/* Streak banner */}
      <Card className="border-0 overflow-hidden">
        <div className="gradient-brand p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🔥</div>
              <div>
                <div className="text-4xl font-display font-bold">{streak}</div>
                <div className="opacity-80 text-sm">Day Streak</div>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-display font-bold">
                  {solved.length}
                </div>
                <div className="opacity-80 text-xs">Total Solved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-display font-bold">
                  {solvedToday}
                </div>
                <div className="opacity-80 text-xs">Today</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Weekly chart */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-base">
            Weekly Consistency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyChart solvedQuestions={solved} />
        </CardContent>
      </Card>

      {/* Filter + Questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Tabs value={diffFilter} onValueChange={setDiffFilter}>
              <TabsList>
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="Easy">Easy</TabsTrigger>
                <TabsTrigger value="Medium">Medium</TabsTrigger>
                <TabsTrigger value="Hard">Hard</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <span className="text-sm text-muted-foreground">
            {filteredQuestions.filter((q) => !solvedSet.has(q.id)).length}{" "}
            remaining
          </span>
        </div>

        {questionsLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-3 stagger-children">
            {filteredQuestions.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                isSolved={solvedSet.has(q.id)}
                onSolve={handleMarkSolved}
              />
            ))}
          </div>
        )}
      </div>

      {/* History */}
      {!solvedLoading && solved.length > 0 && (
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Practice History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {[...solved]
                .reverse()
                .slice(0, 20)
                .map((sq) => {
                  const q = questions.find((q) => q.id === sq.questionId);
                  return (
                    <div
                      key={sq.questionId}
                      className="flex items-center justify-between text-sm py-2 border-b border-border/40 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span>{q?.title || sq.questionId}</span>
                        {q && (
                          <Badge
                            className={`text-xs ${DIFFICULTY_COLORS[q.difficulty] || ""}`}
                          >
                            {q.difficulty}
                          </Badge>
                        )}
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {new Date(sq.solvedDate).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
