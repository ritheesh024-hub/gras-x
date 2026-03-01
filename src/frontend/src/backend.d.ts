import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MockInterviewQuestion {
    id: string;
    question: string;
    subcategory: string;
    category: string;
}
export interface MockInterviewAnswer {
    answer: string;
    questionId: string;
    rating: bigint;
    answeredDate: string;
}
export interface SolvedQuestion {
    solvedDate: string;
    notes: string;
    questionId: string;
}
export interface ReminderSettings {
    dailyTime: string;
    monthlyEnabled: boolean;
    weeklyDay: string;
    dailyEnabled: boolean;
    monthlyDay: bigint;
    weeklyEnabled: boolean;
}
export interface Skill {
    skillName: string;
    lastPracticedDate: string;
    level: bigint;
    progressPercent: bigint;
}
export interface InternshipApplication {
    id: string;
    status: string;
    role: string;
    dateApplied: string;
    company: string;
}
export interface ResumeData {
    projects: string;
    education: string;
    fullName: string;
    email: string;
    summary: string;
    phone: string;
    skills: string;
}
export interface PracticeQuestion {
    id: string;
    title: string;
    difficulty: string;
    description: string;
    category: string;
}
export interface UserProfile {
    name: string;
    totalSolvedQuestions: bigint;
    lastActiveDate: string;
    currentStreak: bigint;
}
export interface RoadmapProgress {
    completionPercent: bigint;
    monthIndex: bigint;
    completedTopics: Array<boolean>;
}
export interface backendInterface {
    addInternshipApplication(app: InternshipApplication): Promise<void>;
    deleteInternshipApplication(id: string): Promise<void>;
    getAllMockInterviewQuestions(): Promise<Array<MockInterviewQuestion>>;
    getAllPracticeQuestions(): Promise<Array<PracticeQuestion>>;
    getInternshipApplications(): Promise<Array<InternshipApplication>>;
    getInternshipApplicationsSortedByCompany(): Promise<Array<InternshipApplication>>;
    getInternshipApplicationsSortedByDate(): Promise<Array<InternshipApplication>>;
    getPracticeQuestionsByDifficulty(): Promise<Array<PracticeQuestion>>;
    getReminderSettings(): Promise<ReminderSettings | null>;
    getResumeData(): Promise<ResumeData | null>;
    getRoadmapProgress(month: bigint): Promise<RoadmapProgress | null>;
    getSkills(): Promise<Array<Skill>>;
    getSolvedQuestions(): Promise<Array<SolvedQuestion>>;
    getUserProfile(): Promise<UserProfile | null>;
    initialize(): Promise<void>;
    markQuestionSolved(solved: SolvedQuestion): Promise<void>;
    saveMockInterviewAnswer(answer: MockInterviewAnswer): Promise<void>;
    updateInternshipApplication(app: InternshipApplication): Promise<void>;
    updateReminderSettings(settings: ReminderSettings): Promise<void>;
    updateResumeData(data: ResumeData): Promise<void>;
    updateRoadmapProgress(progress: RoadmapProgress): Promise<void>;
    updateSkills(newSkills: Array<Skill>): Promise<void>;
    updateUserProfile(profile: UserProfile): Promise<void>;
}
