import { Layout } from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";
import { useActor } from "@/hooks/useActor";
import { AIAssistant } from "@/pages/AIAssistant";
import { AuthFlow } from "@/pages/AuthFlow";
import { CodeEditor } from "@/pages/CodeEditor";
import { Dashboard } from "@/pages/Dashboard";
import { InternshipTracker } from "@/pages/InternshipTracker";
import { LandingPage } from "@/pages/LandingPage";
import { PublicCompiler } from "@/pages/PublicCompiler";
import { QuizArena } from "@/pages/QuizArena";
import { ResumeBuilder } from "@/pages/ResumeBuilder";
import { SkillGapAnalyzer } from "@/pages/SkillGapAnalyzer";
import { SkillRoadmap } from "@/pages/SkillRoadmap";
import { StudentDetails } from "@/pages/StudentDetails";
import { useEffect, useState } from "react";

export type Route =
  | "/"
  | "/roadmap"
  | "/practice"
  | "/gap-analyzer"
  | "/resume"
  | "/internships"
  | "/ai-assistant"
  | "/student"
  | "/code-editor"
  | "/landing"
  | "/compiler";

function getInitialRoute(): Route {
  const hash = window.location.hash.replace("#", "") as Route;
  const validRoutes: Route[] = [
    "/",
    "/roadmap",
    "/practice",
    "/gap-analyzer",
    "/resume",
    "/internships",
    "/ai-assistant",
    "/student",
    "/code-editor",
    "/landing",
    "/compiler",
  ];
  return validRoutes.includes(hash) ? hash : "/";
}

function AppInit({ children }: { children: React.ReactNode }) {
  const { actor, isFetching } = useActor();

  useEffect(() => {
    if (actor && !isFetching) {
      actor.initialize().catch(console.error);
    }
  }, [actor, isFetching]);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return <>{children}</>;
}

function PageView({
  route,
  navigate,
}: { route: Route; navigate: (r: Route) => void }) {
  switch (route) {
    case "/":
      return <Dashboard navigate={navigate} />;
    case "/roadmap":
      return <SkillRoadmap />;
    case "/practice":
      return <QuizArena />;
    case "/gap-analyzer":
      return <SkillGapAnalyzer />;
    case "/resume":
      return <ResumeBuilder />;
    case "/internships":
      return <InternshipTracker />;
    case "/ai-assistant":
      return <AIAssistant />;
    case "/student":
      return <StudentDetails />;
    case "/code-editor":
      return <CodeEditor />;
    case "/compiler":
      return <PublicCompiler onBack={() => navigate("/")} />;
    default:
      return <Dashboard navigate={navigate} />;
  }
}

// Parse URL hash fragment into key=value map
function parseHashParams(hash: string): Record<string, string> {
  return hash
    .replace(/^#/, "")
    .split("&")
    .reduce(
      (acc, pair) => {
        const [k, v] = pair.split("=");
        if (k) acc[decodeURIComponent(k)] = decodeURIComponent(v || "");
        return acc;
      },
      {} as Record<string, string>,
    );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("ppp_auth") === "true",
  );
  const [appVisible, setAppVisible] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<Route>(getInitialRoute);
  // showAuth: true = render AuthFlow over landing, false = render landing
  const [showAuth, setShowAuth] = useState(false);

  const navigate = (route: Route) => {
    setCurrentRoute(route);
    window.location.hash = route;
    window.scrollTo(0, 0);
  };

  // Handle Google OAuth redirect callback (implicit flow returns token in hash)
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("access_token=")) return;

    const params = parseHashParams(hash);
    const accessToken = params.access_token;
    const returnedState = params.state;
    const savedState = localStorage.getItem("google_oauth_state");

    // Clear the token from the URL immediately
    window.history.replaceState(null, "", window.location.pathname);

    if (!accessToken) return;

    // Optionally validate state to prevent CSRF
    if (returnedState && savedState && returnedState !== savedState) {
      console.warn("Google OAuth state mismatch");
      return;
    }
    localStorage.removeItem("google_oauth_state");

    // Fetch user profile from Google
    fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
    )
      .then((r) => r.json())
      .then((userInfo: { name?: string; email?: string; picture?: string }) => {
        const existingUser = JSON.parse(
          localStorage.getItem("ppp_user") || "{}",
        );
        localStorage.setItem(
          "ppp_user",
          JSON.stringify({
            ...existingUser,
            fullName: userInfo.name || existingUser.fullName || "",
            email: userInfo.email || existingUser.email || "",
            googleAvatar: userInfo.picture || "",
          }),
        );
        localStorage.setItem("ppp_auth", "true");
        setIsAuthenticated(true);
        setShowAuth(false);
      })
      .catch(() => {
        // Even if profile fetch fails, token was valid — log in
        localStorage.setItem("ppp_auth", "true");
        setIsAuthenticated(true);
        setShowAuth(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      // Small delay then fade in the main app
      const t = setTimeout(() => setAppVisible(true), 30);
      return () => clearTimeout(t);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") as Route;
      const validRoutes: Route[] = [
        "/",
        "/roadmap",
        "/practice",
        "/gap-analyzer",
        "/resume",
        "/internships",
        "/ai-assistant",
        "/student",
        "/code-editor",
        "/landing",
        "/compiler",
      ];
      if (validRoutes.includes(hash)) {
        setCurrentRoute(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("ppp_auth");
    localStorage.removeItem("ppp_remember");
    setIsAuthenticated(false);
    setAppVisible(false);
    setShowAuth(false);
    setCurrentRoute("/");
    window.location.hash = "";
  };

  if (!isAuthenticated) {
    // Public compiler route — no auth needed
    if (currentRoute === "/compiler") {
      return (
        <>
          <PublicCompiler onBack={() => navigate("/landing")} />
          <Toaster richColors position="top-right" />
        </>
      );
    }

    // Show auth flow when user clicked "Get Started" / "Create Account"
    if (showAuth) {
      return (
        <>
          <AuthFlow onAuthenticated={handleAuthenticated} />
          <Toaster richColors position="top-right" />
        </>
      );
    }

    // Default: show landing page
    return (
      <>
        <LandingPage
          onGetStarted={() => setShowAuth(true)}
          onGoToCompiler={() => navigate("/compiler")}
        />
        <Toaster richColors position="top-right" />
      </>
    );
  }

  return (
    <AppInit>
      <div
        className={`transition-opacity duration-500 ${appVisible ? "opacity-100" : "opacity-0"}`}
      >
        <Layout
          currentRoute={currentRoute}
          navigate={navigate}
          onLogout={handleLogout}
        >
          <PageView route={currentRoute} navigate={navigate} />
        </Layout>
      </div>
      <Toaster richColors position="top-right" />
    </AppInit>
  );
}
