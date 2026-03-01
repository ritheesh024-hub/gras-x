import Debug "mo:core/Debug";
import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

actor {
  module Skill {
    public func compare(s1 : Skill, s2 : Skill) : Order.Order {
      Text.compare(s1.skillName, s2.skillName);
    };
  };

  module PracticeQuestion {
    public func compareByDifficulty(p1 : PracticeQuestion, p2 : PracticeQuestion) : Order.Order {
      Text.compare(p1.difficulty, p2.difficulty);
    };
  };

  module InternshipApplication {
    public func compareByDate(ap1 : InternshipApplication, ap2 : InternshipApplication) : Order.Order {
      Text.compare(ap1.dateApplied, ap2.dateApplied);
    };

    public func compareByCompany(ap1 : InternshipApplication, ap2 : InternshipApplication) : Order.Order {
      Text.compare(ap1.company, ap2.company);
    };
  };

  type UserProfile = {
    name : Text;
    currentStreak : Nat;
    lastActiveDate : Text;
    totalSolvedQuestions : Nat;
  };

  type RoadmapProgress = {
    monthIndex : Nat;
    completionPercent : Nat;
    completedTopics : [Bool];
  };

  type Skill = {
    skillName : Text;
    level : Nat;
    progressPercent : Nat;
    lastPracticedDate : Text;
  };

  type PracticeQuestion = {
    id : Text;
    title : Text;
    difficulty : Text;
    description : Text;
    category : Text;
  };

  type SolvedQuestion = {
    questionId : Text;
    solvedDate : Text;
    notes : Text;
  };

  type MockInterviewQuestion = {
    id : Text;
    category : Text;
    question : Text;
    subcategory : Text;
  };

  type MockInterviewAnswer = {
    questionId : Text;
    answer : Text;
    rating : Nat;
    answeredDate : Text;
  };

  type InternshipApplication = {
    id : Text;
    company : Text;
    role : Text;
    dateApplied : Text;
    status : Text;
  };

  type ReminderSettings = {
    dailyEnabled : Bool;
    dailyTime : Text;
    weeklyEnabled : Bool;
    weeklyDay : Text;
    monthlyEnabled : Bool;
    monthlyDay : Nat;
  };

  type ResumeData = {
    fullName : Text;
    email : Text;
    phone : Text;
    summary : Text;
    education : Text;
    skills : Text;
    projects : Text;
  };

  var initialized : Bool = false;

  let userProfiles = Map.empty<Principal, UserProfile>();
  let roadmapProgress = Map.empty<Principal, Map.Map<Nat, RoadmapProgress>>();
  let skills = Map.empty<Principal, List.List<Skill>>();
  let practiceQuestions = Map.empty<Text, PracticeQuestion>();
  let solvedQuestions = Map.empty<Principal, List.List<SolvedQuestion>>();
  let mockInterviewQuestions = Map.empty<Text, MockInterviewQuestion>();
  let mockInterviewAnswers = Map.empty<Principal, Map.Map<Text, MockInterviewAnswer>>();
  let internshipApplications = Map.empty<Principal, List.List<InternshipApplication>>();
  let reminderSettings = Map.empty<Principal, ReminderSettings>();
  let resumeData = Map.empty<Principal, ResumeData>();

  public shared ({ caller }) func initialize() : async () {
    if (initialized) { Runtime.trap("Already initialized. ") };
    initialized := true;

    let easyQuestions = [
      {
        id = "pq1";
        title = "Calculate Sum";
        difficulty = "Easy";
        description = "Find the sum of two numbers.";
        category = "Math";
      },
      {
        id = "pq2";
        title = "Reverse String";
        difficulty = "Easy";
        description = "Reverse a given string.";
        category = "Strings";
      },
    ];

    let mediumQuestions = [
      {
        id = "pq11";
        title = "Find Median";
        difficulty = "Medium";
        description = "Find the median of an array.";
        category = "Math";
      },
    ];

    let hardQuestions = [
      {
        id = "pq16";
        title = "Longest Palindrome";
        difficulty = "Hard";
        description = "Find the longest palindromic substring.";
        category = "Strings";
      },
    ];

    for (q in easyQuestions.values()) {
      practiceQuestions.add(q.id, q);
    };
    for (q in mediumQuestions.values()) {
      practiceQuestions.add(q.id, q);
    };
    for (q in hardQuestions.values()) {
      practiceQuestions.add(q.id, q);
    };

    let hrQuestions = [
      {
        id = "miq1";
        category = "HR";
        question = "Tell me about yourself.";
        subcategory = "General";
      },
    ];

    let technicalQuestions = [
      {
        id = "miq8";
        category = "Technical";
        question = "Explain binary search.";
        subcategory = "Algorithms";
      },
    ];

    for (q in hrQuestions.values()) {
      mockInterviewQuestions.add(q.id, q);
    };
    for (q in technicalQuestions.values()) {
      mockInterviewQuestions.add(q.id, q);
    };
  };

  public query ({ caller }) func getUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public shared ({ caller }) func updateUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getRoadmapProgress(month : Nat) : async ?RoadmapProgress {
    switch (roadmapProgress.get(caller)) {
      case (null) { null };
      case (?userProgress) { userProgress.get(month) };
    };
  };

  public shared ({ caller }) func updateRoadmapProgress(progress : RoadmapProgress) : async () {
    let userProgress = switch (roadmapProgress.get(caller)) {
      case (null) { Map.empty<Nat, RoadmapProgress>() };
      case (?existing) { existing };
    };
    userProgress.add(progress.monthIndex, progress);
    roadmapProgress.add(caller, userProgress);
  };

  public query ({ caller }) func getSkills() : async [Skill] {
    switch (skills.get(caller)) {
      case (null) { [] };
      case (?userSkills) { userSkills.toArray().sort() };
    };
  };

  public shared ({ caller }) func updateSkills(newSkills : [Skill]) : async () {
    let skillList = List.fromArray<Skill>(newSkills);
    skills.add(caller, skillList);
  };

  public query ({ caller }) func getAllPracticeQuestions() : async [PracticeQuestion] {
    practiceQuestions.values().toArray();
  };

  public query ({ caller }) func getPracticeQuestionsByDifficulty() : async [PracticeQuestion] {
    practiceQuestions.values().toArray().sort(PracticeQuestion.compareByDifficulty);
  };

  public query ({ caller }) func getSolvedQuestions() : async [SolvedQuestion] {
    switch (solvedQuestions.get(caller)) {
      case (null) { [] };
      case (?userSolved) { userSolved.toArray() };
    };
  };

  public shared ({ caller }) func markQuestionSolved(solved : SolvedQuestion) : async () {
    let userSolved = switch (solvedQuestions.get(caller)) {
      case (null) { List.empty<SolvedQuestion>() };
      case (?existing) { existing };
    };
    userSolved.add(solved);
    solvedQuestions.add(caller, userSolved);
  };

  public query ({ caller }) func getAllMockInterviewQuestions() : async [MockInterviewQuestion] {
    mockInterviewQuestions.values().toArray();
  };

  public shared ({ caller }) func saveMockInterviewAnswer(answer : MockInterviewAnswer) : async () {
    let userAnswers = switch (mockInterviewAnswers.get(caller)) {
      case (null) { Map.empty<Text, MockInterviewAnswer>() };
      case (?existing) { existing };
    };
    userAnswers.add(answer.questionId, answer);
    mockInterviewAnswers.add(caller, userAnswers);
  };

  public query ({ caller }) func getInternshipApplications() : async [InternshipApplication] {
    switch (internshipApplications.get(caller)) {
      case (null) { [] };
      case (?userApps) { userApps.toArray() };
    };
  };

  public query ({ caller }) func getInternshipApplicationsSortedByDate() : async [InternshipApplication] {
    switch (internshipApplications.get(caller)) {
      case (null) { [] };
      case (?userApps) { userApps.toArray().sort(InternshipApplication.compareByDate) };
    };
  };

  public query ({ caller }) func getInternshipApplicationsSortedByCompany() : async [InternshipApplication] {
    switch (internshipApplications.get(caller)) {
      case (null) { [] };
      case (?userApps) { userApps.toArray().sort(InternshipApplication.compareByCompany) };
    };
  };

  public shared ({ caller }) func addInternshipApplication(app : InternshipApplication) : async () {
    let userApps = switch (internshipApplications.get(caller)) {
      case (null) { List.empty<InternshipApplication>() };
      case (?existing) { existing };
    };
    userApps.add(app);
    internshipApplications.add(caller, userApps);
  };

  public shared ({ caller }) func updateInternshipApplication(app : InternshipApplication) : async () {
    switch (internshipApplications.get(caller)) {
      case (null) { Runtime.trap("No applications found for user ") };
      case (?userApps) {
        let filtered = userApps.filter(func(a) { a.id != app.id });
        filtered.add(app);
        internshipApplications.add(caller, filtered);
      };
    };
  };

  public shared ({ caller }) func deleteInternshipApplication(id : Text) : async () {
    switch (internshipApplications.get(caller)) {
      case (null) { Runtime.trap("No applications found for user ") };
      case (?userApps) {
        let filtered = userApps.filter(func(a) { a.id != id });
        internshipApplications.add(caller, filtered);
      };
    };
  };

  public query ({ caller }) func getReminderSettings() : async ?ReminderSettings {
    reminderSettings.get(caller);
  };

  public shared ({ caller }) func updateReminderSettings(settings : ReminderSettings) : async () {
    reminderSettings.add(caller, settings);
  };

  public query ({ caller }) func getResumeData() : async ?ResumeData {
    resumeData.get(caller);
  };

  public shared ({ caller }) func updateResumeData(data : ResumeData) : async () {
    resumeData.add(caller, data);
  };
};
