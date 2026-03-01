import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Check, Copy, GraduationCap, Send, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: number;
}

// ── AI System Prompt ──────────────────────────────────────────────────────
const AI_SYSTEM_PROMPT = `You are GPT, an expert AI coding mentor and placement preparation assistant for engineering students on GrasX.

YOUR MISSION:
Help students with coding doubts, programming concepts, debugging errors, data structures, algorithms, web development, GitHub, projects, interview preparation, and placement roadmap guidance. Your audience is primarily first-year and second-year engineering students preparing for placements.

BEHAVIOR RULES:
1. Answer ANY coding doubt clearly.
2. If user gives code:
   - Identify the exact error type
   - Explain why the error occurs
   - Provide corrected code
   - Explain line-by-line if needed
3. If user asks theory:
   - Explain in simple language
   - Give examples
   - Use real-world analogies
4. If user asks placement-related question:
   - Give a structured roadmap
   - Suggest skills to learn
   - Suggest project ideas
   - Suggest practice platforms
5. If user is confused:
   - Break the problem into small steps
6. Always provide structured answers:
   - Explanation
   - Example
   - Steps
   - Final Summary
7. Keep tone friendly and motivating — like a helpful senior student + expert mentor.
8. Use simple English. Avoid overcomplicated jargon.
9. Encourage consistent practice.

SUPPORTED TOPICS:
- C, C++, Java, Python, JavaScript, SQL
- Data Structures & Algorithms (DSA)
- OOP (Object-Oriented Programming)
- DBMS (Database Management Systems)
- Operating Systems basics
- Web development (HTML, CSS, JS, React)
- Git and GitHub
- Resume building and ATS optimization
- Interview preparation (HR + Technical)
- Hackathons
- Placement roadmap (company-specific: TCS, Infosys, Wipro, Google, Amazon)
- Problem solving strategy

WHEN DEBUGGING CODE:
- Mention the exact error type (Syntax Error / Runtime Error / Logical Error)
- Show the corrected version with proper formatting
- Explain the mistake clearly

WHEN GIVING ROADMAP:
- Give a weekly plan
- Suggest platforms (LeetCode, HackerRank, GeeksForGeeks, etc.)
- Suggest practice count per day

FORMATTING RULES:
- Always use markdown code blocks (\`\`\`language ... \`\`\`) for ALL code examples
- Use bullet points for lists
- Use **bold** for key terms
- Structure every answer with clear sections

TONE:
Confident, supportive, clear. Like a friendly senior who genuinely wants you to crack placements.

GOAL:
Make the student industry-ready and placement-ready.`;

