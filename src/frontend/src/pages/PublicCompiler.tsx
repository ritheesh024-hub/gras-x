import {
  ArrowLeft,
  ChevronDown,
  Copy,
  Download,
  Loader2,
  Play,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface PublicCompilerProps {
  onBack: () => void;
}

// ── Language Config ──────────────────────────────────────────────────────
type Language = "python" | "c" | "cpp" | "java";

const LANGUAGES: {
  id: Language;
  label: string;
  pistonLang: string;
  pistonVersion: string;
  ext: string;
}[] = [
  {
    id: "python",
    label: "Python 3",
    pistonLang: "python",
    pistonVersion: "3.10.0",
    ext: "py",
  },
  {
    id: "c",
    label: "C (GCC)",
    pistonLang: "c",
    pistonVersion: "10.2.0",
    ext: "c",
  },
  {
    id: "cpp",
    label: "C++ (GCC)",
    pistonLang: "cpp",
    pistonVersion: "10.2.0",
    ext: "cpp",
  },
  {
    id: "java",
    label: "Java",
    pistonLang: "java",
    pistonVersion: "15.0.2",
    ext: "java",
  },
];

const STARTER_CODE: Record<Language, string> = {
  python: `# Python 3
print("Hello, World!")

# Try modifying this code
name = "GrasX"
print(f"Welcome to {name} Compiler!")
`,
  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    
    // Calculate factorial
    int n = 5, fact = 1;
    for (int i = 1; i <= n; i++) {
        fact *= i;
    }
    printf("Factorial of %d = %d\\n", n, fact);
    
    return 0;
}
`,
  cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    
    // Vector example
    vector<int> v = {1, 2, 3, 4, 5};
    cout << "Sum: ";
    int sum = 0;
    for (int x : v) sum += x;
    cout << sum << endl;
    
    return 0;
}
`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Fibonacci
        int n = 10;
        int a = 0, b = 1;
        System.out.print("Fibonacci: ");
        for (int i = 0; i < n; i++) {
            System.out.print(a + " ");
            int temp = a + b;
            a = b;
            b = temp;
        }
        System.out.println();
    }
}
`,
};

// ── Execution result type ─────────────────────────────────────────────────
interface ExecResult {
  stdout: string;
  stderr: string;
  compile_output: string;
  status: { id: number; description: string };
  time: string | null;
  memory: number | null;
}

// ── Line numbers ─────────────────────────────────────────────────────────
function LineNumbers({ code }: { code: string }) {
  const lines = code.split("\n");
  return (
    <div
      style={{
        minWidth: "48px",
        width: "48px",
        background: "#1e1e1e",
        borderRight: "1px solid #333",
        padding: "1rem 0",
        userSelect: "none",
        flexShrink: 0,
        overflowY: "hidden",
      }}
    >
      {lines.map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: line numbers are index-based
          key={i}
          style={{
            height: "1.5rem",
            lineHeight: "1.5rem",
            textAlign: "right",
            paddingRight: "10px",
            color: "#4a4a5a",
            fontSize: "0.8rem",
            fontFamily: "'JetBrains Mono', 'Geist Mono', monospace",
          }}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}

// ── Language selector ─────────────────────────────────────────────────────
function LanguageSelector({
  value,
  onChange,
}: {
  value: Language;
  onChange: (l: Language) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.id === value)!;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          background: "#2d2d2d",
          border: "1px solid #444",
          borderRadius: "8px",
          color: "#d4d4d4",
          padding: "0.375rem 0.75rem",
          fontSize: "0.8rem",
          fontWeight: 500,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          transition: "border-color 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#2dd4bf";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#444";
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#2dd4bf",
            flexShrink: 0,
          }}
        />
        {current.label}
        <ChevronDown size={13} style={{ opacity: 0.6 }} />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            background: "#252526",
            border: "1px solid #444",
            borderRadius: "8px",
            overflow: "hidden",
            zIndex: 100,
            minWidth: "160px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => {
                onChange(lang.id);
                setOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                width: "100%",
                padding: "0.5rem 0.75rem",
                background: lang.id === value ? "#2dd4bf22" : "transparent",
                border: "none",
                color: lang.id === value ? "#2dd4bf" : "#d4d4d4",
                fontSize: "0.8rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                if (lang.id !== value)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#333";
              }}
              onMouseLeave={(e) => {
                if (lang.id !== value)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Output Panel ─────────────────────────────────────────────────────────
function OutputPanel({
  result,
  loading,
  onClear,
}: {
  result: ExecResult | null;
  loading: boolean;
  onClear: () => void;
}) {
  const hasOutput =
    result && (result.stdout || result.stderr || result.compile_output);

  return (
    <div
      style={{
        flex: "0 0 40%",
        display: "flex",
        flexDirection: "column",
        background: "#1e1e1e",
        borderLeft: "1px solid #333",
        minWidth: 0,
      }}
    >
      {/* Output header */}
      <div
        style={{
          background: "#252526",
          borderBottom: "1px solid #333",
          padding: "0.75rem 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: loading
                ? "#f59e0b"
                : result
                  ? result.stderr || result.compile_output
                    ? "#ef4444"
                    : "#22c55e"
                  : "#555",
              transition: "background 0.3s",
              boxShadow: loading
                ? "0 0 8px #f59e0b"
                : result &&
                    !result.stderr &&
                    !result.compile_output &&
                    result.stdout
                  ? "0 0 8px #22c55e"
                  : "none",
            }}
          />
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "#858585",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            OUTPUT
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {result?.time && (
            <span
              style={{
                fontSize: "0.7rem",
                color: "#2dd4bf",
                background: "#2dd4bf18",
                padding: "2px 6px",
                borderRadius: "4px",
              }}
            >
              ⏱ {result.time}s
            </span>
          )}
          {result?.memory && (
            <span
              style={{
                fontSize: "0.7rem",
                color: "#8b5cf6",
                background: "#8b5cf618",
                padding: "2px 6px",
                borderRadius: "4px",
              }}
            >
              💾 {result.memory} KB
            </span>
          )}
          {hasOutput && (
            <button
              type="button"
              onClick={onClear}
              title="Clear output"
              style={{
                background: "none",
                border: "none",
                color: "#555",
                cursor: "pointer",
                padding: "2px",
                display: "flex",
                alignItems: "center",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#555";
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Output content */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "1rem",
          fontFamily: "'JetBrains Mono', 'Geist Mono', monospace",
          fontSize: "0.825rem",
          lineHeight: 1.6,
        }}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: "1rem",
              color: "#555",
            }}
          >
            <Loader2
              size={28}
              color="#2dd4bf"
              style={{ animation: "spin 1s linear infinite" }}
            />
            <span style={{ color: "#858585", fontSize: "0.8rem" }}>
              Executing code...
            </span>
          </div>
        ) : !hasOutput ? (
          <div
            style={{
              color: "#3a3a4a",
              textAlign: "center",
              paddingTop: "3rem",
              fontSize: "0.8rem",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>▷</div>
            <div>Waiting for output...</div>
            <div style={{ marginTop: "0.5rem", color: "#2d2d3d" }}>
              Press Run Code to execute
            </div>
          </div>
        ) : (
          <>
            {/* Status badge */}
            {result && (
              <div
                style={{
                  marginBottom: "0.75rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "3px 10px",
                  borderRadius: "999px",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  background:
                    result.status.id === 3 ? "#22c55e22" : "#ef444422",
                  color: result.status.id === 3 ? "#22c55e" : "#ef4444",
                  border: `1px solid ${result.status.id === 3 ? "#22c55e33" : "#ef444433"}`,
                }}
              >
                {result.status.id === 3 ? "✓" : "✗"} {result.status.description}
              </div>
            )}

            {/* stdout */}
            {result?.stdout && (
              <pre
                style={{
                  color: "#4ec9b0",
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {result.stdout}
              </pre>
            )}

            {/* compile_output */}
            {result?.compile_output && (
              <>
                <div
                  style={{
                    color: "#f59e0b",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    marginTop: "0.75rem",
                    marginBottom: "0.25rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Compilation Output:
                </div>
                <pre
                  style={{
                    color: "#f44747",
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {result.compile_output}
                </pre>
              </>
            )}

            {/* stderr */}
            {result?.stderr && (
              <>
                <div
                  style={{
                    color: "#f59e0b",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    marginTop: "0.75rem",
                    marginBottom: "0.25rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Error:
                </div>
                <pre
                  style={{
                    color: "#f44747",
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {result.stderr}
                </pre>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Compiler Page ────────────────────────────────────────────────────
export function PublicCompiler({ onBack }: PublicCompilerProps) {
  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState(STARTER_CODE.python);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExecResult | null>(null);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumRef = useRef<HTMLDivElement>(null);

  // Sync language → starter code
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setCode(STARTER_CODE[lang]);
    setResult(null);
    setNetworkError(null);
  };

  // Sync textarea scroll with line numbers
  const syncScroll = () => {
    if (textareaRef.current && lineNumRef.current) {
      lineNumRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Tab key → 2 spaces, Enter → auto-indent
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = e.currentTarget;

    if (e.key === "Tab") {
      e.preventDefault();
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newCode = `${code.substring(0, start)}  ${code.substring(end)}`;
      setCode(newCode);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      const start = ta.selectionStart;
      const lineStart = code.lastIndexOf("\n", start - 1) + 1;
      const currentLine = code.substring(lineStart, start);
      const indent = currentLine.match(/^(\s*)/)?.[1] ?? "";
      const newCode = `${code.substring(0, start)}\n${indent}${code.substring(start)}`;
      setCode(newCode);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 1 + indent.length;
      });
    }
  };

  // Run code via Judge0
  const runCode = useCallback(async () => {
    setLoading(true);
    setResult(null);
    setNetworkError(null);

    const lang = LANGUAGES.find((l) => l.id === language)!;

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: lang.pistonLang,
          version: lang.pistonVersion,
          files: [{ name: `main.${lang.ext}`, content: code }],
          stdin: "",
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(
          `API Error ${response.status}: ${errText.slice(0, 200)}`,
        );
      }

      const data = await response.json();
      const run = data.run ?? {};
      const compile = data.compile ?? {};

      const stdout = run.stdout ?? "";
      const stderr = run.stderr ?? "";
      const compileOutput = compile.stderr ?? compile.stdout ?? "";
      const exitCode = run.code ?? 0;
      const statusDesc = exitCode === 0 ? "Accepted" : "Runtime Error";

      setResult({
        stdout,
        stderr,
        compile_output: compileOutput,
        status: { id: exitCode === 0 ? 3 : 11, description: statusDesc },
        time: run.cpu_time != null ? String(run.cpu_time) : null,
        memory: run.memory ?? null,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown network error";
      setNetworkError(msg);
      setResult({
        stdout: "",
        stderr: `Network error: ${msg}\n\nPlease check your internet connection or try again.`,
        compile_output: "",
        status: { id: -1, description: "Network Error" },
        time: null,
        memory: null,
      });
    } finally {
      setLoading(false);
    }
  }, [code, language]);

  // Download code
  const downloadCode = () => {
    const lang = LANGUAGES.find((l) => l.id === language)!;
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `main.${lang.ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy code
  const copyCode = () => {
    navigator.clipboard.writeText(code).catch(() => {});
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#1e1e1e",
        fontFamily: "'General Sans', system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ── Top bar ── */}
      <header
        style={{
          background: "#252526",
          borderBottom: "1px solid #333",
          padding: "0 1rem",
          height: "52px",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexShrink: 0,
        }}
      >
        {/* Back button */}
        <button
          type="button"
          onClick={onBack}
          style={{
            background: "none",
            border: "1px solid #444",
            borderRadius: "6px",
            color: "#858585",
            cursor: "pointer",
            padding: "0.3rem 0.6rem",
            fontSize: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            transition: "all 0.2s ease",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#d4d4d4";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#666";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#858585";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#444";
          }}
        >
          <ArrowLeft size={13} />
          Back
        </button>

        {/* Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "5px",
              background: "linear-gradient(135deg, #2dd4bf, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "11px" }}>⌨</span>
          </div>
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, #2dd4bf, #3b82f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            GrasX Compiler
          </span>
        </div>

        {/* Language selector — centered */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <LanguageSelector value={language} onChange={handleLanguageChange} />
        </div>

        {/* Action buttons */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          {/* Copy */}
          <button
            type="button"
            onClick={copyCode}
            title="Copy code"
            style={{
              background: "none",
              border: "1px solid #444",
              borderRadius: "6px",
              color: "#858585",
              cursor: "pointer",
              padding: "0.3rem 0.5rem",
              display: "flex",
              alignItems: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#d4d4d4";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#858585";
            }}
          >
            <Copy size={13} />
          </button>

          {/* Download */}
          <button
            type="button"
            onClick={downloadCode}
            title="Download code"
            style={{
              background: "none",
              border: "1px solid #444",
              borderRadius: "6px",
              color: "#858585",
              cursor: "pointer",
              padding: "0.3rem 0.5rem",
              display: "flex",
              alignItems: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#d4d4d4";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#858585";
            }}
          >
            <Download size={13} />
          </button>

          {/* Clear */}
          <button
            type="button"
            onClick={() => {
              setCode("");
              textareaRef.current?.focus();
            }}
            title="Clear editor"
            style={{
              background: "none",
              border: "1px solid #444",
              borderRadius: "6px",
              color: "#858585",
              cursor: "pointer",
              padding: "0.3rem 0.5rem",
              display: "flex",
              alignItems: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#858585";
            }}
          >
            <Trash2 size={13} />
          </button>

          {/* Run Code */}
          <button
            type="button"
            onClick={runCode}
            disabled={loading || !code.trim()}
            style={{
              background: loading
                ? "#1a3d2d"
                : "linear-gradient(135deg, #16a34a, #22c55e)",
              border: "none",
              borderRadius: "7px",
              color: "#ffffff",
              cursor: loading || !code.trim() ? "not-allowed" : "pointer",
              padding: "0.4rem 1rem",
              fontSize: "0.8rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              transition: "all 0.2s ease",
              boxShadow: loading ? "none" : "0 0 16px rgba(34,197,94,0.35)",
              opacity: !code.trim() ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading && code.trim()) {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1.04)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 24px rgba(34,197,94,0.5)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 16px rgba(34,197,94,0.35)";
            }}
          >
            {loading ? (
              <Loader2
                size={13}
                style={{ animation: "spin 1s linear infinite" }}
              />
            ) : (
              <Play size={13} />
            )}
            {loading ? "Running..." : "Run Code"}
          </button>
        </div>
      </header>

      {/* Network error banner */}
      {networkError && (
        <div
          style={{
            background: "#3d1515",
            borderBottom: "1px solid #5c2020",
            padding: "0.5rem 1rem",
            color: "#f87171",
            fontSize: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          ⚠ API Error: {networkError.slice(0, 120)}
        </div>
      )}

      {/* ── Split screen ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        {/* ── Editor panel (left 60%) ── */}
        <div
          style={{
            flex: "0 0 60%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minWidth: 0,
          }}
        >
          {/* Editor toolbar */}
          <div
            style={{
              background: "#252526",
              borderBottom: "1px solid #333",
              padding: "0.5rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                color: "#2dd4bf",
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
              }}
            >
              main.{LANGUAGES.find((l) => l.id === language)?.ext}
            </span>
            <span
              style={{
                width: "1px",
                height: "12px",
                background: "#444",
              }}
            />
            <span style={{ fontSize: "0.7rem", color: "#555" }}>
              {code.split("\n").length} lines · {code.length} chars
            </span>
          </div>

          {/* Editor area: line numbers + textarea */}
          <div
            style={{
              flex: 1,
              display: "flex",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Line numbers */}
            <div
              ref={lineNumRef}
              style={{ overflowY: "hidden", flexShrink: 0 }}
            >
              <LineNumbers code={code} />
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onScroll={syncScroll}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              style={{
                flex: 1,
                background: "#1e1e1e",
                color: "#d4d4d4",
                border: "none",
                outline: "none",
                resize: "none",
                padding: "1rem",
                fontFamily:
                  "'JetBrains Mono', 'Geist Mono', 'Courier New', monospace",
                fontSize: "0.875rem",
                lineHeight: "1.5rem",
                overflowY: "auto",
                overflowX: "auto",
                whiteSpace: "pre",
                tabSize: 2,
                caretColor: "#2dd4bf",
              }}
            />
          </div>

          {/* Status bar */}
          <div
            style={{
              background: "linear-gradient(90deg, #2dd4bf22, #3b82f622)",
              borderTop: "1px solid #333",
              padding: "0.25rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: "0.65rem", color: "#555" }}>
              {LANGUAGES.find((l) => l.id === language)?.label}
            </span>
            <span style={{ fontSize: "0.65rem", color: "#555" }}>UTF-8</span>
            <span style={{ fontSize: "0.65rem", color: "#555" }}>
              Tab: 2 spaces
            </span>
          </div>
        </div>

        {/* ── Output panel (right 40%) ── */}
        <OutputPanel
          result={result}
          loading={loading}
          onClear={() => setResult(null)}
        />
      </div>

      {/* Spin animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 640px) {
          .compiler-split { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
}
