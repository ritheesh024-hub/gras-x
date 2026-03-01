import { GradientProgress } from "@/components/GradientProgress";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useRoadmapProgress,
  useUpdateRoadmapProgress,
} from "@/hooks/useQueries";
import {
  BookOpen,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Circle,
  ExternalLink,
  FileText,
  Map as MapIcon,
  PlayCircle,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface TopicData {
  name: string;
  pdf?: { name: string; url: string };
}

interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
}

interface MonthData {
  title: string;
  emoji: string;
  topics: TopicData[];
  tasks: string[];
  resource: { name: string; url: string };
  videos: { lang: string; name: string; url: string }[];
  quiz: QuizQuestion[];
}

const ROADMAP_DATA: MonthData[] = [
  {
    title: "C Programming Basics",
    emoji: "🔷",
    topics: [
      {
        name: "Variables & Data Types",
        pdf: {
          name: "C Variables Notes",
          url: "https://www.tutorialspoint.com/cprogramming/c_variables.htm",
        },
      },
      {
        name: "Loops & Conditionals",
        pdf: {
          name: "C Loops Notes",
          url: "https://www.tutorialspoint.com/cprogramming/c_loops.htm",
        },
      },
      {
        name: "Functions",
        pdf: {
          name: "C Functions Notes",
          url: "https://www.tutorialspoint.com/cprogramming/c_functions.htm",
        },
      },
      {
        name: "Arrays & Strings",
        pdf: {
          name: "C Arrays Notes",
          url: "https://www.tutorialspoint.com/cprogramming/c_arrays.htm",
        },
      },
      {
        name: "Pointers",
        pdf: {
          name: "C Pointers Notes",
          url: "https://www.tutorialspoint.com/cprogramming/c_pointers.htm",
        },
      },
      {
        name: "Structures",
        pdf: {
          name: "C Structures Notes",
          url: "https://www.tutorialspoint.com/cprogramming/c_structures.htm",
        },
      },
      {
        name: "File I/O",
        pdf: {
          name: "C File I/O Notes",
          url: "https://www.tutorialspoint.com/cprogramming/c_file_io.htm",
        },
      },
    ],
    tasks: [
      "Write 20 practice programs",
      "Complete HackerRank C track",
      "Build a simple calculator",
      "Implement basic sorting algorithms",
    ],
    resource: {
      name: "HackerRank C",
      url: "https://www.hackerrank.com/domains/c",
    },
    videos: [
      {
        lang: "English",
        name: "C Programming Full Course – freeCodeCamp",
        url: "https://www.youtube.com/watch?v=KJgsSFOSQv0",
      },
      {
        lang: "Hindi",
        name: "C Language Full Course – CodeWithHarry",
        url: "https://www.youtube.com/watch?v=ZSPZob_1TOk",
      },
      {
        lang: "Telugu",
        name: "C Programming in Telugu – Naresh IT",
        url: "https://www.youtube.com/watch?v=e9Eds2Rc_x8",
      },
    ],
    quiz: [
      {
        q: "What is the correct syntax to declare an integer variable in C?",
        options: ["int x;", "integer x;", "var x;", "x = int;"],
        answer: 0,
      },
      {
        q: "Which symbol is used for pointer declaration in C?",
        options: ["&", "*", "#", "@"],
        answer: 1,
      },
      {
        q: "What does printf() do in C?",
        options: ["Reads input", "Prints output", "Declares variable", "Loops"],
        answer: 1,
      },
      {
        q: "Which loop checks condition at the end?",
        options: ["for", "while", "do-while", "if"],
        answer: 2,
      },
    ],
  },
  {
    title: "C++ Fundamentals",
    emoji: "🔶",
    topics: [
      {
        name: "Classes & Objects",
        pdf: {
          name: "C++ Classes Notes",
          url: "https://www.tutorialspoint.com/cplusplus/cpp_classes_objects.htm",
        },
      },
      {
        name: "Inheritance",
        pdf: {
          name: "C++ Inheritance Notes",
          url: "https://www.tutorialspoint.com/cplusplus/cpp_inheritance.htm",
        },
      },
      {
        name: "Polymorphism",
        pdf: {
          name: "C++ Polymorphism Notes",
          url: "https://www.tutorialspoint.com/cplusplus/cpp_polymorphism.htm",
        },
      },
      {
        name: "Templates",
        pdf: {
          name: "C++ Templates Notes",
          url: "https://www.tutorialspoint.com/cplusplus/cpp_templates.htm",
        },
      },
      {
        name: "STL (vector, map, set)",
        pdf: {
          name: "C++ STL Notes",
          url: "https://www.tutorialspoint.com/cplusplus/cpp_stl_tutorial.htm",
        },
      },
      {
        name: "Exception Handling",
        pdf: {
          name: "C++ Exceptions Notes",
          url: "https://www.tutorialspoint.com/cplusplus/cpp_exceptions_handling.htm",
        },
      },
    ],
    tasks: [
      "Write 15 OOP programs",
      "Complete CodeChef Beginner",
      "Implement a stack using class",
      "Use STL containers in 5 programs",
    ],
    resource: {
      name: "CodeChef C++",
      url: "https://www.codechef.com/learn/course/cpp",
    },
    videos: [
      {
        lang: "English",
        name: "C++ Full Course – freeCodeCamp",
        url: "https://www.youtube.com/watch?v=vLnPwxZdW4Y",
      },
      {
        lang: "Hindi",
        name: "C++ Full Course – CodeWithHarry",
        url: "https://www.youtube.com/watch?v=j8nAHeVKL08",
      },
      {
        lang: "Telugu",
        name: "C++ Tutorial in Telugu – Naresh IT",
        url: "https://www.youtube.com/watch?v=yGB3eEa90rk",
      },
    ],
    quiz: [
      {
        q: "What does OOP stand for?",
        options: [
          "Object Oriented Programming",
          "Only One Program",
          "Object Output Process",
          "Open Output Protocol",
        ],
        answer: 0,
      },
      {
        q: "Which concept allows a class to inherit from multiple classes?",
        options: [
          "Single Inheritance",
          "Multiple Inheritance",
          "Polymorphism",
          "Encapsulation",
        ],
        answer: 1,
      },
      {
        q: "What is the use of 'virtual' keyword in C++?",
        options: [
          "For templates",
          "For runtime polymorphism",
          "For exception handling",
          "For constructors",
        ],
        answer: 1,
      },
      {
        q: "Which STL container stores unique elements in sorted order?",
        options: ["vector", "list", "set", "map"],
        answer: 2,
      },
    ],
  },
  {
    title: "Python Basics",
    emoji: "🐍",
    topics: [
      {
        name: "Lists, Dicts, Tuples",
        pdf: {
          name: "Python Data Structures",
          url: "https://www.tutorialspoint.com/python/python_lists.htm",
        },
      },
      {
        name: "Functions & Lambdas",
        pdf: {
          name: "Python Functions Notes",
          url: "https://www.tutorialspoint.com/python/python_functions.htm",
        },
      },
      {
        name: "File Handling",
        pdf: {
          name: "Python File Handling",
          url: "https://www.tutorialspoint.com/python/python_files_io.htm",
        },
      },
      {
        name: "Modules & Packages",
        pdf: {
          name: "Python Modules Notes",
          url: "https://www.tutorialspoint.com/python/python_modules.htm",
        },
      },
      {
        name: "List Comprehensions",
        pdf: {
          name: "Python List Comprehension",
          url: "https://www.w3schools.com/python/python_lists_comprehension.asp",
        },
      },
      {
        name: "Error Handling",
        pdf: {
          name: "Python Exception Handling",
          url: "https://www.tutorialspoint.com/python/python_exceptions.htm",
        },
      },
    ],
    tasks: [
      "Write 20 Python scripts",
      "Complete Automate the Boring Stuff exercises",
      "Build a contact book CLI app",
      "Parse a JSON file",
    ],
    resource: {
      name: "Automate the Boring Stuff",
      url: "https://automatetheboringstuff.com",
    },
    videos: [
      {
        lang: "English",
        name: "Python for Beginners – Programming with Mosh",
        url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
      },
      {
        lang: "Hindi",
        name: "Python Full Course – CodeWithHarry",
        url: "https://www.youtube.com/watch?v=gfDE2a7MKjA",
      },
      {
        lang: "Telugu",
        name: "Python in Telugu – Naresh IT",
        url: "https://www.youtube.com/watch?v=9FIHpyWi7Hk",
      },
    ],
    quiz: [
      {
        q: "Which keyword is used to define a function in Python?",
        options: ["function", "def", "func", "define"],
        answer: 1,
      },
      {
        q: "What data type is: {'name': 'Ravi', 'age': 20}?",
        options: ["List", "Tuple", "Dictionary", "Set"],
        answer: 2,
      },
      {
        q: "Which of these is a valid list comprehension?",
        options: [
          "[x for x in range(5)]",
          "(x for x in range(5))",
          "{x for x in range(5)}",
          "x: for x in range(5)",
        ],
        answer: 0,
      },
      {
        q: "What is the output of: print(type([1,2,3]))?",
        options: ["list", "<class 'list'>", "array", "tuple"],
        answer: 1,
      },
    ],
  },
  {
    title: "HTML + CSS",
    emoji: "🌐",
    topics: [
      {
        name: "Semantic HTML5",
        pdf: {
          name: "HTML5 Semantic Tags",
          url: "https://www.w3schools.com/html/html5_semantic_elements.asp",
        },
      },
      {
        name: "CSS Box Model",
        pdf: {
          name: "CSS Box Model Notes",
          url: "https://www.tutorialspoint.com/css/css_box_model.htm",
        },
      },
      {
        name: "Flexbox",
        pdf: {
          name: "CSS Flexbox Guide",
          url: "https://www.w3schools.com/css/css3_flexbox.asp",
        },
      },
      {
        name: "CSS Grid",
        pdf: {
          name: "CSS Grid Notes",
          url: "https://www.w3schools.com/css/css_grid.asp",
        },
      },
      {
        name: "Responsive Design",
        pdf: {
          name: "Responsive Design Guide",
          url: "https://www.w3schools.com/css/css_rwd_intro.asp",
        },
      },
      {
        name: "CSS Variables",
        pdf: {
          name: "CSS Variables Notes",
          url: "https://www.w3schools.com/css/css3_variables.asp",
        },
      },
      {
        name: "Animations",
        pdf: {
          name: "CSS Animations Notes",
          url: "https://www.w3schools.com/css/css3_animations.asp",
        },
      },
    ],
    tasks: [
      "Build 3 complete web pages",
      "Complete CSS Battle challenges",
      "Create a responsive portfolio page",
      "Build a pricing table",
    ],
    resource: { name: "CSS Battle", url: "https://cssbattle.dev" },
    videos: [
      {
        lang: "English",
        name: "HTML & CSS Full Course – Dave Gray",
        url: "https://www.youtube.com/watch?v=mU6anWqZJcc",
      },
      {
        lang: "Hindi",
        name: "HTML CSS Full Course – CodeWithHarry",
        url: "https://www.youtube.com/watch?v=BsDoLVMnmZs",
      },
      {
        lang: "Telugu",
        name: "HTML CSS in Telugu – Naresh IT",
        url: "https://www.youtube.com/watch?v=pQN-pnXPaVg",
      },
    ],
    quiz: [
      {
        q: "Which HTML tag is used for the most important heading?",
        options: ["<h6>", "<heading>", "<h1>", "<head>"],
        answer: 2,
      },
      {
        q: "What does CSS stand for?",
        options: [
          "Computer Style Sheets",
          "Cascading Style Sheets",
          "Colorful Style Sheets",
          "Creative Style Sheets",
        ],
        answer: 1,
      },
      {
        q: "Which CSS property is used to change the text color?",
        options: ["text-color", "font-color", "color", "foreground"],
        answer: 2,
      },
      {
        q: "Which display value creates a flex container?",
        options: [
          "display: block",
          "display: flex",
          "display: grid",
          "display: inline",
        ],
        answer: 1,
      },
    ],
  },
  {
    title: "JavaScript Basics",
    emoji: "⚡",
    topics: [
      {
        name: "DOM Manipulation",
        pdf: {
          name: "JavaScript DOM Notes",
          url: "https://www.tutorialspoint.com/javascript/javascript_html_dom.htm",
        },
      },
      {
        name: "Events & Listeners",
        pdf: {
          name: "JS Events Notes",
          url: "https://www.w3schools.com/js/js_events.asp",
        },
      },
      {
        name: "ES6+ Features",
        pdf: {
          name: "ES6 Features Guide",
          url: "https://www.w3schools.com/js/js_es6.asp",
        },
      },
      {
        name: "Promises & Async/Await",
        pdf: {
          name: "JS Async Notes",
          url: "https://www.w3schools.com/js/js_async.asp",
        },
      },
      {
        name: "Fetch API",
        pdf: {
          name: "Fetch API Notes",
          url: "https://www.w3schools.com/js/js_api_fetch.asp",
        },
      },
      {
        name: "Local Storage",
        pdf: {
          name: "Web Storage Notes",
          url: "https://www.w3schools.com/html/html5_webstorage.asp",
        },
      },
      {
        name: "JSON",
        pdf: {
          name: "JSON Notes",
          url: "https://www.w3schools.com/js/js_json_intro.asp",
        },
      },
    ],
    tasks: [
      "Build 5 mini projects",
      "Complete JS30 by Wes Bos",
      "Create a todo app",
      "Build a weather app with API",
    ],
    resource: { name: "JavaScript30", url: "https://javascript30.com" },
    videos: [
      {
        lang: "English",
        name: "JavaScript Full Course – freeCodeCamp",
        url: "https://www.youtube.com/watch?v=jS4aFq5-91M",
      },
      {
        lang: "Hindi",
        name: "JavaScript Full Course – CodeWithHarry",
        url: "https://www.youtube.com/watch?v=ER9SspLe9IQ",
      },
      {
        lang: "Telugu",
        name: "JavaScript in Telugu – Naresh IT",
        url: "https://www.youtube.com/watch?v=9YBjGp21PJQ",
      },
    ],
    quiz: [
      {
        q: "Which keyword declares a block-scoped variable in ES6?",
        options: ["var", "let", "const", "Both let and const"],
        answer: 3,
      },
      {
        q: "What does JSON stand for?",
        options: [
          "Java Serialized Object Notation",
          "JavaScript Object Notation",
          "Java Source Object Notation",
          "JavaScript Online Notation",
        ],
        answer: 1,
      },
      {
        q: "What does DOM stand for?",
        options: [
          "Data Object Model",
          "Document Object Model",
          "Document Output Model",
          "Data Output Model",
        ],
        answer: 1,
      },
      {
        q: "Which method adds an element to the end of an array?",
        options: ["push()", "pop()", "shift()", "unshift()"],
        answer: 0,
      },
    ],
  },
  {
    title: "Data Structures",
    emoji: "📊",
    topics: [
      {
        name: "Arrays & 2D Arrays",
        pdf: {
          name: "Arrays Notes – GFG",
          url: "https://www.geeksforgeeks.org/array-data-structure/",
        },
      },
      {
        name: "Strings & Pattern Matching",
        pdf: {
          name: "Strings Notes – GFG",
          url: "https://www.geeksforgeeks.org/string-data-structure/",
        },
      },
      {
        name: "Recursion",
        pdf: {
          name: "Recursion Notes – GFG",
          url: "https://www.geeksforgeeks.org/recursion/",
        },
      },
      {
        name: "Sorting Algorithms",
        pdf: {
          name: "Sorting Notes – GFG",
          url: "https://www.geeksforgeeks.org/sorting-algorithms/",
        },
      },
      {
        name: "Searching Algorithms",
        pdf: {
          name: "Searching Notes – GFG",
          url: "https://www.geeksforgeeks.org/searching-algorithms/",
        },
      },
      {
        name: "Hashing",
        pdf: {
          name: "Hashing Notes – GFG",
          url: "https://www.geeksforgeeks.org/hashing-data-structure/",
        },
      },
      {
        name: "Two Pointers",
        pdf: {
          name: "Two Pointers – GFG",
          url: "https://www.geeksforgeeks.org/two-pointers-technique/",
        },
      },
    ],
    tasks: [
      "Solve 30 LeetCode problems",
      "Implement all sorting algorithms",
      "Practice 10 recursion problems",
      "Complete HackerRank Data Structures",
    ],
    resource: { name: "LeetCode", url: "https://leetcode.com" },
    videos: [
      {
        lang: "English",
        name: "Data Structures & Algorithms – freeCodeCamp",
        url: "https://www.youtube.com/watch?v=8hly31xKli0",
      },
      {
        lang: "Hindi",
        name: "DSA Full Course in Hindi – CodeWithHarry",
        url: "https://www.youtube.com/watch?v=5_5oE5lgrhw",
      },
      {
        lang: "Telugu",
        name: "DSA in Telugu – Naresh IT",
        url: "https://www.youtube.com/watch?v=H8Cq_4dCpHY",
      },
    ],
    quiz: [
      {
        q: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        answer: 1,
      },
      {
        q: "Which sorting algorithm has best average-case complexity?",
        options: [
          "Bubble Sort",
          "Selection Sort",
          "Quick Sort",
          "Insertion Sort",
        ],
        answer: 2,
      },
      {
        q: "What data structure uses LIFO principle?",
        options: ["Queue", "Stack", "Linked List", "Tree"],
        answer: 1,
      },
      {
        q: "What is the worst-case time complexity of bubble sort?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        answer: 2,
      },
    ],
  },
  {
    title: "Advanced DSA",
    emoji: "🌲",
    topics: [
      {
        name: "Linked Lists",
        pdf: {
          name: "Linked List Notes – GFG",
          url: "https://www.geeksforgeeks.org/linked-list-data-structure/",
        },
      },
      {
        name: "Stacks & Queues",
        pdf: {
          name: "Stacks & Queues – GFG",
          url: "https://www.geeksforgeeks.org/stack-data-structure/",
        },
      },
      {
        name: "Trees (BST, AVL)",
        pdf: {
          name: "Tree Data Structure – GFG",
          url: "https://www.geeksforgeeks.org/binary-tree-data-structure/",
        },
      },
      {
        name: "Graphs (BFS, DFS)",
        pdf: {
          name: "Graph Algorithms – GFG",
          url: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/",
        },
      },
      {
        name: "Dynamic Programming",
        pdf: {
          name: "DP Concepts – GFG",
          url: "https://www.geeksforgeeks.org/dynamic-programming/",
        },
      },
      {
        name: "Backtracking",
        pdf: {
          name: "Backtracking Notes – GFG",
          url: "https://www.geeksforgeeks.org/backtracking-algorithms/",
        },
      },
      {
        name: "Heaps",
        pdf: {
          name: "Heap Data Structure – GFG",
          url: "https://www.geeksforgeeks.org/heap-data-structure/",
        },
      },
    ],
    tasks: [
      "Solve 40 LeetCode problems",
      "Implement linked list from scratch",
      "Solve 10 DP problems",
      "Implement graph BFS/DFS",
    ],
    resource: { name: "NeetCode 150", url: "https://neetcode.io" },
    videos: [
      {
        lang: "English",
        name: "Advanced DSA – Abdul Bari",
        url: "https://www.youtube.com/watch?v=0IAPZzGSbME",
      },
      {
        lang: "Hindi",
        name: "Advanced DSA Hindi – Apna College",
        url: "https://www.youtube.com/watch?v=z9bZufPHFLU",
      },
      {
        lang: "Telugu",
        name: "Advanced DSA Telugu – Sai Tutorials",
        url: "https://www.youtube.com/watch?v=RBSGKlAvoiM",
      },
    ],
    quiz: [
      {
        q: "In a Binary Search Tree, where is the smallest element?",
        options: ["Root", "Rightmost node", "Leftmost node", "Random"],
        answer: 2,
      },
      {
        q: "BFS uses which data structure?",
        options: ["Stack", "Queue", "Tree", "Heap"],
        answer: 1,
      },
      {
        q: "What is memoization?",
        options: [
          "A sorting technique",
          "Caching computed results in DP",
          "A graph algorithm",
          "Memory management",
        ],
        answer: 1,
      },
      {
        q: "Time complexity of inserting in a max heap?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        answer: 2,
      },
    ],
  },
  {
    title: "OOPS in Java",
    emoji: "☕",
    topics: [
      {
        name: "Classes & Objects",
        pdf: {
          name: "Java Classes Notes",
          url: "https://www.tutorialspoint.com/java/java_object_classes.htm",
        },
      },
      {
        name: "Encapsulation",
        pdf: {
          name: "Java Encapsulation Notes",
          url: "https://www.tutorialspoint.com/java/java_encapsulation.htm",
        },
      },
      {
        name: "Inheritance",
        pdf: {
          name: "Java Inheritance Notes",
          url: "https://www.tutorialspoint.com/java/java_inheritance.htm",
        },
      },
      {
        name: "Polymorphism",
        pdf: {
          name: "Java Polymorphism Notes",
          url: "https://www.tutorialspoint.com/java/java_polymorphism.htm",
        },
      },
      {
        name: "Abstract Classes",
        pdf: {
          name: "Java Abstract Classes",
          url: "https://www.tutorialspoint.com/java/java_abstraction.htm",
        },
      },
      {
        name: "Interfaces",
        pdf: {
          name: "Java Interfaces Notes",
          url: "https://www.tutorialspoint.com/java/java_interfaces.htm",
        },
      },
      {
        name: "Collections Framework",
        pdf: {
          name: "Java Collections Notes",
          url: "https://www.tutorialspoint.com/java/java_collections.htm",
        },
      },
    ],
    tasks: [
      "Write 15 Java programs",
      "Implement SOLID principles",
      "Build a Bank Account system",
      "Use Java Collections in 5 problems",
    ],
    resource: {
      name: "JavaTPoint OOP",
      url: "https://www.javatpoint.com/java-oops-concepts",
    },
    videos: [
      {
        lang: "English",
        name: "Java OOP Full Course – Telusko",
        url: "https://www.youtube.com/watch?v=BSVKUk58K6U",
      },
      {
        lang: "Hindi",
        name: "Java Full Course Hindi – CodeWithHarry",
        url: "https://www.youtube.com/watch?v=ntLJmHOJ0ME",
      },
      {
        lang: "Telugu",
        name: "Java OOP in Telugu – Naresh IT",
        url: "https://www.youtube.com/watch?v=6T8a_2UFZ7A",
      },
    ],
    quiz: [
      {
        q: "Which keyword is used for inheritance in Java?",
        options: ["implements", "extends", "inherits", "super"],
        answer: 1,
      },
      {
        q: "What is encapsulation in Java?",
        options: [
          "Hiding data using private variables",
          "Inheriting from parent class",
          "Overriding methods",
          "Using abstract classes",
        ],
        answer: 0,
      },
      {
        q: "Can a Java class implement multiple interfaces?",
        options: ["No", "Yes", "Only if abstract", "Only in Java 8+"],
        answer: 1,
      },
      {
        q: "Which method is the entry point of a Java program?",
        options: ["start()", "main()", "run()", "init()"],
        answer: 1,
      },
    ],
  },
  {
    title: "Git & GitHub",
    emoji: "🐙",
    topics: [
      {
        name: "Init, Add, Commit",
        pdf: {
          name: "Git Basics Notes",
          url: "https://www.tutorialspoint.com/git/git_basic_concepts.htm",
        },
      },
      {
        name: "Branches & Merging",
        pdf: {
          name: "Git Branching Notes",
          url: "https://www.tutorialspoint.com/git/git_branching.htm",
        },
      },
      {
        name: "Pull Requests",
        pdf: {
          name: "GitHub Pull Requests Guide",
          url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests",
        },
      },
      {
        name: "Resolving Conflicts",
        pdf: {
          name: "Git Merge Conflicts",
          url: "https://www.tutorialspoint.com/git/git_managing_conflicts.htm",
        },
      },
      {
        name: "GitHub Pages",
        pdf: {
          name: "GitHub Pages Guide",
          url: "https://docs.github.com/en/pages/getting-started-with-github-pages",
        },
      },
      {
        name: "README & Documentation",
        pdf: {
          name: "Markdown Guide",
          url: "https://www.markdownguide.org/basic-syntax/",
        },
      },
      {
        name: "Open Source Workflow",
        pdf: {
          name: "Open Source Guide",
          url: "https://opensource.guide/how-to-contribute/",
        },
      },
    ],
    tasks: [
      "Create 3 GitHub repositories",
      "Contribute to an open source project",
      "Set up GitHub Pages site",
      "Learn rebase and cherry-pick",
    ],
    resource: { name: "Pro Git Book", url: "https://git-scm.com/book/en/v2" },
    videos: [
      {
        lang: "English",
        name: "Git & GitHub Crash Course – Traversy Media",
        url: "https://www.youtube.com/watch?v=SWYqp7iY_Tc",
      },
      {
        lang: "Hindi",
        name: "Git & GitHub in Hindi – CodeWithHarry",
        url: "https://www.youtube.com/watch?v=gwWKnnCMQ5c",
      },
      {
        lang: "Telugu",
        name: "Git GitHub in Telugu – Naresh IT",
        url: "https://www.youtube.com/watch?v=evknSAkUIvs",
      },
    ],
    quiz: [
      {
        q: "What does 'git init' do?",
        options: [
          "Clones a repository",
          "Initializes a new Git repo",
          "Commits changes",
          "Creates a branch",
        ],
        answer: 1,
      },
      {
        q: "Which command stages files for commit?",
        options: ["git commit", "git push", "git add", "git stage"],
        answer: 2,
      },
      {
        q: "What is a Pull Request?",
        options: [
          "Downloading code",
          "Proposing changes to merge into a branch",
          "Deleting a branch",
          "Creating a new repository",
        ],
        answer: 1,
      },
      {
        q: "Which command shows the commit history?",
        options: ["git status", "git log", "git show", "git history"],
        answer: 1,
      },
    ],
  },
  {
    title: "Oracle SQL Basics",
    emoji: "🗄️",
    topics: [
      {
        name: "SELECT & WHERE",
        pdf: {
          name: "SQL SELECT Notes",
          url: "https://www.tutorialspoint.com/sql/sql-select-query.htm",
        },
      },
      {
        name: "JOINs (INNER, LEFT, RIGHT)",
        pdf: {
          name: "SQL JOINs Notes",
          url: "https://www.tutorialspoint.com/sql/sql-using-joins.htm",
        },
      },
      {
        name: "GROUP BY & HAVING",
        pdf: {
          name: "SQL GROUP BY Notes",
          url: "https://www.tutorialspoint.com/sql/sql-group-by.htm",
        },
      },
      {
        name: "Subqueries",
        pdf: {
          name: "SQL Subqueries Notes",
          url: "https://www.tutorialspoint.com/sql/sql-sub-queries.htm",
        },
      },
      {
        name: "Indexes & Views",
        pdf: {
          name: "SQL Indexes Notes",
          url: "https://www.tutorialspoint.com/sql/sql-indexes.htm",
        },
      },
      {
        name: "Stored Procedures",
        pdf: {
          name: "SQL Stored Procedures",
          url: "https://www.tutorialspoint.com/sql/sql-stored-procedures.htm",
        },
      },
      {
        name: "Transactions",
        pdf: {
          name: "SQL Transactions Notes",
          url: "https://www.tutorialspoint.com/sql/sql-transactions.htm",
        },
      },
    ],
    tasks: [
      "Write 20 SQL queries",
      "Complete HackerRank SQL track",
      "Design a student database",
      "Practice complex JOIN queries",
    ],
    resource: {
      name: "HackerRank SQL",
      url: "https://www.hackerrank.com/domains/sql",
    },
    videos: [
      {
        lang: "English",
        name: "SQL Full Course – freeCodeCamp",
        url: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
      },
      {
        lang: "Hindi",
        name: "SQL Full Course Hindi – CodeWithHarry",
        url: "https://www.youtube.com/watch?v=7S_tz1z_5bA",
      },
      {
        lang: "Telugu",
        name: "SQL in Telugu – Naresh IT",
        url: "https://www.youtube.com/watch?v=323H_mOOWQ4",
      },
    ],
    quiz: [
      {
        q: "Which SQL clause is used to filter rows?",
        options: ["HAVING", "WHERE", "ORDER BY", "GROUP BY"],
        answer: 1,
      },
      {
        q: "Which JOIN returns all rows from both tables?",
        options: ["INNER JOIN", "LEFT JOIN", "FULL OUTER JOIN", "RIGHT JOIN"],
        answer: 2,
      },
      {
        q: "What does GROUP BY do?",
        options: [
          "Sorts data",
          "Groups rows with same value",
          "Filters duplicate rows",
          "Joins two tables",
        ],
        answer: 1,
      },
      {
        q: "Which function returns the total count of rows?",
        options: ["SUM()", "MAX()", "COUNT()", "AVG()"],
        answer: 2,
      },
    ],
  },
  {
    title: "Aptitude Preparation",
    emoji: "🧠",
    topics: [
      {
        name: "Quantitative Aptitude",
        pdf: {
          name: "Quantitative Aptitude Notes",
          url: "https://www.indiabix.com/aptitude/questions-and-answers/",
        },
      },
      {
        name: "Logical Reasoning",
        pdf: {
          name: "Logical Reasoning Notes",
          url: "https://www.indiabix.com/logical-reasoning/questions-and-answers/",
        },
      },
      {
        name: "Verbal Ability",
        pdf: {
          name: "Verbal Ability Notes",
          url: "https://www.indiabix.com/verbal-ability/questions-and-answers/",
        },
      },
      {
        name: "Data Interpretation",
        pdf: {
          name: "Data Interpretation Notes",
          url: "https://www.indiabix.com/data-interpretation/questions-and-answers/",
        },
      },
      {
        name: "Number Series",
        pdf: {
          name: "Number Series Guide",
          url: "https://www.tutorialspoint.com/aptitude/aptitude_number_series.htm",
        },
      },
      {
        name: "Probability & Statistics",
        pdf: {
          name: "Probability Notes",
          url: "https://www.tutorialspoint.com/aptitude/aptitude_probability.htm",
        },
      },
    ],
    tasks: [
      "Solve 100 practice questions",
      "Practice IndiaBix daily",
      "Attempt 5 mock tests",
      "Focus on weak areas",
    ],
    resource: { name: "IndiaBix", url: "https://www.indiabix.com" },
    videos: [
      {
        lang: "English",
        name: "Aptitude Shortcuts – CareerRide",
        url: "https://www.youtube.com/watch?v=7LjqOBvh0UE",
      },
      {
        lang: "Hindi",
        name: "Aptitude Full Course Hindi – Abhinay Maths",
        url: "https://www.youtube.com/watch?v=CeaMSUHOQNM",
      },
      {
        lang: "Telugu",
        name: "Aptitude in Telugu – MathsGuru",
        url: "https://www.youtube.com/watch?v=Y1rJoNSNXow",
      },
    ],
    quiz: [
      {
        q: "If a train travels 120 km in 2 hours, what is its speed?",
        options: ["60 km/h", "240 km/h", "30 km/h", "12 km/h"],
        answer: 0,
      },
      {
        q: "What is 15% of 200?",
        options: ["25", "30", "35", "40"],
        answer: 1,
      },
      {
        q: "Next in series: 2, 4, 8, 16, __",
        options: ["24", "30", "32", "36"],
        answer: 2,
      },
      {
        q: "A man bought an item for ₹400 and sold it for ₹500. Profit %?",
        options: ["20%", "25%", "15%", "10%"],
        answer: 1,
      },
    ],
  },
  {
    title: "Mini Project + Resume",
    emoji: "🚀",
    topics: [
      {
        name: "Project Planning",
        pdf: {
          name: "Project Planning Guide",
          url: "https://www.tutorialspoint.com/software_engineering/software_project_management.htm",
        },
      },
      {
        name: "GitHub Deployment",
        pdf: {
          name: "GitHub Pages Deployment",
          url: "https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site",
        },
      },
      {
        name: "Resume Writing",
        pdf: {
          name: "Resume Writing Guide",
          url: "https://www.careercup.com/resume",
        },
      },
      {
        name: "LinkedIn Profile",
        pdf: {
          name: "LinkedIn Optimization",
          url: "https://www.linkedin.com/help/linkedin/answer/a554351",
        },
      },
      {
        name: "Portfolio Building",
        pdf: {
          name: "Portfolio Guide",
          url: "https://www.freecodecamp.org/news/how-to-build-a-developer-portfolio-website/",
        },
      },
      {
        name: "Technical Interview Prep",
        pdf: {
          name: "Interview Prep Guide",
          url: "https://www.geeksforgeeks.org/how-to-prepare-for-a-technical-interview/",
        },
      },
    ],
    tasks: [
      "Complete 1 full-stack project",
      "Deploy on GitHub Pages/Vercel",
      "Polish resume with all projects",
      "Optimize LinkedIn profile",
    ],
    resource: { name: "Resume.io", url: "https://resume.io" },
    videos: [
      {
        lang: "English",
        name: "How to Build a Developer Portfolio – Traversy Media",
        url: "https://www.youtube.com/watch?v=oYlJR4Le228",
      },
      {
        lang: "Hindi",
        name: "Placement Preparation 2024 – Apna College Hindi",
        url: "https://www.youtube.com/watch?v=mF4ZD4T3-hc",
      },
      {
        lang: "Telugu",
        name: "Resume Building in Telugu – Telugu Tech Tuts",
        url: "https://www.youtube.com/watch?v=nMnfMazuA7A",
      },
    ],
    quiz: [
      {
        q: "What does ATS stand for in resume context?",
        options: [
          "Automatic Typing System",
          "Applicant Tracking System",
          "Advanced Technical Skills",
          "Application Test Score",
        ],
        answer: 1,
      },
      {
        q: "What is the ideal resume length for a fresher?",
        options: ["3-4 pages", "2-3 pages", "1 page", "No limit"],
        answer: 2,
      },
      {
        q: "Which format is preferred for submitting resumes?",
        options: ["Word Document", "PDF", "Plain Text", "HTML"],
        answer: 1,
      },
      {
        q: "Which section should appear first on a fresher resume?",
        options: ["Work Experience", "Projects", "Education", "Skills"],
        answer: 2,
      },
    ],
  },
];

