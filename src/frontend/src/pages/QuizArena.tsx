import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  BarChart2,
  Bot,
  Brain,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  Flame,
  Loader2,
  RefreshCw,
  Star,
  Target,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Question {
  id: string;
  type:
    | "mcq"
    | "code-output"
    | "find-error"
    | "complete-code"
    | "dry-run"
    | "time-complexity"
    | "hr";
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  aiExplanation?: string;
}

interface QuizResult {
  date: string;
  score: number;
  total: number;
  topic: string;
  difficulty: string;
  xpEarned: number;
  wrongTopics: string[];
}

interface GamificationState {
  xp: number;
  badges: string[];
  streak: number;
  lastQuizDate: string;
  history: QuizResult[];
}

// ─── Question Bank ─────────────────────────────────────────────────────────────
const CODING_QUESTIONS: Question[] = [
  // Easy
  {
    id: "e1",
    type: "code-output",
    difficulty: "Easy",
    topic: "JavaScript",
    question: "What is the output of: console.log(2 + '3')?",
    options: ["5", "'23'", "Error", "undefined"],
    answer: 1,
    explanation: "JS coerces 2 to string, so '2'+'3' = '23'",
    aiExplanation:
      "JavaScript uses type coercion. When + is used with a string, numbers are converted to strings and concatenated.",
  },
  {
    id: "e2",
    type: "time-complexity",
    difficulty: "Easy",
    topic: "DSA",
    question: "What is the time complexity of linear search?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    answer: 1,
    explanation: "Linear search checks each element once → O(n)",
    aiExplanation:
      "In the worst case, linear search visits every element exactly once before finding the target or exhausting the list.",
  },
  {
    id: "e3",
    type: "find-error",
    difficulty: "Easy",
    topic: "C",
    question: 'Find the error: for(int i=0; i<5; i++) { printf("%d", i) }',
    options: [
      "Missing semicolon after printf",
      "Wrong loop syntax",
      "i should start at 1",
      "No error",
    ],
    answer: 0,
    explanation: "printf statement needs a semicolon to end the statement",
    aiExplanation:
      'In C, every statement must end with a semicolon. printf("%d", i) is a statement and needs ; at the end.',
  },
  {
    id: "e4",
    type: "complete-code",
    difficulty: "Easy",
    topic: "C",
    question: "Complete: int arr[]={1,2,3}; int len = ___/___",
    options: [
      "sizeof(arr)/sizeof(arr[0])",
      "arr.length/1",
      "count(arr)/1",
      "arr.size()/1",
    ],
    answer: 0,
    explanation: "In C/C++, array length = sizeof(array)/sizeof(first element)",
    aiExplanation:
      "sizeof(arr) gives total bytes, sizeof(arr[0]) gives bytes per element. Dividing gives the element count.",
  },
  {
    id: "e5",
    type: "dry-run",
    difficulty: "Easy",
    topic: "Logic",
    question: "Dry run: int x=5; x=x+x; x=x*2; What is x?",
    options: ["10", "15", "20", "25"],
    answer: 2,
    explanation: "x=5 → x=10 → x=20",
    aiExplanation:
      "Step by step: x starts at 5, then x=5+5=10, then x=10*2=20. Final value is 20.",
  },
  {
    id: "e6",
    type: "mcq",
    difficulty: "Easy",
    topic: "DSA",
    question: "Which data structure uses FIFO?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    answer: 1,
    explanation: "Queue follows First In, First Out",
    aiExplanation:
      "A Queue is like a line at a ticket counter — the first person to join is the first to be served.",
  },
  {
    id: "e7",
    type: "mcq",
    difficulty: "Easy",
    topic: "Python",
    question: "What is output of: print(type(3.14))?",
    options: ["int", "<class 'float'>", "double", "number"],
    answer: 1,
    explanation: "3.14 is a float literal in Python",
    aiExplanation:
      "Python's type() returns the class of the object. 3.14 is a floating-point number, so it returns <class 'float'>.",
  },
  {
    id: "e8",
    type: "mcq",
    difficulty: "Easy",
    topic: "OOP",
    question: "Which OOP concept hides internal implementation details?",
    options: ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"],
    answer: 2,
    explanation:
      "Encapsulation bundles data and methods, hiding internal state",
    aiExplanation:
      "Encapsulation wraps data and behavior together in a class and exposes only what's necessary via public methods.",
  },
  // Medium
  {
    id: "m1",
    type: "code-output",
    difficulty: "Medium",
    topic: "C",
    question: 'What is output? int a=10,b=5; printf("%d", a&b);',
    options: ["15", "0", "5", "10"],
    answer: 1,
    explanation: "10=1010, 5=0101, AND=0000=0",
    aiExplanation:
      "Bitwise AND compares each bit. 1010 & 0101 = 0000 = 0. Every bit position has at least one 0.",
  },
  {
    id: "m2",
    type: "time-complexity",
    difficulty: "Medium",
    topic: "DSA",
    question: "Time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    answer: 1,
    explanation: "Binary search halves the space each step → O(log n)",
    aiExplanation:
      "Each step eliminates half the remaining elements. With n elements, you need at most log₂(n) steps.",
  },
  {
    id: "m3",
    type: "find-error",
    difficulty: "Medium",
    topic: "DSA",
    question: "Find error in bubble sort inner loop: for(j=0; j<n; j++)",
    options: [
      "Should be j<n-i-1",
      "Should start j=1",
      "Should use j<=n",
      "No error",
    ],
    answer: 0,
    explanation:
      "After each pass, largest element is placed. Inner loop should be j<n-i-1",
    aiExplanation:
      "After i passes, the last i elements are already sorted. The inner loop only needs to go up to n-i-1.",
  },
  {
    id: "m4",
    type: "complete-code",
    difficulty: "Medium",
    topic: "DSA",
    question: "Complete Fibonacci: if(n<=1) return n; return ___",
    options: [
      "fib(n-1)+fib(n-2)",
      "fib(n)+fib(n-1)",
      "fib(n-1)*fib(n-2)",
      "n-1+n-2",
    ],
    answer: 0,
    explanation: "Each Fibonacci number is the sum of the two preceding ones",
    aiExplanation:
      "The Fibonacci sequence is defined recursively: F(n) = F(n-1) + F(n-2), with base cases F(0)=0, F(1)=1.",
  },
  {
    id: "m5",
    type: "dry-run",
    difficulty: "Medium",
    topic: "DSA",
    question: "int arr[]={3,1,4,1,5}; sort(arr); What is arr[2]?",
    options: ["3", "1", "4", "5"],
    answer: 0,
    explanation: "Sorted: {1,1,3,4,5}, index 2 = 3",
    aiExplanation:
      "After sorting in ascending order: [1,1,3,4,5]. arr[2] (0-indexed) is 3.",
  },
  {
    id: "m6",
    type: "time-complexity",
    difficulty: "Medium",
    topic: "DSA",
    question: "Space complexity of merge sort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    answer: 2,
    explanation: "Merge sort needs O(n) auxiliary space for merging",
    aiExplanation:
      "Merge sort creates temporary arrays during the merge step. The total additional space needed is proportional to n.",
  },
  {
    id: "m7",
    type: "mcq",
    difficulty: "Medium",
    topic: "DSA",
    question: "Which sorting algorithm is stable?",
    options: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"],
    answer: 2,
    explanation: "Merge sort maintains relative order of equal elements",
    aiExplanation:
      "A stable sort preserves the original order of equal elements. Merge sort achieves this by always picking the left element when values are equal.",
  },
  {
    id: "m8",
    type: "mcq",
    difficulty: "Medium",
    topic: "Java",
    question: "Which Java keyword prevents method overriding?",
    options: ["static", "final", "private", "abstract"],
    answer: 1,
    explanation: "final prevents a method from being overridden in subclasses",
    aiExplanation:
      "The final keyword in Java, when applied to a method, prevents subclasses from overriding it. It seals the method's behavior.",
  },
  // Hard
  {
    id: "h1",
    type: "code-output",
    difficulty: "Hard",
    topic: "C",
    question:
      'void f(int *p){ *p=(*p)<<2; } int x=3; f(&x); printf("%d",x); Output?',
    options: ["6", "12", "9", "3"],
    answer: 1,
    explanation: "<<2 left-shifts by 2 = multiply by 4. 3<<2=12",
    aiExplanation:
      "Left shift by k is equivalent to multiplying by 2^k. 3 << 2 = 3 * 4 = 12. The pointer modifies x in place.",
  },
  {
    id: "h2",
    type: "time-complexity",
    difficulty: "Hard",
    topic: "DSA",
    question: "Time complexity of building a heap from an array?",
    options: ["O(n log n)", "O(n)", "O(log n)", "O(n²)"],
    answer: 1,
    explanation: "Building heap using heapify bottom-up is O(n)",
    aiExplanation:
      "Counter-intuitively, building a heap is O(n) not O(n log n). Most heapify operations are on small subtrees near the leaves.",
  },
  {
    id: "h3",
    type: "find-error",
    difficulty: "Hard",
    topic: "C",
    question: "int *p = malloc(10); p = malloc(20); — what's wrong?",
    options: [
      "First malloc not freed before reassigning",
      "malloc returns void",
      "Wrong size",
      "No error",
    ],
    answer: 0,
    explanation: "First allocation is lost when p is reassigned — memory leak",
    aiExplanation:
      "When you reassign p without freeing the first allocation, that memory becomes inaccessible. This is a classic memory leak.",
  },
  {
    id: "h4",
    type: "complete-code",
    difficulty: "Hard",
    topic: "DSA",
    question: "After right-heavy AVL imbalance (balance=-2), perform ___",
    options: [
      "Left rotation",
      "Right rotation",
      "Left-Right rotation",
      "No rotation",
    ],
    answer: 0,
    explanation: "Right-heavy imbalance requires a left rotation",
    aiExplanation:
      "In AVL trees, a balance factor of -2 on a node means its right subtree is too heavy. A left rotation restores balance.",
  },
  {
    id: "h5",
    type: "dry-run",
    difficulty: "Hard",
    topic: "DSA",
    question: "dp[0]=0;dp[1]=1; for i=2 to 5: dp[i]=dp[i-1]+dp[i-2]; dp[5]=?",
    options: ["5", "8", "13", "3"],
    answer: 0,
    explanation: "Fibonacci DP: [0,1,1,2,3,5], dp[5]=5",
    aiExplanation:
      "dp=[0,1], dp[2]=1, dp[3]=2, dp[4]=3, dp[5]=5. This computes the 5th Fibonacci number.",
  },
  {
    id: "h6",
    type: "time-complexity",
    difficulty: "Hard",
    topic: "DSA",
    question: "Amortized complexity of dynamic array append?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
    answer: 2,
    explanation: "Amortized O(1) — doubling happens rarely",
    aiExplanation:
      "Each element is copied at most O(log n) times total. Spread across all n operations, the amortized cost per append is O(1).",
  },
  {
    id: "h7",
    type: "mcq",
    difficulty: "Hard",
    topic: "DSA",
    question: "Which traversal gives sorted output for a BST?",
    options: ["Preorder", "Postorder", "Inorder", "Level-order"],
    answer: 2,
    explanation:
      "Inorder (left-root-right) on BST gives sorted ascending output",
    aiExplanation:
      "BST property: left < root < right. Inorder traversal visits left subtree, then root, then right — producing sorted order.",
  },
  {
    id: "h8",
    type: "mcq",
    difficulty: "Hard",
    topic: "DSA",
    question: "To detect cycle in directed graph using DFS, you need:",
    options: [
      "visited[] only",
      "visited[] + recursion stack[]",
      "parent[] only",
      "distance[]",
    ],
    answer: 1,
    explanation:
      "Need both visited[] and recursion stack[] to detect back edges",
    aiExplanation:
      "visited[] tracks all nodes seen. recursion stack[] tracks the current DFS path. A cycle exists if we revisit a node in the current path.",
  },
];

