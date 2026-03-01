import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useMockInterviewQuestions,
  useSaveMockInterviewAnswer,
} from "@/hooks/useQueries";
import {
  Award,
  ChevronDown,
  ChevronUp,
  Loader2,
  MessageSquare,
  Mic,
  Save,
  Star,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { MockInterviewQuestion } from "../backend.d";

function StarRating({
  value,
  onChange,
}: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-5 h-5 ${star <= value ? "text-warning fill-warning" : "text-muted-foreground"}`}
          />
        </button>
      ))}
    </div>
  );
}

function QuestionCard({
  question,
  answers,
}: {
  question: MockInterviewQuestion;
  answers: Record<string, { answer: string; rating: number; date: string }>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [answer, setAnswer] = useState(answers[question.id]?.answer || "");
  const [rating, setRating] = useState(answers[question.id]?.rating || 0);
  const saveAnswer = useSaveMockInterviewAnswer();

  const handleSave = async () => {
    if (!answer.trim()) {
      toast.error("Please write an answer first");
      return;
    }
    if (rating === 0) {
      toast.error("Please rate your answer");
      return;
    }
    try {
      await saveAnswer.mutateAsync({
        questionId: question.id,
        answer,
        rating: BigInt(rating),
        answeredDate: new Date().toISOString().split("T")[0],
      });
      toast.success("Answer saved!");
    } catch {
      toast.error("Failed to save answer");
    }
  };

  const savedData = answers[question.id];

  return (
    <Card
      className={`border-border/60 overflow-hidden transition-all ${savedData ? "border-success/20 bg-success/5" : ""}`}
    >
      <button
        type="button"
        className="p-5 cursor-pointer w-full text-left"
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => e.key === "Enter" && setExpanded(!expanded)}
      >
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="text-xs bg-accent/50 text-accent-foreground">
                {question.category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {question.subcategory}
              </Badge>
              {savedData && (
                <Badge className="text-xs bg-success/10 text-success border-success/20">
                  ✓ Answered · {savedData.rating}/5 ⭐
                </Badge>
              )}
            </div>
            <p className="mt-2 font-medium text-sm leading-relaxed">
              {question.question}
            </p>
          </div>
          <div className="shrink-0">
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-border/40 pt-4 space-y-4">
          <Textarea
            placeholder="Write your answer here... (speak it out loud for best practice)"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={6}
            className="resize-none"
          />
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                Rate your answer:
              </span>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saveAnswer.isPending}
              className="gradient-brand text-white border-0 shadow-brand"
            >
              {saveAnswer.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-3 h-3 mr-1.5" />
                  Save Answer
                </>
              )}
            </Button>
          </div>
          {savedData?.date && (
            <p className="text-xs text-muted-foreground">
              Last answered:{" "}
              {new Date(savedData.date).toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}

export function MockInterview() {
  const { data: questions = [], isLoading } = useMockInterviewQuestions();
  const [localAnswers] = useState<
    Record<string, { answer: string; rating: number; date: string }>
  >({});

  const hrQuestions = questions.filter((q) => q.category === "HR");
  const techQuestions = questions.filter((q) => q.category === "Technical");

  const answeredCount = Object.keys(localAnswers).length;
  const avgRating = useMemo(() => {
    const ratings = Object.values(localAnswers)
      .map((a) => a.rating)
      .filter((r) => r > 0);
    if (ratings.length === 0) return 0;
    return (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1);
  }, [localAnswers]);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <PageHeader
        icon={Mic}
        title="Mock Interview"
        subtitle="Practice HR and technical questions before placement"
      />

      {/* Performance summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border/60">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-display font-bold text-primary">
              {questions.length}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Total Questions
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-display font-bold text-success">
              {answeredCount}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">Answered</div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <Award className="w-5 h-5 text-warning" />
              <div className="text-2xl font-display font-bold text-warning">
                {avgRating}
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Avg Score
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Questions tabs */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, skeletonIdx) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
            <Skeleton key={skeletonIdx} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <Tabs defaultValue="hr">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="hr" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              HR Questions ({hrQuestions.length})
            </TabsTrigger>
            <TabsTrigger value="technical" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Technical ({techQuestions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hr" className="space-y-3 mt-4">
            {hrQuestions.map((q) => (
              <QuestionCard key={q.id} question={q} answers={localAnswers} />
            ))}
          </TabsContent>

          <TabsContent value="technical" className="space-y-3 mt-4">
            {techQuestions.map((q) => (
              <QuestionCard key={q.id} question={q} answers={localAnswers} />
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
