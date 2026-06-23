import { Suspense, lazy, useState, useEffect } from "react";
import { Navbar }        from "./components/Navbar";
import { Hero }          from "./components/Hero";
import { Testimonials }  from "./components/Testimonials";
import { Stats }         from "./components/Stats";
import { Footer }        from "./components/Footer";
import { AIAssistant }   from "./components/AIAssistant";
import { SidebarMenu }   from "./components/SidebarMenu";
import { LoginModal }    from "./components/LoginModal";
import { Lock, Sparkles, ShieldCheck } from "lucide-react";

const CollegeFinder = lazy(() => import("./components/CollegeFinder").then(module => ({ default: module.CollegeFinder })));
const InterviewPrep = lazy(() => import("./components/InterviewPrep").then(module => ({ default: module.InterviewPrep })));
const Roadmaps = lazy(() => import("./components/Roadmaps").then(module => ({ default: module.Roadmaps })));
const CodingPractice = lazy(() => import("./components/CodingPractice").then(module => ({ default: module.CodingPractice })));
const AIChat = lazy(() => import("./components/AIChat").then(module => ({ default: module.AIChat })));
const UserDashboard = lazy(() => import("./components/UserDashboard").then(module => ({ default: module.UserDashboard })));
const Testing = lazy(() => import("./components/Testing").then(module => ({ default: module.Testing })));

const GUEST_SEARCH_LIMIT = 3;

function getStoredValue(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStoredValue(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Unable to save ${key}:`, error);
  }
}

function removeStoredValue(key: string) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Unable to remove ${key}:`, error);
  }
}

function getGuestSearchCount() {
  const parsed = Number.parseInt(getStoredValue("guestSearchCount") || "0", 10);
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(GUEST_SEARCH_LIMIT, Math.max(0, parsed));
}

export default function App() {
  const [dark, setDark] = useState(false);
  const [activeView, setActiveView] = useState("hero");
  
  // Auth states
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(() => getStoredValue("token"));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");

  // Guest trial search state
  const [trialSearchesLeft, setTrialSearchesLeft] = useState(GUEST_SEARCH_LIMIT);

  // Sync dark class on <html>
  useEffect(() => {
    dark
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  }, [dark]);

  // Load trial search count for guests and listen to view change events
  useEffect(() => {
    setTrialSearchesLeft(Math.max(0, GUEST_SEARCH_LIMIT - getGuestSearchCount()));

    const handleViewChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setActiveView(customEvent.detail);
    };
    window.addEventListener("changeView", handleViewChange);
    return () => window.removeEventListener("changeView", handleViewChange);
  }, []);

  // Check auth session on load
  useEffect(() => {
    const checkSession = async () => {
      const storedToken = getStoredValue("token");
      if (!storedToken) return;

      try {
        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setToken(storedToken);
        } else {
          // Token expired or invalid
          removeStoredValue("token");
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.error("Session restoration error:", err);
      }
    };
    checkSession();
  }, []);

  const handleAuthSuccess = (authUser: any, authToken: string) => {
    setUser(authUser);
    setToken(authToken);
    setStoredValue("token", authToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    removeStoredValue("token");
    setActiveView("hero");
  };

  const openAuth = (mode: "login" | "signup") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleCollegeSearchIncrement = async (currentCount: number): Promise<boolean> => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch("/api/college/search", {
        method: "POST",
        headers,
        body: JSON.stringify({ guestCount: currentCount }),
      });

      const data = await response.json().catch(() => ({ limitReached: true }));
      
      if (!response.ok) {
        return false;
      }

      if (!token) {
        // Update local count for guests
        const nextCount = Math.min(GUEST_SEARCH_LIMIT, Math.max(0, currentCount) + 1);
        setStoredValue("guestSearchCount", nextCount.toString());
        setTrialSearchesLeft(Math.max(0, GUEST_SEARCH_LIMIT - nextCount));
      }

      return !data.limitReached;
    } catch (error) {
      console.error("Error updating search count:", error);
      return false;
    }
  };

  return (
    <div className={`min-h-screen min-w-0 overflow-x-clip flex flex-col justify-between ${dark ? "bg-[#070c1a]" : "bg-background"}`}>
      {/* Global keyframes */}
      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-10px) rotate(0.5deg); }
          66%       { transform: translateY(-6px) rotate(-0.5deg); }
        }
        .scrollbar-none { scrollbar-width: none; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Navbar with Auth hooks */}
      <Navbar 
        dark={dark} 
        setDark={setDark} 
        active={activeView}
        user={user}
        onLogout={handleLogout}
        onOpenLogin={() => openAuth("login")}
        onOpenSignup={() => openAuth("signup")}
      />

      <div className="flex min-w-0 flex-1">
        {/* Sidebar Menu */}
        <SidebarMenu 
          activeView={activeView}
          setActiveView={setActiveView}
          dark={dark}
          isAuthenticated={!!user}
          trialSearchesLeft={trialSearchesLeft}
        />

        {/* Main Section view wrapper */}
        <main className="min-w-0 flex-1 pt-28 md:pt-16 md:pl-64 min-h-screen flex flex-col justify-between">
          <Suspense fallback={<ViewLoading dark={dark} />}>
          <div className="flex-1">
            {activeView === "hero" && (
              user ? (
                <UserDashboard dark={dark} user={user} />
              ) : (
                <>
                  <Hero
                    dark={dark}
                    onColleges={() => setActiveView("college-finder")}
                    onInterview={() => setActiveView("interview-prep")}
                  />
                  <Stats dark={dark} />
                  <Testimonials dark={dark} />
                </>
              )
            )}

            {activeView === "college-finder" && (
              <CollegeFinder 
                dark={dark} 
                isAuthenticated={!!user}
                trialSearchesLeft={trialSearchesLeft}
                onSearchIncrement={handleCollegeSearchIncrement}
                onOpenAuth={() => openAuth("signup")}
              />
            )}

            {activeView === "interview-prep" && (
              user ? (
                <InterviewPrep dark={dark} />
              ) : (
                <LockedView dark={dark} title="AI Interview Preparation" onOpenAuth={() => openAuth("signup")} />
              )
            )}

            {activeView === "testing" && (
              user ? (
                <Testing dark={dark} />
              ) : (
                <LockedView dark={dark} title="AI Testing Center" onOpenAuth={() => openAuth("signup")} />
              )
            )}

            {activeView === "roadmaps" && (
              user ? (
                <Roadmaps dark={dark} />
              ) : (
                <LockedView dark={dark} title="Career Roadmaps" onOpenAuth={() => openAuth("signup")} />
              )
            )}

            {activeView === "coding" && (
              user ? (
                <CodingPractice dark={dark} user={user} token={token} onUpdateUser={setUser} />
              ) : (
                <LockedView dark={dark} title="Coding Practice" onOpenAuth={() => openAuth("signup")} />
              )
            )}

            {activeView === "ai-chat" && (
              <AIChat dark={dark} />
            )}
          </div>
          </Suspense>
          {activeView !== "ai-chat" && <Footer dark={dark} />}
        </main>
      </div>

      <AIAssistant dark={dark} />

      {/* Authentication Modal */}
      <LoginModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        dark={dark}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />
    </div>
  );
}