// ── Language badge colors ─────────────────────────────────────────────────
function LangBadge({ lang }: { lang: string }) {
  const colors: Record<string, string> = {
    English:
      "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
    Hindi:
      "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/20",
    Telugu:
      "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20",
  };
  return (
    <span
      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${colors[lang] ?? "bg-muted text-muted-foreground"}`}
    >
      {lang}
    </span>
  );
}

// ── Quiz Component ────────────────────────────────────────────────────────
function QuizSection({ quiz }: { quiz: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [showScore, setShowScore] = useState(false);

  const handleAnswer = (qIdx: number, optIdx: number) => {
    if (submitted[qIdx]) return;
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    setSubmitted((prev) => ({ ...prev, [qIdx]: true }));
    // Show score after all questions answered
    const newSubmitted = { ...submitted, [qIdx]: true };
    if (Object.keys(newSubmitted).length === quiz.length) {
      setTimeout(() => setShowScore(true), 400);
    }
  };

  const retake = () => {
    setAnswers({});
    setSubmitted({});
    setShowScore(false);
  };

  const score = quiz.filter((q, i) => answers[i] === q.answer).length;
  const scoreEmoji =
    score === quiz.length ? "🏆" : score >= quiz.length / 2 ? "😊" : "📚";

  return (
    <div className="space-y-4">
      {showScore && (
        <div className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 p-4 text-center space-y-1">
          <div className="text-3xl">{scoreEmoji}</div>
          <p className="font-display font-bold text-lg">
            {score}/{quiz.length} Correct
          </p>
          <p className="text-sm text-muted-foreground">
            {score === quiz.length
              ? "Perfect score! 🎉"
              : score >= quiz.length / 2
                ? "Good job! Keep practicing!"
                : "Review the topics and try again!"}
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={retake}
            className="mt-2 gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
          </Button>
        </div>
      )}

      {quiz.map((q, qi) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: quiz questions are static
        <div key={qi} className="space-y-2">
          <p className="text-sm font-medium">
            <span className="text-primary font-bold mr-1.5">Q{qi + 1}.</span>
            {q.q}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {q.options.map((opt, oi) => {
              const isSelected = answers[qi] === oi;
              const isCorrect = q.answer === oi;
              const isRevealed = submitted[qi];

              let btnClass =
                "text-left text-xs px-3 py-2 rounded-lg border transition-all ";
              if (isRevealed) {
                if (isCorrect)
                  btnClass +=
                    "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 font-semibold";
                else if (isSelected)
                  btnClass +=
                    "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400";
                else
                  btnClass +=
                    "border-border/40 text-muted-foreground opacity-60";
              } else {
                btnClass +=
                  "border-border hover:border-primary hover:bg-primary/5 hover:text-primary cursor-pointer";
              }

              return (
                <button
                  // biome-ignore lint/suspicious/noArrayIndexKey: static options
                  key={oi}
                  type="button"
                  onClick={() => handleAnswer(qi, oi)}
                  disabled={isRevealed}
                  className={btnClass}
                >
                  <span className="font-bold mr-1">
                    {String.fromCharCode(65 + oi)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── MonthCard ─────────────────────────────────────────────────────────────
function MonthCard({ month, index }: { month: MonthData; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const { data: progress, isLoading } = useRoadmapProgress(index);
  const updateProgress = useUpdateRoadmapProgress();

  const completedTopics: boolean[] =
    progress?.completedTopics?.length === month.topics.length
      ? progress.completedTopics
      : new Array(month.topics.length).fill(false);

  const completionPercent = progress
    ? Number(progress.completionPercent)
    : Math.round(
        (completedTopics.filter(Boolean).length / month.topics.length) * 100,
      );

  const isCompleted = completionPercent === 100;

  const toggleTopic = async (topicIndex: number) => {
    const newCompleted = [...completedTopics];
    newCompleted[topicIndex] = !newCompleted[topicIndex];
    const newPercent = Math.round(
      (newCompleted.filter(Boolean).length / newCompleted.length) * 100,
    );
    try {
      await updateProgress.mutateAsync({
        monthIndex: BigInt(index),
        completedTopics: newCompleted,
        completionPercent: BigInt(newPercent),
      });
    } catch {
      toast.error("Failed to save progress");
    }
  };

  const markAllComplete = async () => {
    try {
      await updateProgress.mutateAsync({
        monthIndex: BigInt(index),
        completedTopics: new Array(month.topics.length).fill(true),
        completionPercent: BigInt(100),
      });
      toast.success(`Month ${index + 1} marked complete!`);
    } catch {
      toast.error("Failed to save progress");
    }
  };

  return (
    <Card
      className={`border-border/60 overflow-hidden card-hover transition-all duration-300 ${
        isCompleted ? "border-success/30 bg-success/5" : ""
      }`}
    >
      <button
        type="button"
        className="p-5 cursor-pointer w-full text-left"
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => e.key === "Enter" && setExpanded(!expanded)}
      >
        <div className="flex items-start gap-4">
          {/* Month number */}
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-display font-bold text-lg ${
              isCompleted
                ? "bg-success text-success-foreground"
                : "gradient-brand text-white shadow-brand"
            }`}
          >
            {isCompleted ? "✓" : index + 1}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-xs text-muted-foreground font-medium">
                  Month {index + 1}
                </span>
                <h3 className="font-display font-bold text-base leading-tight">
                  {month.emoji} {month.title}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                {isCompleted && (
                  <Badge className="bg-success/10 text-success border-success/20">
                    Completed
                  </Badge>
                )}
                <span className="font-bold text-sm gradient-brand-text shrink-0">
                  {isLoading ? "..." : `${completionPercent}%`}
                </span>
                {expanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </div>
            </div>
            <GradientProgress
              value={isLoading ? 0 : completionPercent}
              className="mt-3"
            />
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border/40">
          <Tabs defaultValue="topics" className="w-full">
            <TabsList className="w-full rounded-none border-b border-border/40 bg-transparent h-auto p-0">
              {["topics", "tasks", "resources", "quiz"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary capitalize text-xs py-2.5 font-medium"
                >
                  {tab === "topics" && <BookOpen className="w-3 h-3 mr-1" />}
                  {tab === "tasks" && <CheckSquare className="w-3 h-3 mr-1" />}
                  {tab === "resources" && (
                    <PlayCircle className="w-3 h-3 mr-1" />
                  )}
                  {tab === "quiz" && <span className="mr-1">🧪</span>}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* TOPICS TAB */}
            <TabsContent value="topics" className="px-5 py-4 space-y-4 mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {month.topics.map((topic, ti) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: index needed for topic tracking
                    key={ti}
                    className="flex items-center gap-2"
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTopic(ti);
                      }}
                      disabled={updateProgress.isPending}
                      className="flex items-center gap-2 text-sm text-left hover:text-primary transition-colors disabled:opacity-50 flex-1 min-w-0"
                    >
                      {completedTopics[ti] ? (
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                      <span
                        className={`truncate ${completedTopics[ti] ? "line-through text-muted-foreground" : ""}`}
                      >
                        {topic.name}
                      </span>
                    </button>
                    {topic.pdf && (
                      <a
                        href={topic.pdf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Open: ${topic.pdf.name}`}
                        onClick={(e) => e.stopPropagation()}
                        className="shrink-0 text-muted-foreground hover:text-primary transition-colors p-0.5 rounded"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
              {!isCompleted && (
                <div className="pt-2 border-t border-border/40">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAllComplete();
                    }}
                    disabled={updateProgress.isPending}
                    className="gradient-brand text-white border-0 shadow-brand"
                  >
                    Mark All Complete
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* TASKS TAB */}
            <TabsContent value="tasks" className="px-5 py-4 mt-0">
              <ul className="space-y-2">
                {month.tasks.map((task) => (
                  <li
                    key={task}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-primary mt-0.5 shrink-0">→</span>
                    {task}
                  </li>
                ))}
              </ul>
            </TabsContent>

            {/* RESOURCES TAB */}
            <TabsContent value="resources" className="px-5 py-4 mt-0 space-y-4">
              {/* Videos */}
              <div>
                <h4 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Video Tutorials
                </h4>
                <div className="space-y-2">
                  {month.videos.map((video) => (
                    <a
                      key={video.lang}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-3 p-2.5 rounded-lg border border-border/50 hover:border-red-500/40 hover:bg-red-500/5 transition-all group"
                    >
                      <PlayCircle className="w-5 h-5 text-red-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-red-500 transition-colors">
                          {video.name}
                        </p>
                      </div>
                      <LangBadge lang={video.lang} />
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Practice Resource */}
              <div>
                <h4 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Practice Resource
                </h4>
                <a
                  href={month.resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  {month.resource.name}
                </a>
              </div>
            </TabsContent>

            {/* QUIZ TAB */}
            <TabsContent value="quiz" className="px-5 py-4 mt-0">
              <QuizSection quiz={month.quiz} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </Card>
  );
}

export function SkillRoadmap() {
  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-4xl mx-auto">
      <PageHeader
        icon={MapIcon}
        title="Skill Roadmap"
        subtitle="Your 12-month placement preparation journey"
      />

      {/* Overview pills */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-card border border-border/60 rounded-full px-4 py-2 text-sm">
          <span className="w-2 h-2 rounded-full gradient-brand inline-block" />
          12 months · 80+ topics
        </div>
        <div className="flex items-center gap-2 bg-card border border-border/60 rounded-full px-4 py-2 text-sm">
          <span className="w-2 h-2 rounded-full bg-success inline-block" />
          Tap topic to mark done
        </div>
        <div className="flex items-center gap-2 bg-card border border-border/60 rounded-full px-4 py-2 text-sm">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
          Videos in EN / HI / TE
        </div>
        <div className="flex items-center gap-2 bg-card border border-border/60 rounded-full px-4 py-2 text-sm">
          <span className="w-2 h-2 rounded-full bg-primary inline-block" />
          Quiz + PDF notes per month
        </div>
      </div>

      <div className="space-y-4">
        {ROADMAP_DATA.map((month, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: month index needed for backend
          <MonthCard key={i} month={month} index={i} />
        ))}
      </div>
    </div>
  );
}
