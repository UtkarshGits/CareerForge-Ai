import { useState } from "react";
import { Zap, Menu, X, Sun, Moon, LogOut, User, Flame } from "lucide-react";

interface NavbarProps {
  dark: boolean;
  setDark: (v: boolean) => void;
  active: string;
  user: any;
  onLogout: () => void;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
}

const links = [
  { id: "hero",           label: "Home" },
  { id: "interview-prep", label: "Interview Prep" },
  { id: "testing",        label: "Testing Center" },
  { id: "roadmaps",       label: "Roadmaps" },
  { id: "coding",         label: "Coding Practice" },
];

export function Navbar({ 
  dark, 
  setDark, 
  active,
  user,
  onLogout,
  onOpenLogin,
  onOpenSignup
}: NavbarProps) {
  const [open,     setOpen]     = useState(false);

  const go = (id: string) => {
    setOpen(false);
    // Find the sidebar button or trigger click to change view, or we can let click trigger standard view change
    const menuBtn = document.querySelector(`button[onClick*="${id}"]`) as HTMLButtonElement;
    if (menuBtn) {
      menuBtn.click();
    } else {
      // Direct navigation callback fallback by dispatching a custom event
      const event = new CustomEvent("changeView", { detail: id });
      window.dispatchEvent(event);
    }
  };

  const pill =
    "relative px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150";
  const active_c  = "text-primary bg-primary/10";
  const default_c = dark
    ? "text-slate-400 hover:text-white hover:bg-white/[.07]"
    : "text-slate-600 hover:text-foreground hover:bg-muted";

  const navbarSurface = dark
    ? "bg-[#070c1a] border-b border-white/[.08] shadow-lg shadow-black/25"
    : "bg-white border-b border-slate-200 shadow-sm shadow-slate-200/70";

  // Get user initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className={`fixed inset-x-0 top-0 z-50 ${navbarSurface}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <button onClick={() => go("hero")} className="flex items-center gap-2.5 shrink-0 group bg-transparent border-none cursor-pointer">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/40 group-hover:shadow-primary/60 transition-shadow">
            <Zap size={15} className="text-white" />
          </span>
          <span className={`font-black text-[15px] tracking-tight ${dark ? "text-white" : "text-foreground"}`}>
            CareerForge <span className="text-primary">AI</span>
          </span>
        </button>

        {/* Desktop Links (Hidden, handled by Sidebar on sub-pages, but shown for visual parity) */}
        <ul className="hidden lg:flex items-center gap-0.5">
          {links.map(l => (
            <li key={l.id}>
              <button
                onClick={() => go(l.id)}
                className={`${pill} ${active === l.id ? active_c : default_c} bg-transparent border-none cursor-pointer`}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Light/Dark Toggle */}
          <button
            onClick={() => setDark(!dark)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors border-none bg-transparent cursor-pointer ${
              dark ? "text-slate-400 hover:text-white hover:bg-white/[.07]" : "text-slate-500 hover:text-foreground hover:bg-muted"
            }`}
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-white/10">
              {/* Daily Streak Indicator */}
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold ${
                dark ? "bg-orange-500/10 text-orange-400" : "bg-orange-50 text-orange-600"
              }`}>
                <Flame size={12} className="fill-orange-500 text-orange-500 animate-pulse" />
                <span>14 days</span>
              </div>

              {/* User Avatar & Info */}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-white bg-gradient-to-br from-primary to-accent shadow-md shadow-primary/20`}>
                  {getInitials(user.name)}
                </div>
                <div className="text-left">
                  <p className={`text-[11px] font-bold leading-none ${dark ? "text-white" : "text-foreground"}`}>
                    {user.name}
                  </p>
                  <p className={`text-[9px] mt-0.5 text-emerald-500 font-semibold`}>
                    Premium Active
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                title="Log Out"
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors border-none bg-transparent cursor-pointer ${
                  dark ? "text-slate-400 hover:text-white hover:bg-white/[.07]" : "text-slate-500 hover:text-foreground hover:bg-muted"
                }`}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={onOpenLogin}
                className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors border-none bg-transparent cursor-pointer ${
                  dark ? "text-slate-300 hover:text-white hover:bg-white/[.07]" : "text-slate-600 hover:text-foreground hover:bg-muted"
                }`}
              >
                Log in
              </button>

              <button 
                id="nav-signup-btn"
                onClick={onOpenSignup}
                className="px-4 py-2 rounded-xl text-[13px] font-semibold text-white bg-primary hover:bg-primary/90 shadow-md shadow-primary/30 hover:shadow-primary/50 transition-all duration-150 active:scale-95 border-none cursor-pointer"
              >
                Sign up free →
              </button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <button onClick={() => setDark(!dark)} className={`w-8 h-8 rounded-lg flex items-center justify-center border-none bg-transparent cursor-pointer ${dark ? "text-slate-400" : "text-slate-500"}`}>
            {dark ? <Sun size={15}/> : <Moon size={15}/>}
          </button>
          <button onClick={() => setOpen(!open)} className={`w-8 h-8 rounded-lg flex items-center justify-center border-none bg-transparent cursor-pointer ${dark ? "text-slate-300" : "text-slate-700"}`}>
            {open ? <X size={18}/> : <Menu size={18}/>}
          </button>
        </div>
      </nav>

      {/* Mobile drop-down Menu */}
      {open && (
        <div className={`lg:hidden border-t shadow-xl ${
          dark ? "bg-[#070c1a] border-white/[.07]" : "bg-white border-black/[.07]"
        }`}>
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {links.map(l => (
              <button key={l.id} onClick={() => go(l.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors border-none bg-transparent cursor-pointer ${
                  active === l.id ? active_c : default_c
                }`}
              >
                {l.label}
              </button>
            ))}
            
            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2">
              {user ? (
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-white bg-gradient-to-br from-primary to-accent">
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <p className={`text-[12px] font-bold ${dark ? "text-white" : "text-slate-900"}`}>{user.name}</p>
                      <p className="text-[10px] text-emerald-500 font-semibold">Premium Active</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setOpen(false); onLogout(); }} 
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold bg-rose-500/10 text-rose-500 flex items-center gap-1 border-none cursor-pointer`}
                  >
                    <LogOut size={12} /> Log Out
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => { setOpen(false); onOpenLogin(); }} 
                    className={`w-full py-2.5 rounded-xl text-[13px] font-medium border transition-colors bg-transparent cursor-pointer ${
                      dark ? "border-white/10 text-slate-300" : "border-slate-200 text-slate-700"
                    }`}
                  >
                    Log in
                  </button>
                  
                  <button 
                    onClick={() => { setOpen(false); onOpenSignup(); }} 
                    className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white bg-primary shadow-md shadow-primary/30 border-none cursor-pointer"
                  >
                    Sign up free →
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
