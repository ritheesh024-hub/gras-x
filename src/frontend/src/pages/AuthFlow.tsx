import { useRef, useState } from "react";
import { LoginPage } from "./LoginPage";
import { SignupPage } from "./SignupPage";

type AuthView = "login" | "signup";

interface AuthFlowProps {
  onAuthenticated: () => void;
}

export function AuthFlow({ onAuthenticated }: AuthFlowProps) {
  const [currentView, setCurrentView] = useState<AuthView>("login");
  const [animClass, setAnimClass] = useState<string>("");
  const isAnimating = useRef(false);

  const switchTo = (view: AuthView) => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const enterClass = view === "signup" ? "slide-in-right" : "slide-in-left";

    setCurrentView(view);
    setAnimClass(enterClass);

    setTimeout(() => {
      setAnimClass("");
      isAnimating.current = false;
    }, 500);
  };

  const handleAuth = () => {
    localStorage.setItem("ppp_auth", "true");
    onAuthenticated();
  };

  return (
    <div className="overflow-hidden">
      <div className={animClass || ""}>
        {currentView === "login" ? (
          <LoginPage
            onLogin={handleAuth}
            onGoToSignup={() => switchTo("signup")}
          />
        ) : (
          <SignupPage
            onSignup={handleAuth}
            onGoToLogin={() => switchTo("login")}
          />
        )}
      </div>
    </div>
  );
}