// ── Code Block Renderer ───────────────────────────────────────────────────
function MessageContent({ content }: { content: string }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Parse content into text/code segments
  const segments: { type: "text" | "code"; content: string; lang?: string }[] =
    [];
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let codeIdx = 0;

  // biome-ignore lint/suspicious/noAssignInExpressions: regex exec pattern
  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        content: content.slice(lastIndex, match.index),
      });
    }
    segments.push({
      type: "code",
      content: match[2].trim(),
      lang: match[1] || "code",
    });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    segments.push({ type: "text", content: content.slice(lastIndex) });
  }

  return (
    <div className="space-y-2">
      {segments.map((seg, i) => {
        if (seg.type === "code") {
          const idx = codeIdx++;
          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static parsed segments
              key={i}
              className="relative rounded-xl overflow-hidden border border-zinc-700/60 shadow-lg"
            >
              {/* Code header */}
              <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-800 border-b border-zinc-700/60">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                  {seg.lang || "code"}
                </span>
                <button
                  type="button"
                  onClick={() => copyCode(seg.content, idx)}
                  className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3 h-3 text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-zinc-900 px-4 py-3 overflow-x-auto text-xs leading-relaxed">
                <code className="text-green-400 font-mono whitespace-pre">
                  {seg.content}
                </code>
              </pre>
            </div>
          );
        }

        // Render text with basic markdown
        return (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static parsed segments
            key={i}
            className="text-sm leading-relaxed space-y-1.5"
          >
            {seg.content.split("\n").map((line, li) => {
              if (!line.trim())
                return (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: line index
                    key={li}
                    className="h-1"
                  />
                );

              // Bold text
              const boldLine = line.split(/\*\*(.*?)\*\*/g).map((part, pi) =>
                pi % 2 === 1 ? (
                  <strong
                    // biome-ignore lint/suspicious/noArrayIndexKey: inline parts
                    key={pi}
                    className="font-semibold"
                  >
                    {part}
                  </strong>
                ) : (
                  part
                ),
              );

              // Bullet points
              if (line.startsWith("- ") || line.startsWith("• ")) {
                return (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: line index
                    key={li}
                    className="flex items-start gap-2 ml-2"
                  >
                    <span className="text-primary mt-1 text-xs shrink-0">
                      •
                    </span>
                    <span>{boldLine}</span>
                  </div>
                );
              }

              // Numbered items
              if (/^\d+\./.test(line)) {
                return (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: line index
                    key={li}
                    className="flex items-start gap-2 ml-2"
                  >
                    <span>{boldLine}</span>
                  </div>
                );
              }

              return (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: line index
                  key={li}
                >
                  {boldLine}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ── Suggested Prompts ─────────────────────────────────────────────────────
const SUGGESTED_PROMPTS = [
  "Explain C pointers with example",
  "What is recursion?",
  "Write bubble sort in Python",
  "Explain OOP concepts in Java",
  "What is DSA and where to start?",
  "How to prepare for TCS placement?",
  "Tips for resume writing",
  "Explain time complexity",
  "What is normalization in DBMS?",
  "Git commands for beginners",
  "Roadmap for full stack developer",
  "Explain process vs thread (OS)",
  "Best project ideas for 1st year",
  "How to crack Amazon interview?",
  "Explain linked list with code",
  "Mock interview tips for freshers",
];

// ── Main Component ────────────────────────────────────────────────────────
export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const stored = localStorage.getItem("ai-chat-history");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Persist chat history
  useEffect(() => {
    const trimmed = messages.slice(-100);
    localStorage.setItem("ai-chat-history", JSON.stringify(trimmed));
  }, [messages]);

  // Auto-scroll — biome-ignore: intentional trigger on messages + isThinking
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll triggers on data changes, not refs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isThinking) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    try {
      const conversationHistory = messages.slice(-10).map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      }));

      const makeRequest = async (model: string) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        try {
          const response = await fetch("https://text.pollinations.ai/openai", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Referer: "https://gars-x.app",
            },
            signal: controller.signal,
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: AI_SYSTEM_PROMPT },
                ...conversationHistory,
                { role: "user", content: trimmed },
              ],
              temperature: 0.7,
              max_tokens: 1000,
            }),
          });
          clearTimeout(timeoutId);
          if (!response.ok) throw new Error(`API error: ${response.status}`);
          return await response.json();
        } catch (err) {
          clearTimeout(timeoutId);
          throw err;
        }
      };

      let data: Record<string, unknown>;
      try {
        data = await makeRequest("openai-large");
      } catch {
        // Retry with base model after 1 second
        await new Promise((r) => setTimeout(r, 1000));
        data = await makeRequest("openai");
      }

      const aiText: string =
        data.choices?.[0]?.message?.content ||
        "I'm sorry, I couldn't process that. Please try again.";

      // Add empty message first, then stream characters
      const aiMsgId = `ai-${Date.now()}`;
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        { id: aiMsgId, role: "ai", content: "", timestamp: Date.now() },
      ]);

      let displayText = "";
      const isInsideCodeBlock = () => {
        const matches = displayText.match(/```/g);
        return matches && matches.length % 2 !== 0;
      };
      for (let i = 0; i < aiText.length; i++) {
        displayText += aiText[i];
        const currentText = displayText;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId ? { ...m, content: currentText } : m,
          ),
        );
        // Faster typewriter inside code blocks (skip every 2 chars), slower outside
        const step = isInsideCodeBlock() ? 2 : 3;
        if (i % step === 0) await new Promise((r) => setTimeout(r, 10));
      }
    } catch {
      setIsThinking(false);
      const fallbackMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "ai",
        content: "The AI is temporarily busy. Please try again in a moment.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("ai-chat-history");
  };

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] lg:h-screen max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/60 bg-card shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-brand">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-base leading-tight">
              GPT - AI Coding Mentor
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
              Placement &amp; Coding Expert
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="text-muted-foreground hover:text-destructive gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear chat</span>
          </Button>
        )}
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
      >
        {/* Empty state */}
        {messages.length === 0 && !isThinking && (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center shadow-brand">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg">
                GPT - Your AI Coding Mentor
              </h2>
              <p className="text-muted-foreground text-sm mt-1 max-w-sm">
                Ask me anything -- coding doubts, DSA, debugging, resume tips,
                placement roadmap, or company-specific prep!
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg mt-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition-all bg-card text-muted-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                msg.role === "user"
                  ? "gradient-brand shadow-brand"
                  : "bg-muted border border-border"
              }`}
            >
              {msg.role === "user" ? (
                <span className="text-white text-[10px] font-bold">YOU</span>
              ) : (
                <Bot className="w-3.5 h-3.5 text-foreground" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                msg.role === "user"
                  ? "gradient-brand text-white rounded-tr-sm"
                  : "bg-card border border-border/60 rounded-tl-sm"
              }`}
            >
              {msg.role === "user" ? (
                <p className="text-sm leading-relaxed">{msg.content}</p>
              ) : (
                <MessageContent content={msg.content} />
              )}
              <p
                className={`text-[10px] mt-1.5 ${
                  msg.role === "user"
                    ? "text-white/60 text-right"
                    : "text-muted-foreground"
                }`}
              >
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {/* Thinking indicator */}
        {isThinking && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-3.5 h-3.5 text-foreground" />
            </div>
            <div className="bg-card border border-border/60 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  Thinking...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested prompts (always shown, condensed when has messages) */}
      {messages.length > 0 && (
        <div className="px-4 pb-1 shrink-0">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {SUGGESTED_PROMPTS.slice(0, 5).map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                disabled={isThinking}
                className="text-[11px] px-2.5 py-1 rounded-full border border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition-all bg-card text-muted-foreground whitespace-nowrap shrink-0 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="px-4 py-3 border-t border-border/60 bg-card shrink-0">
        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask any coding doubt, DSA problem, placement query, or debugging help..."
            rows={1}
            className="min-h-[44px] max-h-[120px] resize-none flex-1 bg-background text-sm"
            disabled={isThinking}
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isThinking}
            size="icon"
            className="h-11 w-11 gradient-brand text-white border-0 shadow-brand shrink-0"
          >
            {isThinking ? (
              <X className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>

      {/* Footer */}
      <footer className="text-center text-[10px] text-muted-foreground py-2 border-t border-border/40 shrink-0">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
