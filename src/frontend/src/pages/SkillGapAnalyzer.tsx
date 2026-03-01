import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Code2,
  Lightbulb,
  MessageSquare,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Role =
  | "Software Developer"
  | "AIML Engineer"
  | "Web Developer"
  | "Full Stack Developer"
  | "AI Engineer"
  | "Data Scientist"
  | "Prompt Engineer";

interface WeekPlan {
  week: number;
  title: string;
  topics: string[];
  practice: string[];
  projects: string[];
  interviewTips: string[];
}

interface RoleData {
  emoji: string;
  description: string;
  requiredSkills: string[];
  improvementPlan: WeekPlan[];
}

const ROLE_DATA: Record<Role, RoleData> = {
  "Software Developer": {
    emoji: "💻",
    description: "Build scalable backend systems, master DSA & system design.",
    requiredSkills: [
      "C++",
      "Java",
      "Python",
      "DSA",
      "OOP",
      "SQL",
      "Git",
      "Linux Basics",
      "REST APIs",
      "Algorithms",
      "Data Structures",
      "Problem Solving",
    ],
    improvementPlan: [
      {
        week: 1,
        title: "Week 1: Programming Foundations",
        topics: [
          "C++ / Java fundamentals",
          "Variables, loops, functions",
          "OOP concepts (Classes, Inheritance, Polymorphism)",
          "Basic I/O and file handling",
        ],
        practice: [
          "Solve 5 easy problems on HackerRank",
          "Build a simple calculator app in Java",
          "Practice OOP concepts with mini projects",
        ],
        projects: [
          "Library Management System (console-based)",
          "Student Grade Calculator",
        ],
        interviewTips: [
          "Learn to explain your code logic clearly",
          "Practice STAR method for behavioral questions",
        ],
      },
      {
        week: 2,
        title: "Week 2: Data Structures",
        topics: [
          "Arrays, Linked Lists, Stacks, Queues",
          "Trees and Binary Search Trees",
          "Hash Maps and Sets",
          "Time & Space Complexity (Big-O)",
        ],
        practice: [
          "Solve 3 DSA problems daily on LeetCode",
          "Implement each data structure from scratch",
          "Study complexity for every solution",
        ],
        projects: [
          "Custom Stack and Queue implementation",
          "Phone Book using Hash Map",
        ],
        interviewTips: [
          "Always mention time complexity when answering DSA questions",
          "Draw diagrams to visualize data structures",
        ],
      },
      {
        week: 3,
        title: "Week 3: Algorithms & SQL",
        topics: [
          "Sorting algorithms (Merge, Quick, Heap)",
          "Graph traversal (BFS, DFS)",
          "Dynamic Programming basics",
          "SQL: SELECT, JOIN, GROUP BY, subqueries",
        ],
        practice: [
          "Solve 2 medium LeetCode problems per day",
          "Practice 10 SQL queries on HackerRank",
          "Revise sorting algorithms from scratch",
        ],
        projects: [
          "Pathfinder visualizer (graph algorithms)",
          "Simple blog database with SQL",
        ],
        interviewTips: [
          "Explain your approach before writing code in interviews",
          "Practice SQL queries on paper for written tests",
        ],
      },
      {
        week: 4,
        title: "Week 4: Git, APIs & Mock Interviews",
        topics: [
          "Git workflow (branch, merge, pull request)",
          "REST API design concepts",
          "Linux command basics",
          "System design fundamentals",
        ],
        practice: [
          "Create a GitHub project with proper commits",
          "Build a REST API using Java Spring Boot or Flask",
          "Complete a full mock test on GeeksForGeeks",
        ],
        projects: [
          "Todo app with REST API backend",
          "GitHub profile analyzer tool",
        ],
        interviewTips: [
          "Prepare answers for: Tell me about yourself, Why coding?",
          "Practice system design for small apps like URL shortener",
        ],
      },
    ],
  },

  "AIML Engineer": {
    emoji: "🤖",
    description: "Build intelligent systems using ML algorithms and Python.",
    requiredSkills: [
      "Python",
      "NumPy",
      "Pandas",
      "Scikit-learn",
      "Machine Learning",
      "Deep Learning",
      "TensorFlow",
      "PyTorch",
      "Statistics",
      "SQL",
      "Git",
      "Data Preprocessing",
    ],
    improvementPlan: [
      {
        week: 1,
        title: "Week 1: Python & Math Foundations",
        topics: [
          "Python: lists, dicts, functions, OOP",
          "NumPy and Pandas basics",
          "Statistics: mean, median, standard deviation",
          "Linear Algebra fundamentals (vectors, matrices)",
        ],
        practice: [
          "Complete Kaggle Python course (free)",
          "Solve 10 pandas data manipulation exercises",
          "Watch StatQuest videos on statistics",
        ],
        projects: [
          "Data analysis on any CSV dataset",
          "Student score analysis with Pandas",
        ],
        interviewTips: [
          "Be ready to explain the difference between supervised and unsupervised learning",
          "Know Python list comprehensions and lambda functions",
        ],
      },
      {
        week: 2,
        title: "Week 2: ML Algorithms",
        topics: [
          "Linear and Logistic Regression",
          "Decision Trees and Random Forests",
          "K-Nearest Neighbors, SVM basics",
          "Model evaluation: accuracy, precision, recall",
        ],
        practice: [
          "Implement Linear Regression from scratch in Python",
          "Train a classifier on Titanic or Iris dataset",
          "Use Scikit-learn for model comparison",
        ],
        projects: ["House Price Prediction model", "Email spam classifier"],
        interviewTips: [
          "Explain overfitting vs underfitting with examples",
          "Know when to use which ML algorithm",
        ],
      },
      {
        week: 3,
        title: "Week 3: Deep Learning Intro",
        topics: [
          "Neural networks: layers, activation functions",
          "Backpropagation and gradient descent",
          "CNNs for image classification",
          "TensorFlow / Keras basics",
        ],
        practice: [
          "Build a digit recognizer with MNIST dataset",
          "Try transfer learning with a pretrained model",
          "Complete fast.ai Lesson 1-3",
        ],
        projects: [
          "Handwritten digit recognizer (web app)",
          "Dog vs Cat image classifier",
        ],
        interviewTips: [
          "Explain what gradient descent does in simple terms",
          "Know the difference between CNN, RNN, and transformers",
        ],
      },
      {
        week: 4,
        title: "Week 4: Projects & Interview Prep",
        topics: [
          "Feature engineering and data cleaning",
          "Model deployment basics (Flask/FastAPI)",
          "SQL for data analysis",
          "Kaggle competition strategy",
        ],
        practice: [
          "Join a Kaggle competition and submit",
          "Deploy a ML model as a web API",
          "Practice 20 SQL queries on HackerRank",
        ],
        projects: [
          "End-to-end ML pipeline with deployment",
          "Sentiment analysis web app",
        ],
        interviewTips: [
          "Prepare to discuss your Kaggle projects in detail",
          "Study real ML interview questions from companies like Google/Amazon",
        ],
      },
    ],
  },

  "Web Developer": {
    emoji: "🌐",
    description: "Craft beautiful, fast, accessible web interfaces.",
    requiredSkills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Responsive Design",
      "Git",
      "REST APIs",
      "TypeScript",
      "CSS Frameworks",
      "Browser DevTools",
      "Accessibility",
      "Performance Optimization",
    ],
    improvementPlan: [
      {
        week: 1,
        title: "Week 1: HTML & CSS Mastery",
        topics: [
          "Semantic HTML5 elements",
          "CSS Flexbox and Grid layout",
          "Responsive design and media queries",
          "CSS variables and custom properties",
        ],
        practice: [
          "Clone a real website homepage (e.g. Netflix, Spotify)",
          "Build 3 responsive card components",
          "Complete freeCodeCamp HTML/CSS challenges",
        ],
        projects: [
          "Personal portfolio website",
          "Restaurant landing page (mobile-first)",
        ],
        interviewTips: [
          "Be ready to explain the CSS Box Model",
          "Know the difference between Flexbox and Grid",
        ],
      },
      {
        week: 2,
        title: "Week 2: JavaScript Essentials",
        topics: [
          "DOM manipulation and event listeners",
          "ES6+: arrow functions, destructuring, spread",
          "Promises, async/await, fetch API",
          "LocalStorage and JSON",
        ],
        practice: [
          "Build a to-do app with CRUD operations",
          "Fetch data from a public API (e.g. weather API)",
          "Solve 10 JavaScript challenges on exercism.io",
        ],
        projects: [
          "Weather forecast app using OpenWeather API",
          "Quiz game with score tracker",
        ],
        interviewTips: [
          "Understand hoisting, closures, and event bubbling",
          "Practice 'this' keyword and prototype chain questions",
        ],
      },
      {
        week: 3,
        title: "Week 3: React Framework",
        topics: [
          "Components, props, and state management",
          "useEffect, useContext, custom hooks",
          "React Router for navigation",
          "TypeScript with React basics",
        ],
        practice: [
          "Build a React dashboard from scratch",
          "Convert a vanilla JS app to React",
          "Practice lifting state up and prop drilling solutions",
        ],
        projects: [
          "Movie search app using TMDB API",
          "E-commerce product listing with filter",
        ],
        interviewTips: [
          "Explain virtual DOM and reconciliation",
          "Know useEffect dependencies and when not to use it",
        ],
      },
      {
        week: 4,
        title: "Week 4: Performance & Deployment",
        topics: [
          "Web performance: lazy loading, code splitting",
          "Accessibility (ARIA roles, keyboard nav)",
          "Git workflow and GitHub Pages deployment",
          "Browser DevTools profiling",
        ],
        practice: [
          "Audit a website using Lighthouse",
          "Deploy a React app to Vercel or Netlify",
          "Add keyboard navigation to an existing project",
        ],
        projects: [
          "Optimized blog with 90+ Lighthouse score",
          "PWA (Progressive Web App) with offline support",
        ],
        interviewTips: [
          "Know how to improve Core Web Vitals (LCP, FID, CLS)",
          "Prepare to answer CORS, HTTP methods, and caching questions",
        ],
      },
    ],
  },

  "Full Stack Developer": {
    emoji: "🔗",
    description: "Bridge frontend and backend to build complete applications.",
    requiredSkills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Node.js",
      "Express.js",
      "SQL",
      "MongoDB",
      "REST APIs",
      "Git",
      "Authentication",
      "Docker Basics",
      "TypeScript",
    ],
    improvementPlan: [
      {
        week: 1,
        title: "Week 1: Frontend Foundations",
        topics: [
          "HTML, CSS, JavaScript refresher",
          "React components and state",
          "Tailwind CSS for rapid styling",
          "TypeScript fundamentals",
        ],
        practice: [
          "Build 2 UI components daily with React",
          "Convert a design mockup to code",
          "Complete TypeScript beginner exercises",
        ],
        projects: [
          "Responsive dashboard UI (frontend only)",
          "Task manager with React state",
        ],
        interviewTips: [
          "Explain how React's reconciliation works",
          "Know the event loop and async JavaScript",
        ],
      },
      {
        week: 2,
        title: "Week 2: Backend with Node.js",
        topics: [
          "Node.js: modules, file system, events",
          "Express.js: routes, middleware, error handling",
          "RESTful API design principles",
          "SQL database design and queries",
        ],
        practice: [
          "Build a full CRUD REST API with Express",
          "Connect Node.js to PostgreSQL or MySQL",
          "Test APIs using Postman",
        ],
        projects: [
          "Blog API with authentication",
          "Product inventory management API",
        ],
        interviewTips: [
          "Explain the difference between REST and GraphQL",
          "Know HTTP status codes (200, 201, 400, 401, 404, 500)",
        ],
      },
      {
        week: 3,
        title: "Week 3: Authentication & Databases",
        topics: [
          "JWT authentication and sessions",
          "MongoDB with Mongoose ODM",
          "Password hashing with bcrypt",
          "Environment variables and security best practices",
        ],
        practice: [
          "Add auth to your existing API project",
          "Compare SQL vs NoSQL with real examples",
          "Build a user registration and login system",
        ],
        projects: [
          "Full-stack note-taking app with auth",
          "Social media mini-clone (posts + likes)",
        ],
        interviewTips: [
          "Understand XSS, CSRF, and SQL injection attacks",
          "Know the difference between authentication and authorization",
        ],
      },
      {
        week: 4,
        title: "Week 4: DevOps & Full Project",
        topics: [
          "Docker: containers and compose",
          "CI/CD basics with GitHub Actions",
          "Deployment to cloud (Vercel, Railway, Render)",
          "Git branching strategy (Git Flow)",
        ],
        practice: [
          "Containerize an existing app with Docker",
          "Set up a GitHub Actions pipeline",
          "Deploy a full-stack app to the web",
        ],
        projects: [
          "Full-stack e-commerce app (React + Node + MongoDB)",
          "Real-time chat app with Socket.io",
        ],
        interviewTips: [
          "Be ready to whiteboard a system design for a URL shortener",
          "Prepare a deployed project to show during interviews",
        ],
      },
    ],
  },

  "AI Engineer": {
    emoji: "🧠",
    description: "Deploy and scale AI models in production environments.",
    requiredSkills: [
      "Python",
      "Machine Learning",
      "Deep Learning",
      "TensorFlow",
      "PyTorch",
      "MLOps",
      "Docker",
      "REST APIs",
      "Cloud Platforms",
      "SQL",
      "Git",
      "Math & Statistics",
    ],
    improvementPlan: [
      {
        week: 1,
        title: "Week 1: Python & ML Foundations",
        topics: [
          "Python for data science (NumPy, Pandas)",
          "Statistics and probability fundamentals",
          "Supervised vs unsupervised learning",
          "Scikit-learn pipeline basics",
        ],
        practice: [
          "Complete a regression problem end-to-end",
          "Explore 3 different datasets on Kaggle",
          "Watch Andrej Karpathy's neural network series",
        ],
        projects: [
          "Churn prediction model",
          "Customer segmentation with clustering",
        ],
        interviewTips: [
          "Explain bias-variance tradeoff with examples",
          "Know the math behind gradient descent",
        ],
      },
      {
        week: 2,
        title: "Week 2: Deep Learning",
        topics: [
          "Neural network architecture and backprop",
          "CNNs, RNNs, and Transformer basics",
          "TensorFlow/Keras model building",
          "Transfer learning and fine-tuning",
        ],
        practice: [
          "Train a CNN on CIFAR-10 dataset",
          "Fine-tune a pretrained model (ResNet, BERT)",
          "Implement attention mechanism from scratch",
        ],
        projects: [
          "Image recognition web app",
          "Text sentiment analyzer using BERT",
        ],
        interviewTips: [
          "Explain what transformers revolutionized in NLP",
          "Understand batch normalization and dropout",
        ],
      },
      {
        week: 3,
        title: "Week 3: MLOps & Deployment",
        topics: [
          "Model serialization (pickle, ONNX)",
          "Flask/FastAPI for model serving",
          "Docker for ML environments",
          "Model monitoring and drift detection",
        ],
        practice: [
          "Package a ML model as a REST API",
          "Containerize a prediction service",
          "Implement basic model monitoring with MLflow",
        ],
        projects: [
          "Deployed ML prediction API on cloud",
          "ML experiment tracking dashboard",
        ],
        interviewTips: [
          "Know the ML lifecycle from training to production",
          "Be ready to discuss model versioning strategies",
        ],
      },
      {
        week: 4,
        title: "Week 4: Cloud & Advanced Topics",
        topics: [
          "AWS/GCP/Azure AI services overview",
          "Large Language Models and prompt engineering",
          "Distributed training basics",
          "AI safety and responsible AI principles",
        ],
        practice: [
          "Build a serverless ML inference pipeline",
          "Try AWS SageMaker or Google Vertex AI",
          "Experiment with LangChain for LLM apps",
        ],
        projects: [
          "AI-powered chatbot with LangChain",
          "Cloud-deployed multi-model ensemble",
        ],
        interviewTips: [
          "Prepare to discuss tradeoffs between model accuracy and latency",
          "Know A/B testing methodology for ML models",
        ],
      },
    ],
  },

  "Data Scientist": {
    emoji: "📊",
    description: "Extract insights from data to drive business decisions.",
    requiredSkills: [
      "Python",
      "SQL",
      "Statistics",
      "Machine Learning",
      "Data Visualization",
      "Pandas",
      "NumPy",
      "Tableau",
      "Excel",
      "Storytelling",
      "Git",
      "A/B Testing",
    ],
    improvementPlan: [
      {
        week: 1,
        title: "Week 1: Statistics & Python",
        topics: [
          "Descriptive statistics (mean, median, variance)",
          "Probability distributions and sampling",
          "Python: Pandas for data wrangling",
          "Matplotlib and Seaborn for visualization",
        ],
        practice: [
          "Analyze a real dataset (e.g. Titanic, Airbnb)",
          "Create 5 different chart types with Seaborn",
          "Complete Khan Academy statistics course",
        ],
        projects: [
          "Exploratory data analysis on public dataset",
          "COVID-19 data trends dashboard",
        ],
        interviewTips: [
          "Be comfortable explaining p-values and confidence intervals",
          "Know how to handle missing data and outliers",
        ],
      },
      {
        week: 2,
        title: "Week 2: SQL & Business Analytics",
        topics: [
          "SQL: advanced joins, subqueries, window functions",
          "Data aggregation and business metrics",
          "Cohort analysis and funnel analysis",
          "Excel: pivot tables, VLOOKUP, charts",
        ],
        practice: [
          "Solve 20 SQL questions on Mode Analytics",
          "Build a business metrics dashboard in Excel",
          "Analyze user retention with cohort analysis",
        ],
        projects: [
          "E-commerce sales analytics SQL report",
          "Customer lifetime value analysis",
        ],
        interviewTips: [
          "SQL window functions (ROW_NUMBER, RANK, LAG) are frequently tested",
          "Practice explaining insights in business terms, not technical",
        ],
      },
      {
        week: 3,
        title: "Week 3: ML for Data Science",
        topics: [
          "Regression, classification, and clustering",
          "Feature selection and engineering",
          "Cross-validation and hyperparameter tuning",
          "Ensemble methods (Random Forest, XGBoost)",
        ],
        practice: [
          "Participate in a Kaggle competition",
          "Build a prediction model with full EDA",
          "Compare 5 models on the same dataset",
        ],
        projects: [
          "Price prediction model with feature engineering",
          "Customer churn prediction dashboard",
        ],
        interviewTips: [
          "Be ready for a case study: 'How would you increase conversion rate?'",
          "Know when to use regression vs classification",
        ],
      },
      {
        week: 4,
        title: "Week 4: Visualization & Communication",
        topics: [
          "Tableau or Power BI dashboard creation",
          "Data storytelling and stakeholder presentation",
          "A/B testing design and analysis",
          "Building a data portfolio",
        ],
        practice: [
          "Create an interactive Tableau dashboard",
          "Present a data story in 5 slides",
          "Design and simulate an A/B test",
        ],
        projects: [
          "Interactive business intelligence dashboard",
          "Complete end-to-end data science portfolio project",
        ],
        interviewTips: [
          "Practice explaining technical results to non-technical audiences",
          "Prepare 3 data projects that show business impact",
        ],
      },
    ],
  },

  "Prompt Engineer": {
    emoji: "✨",
    description: "Design precise prompts to unlock AI model capabilities.",
    requiredSkills: [
      "Python",
      "NLP Basics",
      "LLM Concepts",
      "Prompt Design",
      "API Integration",
      "Critical Thinking",
      "Technical Writing",
      "JSON",
      "Git",
      "JavaScript",
      "Problem Solving",
      "AI Ethics",
    ],
    improvementPlan: [
      {
        week: 1,
        title: "Week 1: AI & LLM Foundations",
        topics: [
          "How large language models work (transformers overview)",
          "Prompt anatomy: system, user, assistant roles",
          "Zero-shot, one-shot, few-shot prompting",
          "Common LLMs: GPT-4, Claude, Gemini, Llama",
        ],
        practice: [
          "Experiment with 50 prompts in ChatGPT",
          "Complete LearnPrompting.org beginner guide",
          "Compare GPT-4 vs Claude responses on same prompts",
        ],
        projects: [
          "Prompt template library for common tasks",
          "Compare and document 10 prompt strategies",
        ],
        interviewTips: [
          "Explain what hallucination means in LLMs",
          "Understand tokenization and context windows",
        ],
      },
      {
        week: 2,
        title: "Week 2: Advanced Prompt Techniques",
        topics: [
          "Chain-of-thought (CoT) and step-by-step reasoning",
          "Role prompting and persona design",
          "Output formatting with JSON schemas",
          "Temperature and sampling parameters",
        ],
        practice: [
          "Build 5 complex chain-of-thought prompts",
          "Create a prompt that outputs structured JSON",
          "Design role-based prompts for different personas",
        ],
        projects: [
          "AI writing assistant with persona prompts",
          "Structured data extractor using LLMs",
        ],
        interviewTips: [
          "Demonstrate you can debug a failing prompt systematically",
          "Know prompt injection and adversarial prompt examples",
        ],
      },
      {
        week: 3,
        title: "Week 3: API & Python Integration",
        topics: [
          "OpenAI / Anthropic API basics",
          "Python: requests, JSON, environment variables",
          "Building LLM-powered apps",
          "LangChain basics: chains and agents",
        ],
        practice: [
          "Build a chatbot using OpenAI API in Python",
          "Create a document Q&A system with LangChain",
          "Build a prompt-based code explainer",
        ],
        projects: [
          "Personal AI assistant Python app",
          "Resume optimizer using GPT-4 API",
        ],
        interviewTips: [
          "Be ready to show code using API calls",
          "Know how to handle API rate limits and errors",
        ],
      },
      {
        week: 4,
        title: "Week 4: Production & Ethics",
        topics: [
          "RAG (Retrieval Augmented Generation) basics",
          "Prompt versioning and evaluation frameworks",
          "AI safety, bias, and responsible use",
          "Building a prompt portfolio",
        ],
        practice: [
          "Build a RAG system with a local document store",
          "Evaluate prompts using metrics (accuracy, consistency)",
          "Write 3 case studies on prompt optimization",
        ],
        projects: [
          "Knowledge base chatbot with RAG",
          "Automated content generator with quality gates",
        ],
        interviewTips: [
          "Prepare to discuss ethical implications of LLMs",
          "Show before/after examples of prompt optimization",
        ],
      },
    ],
  },
};