const COMPANY_DATA: Record<
  string,
  { aptitude: Question[]; technical: Question[]; hr: Question[] }
> = {
  TCS: {
    aptitude: [
      {
        id: "tcs_a1",
        type: "mcq",
        difficulty: "Easy",
        topic: "Quantitative",
        question:
          "A train 300m long passes a pole in 15 seconds. Speed in m/s?",
        options: ["20", "15", "25", "10"],
        answer: 0,
        explanation: "Speed = Distance/Time = 300/15 = 20 m/s",
      },
      {
        id: "tcs_a2",
        type: "mcq",
        difficulty: "Easy",
        topic: "Quantitative",
        question: "6 workers finish a job in 8 days. Days for 4 workers?",
        options: ["10", "12", "9", "14"],
        answer: 1,
        explanation: "Work = 6×8=48. Days = 48/4 = 12",
      },
      {
        id: "tcs_a3",
        type: "mcq",
        difficulty: "Medium",
        topic: "Logical",
        question: "Next: 2, 6, 18, 54, ___?",
        options: ["108", "162", "216", "180"],
        answer: 1,
        explanation: "Multiply by 3 each time: 54×3=162",
      },
      {
        id: "tcs_a4",
        type: "mcq",
        difficulty: "Easy",
        topic: "Verbal",
        question: "'Ephemeral' means?",
        options: ["Long-lasting", "Short-lived", "Colorful", "Loud"],
        answer: 1,
        explanation: "Ephemeral = lasting for a very short time",
      },
      {
        id: "tcs_a5",
        type: "mcq",
        difficulty: "Medium",
        topic: "Logical",
        question: "If P>Q and Q>R, which is definitely true?",
        options: ["R>P", "P>R", "R=P", "Cannot determine"],
        answer: 1,
        explanation: "By transitivity: P>Q>R, so P>R",
      },
    ],
    technical: [
      {
        id: "tcs_t1",
        type: "mcq",
        difficulty: "Easy",
        topic: "Java",
        question: "Which keyword prevents method overriding in Java?",
        options: ["static", "final", "private", "abstract"],
        answer: 1,
        explanation: "final prevents overriding in subclasses",
      },
      {
        id: "tcs_t2",
        type: "mcq",
        difficulty: "Medium",
        topic: "DBMS",
        question: "SQL command to completely remove a table?",
        options: ["DELETE", "DROP", "TRUNCATE", "REMOVE"],
        answer: 1,
        explanation: "DROP removes the table and its structure",
      },
      {
        id: "tcs_t3",
        type: "mcq",
        difficulty: "Medium",
        topic: "OOP",
        question: "Same method name, different behavior = ?",
        options: [
          "Encapsulation",
          "Abstraction",
          "Polymorphism",
          "Inheritance",
        ],
        answer: 2,
        explanation: "Polymorphism = same interface, multiple implementations",
      },
      {
        id: "tcs_t4",
        type: "mcq",
        difficulty: "Medium",
        topic: "OS",
        question: "CPU scheduling for equal-priority tasks?",
        options: ["FCFS", "Round Robin", "SJF", "Priority"],
        answer: 1,
        explanation: "Round Robin gives equal time slices to all processes",
      },
      {
        id: "tcs_t5",
        type: "mcq",
        difficulty: "Easy",
        topic: "DSA",
        question: "Advantage of linked list over array?",
        options: [
          "Random access",
          "Less memory",
          "Dynamic size",
          "Faster search",
        ],
        answer: 2,
        explanation: "Linked lists grow/shrink dynamically at runtime",
      },
    ],
    hr: [
      {
        id: "tcs_h1",
        type: "hr",
        difficulty: "Easy",
        topic: "HR",
        question: "Tell me about yourself.",
        options: [],
        answer: 0,
        explanation:
          "Cover: education, skills, projects, goals. Keep it under 2 minutes.",
        aiExplanation:
          "Structure: 1) Who you are (name, college, year), 2) What you know (top 2-3 skills), 3) What you've done (project or achievement), 4) Where you're headed (why TCS).",
      },
      {
        id: "tcs_h2",
        type: "hr",
        difficulty: "Easy",
        topic: "HR",
        question: "Why do you want to join TCS?",
        options: [],
        answer: 0,
        explanation:
          "Mention TCS NQT, scale of projects, learning culture, and global exposure.",
        aiExplanation:
          "Research TCS-specific programs: TCS iON, TCS NQT, digital transformation projects. Show you've done homework, not just saying 'big company'.",
      },
      {
        id: "tcs_h3",
        type: "hr",
        difficulty: "Medium",
        topic: "HR",
        question: "What are your strengths and weaknesses?",
        options: [],
        answer: 0,
        explanation:
          "2 strengths with examples. 1 weakness with how you're improving.",
        aiExplanation:
          "Strength example: 'I'm a fast learner — I picked up React in 2 weeks for a project.' Weakness: 'I used to struggle with time management, but I now use a task tracker daily.'",
      },
    ],
  },
  Infosys: {
    aptitude: [
      {
        id: "inf_a1",
        type: "mcq",
        difficulty: "Easy",
        topic: "Quantitative",
        question: "Simple interest on ₹1000 at 5% for 2 years?",
        options: ["₹100", "₹50", "₹150", "₹200"],
        answer: 0,
        explanation: "SI = P×R×T/100 = 1000×5×2/100 = ₹100",
      },
      {
        id: "inf_a2",
        type: "mcq",
        difficulty: "Medium",
        topic: "Logical",
        question: "Pattern: 1,4,9,16,25,___",
        options: ["30", "36", "35", "49"],
        answer: 1,
        explanation: "Perfect squares: 6²=36",
      },
      {
        id: "inf_a3",
        type: "mcq",
        difficulty: "Easy",
        topic: "Verbal",
        question: "Antonym of 'Benevolent'?",
        options: ["Kind", "Generous", "Malevolent", "Friendly"],
        answer: 2,
        explanation: "Malevolent = having ill will, opposite of benevolent",
      },
      {
        id: "inf_a4",
        type: "mcq",
        difficulty: "Medium",
        topic: "Quantitative",
        question: "A:B = 3:4, B:C = 5:6. A:B:C = ?",
        options: ["15:20:24", "3:4:6", "5:6:8", "9:12:16"],
        answer: 0,
        explanation: "A:B:C = 3×5:4×5:4×6 = 15:20:24",
      },
      {
        id: "inf_a5",
        type: "mcq",
        difficulty: "Easy",
        topic: "Logical",
        question: "All cats are animals. Some animals are black. Therefore?",
        options: [
          "All cats are black",
          "Some cats may be black",
          "No cats are black",
          "All animals are cats",
        ],
        answer: 1,
        explanation: "We can only conclude some cats may be black",
      },
    ],
    technical: [
      {
        id: "inf_t1",
        type: "mcq",
        difficulty: "Easy",
        topic: "C++",
        question: "What is a destructor in C++?",
        options: [
          "Creates objects",
          "Frees memory when object is destroyed",
          "Copies objects",
          "Initializes members",
        ],
        answer: 1,
        explanation:
          "Destructor is called automatically when an object goes out of scope",
      },
      {
        id: "inf_t2",
        type: "mcq",
        difficulty: "Medium",
        topic: "DBMS",
        question: "Which SQL clause filters groups?",
        options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
        answer: 1,
        explanation:
          "HAVING filters after GROUP BY; WHERE filters before grouping",
      },
      {
        id: "inf_t3",
        type: "mcq",
        difficulty: "Medium",
        topic: "DSA",
        question: "Best case time complexity of Quick Sort?",
        options: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"],
        answer: 1,
        explanation: "Best/average case of quick sort is O(n log n)",
      },
      {
        id: "inf_t4",
        type: "mcq",
        difficulty: "Easy",
        topic: "OOP",
        question: "What is inheritance?",
        options: [
          "Hiding data",
          "One class acquiring properties of another",
          "Same method name",
          "Wrapping data",
        ],
        answer: 1,
        explanation:
          "Inheritance allows a class to reuse properties and methods of another class",
      },
      {
        id: "inf_t5",
        type: "mcq",
        difficulty: "Medium",
        topic: "OS",
        question: "What is a deadlock?",
        options: [
          "CPU overload",
          "Two processes waiting for each other indefinitely",
          "Memory overflow",
          "Disk failure",
        ],
        answer: 1,
        explanation:
          "Deadlock: circular wait where processes hold resources needed by others",
      },
    ],
    hr: [
      {
        id: "inf_h1",
        type: "hr",
        difficulty: "Easy",
        topic: "HR",
        question: "Why Infosys specifically?",
        options: [],
        answer: 0,
        explanation:
          "Mention Infosys Springboard, global projects, learning culture",
        aiExplanation:
          "Research: Infosys Lex learning platform, global delivery model, digital services. Be specific about what excites you about their work.",
      },
      {
        id: "inf_h2",
        type: "hr",
        difficulty: "Medium",
        topic: "HR",
        question: "Describe a situation where you worked under pressure.",
        options: [],
        answer: 0,
        explanation: "Use STAR: Situation, Task, Action, Result",
        aiExplanation:
          "STAR method: Describe the stressful Situation, the Task you had, the Action you took, and the positive Result. Keep it professional.",
      },
      {
        id: "inf_h3",
        type: "hr",
        difficulty: "Easy",
        topic: "HR",
        question: "Where do you see yourself in 5 years?",
        options: [],
        answer: 0,
        explanation:
          "Show ambition + loyalty: grow within Infosys, take on more responsibility",
        aiExplanation:
          "Ideal answer: 'I see myself as a skilled developer contributing to major projects at Infosys, potentially leading a team and continuously learning new technologies.'",
      },
    ],
  },
  Wipro: {
    aptitude: [
      {
        id: "wip_a1",
        type: "mcq",
        difficulty: "Easy",
        topic: "Quantitative",
        question: "If 20% of x = 50, then x = ?",
        options: ["200", "250", "150", "300"],
        answer: 1,
        explanation: "x = 50/0.20 = 250",
      },
      {
        id: "wip_a2",
        type: "mcq",
        difficulty: "Medium",
        topic: "Logical",
        question: "Arrange: Doctor, Fever, Medicine, Patient, Clinic",
        options: [
          "Fever→Patient→Doctor→Clinic→Medicine",
          "Patient→Clinic→Doctor→Fever→Medicine",
          "Clinic→Doctor→Patient→Fever→Medicine",
          "Doctor→Clinic→Patient→Fever→Medicine",
        ],
        answer: 0,
        explanation:
          "Logical flow: Fever occurs → Patient → visits Doctor → at Clinic → gets Medicine",
      },
      {
        id: "wip_a3",
        type: "mcq",
        difficulty: "Easy",
        topic: "Verbal",
        question: "Synonym of 'Diligent'?",
        options: ["Lazy", "Hardworking", "Clever", "Brave"],
        answer: 1,
        explanation: "Diligent = hardworking and careful",
      },
      {
        id: "wip_a4",
        type: "mcq",
        difficulty: "Medium",
        topic: "Quantitative",
        question: "Compound interest on ₹1000 at 10% for 2 years?",
        options: ["₹200", "₹210", "₹100", "₹220"],
        answer: 1,
        explanation: "CI = 1000(1.1²-1) = 1000×0.21 = ₹210",
      },
      {
        id: "wip_a5",
        type: "mcq",
        difficulty: "Easy",
        topic: "Logical",
        question: "Which is odd one out: 11, 13, 17, 19, 21?",
        options: ["11", "13", "17", "21"],
        answer: 3,
        explanation: "21 = 3×7 is not prime; all others are prime",
      },
    ],
    technical: [
      {
        id: "wip_t1",
        type: "mcq",
        difficulty: "Easy",
        topic: "C",
        question: "sizeof(int) in most 64-bit systems?",
        options: ["2 bytes", "4 bytes", "8 bytes", "1 byte"],
        answer: 1,
        explanation: "int is typically 4 bytes on 64-bit systems",
      },
      {
        id: "wip_t2",
        type: "mcq",
        difficulty: "Medium",
        topic: "DBMS",
        question: "Primary key constraint ensures?",
        options: [
          "No nulls and no duplicates",
          "Only no nulls",
          "Only no duplicates",
          "Foreign key reference",
        ],
        answer: 0,
        explanation: "Primary key = NOT NULL + UNIQUE",
      },
      {
        id: "wip_t3",
        type: "mcq",
        difficulty: "Medium",
        topic: "Java",
        question: "Java is platform independent because of?",
        options: ["Compiler", "JVM", "JDK", "IDE"],
        answer: 1,
        explanation: "JVM interprets bytecode on any platform",
      },
      {
        id: "wip_t4",
        type: "mcq",
        difficulty: "Easy",
        topic: "DSA",
        question: "Stack follows which principle?",
        options: ["FIFO", "LIFO", "Random", "Priority"],
        answer: 1,
        explanation: "Stack = Last In First Out",
      },
      {
        id: "wip_t5",
        type: "mcq",
        difficulty: "Medium",
        topic: "OS",
        question: "Virtual memory allows?",
        options: [
          "Faster CPU",
          "Running programs larger than RAM",
          "Parallel processing",
          "Network access",
        ],
        answer: 1,
        explanation:
          "Virtual memory uses disk space to extend available memory",
      },
    ],
    hr: [
      {
        id: "wip_h1",
        type: "hr",
        difficulty: "Easy",
        topic: "HR",
        question: "What motivates you?",
        options: [],
        answer: 0,
        explanation: "Mention learning, problem solving, and impact",
        aiExplanation:
          "Good answer: 'I'm motivated by solving real problems with code. Seeing a program I wrote make someone's work easier gives me real satisfaction.'",
      },
      {
        id: "wip_h2",
        type: "hr",
        difficulty: "Medium",
        topic: "HR",
        question: "How do you handle criticism?",
        options: [],
        answer: 0,
        explanation: "Show you take feedback positively and improve",
        aiExplanation:
          "Say: 'I treat criticism as an opportunity to improve. I listen carefully, thank the person, and reflect on how to apply the feedback.'",
      },
      {
        id: "wip_h3",
        type: "hr",
        difficulty: "Easy",
        topic: "HR",
        question: "Why should we hire you?",
        options: [],
        answer: 0,
        explanation: "Link your skills directly to job requirements",
        aiExplanation:
          "Formula: 'I bring [specific skill], I've demonstrated it through [example], and I'll apply it to [company need].'",
      },
    ],
  },
  Accenture: {
    aptitude: [
      {
        id: "acc_a1",
        type: "mcq",
        difficulty: "Easy",
        topic: "Quantitative",
        question:
          "Speed of boat in still water is 15 km/h, current is 5 km/h. Upstream speed?",
        options: ["10 km/h", "20 km/h", "15 km/h", "5 km/h"],
        answer: 0,
        explanation: "Upstream = 15 - 5 = 10 km/h",
      },
      {
        id: "acc_a2",
        type: "mcq",
        difficulty: "Medium",
        topic: "Logical",
        question: "If ROAD is coded as URDG, then SWAN is coded as?",
        options: ["VZDQ", "VZCQ", "VZBQ", "VZDP"],
        answer: 0,
        explanation: "Each letter shifted by +3: S+3=V, W+3=Z, A+3=D, N+3=Q",
      },
      {
        id: "acc_a3",
        type: "mcq",
        difficulty: "Easy",
        topic: "Verbal",
        question: "Fill in: He __ to school every day.",
        options: ["go", "goes", "going", "gone"],
        answer: 1,
        explanation: "Third person singular present: 'goes'",
      },
      {
        id: "acc_a4",
        type: "mcq",
        difficulty: "Medium",
        topic: "Quantitative",
        question:
          "A pipe fills tank in 4h, another drains in 12h. Time to fill?",
        options: ["6h", "8h", "12h", "4h"],
        answer: 0,
        explanation: "Net rate = 1/4 - 1/12 = 2/12 = 1/6. Time = 6h",
      },
      {
        id: "acc_a5",
        type: "mcq",
        difficulty: "Easy",
        topic: "Logical",
        question:
          "Which figure completes: circle, triangle, square, circle, triangle, ___?",
        options: ["circle", "triangle", "square", "pentagon"],
        answer: 2,
        explanation: "Pattern repeats: circle, triangle, square",
      },
    ],
    technical: [
      {
        id: "acc_t1",
        type: "mcq",
        difficulty: "Medium",
        topic: "C++",
        question:
          "Which OOP feature allows calling overridden methods at runtime?",
        options: [
          "Encapsulation",
          "Abstraction",
          "Compile-time polymorphism",
          "Runtime polymorphism",
        ],
        answer: 3,
        explanation: "Runtime polymorphism via virtual functions in C++",
      },
      {
        id: "acc_t2",
        type: "mcq",
        difficulty: "Easy",
        topic: "DBMS",
        question: "Which SQL joins show all rows from both tables?",
        options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
        answer: 3,
        explanation: "FULL OUTER JOIN returns all rows from both tables",
      },
      {
        id: "acc_t3",
        type: "mcq",
        difficulty: "Medium",
        topic: "DSA",
        question: "Time complexity of searching in a balanced BST?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
        answer: 1,
        explanation: "Balanced BST search = O(log n) due to halving",
      },
      {
        id: "acc_t4",
        type: "mcq",
        difficulty: "Easy",
        topic: "Java",
        question: "Interface in Java?",
        options: [
          "Cannot have methods",
          "Can have only abstract methods (pre-Java 8)",
          "Can be instantiated",
          "Same as class",
        ],
        answer: 1,
        explanation: "Pre-Java 8, interfaces had only abstract methods",
      },
      {
        id: "acc_t5",
        type: "mcq",
        difficulty: "Medium",
        topic: "OS",
        question: "What is thrashing?",
        options: [
          "CPU overheating",
          "Excessive paging reducing CPU efficiency",
          "Memory corruption",
          "Disk fragmentation",
        ],
        answer: 1,
        explanation:
          "Thrashing: system spends more time swapping pages than executing",
      },
    ],
    hr: [
      {
        id: "acc_h1",
        type: "hr",
        difficulty: "Easy",
        topic: "HR",
        question: "Describe yourself in 3 words.",
        options: [],
        answer: 0,
        explanation: "Pick positive traits relevant to the role",
        aiExplanation:
          "Good trio: 'Curious, Disciplined, and Collaborative.' Each word should connect to how you'll perform at work.",
      },
      {
        id: "acc_h2",
        type: "hr",
        difficulty: "Medium",
        topic: "HR",
        question: "Tell me about a challenging project you completed.",
        options: [],
        answer: 0,
        explanation:
          "Use STAR: describe the challenge, your role, steps taken, and outcome",
        aiExplanation:
          "Pick a real or academic project. Focus on the problem, your specific contribution, and the measurable result.",
      },
      {
        id: "acc_h3",
        type: "hr",
        difficulty: "Easy",
        topic: "HR",
        question: "Are you comfortable with relocation?",
        options: [],
        answer: 0,
        explanation: "Be honest; if yes, show flexibility and enthusiasm",
        aiExplanation:
          "'Yes, I'm open to relocation. I see it as an opportunity to experience new environments and contribute to different projects.'",
      },
    ],
  },
  Cognizant: {
    aptitude: [
      {
        id: "cog_a1",
        type: "mcq",
        difficulty: "Easy",
        topic: "Quantitative",
        question: "Average of 5 numbers is 10. Sum of numbers?",
        options: ["50", "25", "15", "100"],
        answer: 0,
        explanation: "Sum = Average × Count = 10 × 5 = 50",
      },
      {
        id: "cog_a2",
        type: "mcq",
        difficulty: "Medium",
        topic: "Logical",
        question: "Find missing: 3, 7, 13, 21, 31, ___",
        options: ["43", "42", "41", "45"],
        answer: 0,
        explanation: "Differences: 4,6,8,10,12... next = 31+12=43",
      },
      {
        id: "cog_a3",
        type: "mcq",
        difficulty: "Easy",
        topic: "Verbal",
        question:
          "Choose correct: Neither the students nor the teacher ___ present.",
        options: ["were", "was", "are", "been"],
        answer: 1,
        explanation:
          "With 'neither...nor', verb agrees with the nearer subject (teacher = singular → 'was')",
      },
      {
        id: "cog_a4",
        type: "mcq",
        difficulty: "Medium",
        topic: "Quantitative",
        question:
          "A shopkeeper sells at 20% profit. Cost price ₹500. Selling price?",
        options: ["₹600", "₹550", "₹620", "₹580"],
        answer: 0,
        explanation: "SP = CP × 1.20 = 500 × 1.20 = ₹600",
      },
      {
        id: "cog_a5",
        type: "mcq",
        difficulty: "Easy",
        topic: "Logical",
        question: "If all A are B, and all B are C, then?",
        options: [
          "All C are A",
          "All A are C",
          "Some A are not C",
          "None of these",
        ],
        answer: 1,
        explanation: "Transitivity: A→B→C, so all A are C",
      },
    ],
    technical: [
      {
        id: "cog_t1",
        type: "mcq",
        difficulty: "Easy",
        topic: "C",
        question: "What is a pointer in C?",
        options: [
          "A variable storing value",
          "A variable storing memory address",
          "A function",
          "A data type",
        ],
        answer: 1,
        explanation: "Pointer stores the memory address of another variable",
      },
      {
        id: "cog_t2",
        type: "mcq",
        difficulty: "Medium",
        topic: "DBMS",
        question: "Normalization is done to?",
        options: [
          "Increase redundancy",
          "Reduce redundancy and improve integrity",
          "Speed up queries",
          "Add more tables",
        ],
        answer: 1,
        explanation:
          "Normalization removes duplicate data and ensures data integrity",
      },
      {
        id: "cog_t3",
        type: "mcq",
        difficulty: "Medium",
        topic: "Java",
        question: "What is a thread in Java?",
        options: [
          "A class",
          "Lightweight process for concurrent execution",
          "A loop",
          "A variable",
        ],
        answer: 1,
        explanation:
          "Threads allow multiple tasks to run concurrently in a program",
      },
      {
        id: "cog_t4",
        type: "mcq",
        difficulty: "Easy",
        topic: "OOP",
        question: "Abstraction means?",
        options: [
          "Showing all details",
          "Hiding implementation, showing only interface",
          "Copying objects",
          "Linking classes",
        ],
        answer: 1,
        explanation:
          "Abstraction exposes only necessary functionality, hides complexity",
      },
      {
        id: "cog_t5",
        type: "mcq",
        difficulty: "Medium",
        topic: "OS",
        question: "What is a semaphore?",
        options: [
          "A CPU register",
          "Synchronization tool to control resource access",
          "A memory address",
          "A file type",
        ],
        answer: 1,
        explanation:
          "Semaphore is used to prevent race conditions in concurrent programming",
      },
    ],
    hr: [
      {
        id: "cog_h1",
        type: "hr",
        difficulty: "Easy",
        topic: "HR",
        question: "How do you keep yourself updated with technology?",
        options: [],
        answer: 0,
        explanation:
          "Mention platforms: YouTube, Coursera, GitHub, LeetCode, tech blogs",
        aiExplanation:
          "Good answer: 'I follow tech blogs, take online courses on platforms like Coursera, and practice coding on LeetCode regularly.'",
      },
      {
        id: "cog_h2",
        type: "hr",
        difficulty: "Medium",
        topic: "HR",
        question: "What is your biggest achievement so far?",
        options: [],
        answer: 0,
        explanation: "Pick something measurable: project, contest, exam rank",
        aiExplanation:
          "Quantify if possible: 'I built a web app that reduced our college event registration time by 60%' is stronger than 'I built an app.'",
      },
      {
        id: "cog_h3",
        type: "hr",
        difficulty: "Easy",
        topic: "HR",
        question: "Do you prefer working alone or in a team?",
        options: [],
        answer: 0,
        explanation: "Show you can do both; lean toward team collaboration",
        aiExplanation:
          "'I enjoy both. I can work independently when focused work is needed, but I thrive in teams where I can collaborate and learn from peers.'",
      },
    ],
  },
  Amazon: {
    aptitude: [
      {
        id: "amz_a1",
        type: "mcq",
        difficulty: "Medium",
        topic: "Logical",
        question:
          "You have 8 balls; one is heavier. Min weighings to find it using a balance scale?",
        options: ["3", "2", "4", "1"],
        answer: 1,
        explanation: "Divide into groups of 3,3,2. Two weighings suffice",
      },
      {
        id: "amz_a2",
        type: "mcq",
        difficulty: "Easy",
        topic: "Quantitative",
        question: "10% of 10% of 1000 = ?",
        options: ["10", "100", "1", "0.1"],
        answer: 0,
        explanation: "10% of 1000 = 100, 10% of 100 = 10",
      },
      {
        id: "amz_a3",
        type: "mcq",
        difficulty: "Medium",
        topic: "Logical",
        question:
          "A is taller than B. C is shorter than A. D is taller than C. Who is shortest?",
        options: ["A", "B", "C", "Cannot determine"],
        answer: 3,
        explanation: "We know A>B, A>C, D>C but we don't know B vs C or B vs D",
      },
      {
        id: "amz_a4",
        type: "mcq",
        difficulty: "Easy",
        topic: "Quantitative",
        question: "Work done by A in 1 day if A finishes job in 10 days?",
        options: ["1/10", "1/5", "10", "5"],
        answer: 0,
        explanation: "Work per day = 1/total days = 1/10",
      },
      {
        id: "amz_a5",
        type: "mcq",
        difficulty: "Medium",
        topic: "Verbal",
        question: "Choose: The team ___ the project yesterday.",
        options: ["complete", "completes", "completed", "completing"],
        answer: 2,
        explanation: "'Yesterday' indicates past tense → 'completed'",
      },
    ],
    technical: [
      {
        id: "amz_t1",
        type: "mcq",
        difficulty: "Medium",
        topic: "DSA",
        question: "Time complexity of HashMap get()?",
        options: ["O(n)", "O(1) average", "O(log n)", "O(n²)"],
        answer: 1,
        explanation:
          "HashMap provides O(1) average time for get/put (amortized)",
      },
      {
        id: "amz_t2",
        type: "mcq",
        difficulty: "Hard",
        topic: "DSA",
        question: "Best approach for Two Sum problem?",
        options: [
          "Nested loops O(n²)",
          "Sort+binary search",
          "HashMap O(n)",
          "All same",
        ],
        answer: 2,
        explanation:
          "HashMap: store each number, check if complement exists → O(n)",
      },
      {
        id: "amz_t3",
        type: "mcq",
        difficulty: "Medium",
        topic: "System Design",
        question: "What is horizontal scaling?",
        options: [
          "Adding CPU to one server",
          "Adding more servers",
          "Increasing RAM",
          "Using SSD",
        ],
        answer: 1,
        explanation:
          "Horizontal scaling = adding more machines to distribute load",
      },
      {
        id: "amz_t4",
        type: "mcq",
        difficulty: "Hard",
        topic: "DSA",
        question: "Which data structure for LRU Cache?",
        options: ["Array", "Stack", "HashMap + Doubly Linked List", "BST"],
        answer: 2,
        explanation:
          "HashMap for O(1) lookup + DLL for O(1) insertion/deletion",
      },
      {
        id: "amz_t5",
        type: "mcq",
        difficulty: "Medium",
        topic: "OOP",
        question: "Amazon's Leadership Principle: 'Customer ___'",
        options: ["First", "Obsession", "Priority", "Focus"],
        answer: 1,
        explanation:
          "Amazon's first LP: Customer Obsession — leaders start with the customer and work backward",
      },
    ],
    hr: [
      {
        id: "amz_h1",
        type: "hr",
        difficulty: "Medium",
        topic: "HR",
        question: "Tell me about a time you failed and what you learned.",
        options: [],
        answer: 0,
        explanation: "Be honest, focus on the learning, show growth mindset",
        aiExplanation:
          "Amazon loves growth mindset. Structure: Describe the failure honestly → what went wrong → what you learned → how you applied that lesson later.",
      },
      {
        id: "amz_h2",
        type: "hr",
        difficulty: "Hard",
        topic: "HR",
        question:
          "Describe a situation where you had to work with a difficult teammate.",
        options: [],
        answer: 0,
        explanation:
          "Show empathy, communication, and conflict resolution skills",
        aiExplanation:
          "STAR: Focus on how you understood their perspective, communicated openly, and found a solution that worked for both. Avoid badmouthing.",
      },
      {
        id: "amz_h3",
        type: "hr",
        difficulty: "Medium",
        topic: "HR",
        question: "Give an example of going above and beyond for someone.",
        options: [],
        answer: 0,
        explanation: "Connect to Amazon LP: Earn Trust / Customer Obsession",
        aiExplanation:
          "Pick a specific example where you did more than required. Quantify the impact if possible.",
      },
    ],
  },
  Google: {
    aptitude: [
      {
        id: "goo_a1",
        type: "mcq",
        difficulty: "Hard",
        topic: "Logical",
        question: "How many times do clock hands overlap in 24 hours?",
        options: ["24", "22", "44", "21"],
        answer: 1,
        explanation:
          "Hands overlap 22 times in 24 hours (not every hour — they skip around 12:00)",
      },
      {
        id: "goo_a2",
        type: "mcq",
        difficulty: "Medium",
        topic: "Quantitative",
        question: "A rectangle's length is doubled, width halved. Area change?",
        options: ["Doubled", "Halved", "Same", "Quadrupled"],
        answer: 2,
        explanation: "New area = 2L × W/2 = L×W. Area unchanged",
      },
      {
        id: "goo_a3",
        type: "mcq",
        difficulty: "Hard",
        topic: "Logical",
        question: "How many golf balls fit in a school bus? (Estimation)",
        options: ["~5,000", "~500,000", "~50,000", "~50"],
        answer: 2,
        explanation:
          "Bus ~80 cubic feet = ~138,000 cubic inches. Ball ~2.5in diameter. ~50,000 approximately",
      },
      {
        id: "goo_a4",
        type: "mcq",
        difficulty: "Medium",
        topic: "Verbal",
        question: "Which is grammatically correct?",
        options: [
          "Between you and I",
          "Between you and me",
          "Between you and myself",
          "Between I and you",
        ],
        answer: 1,
        explanation:
          "'Between' is a preposition → requires object pronouns 'me', not 'I'",
      },
      {
        id: "goo_a5",
        type: "mcq",
        difficulty: "Medium",
        topic: "Quantitative",
        question: "If x² - 5x + 6 = 0, values of x?",
        options: ["2 and 3", "1 and 6", "2 and -3", "-2 and -3"],
        answer: 0,
        explanation: "Factor: (x-2)(x-3)=0, so x=2 or x=3",
      },
    ],
    technical: [
      {
        id: "goo_t1",
        type: "mcq",
        difficulty: "Hard",
        topic: "DSA",
        question: "Time complexity of Dijkstra's with a min-heap?",
        options: ["O(V²)", "O(E log V)", "O(V log E)", "O(VE)"],
        answer: 1,
        explanation: "With binary heap: O(E log V) where E=edges, V=vertices",
      },
      {
        id: "goo_t2",
        type: "mcq",
        difficulty: "Hard",
        topic: "DSA",
        question: "In dynamic programming, overlapping subproblems means?",
        options: [
          "Same subproblem solved multiple times",
          "Subproblems are independent",
          "Greedy works better",
          "Recursion always works",
        ],
        answer: 0,
        explanation:
          "DP is useful when same subproblems recur — we store results to avoid recomputation",
      },
      {
        id: "goo_t3",
        type: "mcq",
        difficulty: "Medium",
        topic: "System Design",
        question: "What does CAP theorem state?",
        options: [
          "A distributed system can have all 3: Consistency, Availability, Partition tolerance",
          "Can only guarantee 2 of 3 properties",
          "Only consistency matters",
          "Only availability matters",
        ],
        answer: 1,
        explanation:
          "CAP: distributed systems can only guarantee 2 of 3 (C, A, P) simultaneously",
      },
      {
        id: "goo_t4",
        type: "mcq",
        difficulty: "Medium",
        topic: "DSA",
        question:
          "Which algorithm for finding shortest path in unweighted graph?",
        options: ["Dijkstra", "BFS", "DFS", "Bellman-Ford"],
        answer: 1,
        explanation: "BFS naturally finds shortest path in unweighted graphs",
      },
      {
        id: "goo_t5",
        type: "mcq",
        difficulty: "Hard",
        topic: "DSA",
        question:
          "Space complexity of recursive DFS on a graph with V vertices?",
        options: ["O(1)", "O(V)", "O(E)", "O(V+E)"],
        answer: 1,
        explanation: "Recursion stack can go V deep in worst case (path graph)",
      },
    ],
    hr: [
      {
        id: "goo_h1",
        type: "hr",
        difficulty: "Medium",
        topic: "HR",
        question: "How do you approach a problem you've never seen before?",
        options: [],
        answer: 0,
        explanation:
          "Show structured thinking: understand, research, experiment, iterate",
        aiExplanation:
          "Google values problem-solving approach. Say: 'I break it down, identify what I know and don't know, look for patterns, build a minimal solution, then iterate.'",
      },
      {
        id: "goo_h2",
        type: "hr",
        difficulty: "Hard",
        topic: "HR",
        question:
          "Tell me about a project where you made a significant technical decision.",
        options: [],
        answer: 0,
        explanation: "Show data-driven decision making and trade-off analysis",
        aiExplanation:
          "Describe the options you considered, the criteria you used, the trade-offs, and why your choice was best. Quantify the impact.",
      },
      {
        id: "goo_h3",
        type: "hr",
        difficulty: "Medium",
        topic: "HR",
        question: "How do you handle ambiguity?",
        options: [],
        answer: 0,
        explanation:
          "Show comfort with uncertainty: ask questions, make assumptions explicit, iterate",
        aiExplanation:
          "Google values handling ambiguity. Answer: 'I identify the key unknowns, make reasonable assumptions, move forward with a plan, and validate as I go.'",
      },
    ],
  },
};

