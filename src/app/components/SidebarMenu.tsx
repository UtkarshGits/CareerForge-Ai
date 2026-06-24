import { Home, BookOpen, Route, Trophy, Lock, Shield } from "lucide-react";

interface SidebarMenuProps {
  activeView: string;
  setActiveView: (view: string) => void;
  dark: boolean;
  isAuthenticated: boolean;
}

export function SidebarMenu({ activeView, setActiveView, dark, isAuthenticated }: SidebarMenuProps) {
  
  const menuItems = [
    { id: "hero", label: "Dashboard", Icon: Home, guestAccessible: true },
    { id: "interview-prep", label: "Interview Prep", Icon: Trophy, guestAccessible: false },
    { id: "testing", label: "Testing Center", Icon: Shield, guestAccessible: false },
    { id: "roadmaps", label: "Career Roadmaps", Icon: Route, guestAccessible: false },
    { id: "coding", label: "Coding Practice", Icon: BookOpen, guestAccessible: false }
  ];

  const sidebarClass = `h-[calc(100dvh-4rem)] fixed top-16 left-0 w-64 border-r transition-all duration-300 hidden md:flex flex-col z-35 ${
    dark 
      ? "bg-[#070c1a] border-white/[.07]" 
      : "bg-white border-slate-200/80"
  }`;

  const linkClass = (id: string, active: boolean) => {
    const base = "w-full flex items-center justify-between px-4 py-3 rounded-2xl text-[13px] font-semibold transition-all duration-150 relative group";
    if (active) {
      return `${base} text-white bg-primary shadow-lg shadow-primary/25`;
    }
    return `${base} ${
      dark 
        ? "text-slate-400 hover:text-white hover:bg-white/[.04]" 
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
    }`;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={sidebarClass}>
        <div className="p-4 flex-1 flex flex-col justify-between py-6">
          <div className="space-y-6">
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-widest px-3 mb-3 ${dark ? "text-slate-600" : "text-slate-400"}`}>
                Menu
              </p>
              <nav className="space-y-1">
                {menuItems.map(item => {
                  const active = activeView === item.id;
                  const Icon = item.Icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      className={linkClass(item.id, active)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} className={active ? "text-white" : "text-primary"} />
                        <span>{item.label}</span>
                      </div>
                      
                      {/* Lock/Unlock / Trial indicator */}
                      {!item.guestAccessible && !isAuthenticated ? (
                        <span className={`text-[10px] p-1 rounded-lg ${dark ? "bg-white/[.04]" : "bg-slate-100"} text-amber-500`}>
                          <Lock size={11} />
                        </span>
                      ) : item.badge ? (
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                          active 
                            ? "bg-white text-primary" 
                            : !isAuthenticated 
                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        }`}>
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Trial Info Info-box */}
            {!isAuthenticated && (
              <div className={`p-4 rounded-3xl border text-center relative overflow-hidden ${
                dark 
                  ? "bg-gradient-to-br from-[#2563eb]/5 to-transparent border-white/[.06]" 
                  : "bg-gradient-to-br from-blue-50/50 to-transparent border-slate-200/80"
              }`}>
                <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-primary/5 blur-xl pointer-events-none" />
                <p className={`text-[11px] font-bold ${dark ? "text-white" : "text-slate-800"}`}>Guest Mode</p>
                <p className={`text-[10px] mt-1 mb-3 leading-relaxed ${dark ? "text-slate-500" : "text-slate-400"}`}>
                  Unlock roadmaps, coding practice & live tests.
                </p>
                <button
                  onClick={() => {
                    const signupBtn = document.getElementById("nav-signup-btn");
                    if (signupBtn) signupBtn.click();
                  }}
                  className="w-full py-2 rounded-xl text-[11px] font-extrabold text-white bg-primary hover:bg-primary/95 transition-all shadow-md shadow-primary/25"
                >
                  Sign Up Free
                </button>
              </div>
            )}
          </div>

          {/* Footer inside sidebar */}
          <div className="px-3">
            <div className={`flex items-center gap-2 text-[10px] ${dark ? "text-slate-600" : "text-slate-400"}`}>
              <span className={`w-1.5 h-1.5 rounded-full bg-primary`} />
              <span>CareerForge AI v1.0</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Horizontal Menu */}
      <div className={`md:hidden fixed top-16 inset-x-0 h-12 border-b flex items-center px-3 sm:px-4 overflow-x-auto overscroll-x-contain scrollbar-none z-40 transition-colors ${
        dark ? "bg-[#070c1a] border-white/[.07]" : "bg-white border-slate-200/80"
      }`}>
        <div className="flex min-w-max gap-2 pr-3">
          {menuItems.map(item => {
            const active = activeView === item.id;
            const Icon = item.Icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-colors ${
                  active
                    ? "bg-primary text-white"
                    : dark
                      ? "text-slate-400 hover:text-white hover:bg-white/[.05]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon size={12} className={active ? "text-white" : "text-primary"} />
                <span>{item.label}</span>
                {!item.guestAccessible && !isAuthenticated && <Lock size={9} className="text-amber-500" />}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