interface AnalysisResult {
  have: string[];
  missing: string[];
  readiness: number;
}

interface WeekCardProps {
  plan: WeekPlan;
  index: number;
}

function WeekCard({ plan, index }: WeekCardProps) {
  const [openSection, setOpenSection] = useState<string | null>("topics");

  const sections = [
    {
      id: "topics",
      icon: BookOpen,
      label: "Topics to Cover",
      items: plan.topics,
      color: "text-blue-500",
    },
    {
      id: "practice",
      icon: Code2,
      label: "Practice Suggestions",
      items: plan.practice,
      color: "text-teal-500",
    },
    {
      id: "projects",
      icon: Lightbulb,
      label: "Project Ideas",
      items: plan.projects,
      color: "text-amber-500",
    },
    {
      id: "interview",
      icon: MessageSquare,
      label: "Interview Prep Tips",
      items: plan.interviewTips,
      color: "text-purple-500",
    },
  ];

  const delayClass =
    ["delay-0", "delay-75", "delay-150", "delay-200"][index] ?? "delay-0";

  return (
    <div
      className={`animate-fade-in-up ${delayClass} bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200`}
    >
      {/* Week header */}
      <div className="gradient-brand p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
            W{plan.week}
          </div>
          <div>
            <p className="text-white/70 text-xs font-medium uppercase tracking-wider">
              Week {plan.week}
            </p>
            <h4 className="text-white font-semibold text-sm leading-tight">
              {plan.title.replace(`Week ${plan.week}: `, "")}
            </h4>
          </div>
        </div>
      </div>

      {/* Expandable sections */}
      <div className="divide-y divide-border/50">
        {sections.map((section) => {
          const Icon = section.icon;
          const isOpen = openSection === section.id;
          return (
            <div key={section.id}>
              <button
                type="button"
                onClick={() => setOpenSection(isOpen ? null : section.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors text-left"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${section.color}`} />
                  <span className="text-sm font-medium text-foreground">
                    {section.label}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              {isOpen && (
                <div className="px-4 pb-3">
                  <ul className="space-y-1.5">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ProgressBarProps {
  value: number;
}

function AnimatedProgressBar({ value }: ProgressBarProps) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayed(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Skill Readiness
        </span>
        <span
          className="text-2xl font-bold gradient-brand-text"
          aria-live="polite"
        >
          {displayed}%
        </span>
      </div>
      <div className="relative h-4 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${displayed}%`,
            background:
              "linear-gradient(90deg, oklch(var(--brand-blue)), oklch(var(--brand-purple)))",
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {displayed >= 80
          ? "🎉 Excellent! You're almost ready for this role."
          : displayed >= 50
            ? "📈 Good progress! Keep building your skills."
            : "🚀 Great start! Follow the improvement plan below."}
      </p>
    </div>
  );
}

export function SkillGapAnalyzer() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [userSkillsInput, setUserSkillsInput] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);

  const roles = Object.keys(ROLE_DATA) as Role[];

  const handleRoleSelect = (role: Role) => {
    if (selectedRole === role) {
      setSelectedRole(null);
      setIsExpanded(false);
      setUserSkillsInput("");
      setAnalysisResult(null);
      return;
    }
    // Reset analysis when switching roles
    setAnalysisResult(null);
    setUserSkillsInput("");
    setSelectedRole(role);
    setIsExpanded(true);
    // Scroll to detail section after a brief delay for animation
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  const handleAnalyze = () => {
    if (!selectedRole || !userSkillsInput.trim()) return;
    const userSkills = userSkillsInput
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    const required = ROLE_DATA[selectedRole].requiredSkills;
    const have = required.filter((skill) =>
      userSkills.some(
        (u) =>
          skill.toLowerCase().includes(u) || u.includes(skill.toLowerCase()),
      ),
    );
    const missing = required.filter((skill) => !have.includes(skill));
    const readiness = Math.round((have.length / required.length) * 100);
    setAnalysisResult({ have, missing, readiness });
  };

  const roleData = selectedRole ? ROLE_DATA[selectedRole] : null;

  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-5xl mx-auto">
      <PageHeader
        icon={Target}
        title="Skill Gap Analyzer"
        subtitle="Select your dream role — discover what skills you need and how to get there"
      />

      {/* Role Cards Grid */}
      <div className="stagger-children grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {roles.map((role) => {
          const data = ROLE_DATA[role];
          const isActive = selectedRole === role;
          return (
            <button
              key={role}
              type="button"
              onClick={() => handleRoleSelect(role)}
              aria-pressed={isActive}
              className={[
                "relative p-4 sm:p-5 rounded-2xl border-2 text-left transition-all duration-300 group",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isActive
                  ? "border-primary gradient-brand-soft shadow-brand scale-[1.02]"
                  : "border-border/60 bg-card hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5",
              ].join(" ")}
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                {data.emoji}
              </div>
              <div className="font-semibold text-sm leading-tight text-foreground">
                {role}
              </div>
              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {data.description}
              </div>
              {isActive && (
                <div className="mt-2 flex items-center gap-1">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-medium text-primary">
                    Selected
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {!selectedRole && (
        <div className="text-center py-16 text-muted-foreground">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full gradient-brand-soft flex items-center justify-center">
            <Target className="w-10 h-10 text-primary opacity-60" />
          </div>
          <p className="font-semibold text-lg text-foreground">
            Pick a dream role above
          </p>
          <p className="text-sm mt-2 max-w-xs mx-auto">
            We'll show you required skills, analyze your readiness, and build a
            personalized 4-week plan.
          </p>
        </div>
      )}

      {/* Expanded Detail Section */}
      {isExpanded && selectedRole && roleData && (
        <div
          ref={detailRef}
          className="space-y-5 animate-fade-in-up"
          style={{ scrollMarginTop: "1rem" }}
        >
          {/* ─── Role Header Card ─── */}
          <Card className="border-border/60 overflow-hidden shadow-sm">
            <div className="gradient-brand p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="text-5xl shrink-0">{roleData.emoji}</div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-white text-xl font-bold">
                    {selectedRole}
                  </h2>
                  <p className="text-white/80 text-sm mt-1">
                    {roleData.description}
                  </p>
                  <div className="mt-4">
                    <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">
                      Required Skills ({roleData.requiredSkills.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {roleData.requiredSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* ─── Skill Input Form ─── */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-semibold text-base flex items-center gap-2">
                <Code2 className="w-4 h-4 text-primary" />
                Enter Your Current Skills
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Type skills separated by commas — e.g.{" "}
                <em className="text-foreground not-italic font-medium">
                  Python, HTML, Git, React
                </em>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={userSkillsInput}
                onChange={(e) => setUserSkillsInput(e.target.value)}
                placeholder="e.g. Python, JavaScript, HTML, CSS, Git, SQL, React..."
                className="min-h-[80px] resize-none text-sm focus:ring-2 focus:ring-primary/30"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    handleAnalyze();
                  }
                }}
              />
              <Button
                onClick={handleAnalyze}
                disabled={!userSkillsInput.trim()}
                className="w-full gradient-brand text-white border-0 font-semibold py-5 rounded-xl hover:opacity-90 hover:scale-[1.01] transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Analyze My Skills
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Tip: Press Ctrl+Enter to analyze quickly
              </p>
            </CardContent>
          </Card>

          {/* ─── Analysis Results ─── */}
          {analysisResult && (
            <Card className="border-border/60 shadow-sm animate-fade-in-up">
              <CardHeader className="pb-3">
                <CardTitle className="font-semibold text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Skill Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <AnimatedProgressBar value={analysisResult.readiness} />

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Skills You Have */}
                  <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-green-600 dark:text-green-400 flex items-center gap-2 mb-3">
                      ✅ Skills You Have
                      <Badge className="bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20 text-xs">
                        {analysisResult.have.length}
                      </Badge>
                    </h4>
                    {analysisResult.have.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">
                        None matched yet — try adding more skills above.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.have.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-700 dark:text-green-300 border border-green-500/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Skills Missing */}
                  <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-2 mb-3">
                      ❌ Skills Missing
                      <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20 text-xs">
                        {analysisResult.missing.length}
                      </Badge>
                    </h4>
                    {analysisResult.missing.length === 0 ? (
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                        🎉 You have all required skills for this role!
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.missing.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary bar */}
                <div className="flex items-center justify-around py-3 bg-muted/40 rounded-xl text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {analysisResult.have.length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Skills Matched
                    </p>
                  </div>
                  <div className="w-px h-10 bg-border/60" />
                  <div>
                    <p className="text-2xl font-bold text-red-500 dark:text-red-400">
                      {analysisResult.missing.length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Skills to Learn
                    </p>
                  </div>
                  <div className="w-px h-10 bg-border/60" />
                  <div>
                    <p className="text-2xl font-bold gradient-brand-text">
                      {roleData.requiredSkills.length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Total Required
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ─── Improvement Plan ─── */}
          {analysisResult && (
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">
                    Your 4-Week Improvement Plan
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Structured roadmap to become a {selectedRole}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {roleData.improvementPlan.map((plan, i) => (
                  <WeekCard key={plan.week} plan={plan} index={i} />
                ))}
              </div>

              {/* Call to action */}
              <div className="mt-5 p-4 rounded-2xl gradient-brand-soft border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    Ready to start your journey as a {selectedRole}?
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Start with Week 1 today — consistency beats intensity every
                    time.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="gradient-brand text-white border-0 shrink-0 hover:opacity-90 transition-opacity"
                >
                  Start Week 1 →
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