const MOCK_TEST_QUESTIONS: Question[] = [
  ...COMPANY_DATA.TCS.aptitude.slice(0, 3),
  ...COMPANY_DATA.Infosys.aptitude.slice(0, 3),
  ...COMPANY_DATA.Amazon.aptitude.slice(0, 2),
  ...CODING_QUESTIONS.filter((q) => q.difficulty === "Medium").slice(0, 5),
  ...COMPANY_DATA.TCS.technical.slice(0, 3),
  ...COMPANY_DATA.Amazon.technical.slice(0, 2),
  ...CODING_QUESTIONS.filter((q) => q.difficulty === "Easy").slice(0, 2),
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function loadGamification(): GamificationState {
  try {
    const raw = localStorage.getItem("quiz_gamification");
    if (raw) return JSON.parse(raw);
  } catch {}
  return { xp: 0, badges: [], streak: 0, lastQuizDate: "", history: [] };
}

function saveGamification(g: GamificationState) {
  localStorage.setItem("quiz_gamification", JSON.stringify(g));
}

function getLevel(xp: number): {
  level: number;
  name: string;
  nextXp: number;
  progress: number;
} {
  const levels = [
    { level: 1, name: "Beginner", min: 0, max: 100 },
    { level: 2, name: "Explorer", min: 100, max: 300 },
    { level: 3, name: "Practitioner", min: 300, max: 600 },
    { level: 4, name: "Expert", min: 600, max: 1000 },
    { level: 5, name: "Master", min: 1000, max: 9999 },
  ];
  const current = levels.findLast((l) => xp >= l.min) ?? levels[0];
  const progress =
    current.max === 9999
      ? 100
      : Math.round(((xp - current.min) / (current.max - current.min)) * 100);
  return {
    level: current.level,
    name: current.name,
    nextXp: current.max,
    progress,
  };
}

const BADGE_DEFS = [
  {
    id: "logic_master",
    label: "Logic Master",
    icon: "🧠",
    desc: "Answer 10 coding questions correctly",
  },
  {
    id: "debug_king",
    label: "Debug King",
    icon: "🐛",
    desc: "Get 5 Hard questions correct",
  },
  { id: "hr_star", label: "HR Star", icon: "⭐", desc: "Complete an HR round" },
  {
    id: "mock_champion",
    label: "Mock Champion",
    icon: "🏆",
    desc: "Complete the full mock test",
  },
  {
    id: "streak_warrior",
    label: "Streak Warrior",
    icon: "🔥",
    desc: "Maintain a 7-day streak",
  },
  {
    id: "speed_demon",
    label: "Speed Demon",
    icon: "⚡",
    desc: "Answer a question in under 5s",
  },
];

// ─── Confetti ─────────────────────────────────────────────────────────────────
function Confetti() {
  const colors = [
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
  ];
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    color: colors[i % colors.length],
    size: 6 + Math.random() * 8,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animation: "confettiFall 3s ease-in forwards",
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Quiz Engine ──────────────────────────────────────────────────────────────
function QuizEngine({
  questions,
  onComplete,
  timePerQuestion = 30,
}: {
  questions: Question[];
  onComplete: (results: {
    correct: number;
    wrong: string[];
    timeMs: number;
  }) => void;
  timePerQuestion?: number;
}) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExp, setShowExp] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [timer, setTimer] = useState(timePerQuestion);
  const [anim, setAnim] = useState(true);
  const [correct, setCorrect] = useState(0);
  const [wrongTopics, setWrongTopics] = useState<string[]>([]);
  const startTime = useRef(Date.now());
  const questionStart = useRef(Date.now());
  const [fastAnswer, setFastAnswer] = useState(false);

  const q = questions[idx];

  useEffect(() => {
    void idx; // depend on idx so effect re-runs on question change
    setTimer(timePerQuestion);
    questionStart.current = Date.now();
    setAnim(false);
    const t = setTimeout(() => setAnim(true), 50);
    return () => clearTimeout(t);
  }, [idx, timePerQuestion]);

  useEffect(() => {
    if (showExp) return;
    if (timer <= 0) {
      handleAnswer(-1);
      return;
    }
    const t = setInterval(() => setTimer((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [timer, showExp]);

  const handleAnswer = (optIdx: number) => {
    if (showExp) return;
    const elapsed = (Date.now() - questionStart.current) / 1000;
    if (elapsed < 5) setFastAnswer(true);
    setSelected(optIdx);
    setShowExp(true);
    if (optIdx === q.answer) setCorrect((c) => c + 1);
    else setWrongTopics((w) => [...w, q.topic]);
  };

  const handleNext = () => {
    setShowExp(false);
    setShowAI(false);
    setSelected(null);
    setFastAnswer(false);
    if (idx + 1 >= questions.length) {
      onComplete({
        correct,
        wrong: wrongTopics,
        timeMs: Date.now() - startTime.current,
      });
    } else {
      setIdx((i) => i + 1);
    }
  };

  if (!q) return null;

  const diffColor =
    q.difficulty === "Easy"
      ? "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400"
      : q.difficulty === "Medium"
        ? "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400"
        : "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400";

  const timerColor =
    timer > 20
      ? "text-green-500"
      : timer > 10
        ? "text-amber-500"
        : "text-red-500";

  return (
    <div
      className="space-y-4"
      style={{
        opacity: anim ? 1 : 0,
        transform: anim ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.25s ease, transform 0.25s ease",
      }}
    >
      {/* Progress + timer row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <Progress value={(idx / questions.length) * 100} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {idx + 1} / {questions.length}
          </p>
        </div>
        <div
          className={`flex items-center gap-1 font-mono font-bold text-lg min-w-[48px] ${timerColor}`}
        >
          <Clock className="w-4 h-4" />
          {timer}s
        </div>
      </div>

      {/* Question card */}
      <Card className="border-border/60">
        <CardContent className="pt-5 pb-4 space-y-4">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="flex gap-2 flex-wrap">
              <Badge className={`text-xs ${diffColor}`}>{q.difficulty}</Badge>
              <Badge variant="outline" className="text-xs">
                {q.type.replace("-", " ")}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {q.topic}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">Q{idx + 1}</span>
          </div>

          <p className="font-medium leading-relaxed text-sm md:text-base">
            {q.question}
          </p>

          {/* Options */}
          {q.type !== "hr" ? (
            <div className="grid gap-2">
              {q.options.map((opt, i) => {
                let cls =
                  "w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all duration-150 ";
                if (!showExp)
                  cls +=
                    "border-border hover:border-primary hover:bg-primary/5 cursor-pointer";
                else if (i === q.answer)
                  cls +=
                    "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 font-medium";
                else if (i === selected && i !== q.answer)
                  cls +=
                    "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400";
                else cls += "border-border opacity-60";
                return (
                  <button
                    type="button"
                    // biome-ignore lint/suspicious/noArrayIndexKey: option index is stable per question
                    key={i}
                    className={cls}
                    onClick={() => handleAnswer(i)}
                    disabled={showExp}
                  >
                    <span className="mr-2 font-semibold text-muted-foreground">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {opt}
                    {showExp && i === q.answer && (
                      <CheckCircle2 className="inline w-4 h-4 ml-2 text-green-500" />
                    )}
                    {showExp && i === selected && i !== q.answer && (
                      <XCircle className="inline w-4 h-4 ml-2 text-red-500" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground italic">
                This is an HR question. Reflect on your answer, then review the
                model answer below.
              </p>
              {!showExp && (
                <Button
                  size="sm"
                  className="mt-3 gradient-brand text-white border-0"
                  onClick={() => handleAnswer(0)}
                >
                  View Model Answer
                </Button>
              )}
            </div>
          )}

          {/* Explanation */}
          {showExp && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                  Explanation
                </p>
                <p className="text-sm">{q.explanation}</p>
              </div>
              {q.aiExplanation && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-xs"
                  onClick={() => setShowAI(!showAI)}
                >
                  <Bot className="w-3 h-3" />
                  {showAI ? "Hide" : "Show"} AI Explanation
                </Button>
              )}
              {showAI && q.aiExplanation && (
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 animate-in fade-in duration-200">
                  <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1 flex items-center gap-1">
                    <Bot className="w-3 h-3" /> AI Explanation
                  </p>
                  <p className="text-sm">{q.aiExplanation}</p>
                </div>
              )}
              {fastAnswer && selected === q.answer && (
                <div className="flex items-center gap-2 text-xs text-amber-600">
                  <Zap className="w-3 h-3" /> Speed bonus! Answered in under 5
                  seconds
                </div>
              )}
              <Button
                className="w-full gradient-brand text-white border-0"
                onClick={handleNext}
              >
                {idx + 1 < questions.length ? (
                  <>
                    <ChevronRight className="w-4 h-4 mr-1" /> Next Question
                  </>
                ) : (
                  <>
                    <Trophy className="w-4 h-4 mr-1" /> See Results
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Score Summary ─────────────────────────────────────────────────────────────
function ScoreSummary({
  correct,
  total,
  wrong,
  timeMs,
  xpEarned,
  onRetry,
  onBack,
}: {
  correct: number;
  total: number;
  wrong: string[];
  timeMs: number;
  xpEarned: number;
  onRetry: () => void;
  onBack: () => void;
}) {
  const pct = Math.round((correct / total) * 100);
  const showConfetti = pct >= 80;
  const weakTopics = [...new Set(wrong)];
  const msg =
    pct >= 90
      ? "Outstanding! You're placement ready! 🎉"
      : pct >= 70
        ? "Great work! Keep pushing 💪"
        : pct >= 50
          ? "Good effort! Review weak topics 📚"
          : "Keep practicing — improvement takes time! 🔄";

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {showConfetti && <Confetti />}
      <Card className="border-border/60 overflow-hidden">
        <div className="gradient-brand p-6 text-white text-center">
          <div className="text-6xl font-bold mb-1">{pct}%</div>
          <p className="opacity-80 text-sm">
            {correct} / {total} correct
          </p>
          <p className="mt-2 font-medium">{msg}</p>
        </div>
        <CardContent className="pt-4 pb-5 space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="text-2xl font-bold text-green-600">{correct}</div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </div>
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="text-2xl font-bold text-red-600">
                {total - correct}
              </div>
              <div className="text-xs text-muted-foreground">Wrong</div>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(timeMs / 1000)}s
              </div>
              <div className="text-xs text-muted-foreground">Time</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Zap className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-sm font-semibold">+{xpEarned} XP Earned</p>
              <p className="text-xs text-muted-foreground">
                Added to your profile
              </p>
            </div>
          </div>

          {weakTopics.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                WEAK TOPICS
              </p>
              <div className="flex flex-wrap gap-2">
                {weakTopics.map((t) => (
                  <Badge
                    key={t}
                    className="text-xs bg-red-500/10 text-red-600 border-red-500/20"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={onRetry}
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </Button>
            <Button
              className="flex-1 gradient-brand text-white border-0"
              onClick={onBack}
            >
              Back to Menu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Coding Quiz Tab ───────────────────────────────────────────────────────────
function CodingQuizTab({
  gamification,
  onUpdateGamification,
}: {
  gamification: GamificationState;
  onUpdateGamification: (g: GamificationState) => void;
}) {
  const [difficulty, setDifficulty] = useState<
    "Easy" | "Medium" | "Hard" | null
  >(null);
  const [quizActive, setQuizActive] = useState(false);
  const [result, setResult] = useState<{
    correct: number;
    wrong: string[];
    timeMs: number;
  } | null>(null);

  const questions = difficulty
    ? CODING_QUESTIONS.filter((q) => q.difficulty === difficulty)
    : [];

  const handleComplete = (res: {
    correct: number;
    wrong: string[];
    timeMs: number;
  }) => {
    setResult(res);
    setQuizActive(false);
    const xpMap = { Easy: 10, Medium: 20, Hard: 30 };
    const xpEarned = res.correct * (xpMap[difficulty!] ?? 10);
    const newG = { ...gamification, xp: gamification.xp + xpEarned };
    const newBadges = [...newG.badges];
    const totalCorrect =
      newG.history.reduce((s, h) => s + h.score, 0) + res.correct;
    if (totalCorrect >= 10 && !newBadges.includes("logic_master"))
      newBadges.push("logic_master");
    if (
      difficulty === "Hard" &&
      res.correct >= 5 &&
      !newBadges.includes("debug_king")
    )
      newBadges.push("debug_king");
    newG.badges = newBadges;
    newG.history = [
      ...newG.history,
      {
        date: new Date().toISOString(),
        score: res.correct,
        total: questions.length,
        topic: "Coding",
        difficulty: difficulty!,
        xpEarned,
        wrongTopics: res.wrong,
      },
    ];
    saveGamification(newG);
    onUpdateGamification(newG);
  };

  const xpMap = { Easy: 10, Medium: 20, Hard: 30 };
  const xpEarned = result
    ? result.correct * (xpMap[difficulty ?? "Easy"] ?? 10)
    : 0;

  if (quizActive && difficulty) {
    return <QuizEngine questions={questions} onComplete={handleComplete} />;
  }

  if (result && difficulty) {
    return (
      <ScoreSummary
        correct={result.correct}
        total={questions.length}
        wrong={result.wrong}
        timeMs={result.timeMs}
        xpEarned={xpEarned}
        onRetry={() => {
          setResult(null);
          setQuizActive(true);
        }}
        onBack={() => {
          setResult(null);
          setDifficulty(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Code2 className="w-5 h-5 text-primary" /> Programming Logic Practice
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          MCQ, code output, find-the-error, dry run, and time complexity
          questions
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(["Easy", "Medium", "Hard"] as const).map((d) => {
          const count = CODING_QUESTIONS.filter(
            (q) => q.difficulty === d,
          ).length;
          const color =
            d === "Easy"
              ? "border-green-500/30 hover:border-green-500"
              : d === "Medium"
                ? "border-amber-500/30 hover:border-amber-500"
                : "border-red-500/30 hover:border-red-500";
          const badge =
            d === "Easy"
              ? "bg-green-500/10 text-green-600"
              : d === "Medium"
                ? "bg-amber-500/10 text-amber-600"
                : "bg-red-500/10 text-red-600";
          const xp = d === "Easy" ? 10 : d === "Medium" ? 20 : 30;
          return (
            <Card
              key={d}
              className={`cursor-pointer border-2 transition-all duration-200 hover:shadow-md ${color} ${difficulty === d ? "ring-2 ring-primary" : ""}`}
              onClick={() => setDifficulty(d)}
            >
              <CardContent className="p-5 text-center space-y-2">
                <Badge className={`${badge} text-sm`}>
                  {d === "Easy" ? "🟢" : d === "Medium" ? "🟡" : "🔴"} {d}
                </Badge>
                <p className="font-bold text-lg">{count} Questions</p>
                <p className="text-xs text-muted-foreground">
                  +{xp} XP per correct
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {difficulty && (
        <div className="flex justify-center pt-2">
          <Button
            className="gradient-brand text-white border-0 px-8 gap-2"
            onClick={() => setQuizActive(true)}
          >
            <Brain className="w-4 h-4" /> Start {difficulty} Quiz (
            {questions.length} questions)
          </Button>
        </div>
      )}
      {gamification.history.length > 0 && (
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart2 className="w-4 h-4" /> Score History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-20">
              {gamification.history.slice(-8).map((h, i) => {
                const pct = (h.score / h.total) * 100;
                return (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: chart bars ordered by date
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <span className="text-[10px] text-muted-foreground">
                      {Math.round(pct)}%
                    </span>
                    <div
                      className="w-full rounded-t-sm"
                      style={{
                        height: `${Math.max(8, pct * 0.6)}px`,
                        background:
                          pct >= 70
                            ? "oklch(0.58 0.16 150)"
                            : pct >= 50
                              ? "oklch(0.7 0.19 75)"
                              : "oklch(0.58 0.22 27)",
                      }}
                    />
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

// ─── Company Rounds Tab ───────────────────────────────────────────────────────
function CompanyRoundsTab({
  gamification,
  onUpdateGamification,
}: {
  gamification: GamificationState;
  onUpdateGamification: (g: GamificationState) => void;
}) {
  const companies = Object.keys(COMPANY_DATA) as (keyof typeof COMPANY_DATA)[];
  const [company, setCompany] = useState<string | null>(null);
  const [round, setRound] = useState<"aptitude" | "technical" | "hr" | null>(
    null,
  );
  const [mode, setMode] = useState<"practice" | "timed" | null>(null);
  const [quizActive, setQuizActive] = useState(false);
  const [result, setResult] = useState<{
    correct: number;
    wrong: string[];
    timeMs: number;
  } | null>(null);

  const roundQuestions = company && round ? COMPANY_DATA[company][round] : [];

  const handleComplete = (res: {
    correct: number;
    wrong: string[];
    timeMs: number;
  }) => {
    setResult(res);
    setQuizActive(false);
    const xpEarned = res.correct * 15;
    const newG = { ...gamification, xp: gamification.xp + xpEarned };
    if (round === "hr" && !newG.badges.includes("hr_star"))
      newG.badges = [...newG.badges, "hr_star"];
    newG.history = [
      ...newG.history,
      {
        date: new Date().toISOString(),
        score: res.correct,
        total: roundQuestions.length,
        topic: `${company} ${round}`,
        difficulty: "Medium",
        xpEarned,
        wrongTopics: res.wrong,
      },
    ];
    saveGamification(newG);
    onUpdateGamification(newG);
  };

  if (quizActive && roundQuestions.length > 0) {
    return (
      <QuizEngine
        questions={roundQuestions}
        onComplete={handleComplete}
        timePerQuestion={mode === "timed" ? 20 : 60}
      />
    );
  }

  if (result && company && round) {
    return (
      <ScoreSummary
        correct={result.correct}
        total={roundQuestions.length}
        wrong={result.wrong}
        timeMs={result.timeMs}
        xpEarned={result.correct * 15}
        onRetry={() => {
          setResult(null);
          setQuizActive(true);
        }}
        onBack={() => {
          setResult(null);
          setRound(null);
          setMode(null);
        }}
      />
    );
  }

  if (company && round && !mode) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          onClick={() => setRound(null)}
        >
          ← Back
        </button>
        <h2 className="text-lg font-bold">
          {company} — {round.charAt(0).toUpperCase() + round.slice(1)} Round
        </h2>
        <p className="text-sm text-muted-foreground">
          {roundQuestions.length} questions available
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <Card
            className="cursor-pointer border-2 border-blue-500/30 hover:border-blue-500 transition-all"
            onClick={() => {
              setMode("practice");
              setQuizActive(true);
            }}
          >
            <CardContent className="p-5 text-center">
              <div className="text-2xl mb-2">📖</div>
              <p className="font-bold">Practice Mode</p>
              <p className="text-xs text-muted-foreground mt-1">
                60s per question, unlimited runs
              </p>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer border-2 border-red-500/30 hover:border-red-500 transition-all"
            onClick={() => {
              setMode("timed");
              setQuizActive(true);
            }}
          >
            <CardContent className="p-5 text-center">
              <div className="text-2xl mb-2">⏱️</div>
              <p className="font-bold">Timed Mock Test</p>
              <p className="text-xs text-muted-foreground mt-1">
                20s per question, real pressure
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (company && !round) {
    const roundDefs = [
      {
        key: "aptitude" as const,
        label: "Aptitude Round",
        icon: "📌",
        desc: "Quant, logical, verbal",
      },
      {
        key: "technical" as const,
        label: "Technical Round",
        icon: "💻",
        desc: "C/C++, Java, DSA, DBMS, OOP, OS",
      },
      {
        key: "hr" as const,
        label: "HR Round",
        icon: "🎤",
        desc: "Tell me about yourself, situational questions",
      },
    ];
    return (
      <div className="space-y-4">
        <button
          type="button"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          onClick={() => setCompany(null)}
        >
          ← Back to Companies
        </button>
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" /> {company} Interview
          Rounds
        </h2>
        <div className="space-y-3">
          {roundDefs.map((r) => (
            <Card
              key={r.key}
              className="cursor-pointer border-border/60 hover:border-primary/50 hover:shadow-md transition-all"
              onClick={() => setRound(r.key)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <span className="text-3xl">{r.icon}</span>
                <div>
                  <p className="font-semibold">{r.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.desc} · {COMPANY_DATA[company][r.key].length} questions
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" /> Previous Company Rounds
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Practice real questions from top companies
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {companies.map((c) => {
          const colors: Record<string, string> = {
            TCS: "from-blue-600 to-blue-800",
            Infosys: "from-indigo-600 to-indigo-800",
            Wipro: "from-orange-500 to-orange-700",
            Accenture: "from-purple-600 to-purple-800",
            Cognizant: "from-sky-500 to-sky-700",
            Amazon: "from-amber-500 to-orange-600",
            Google: "from-green-500 to-teal-600",
          };
          return (
            <Card
              key={c}
              className="cursor-pointer hover:shadow-md transition-all hover:scale-105 overflow-hidden border-border/60"
              onClick={() => setCompany(c)}
            >
              <CardContent className="p-0">
                <div
                  className={`bg-gradient-to-br ${colors[c] ?? "from-gray-600 to-gray-800"} p-4 text-white text-center`}
                >
                  <div className="text-3xl font-black">{c[0]}</div>
                </div>
                <div className="p-3 text-center">
                  <p className="font-semibold text-sm">{c}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {Object.values(COMPANY_DATA[c]).flat().length} questions
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Mock Test Tab ─────────────────────────────────────────────────────────────
function MockTestTab({
  gamification,
  onUpdateGamification,
}: {
  gamification: GamificationState;
  onUpdateGamification: (g: GamificationState) => void;
}) {
  const [active, setActive] = useState(false);
  const [result, setResult] = useState<{
    correct: number;
    wrong: string[];
    timeMs: number;
  } | null>(null);

  const handleComplete = (res: {
    correct: number;
    wrong: string[];
    timeMs: number;
  }) => {
    setResult(res);
    setActive(false);
    const xpEarned = res.correct * 20;
    const newG = { ...gamification, xp: gamification.xp + xpEarned };
    if (!newG.badges.includes("mock_champion"))
      newG.badges = [...newG.badges, "mock_champion"];
    saveGamification(newG);
    onUpdateGamification(newG);
  };

  if (active)
    return (
      <QuizEngine
        questions={MOCK_TEST_QUESTIONS}
        onComplete={handleComplete}
        timePerQuestion={45}
      />
    );

  if (result) {
    const pct = Math.round((result.correct / MOCK_TEST_QUESTIONS.length) * 100);
    const percentile = Math.min(99, 40 + pct * 0.5);
    return (
      <div className="space-y-4">
        <ScoreSummary
          correct={result.correct}
          total={MOCK_TEST_QUESTIONS.length}
          wrong={result.wrong}
          timeMs={result.timeMs}
          xpEarned={result.correct * 20}
          onRetry={() => {
            setResult(null);
            setActive(true);
          }}
          onBack={() => setResult(null)}
        />
        <Card className="border-border/60">
          <CardContent className="p-5 text-center">
            <p className="text-xs text-muted-foreground">YOUR PERCENTILE</p>
            <p className="text-5xl font-black gradient-brand-text">
              {percentile.toFixed(1)}th
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Better than {percentile.toFixed(0)}% of candidates
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" /> Full Placement Mock Test
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Simulated placement experience with mixed sections
        </p>
      </div>
      <Card className="border-border/60 overflow-hidden">
        <div className="gradient-brand p-5 text-white">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">
                {MOCK_TEST_QUESTIONS.length}
              </div>
              <div className="text-xs opacity-80">Questions</div>
            </div>
            <div>
              <div className="text-2xl font-bold">45s</div>
              <div className="text-xs opacity-80">Per Question</div>
            </div>
            <div>
              <div className="text-2xl font-bold">3</div>
              <div className="text-xs opacity-80">Sections</div>
            </div>
            <div>
              <div className="text-2xl font-bold">+20</div>
              <div className="text-xs opacity-80">XP/Correct</div>
            </div>
          </div>
        </div>
        <CardContent className="p-5 space-y-3">
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="font-semibold">📌 Aptitude</p>
              <p className="text-xs text-muted-foreground mt-1">
                Quant, logical, verbal
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="font-semibold">💻 Coding</p>
              <p className="text-xs text-muted-foreground mt-1">
                DSA, logic, output
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="font-semibold">🔧 Technical</p>
              <p className="text-xs text-muted-foreground mt-1">
                Java, DBMS, OOP, OS
              </p>
            </div>
          </div>
          <Button
            className="w-full gradient-brand text-white border-0 gap-2"
            onClick={() => setActive(true)}
          >
            <Clock className="w-4 h-4" /> Start Mock Test
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Analytics Tab ─────────────────────────────────────────────────────────────
function AnalyticsTab({ gamification }: { gamification: GamificationState }) {
  const history = gamification.history;
  const allWrong = history.flatMap((h) => h.wrongTopics);
  const topicCounts: Record<string, number> = {};
  for (const t of allWrong) topicCounts[t] = (topicCounts[t] ?? 0) + 1;
  const weakTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([t]) => t);
  const allTopics = [...new Set(history.map((h) => h.topic))];
  const strongTopics = allTopics
    .filter((t) => !weakTopics.includes(t))
    .slice(0, 5);
  const totalCorrect = history.reduce((s, h) => s + h.score, 0);
  const totalQ = history.reduce((s, h) => s + h.total, 0);
  const accuracy = totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0;

  if (history.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <BarChart2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="font-medium">No quiz history yet</p>
        <p className="text-sm mt-1">Complete a quiz to see your analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <BarChart2 className="w-5 h-5 text-primary" /> Performance Analytics
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-border/60 text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {history.length}
            </div>
            <div className="text-xs text-muted-foreground">Quizzes Done</div>
          </CardContent>
        </Card>
        <Card className="border-border/60 text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </CardContent>
        </Card>
        <Card className="border-border/60 text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-600">
              {gamification.xp}
            </div>
            <div className="text-xs text-muted-foreground">Total XP</div>
          </CardContent>
        </Card>
        <Card className="border-border/60 text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {gamification.badges.length}
            </div>
            <div className="text-xs text-muted-foreground">Badges</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">
            Score History (last 8 quizzes)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-24">
            {history.slice(-8).map((h, i) => {
              const pct = (h.score / h.total) * 100;
              return (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: chart bars ordered by date
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <span className="text-[10px] text-muted-foreground">
                    {Math.round(pct)}%
                  </span>
                  <div
                    className="w-full rounded-t-sm transition-all"
                    style={{
                      height: `${Math.max(6, pct * 0.7)}px`,
                      background:
                        pct >= 70
                          ? "oklch(0.58 0.16 150)"
                          : pct >= 50
                            ? "oklch(0.7 0.19 75)"
                            : "oklch(0.58 0.22 27)",
                    }}
                  />
                  <span className="text-[9px] text-muted-foreground truncate w-full text-center">
                    {h.topic.split(" ")[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        {strongTopics.length > 0 && (
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-600">
                Strong Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {strongTopics.map((t) => (
                  <Badge
                    key={t}
                    className="bg-green-500/10 text-green-600 border-green-500/20"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        {weakTopics.length > 0 && (
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-red-600">
                Weak Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {weakTopics.map((t) => (
                  <Badge
                    key={t}
                    className="bg-red-500/10 text-red-600 border-red-500/20"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Recommended: Practice {weakTopics[0] ?? "DSA"} questions
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bot className="w-4 h-4 text-purple-500" /> AI Suggested Next Quiz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            {weakTopics.length > 0
              ? `Focus on "${weakTopics[0]}" — try the ${accuracy < 60 ? "Easy" : "Medium"} level coding quiz to improve your weak areas.`
              : "You're doing great! Challenge yourself with Hard difficulty or try a Company Rounds simulation."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Gamification Tab ──────────────────────────────────────────────────────────
function GamificationTab({
  gamification,
}: { gamification: GamificationState }) {
  const lvl = getLevel(gamification.xp);
  const leaderboard = [
    { name: "Priya S.", xp: 1240 },
    { name: "Rahul K.", xp: 980 },
    { name: "Ananya M.", xp: 870 },
    { name: "Vikram J.", xp: 760 },
    { name: "Sneha R.", xp: 650 },
    { name: "You", xp: gamification.xp, isYou: true },
    { name: "Karthik B.", xp: 420 },
    { name: "Divya P.", xp: 380 },
    { name: "Arun T.", xp: 290 },
    { name: "Meera V.", xp: 150 },
  ]
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 10);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Trophy className="w-5 h-5 text-primary" /> Gamification
      </h2>

      <Card className="border-border/60 overflow-hidden">
        <div className="gradient-brand p-5 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-black">
              {lvl.level}
            </div>
            <div>
              <p className="font-bold text-lg">{lvl.name}</p>
              <p className="text-sm opacity-80">{gamification.xp} XP total</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs opacity-70">Next level</p>
              <p className="font-bold">{lvl.nextXp} XP</p>
            </div>
          </div>
          <div className="mt-3">
            <Progress
              value={lvl.progress}
              className="h-2 bg-white/20 [&>div]:bg-white"
            />
            <p className="text-xs opacity-70 mt-1">
              {lvl.progress}% to next level
            </p>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" /> Badges
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {BADGE_DEFS.map((b) => {
            const earned = gamification.badges.includes(b.id);
            return (
              <Card
                key={b.id}
                className={`border-border/60 transition-all ${earned ? "ring-2 ring-amber-400/50" : "opacity-60 grayscale"}`}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-1">{b.icon}</div>
                  <p className="text-xs font-bold">{b.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {b.desc}
                  </p>
                  {earned && (
                    <Badge className="mt-2 bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">
                      Earned!
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" /> Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {leaderboard.map((u, i) => (
            <div
              key={u.name}
              className={`flex items-center gap-3 p-2 rounded-lg ${(u as { isYou?: boolean }).isYou ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"}`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-amber-400 text-white" : i === 1 ? "bg-gray-300 text-gray-700" : i === 2 ? "bg-orange-400 text-white" : "bg-muted text-muted-foreground"}`}
              >
                {i + 1}
              </span>
              <span className="flex-1 text-sm font-medium">
                {u.name}
                {(u as { isYou?: boolean }).isYou ? " (You)" : ""}
              </span>
              <span className="text-sm font-bold text-primary">{u.xp} XP</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" /> Weekly Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium">
            This week: Complete 3 Hard coding questions
          </p>
          <Progress
            value={Math.min(
              100,
              (gamification.history.filter((h) => h.difficulty === "Hard")
                .length /
                3) *
                100,
            )}
            className="mt-2 h-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {Math.min(
              3,
              gamification.history.filter((h) => h.difficulty === "Hard")
                .length,
            )}
            /3 completed · Reward: 100 XP
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── AI Generator Tab ──────────────────────────────────────────────────────────
function AIGeneratorTab() {
  const [topic, setTopic] = useState("Arrays");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Medium",
  );
  const [count, setCount] = useState("5");
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [quizActive, setQuizActive] = useState(false);
  const [result, setResult] = useState<{
    correct: number;
    wrong: string[];
    timeMs: number;
  } | null>(null);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const pool = CODING_QUESTIONS.filter((q) => q.difficulty === difficulty);
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      setQuestions(shuffled.slice(0, Math.min(Number(count), shuffled.length)));
      setGenerating(false);
    }, 1500);
  };

  if (quizActive && questions)
    return (
      <QuizEngine
        questions={questions}
        onComplete={(r) => {
          setResult(r);
          setQuizActive(false);
        }}
      />
    );
  if (result && questions)
    return (
      <ScoreSummary
        correct={result.correct}
        total={questions.length}
        wrong={result.wrong}
        timeMs={result.timeMs}
        xpEarned={result.correct * 15}
        onRetry={() => {
          setResult(null);
          setQuizActive(true);
        }}
        onBack={() => {
          setResult(null);
          setQuestions(null);
        }}
      />
    );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" /> AI Quiz Generator
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Generate a custom practice set tailored to your needs
        </p>
      </div>
      <Card className="border-border/60">
        <CardContent className="p-5 space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Topic</p>
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Arrays",
                  "Strings",
                  "Recursion",
                  "Sorting",
                  "DSA",
                  "OOP",
                  "Java",
                  "DBMS",
                  "OS",
                  "Logic",
                  "C",
                  "Python",
                ].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Difficulty</p>
            <div className="flex gap-2">
              {(["Easy", "Medium", "Hard"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${difficulty === d ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
                >
                  {d === "Easy" ? "🟢" : d === "Medium" ? "🟡" : "🔴"} {d}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Number of Questions</p>
            <div className="flex gap-2">
              {["5", "8", "10"].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCount(n)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${count === n ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <Button
            className="w-full gradient-brand text-white border-0 gap-2"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" /> Generate Quiz
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {questions && !generating && (
        <Card className="border-border/60">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <p className="font-medium">
                {questions.length} questions generated!
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {difficulty} · {topic} · with explanations
            </p>
            <Button
              className="w-full gradient-brand text-white border-0"
              onClick={() => setQuizActive(true)}
            >
              <Brain className="w-4 h-4 mr-2" /> Start Generated Quiz
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function QuizArena() {
  const [gamification, setGamification] =
    useState<GamificationState>(loadGamification);

  const handleUpdateGamification = useCallback((g: GamificationState) => {
    setGamification(g);
    saveGamification(g);
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-4xl mx-auto">
      <PageHeader
        icon={Trophy}
        title="Quiz & Company Prep Arena"
        subtitle="Practice coding, aptitude, and company-specific rounds"
        action={
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1">
              <Zap className="w-3 h-3" /> {gamification.xp} XP
            </Badge>
            <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
              <Star className="w-3 h-3" /> {getLevel(gamification.xp).name}
            </Badge>
          </div>
        }
      />

      <Tabs defaultValue="coding" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-auto gap-1">
          <TabsTrigger value="coding" className="text-xs py-2">
            <Code2 className="w-3 h-3 mr-1" />
            Coding
          </TabsTrigger>
          <TabsTrigger value="company" className="text-xs py-2">
            <Building2 className="w-3 h-3 mr-1" />
            Company
          </TabsTrigger>
          <TabsTrigger value="mock" className="text-xs py-2">
            <Trophy className="w-3 h-3 mr-1" />
            Mock Test
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs py-2">
            <BarChart2 className="w-3 h-3 mr-1" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="rewards" className="text-xs py-2">
            <Award className="w-3 h-3 mr-1" />
            Rewards
          </TabsTrigger>
          <TabsTrigger value="ai" className="text-xs py-2">
            <Bot className="w-3 h-3 mr-1" />
            AI Gen
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="coding">
            <CodingQuizTab
              gamification={gamification}
              onUpdateGamification={handleUpdateGamification}
            />
          </TabsContent>
          <TabsContent value="company">
            <CompanyRoundsTab
              gamification={gamification}
              onUpdateGamification={handleUpdateGamification}
            />
          </TabsContent>
          <TabsContent value="mock">
            <MockTestTab
              gamification={gamification}
              onUpdateGamification={handleUpdateGamification}
            />
          </TabsContent>
          <TabsContent value="analytics">
            <AnalyticsTab gamification={gamification} />
          </TabsContent>
          <TabsContent value="rewards">
            <GamificationTab gamification={gamification} />
          </TabsContent>
          <TabsContent value="ai">
            <AIGeneratorTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