function ViewLoading({ dark }: { dark: boolean }) {
  return (
    <div className={`min-h-[60vh] flex items-center justify-center ${dark ? "bg-[#070c1a]" : "bg-white"}`}>
      <div className="flex items-center gap-3 text-primary text-[13px] font-bold">
        <span className="w-4 h-4 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        Loading workspace...
      </div>
    </div>
  );
}

// Sleek Locked Feature Component
function LockedView({ dark, title, onOpenAuth }: { dark: boolean; title: string; onOpenAuth: () => void }) {
  return (
    <section className={`py-16 sm:py-24 md:py-28 min-h-[70vh] flex items-center justify-center ${dark ? "bg-[#070c1a]" : "bg-white"}`}>
      <div className="max-w-md mx-auto px-6 text-center">
        <div className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center mb-6 border ${
          dark 
            ? "bg-amber-500/10 border-amber-500/20 text-amber-500" 
            : "bg-amber-50 border-amber-100 text-amber-500 shadow-md shadow-amber-500/5"
        }`}>
          <Lock size={26} className="animate-pulse" />
        </div>
        
        <h2 className={`text-2xl font-black mb-3 tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>
          Unlock {title}
        </h2>
        
        <p className={`text-[13px] leading-relaxed mb-8 ${dark ? "text-slate-400" : "text-slate-600"}`}>
          This is a premium AI functionality. Sign up for a free CareerForge AI account to access live interviews, interactive assessments, complete syllabus roadmaps, and 10,000+ coding challenges.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onOpenAuth}
            className="px-6 py-3.5 rounded-2xl text-[13px] font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all duration-150 active:scale-95 flex items-center justify-center gap-2"
          >
            <Sparkles size={14} /> Join Free Now
          </button>
          <button
            onClick={onOpenAuth}
            className={`px-6 py-3.5 rounded-2xl text-[13px] font-bold border transition-colors ${
              dark 
                ? "border-white/10 text-slate-300 hover:bg-white/[.04]" 
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            Sign In
          </button>
        </div>
        
        <div className="mt-8 flex justify-center items-center gap-2 text-[10px] text-emerald-500 font-bold">
          <ShieldCheck size={12} />
          <span>Secured by CareerForge Identity</span>
        </div>
      </div>
    </section>
  );
}
