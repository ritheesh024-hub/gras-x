import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  InternshipApplication,
  MockInterviewAnswer,
  MockInterviewQuestion,
  PracticeQuestion,
  ReminderSettings,
  ResumeData,
  RoadmapProgress,
  Skill,
  SolvedQuestion,
  UserProfile,
} from "../backend.d";
import { useActor } from "./useActor";

// ---- User Profile ----
export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateUserProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("No actor");
      await actor.updateUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userProfile"] }),
  });
}

// ---- Skills ----
export function useSkills() {
  const { actor, isFetching } = useActor();
  return useQuery<Skill[]>({
    queryKey: ["skills"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSkills();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateSkills() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (skills: Skill[]) => {
      if (!actor) throw new Error("No actor");
      await actor.updateSkills(skills);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["skills"] }),
  });
}

// ---- Practice Questions ----
export function usePracticeQuestions() {
  const { actor, isFetching } = useActor();
  return useQuery<PracticeQuestion[]>({
    queryKey: ["practiceQuestions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPracticeQuestions();
    },
    enabled: !!actor && !isFetching,
  });
}

// ---- Solved Questions ----
export function useSolvedQuestions() {
  const { actor, isFetching } = useActor();
  return useQuery<SolvedQuestion[]>({
    queryKey: ["solvedQuestions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSolvedQuestions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkQuestionSolved() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (solved: SolvedQuestion) => {
      if (!actor) throw new Error("No actor");
      await actor.markQuestionSolved(solved);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["solvedQuestions"] });
      qc.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

// ---- Roadmap ----
export function useRoadmapProgress(month: number) {
  const { actor, isFetching } = useActor();
  return useQuery<RoadmapProgress | null>({
    queryKey: ["roadmapProgress", month],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getRoadmapProgress(BigInt(month));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateRoadmapProgress() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (progress: RoadmapProgress) => {
      if (!actor) throw new Error("No actor");
      await actor.updateRoadmapProgress(progress);
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: ["roadmapProgress", Number(variables.monthIndex)],
      });
    },
  });
}

// ---- Mock Interview ----
export function useMockInterviewQuestions() {
  const { actor, isFetching } = useActor();
  return useQuery<MockInterviewQuestion[]>({
    queryKey: ["mockInterviewQuestions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMockInterviewQuestions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveMockInterviewAnswer() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (answer: MockInterviewAnswer) => {
      if (!actor) throw new Error("No actor");
      await actor.saveMockInterviewAnswer(answer);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["mockInterviewAnswers"] }),
  });
}

// ---- Internship Applications ----
export function useInternshipApplications() {
  const { actor, isFetching } = useActor();
  return useQuery<InternshipApplication[]>({
    queryKey: ["internshipApplications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInternshipApplications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddInternshipApplication() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (app: InternshipApplication) => {
      if (!actor) throw new Error("No actor");
      await actor.addInternshipApplication(app);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["internshipApplications"] }),
  });
}

export function useUpdateInternshipApplication() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (app: InternshipApplication) => {
      if (!actor) throw new Error("No actor");
      await actor.updateInternshipApplication(app);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["internshipApplications"] }),
  });
}

export function useDeleteInternshipApplication() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      await actor.deleteInternshipApplication(id);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["internshipApplications"] }),
  });
}

// ---- Resume ----
export function useResumeData() {
  const { actor, isFetching } = useActor();
  return useQuery<ResumeData | null>({
    queryKey: ["resumeData"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getResumeData();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateResumeData() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: ResumeData) => {
      if (!actor) throw new Error("No actor");
      await actor.updateResumeData(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["resumeData"] }),
  });
}

// ---- Reminders ----
export function useReminderSettings() {
  const { actor, isFetching } = useActor();
  return useQuery<ReminderSettings | null>({
    queryKey: ["reminderSettings"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getReminderSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateReminderSettings() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (settings: ReminderSettings) => {
      if (!actor) throw new Error("No actor");
      await actor.updateReminderSettings(settings);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminderSettings"] }),
  });
}
