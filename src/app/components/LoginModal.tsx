import { useEffect, useState } from "react";
import {
  ArrowLeft, CheckCircle2, KeyRound, Lock, Mail, MessageSquare,
  Phone, ShieldAlert, Sparkles, User, X
} from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  dark: boolean;
  onAuthSuccess: (user: any, token: string) => void;
  initialMode?: "login" | "signup";
}

type View = "login" | "signup" | "forgot" | "reset";
type RecoveryMethod = "email" | "sms";

export function LoginModal({ isOpen, onClose, dark, onAuthSuccess, initialMode = "login" }: LoginModalProps) {
  const [view, setView] = useState<View>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [method, setMethod] = useState<RecoveryMethod>("email");
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [requestId, setRequestId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setView(initialMode);
    setError("");
    setNotice("");
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const goTo = (next: View) => {
    setView(next);
    setError("");
    setNotice("");
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (view === "signup" && !name)) {
      return setError("Please fill in all required fields");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return setError("Please enter a valid email address");
    }
    if (password.length < 6) return setError("Password must be at least 6 characters long");

    setLoading(true);
    try {
      const isLogin = view === "login";
      const response = await fetch(isLogin ? "/api/auth/login" : "/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isLogin ? { email, password } : { name, email, phone, password })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Something went wrong. Please try again.");

      setSuccess(true);
      setTimeout(() => {
        onAuthSuccess(data.user, data.token);
        setSuccess(false);
        setName(""); setEmail(""); setPhone(""); setPassword("");
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const requestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!identifier.trim()) return setError(method === "email" ? "Enter your email address" : "Enter your mobile number");

    setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, identifier })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Unable to send the verification code");
      setRequestId(data.requestId);
      setNotice(data.message);
      setView("reset");
    } catch (err: any) {
      setError(err.message || "Unable to send the verification code");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(code)) return setError("Enter the 6-digit verification code");
    if (password.length < 6) return setError("Password must be at least 6 characters long");
    if (password !== confirmPassword) return setError("Passwords do not match");

    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, code, password })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Unable to reset password");
      setPassword(""); setConfirmPassword(""); setCode("");
      setView("login");
      setNotice(data.message);
    } catch (err: any) {
      setError(err.message || "Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full pl-10 pr-4 py-3 rounded-2xl text-[13px] border outline-none transition-all ${
    dark
      ? "bg-white/[.04] border-white/[.08] text-white placeholder:text-slate-600 focus:border-primary/50 focus:bg-white/[.08] focus:ring-1 focus:ring-primary/20"
      : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary/40 focus:bg-white focus:ring-1 focus:ring-primary/10 shadow-inner"
  }`;
  const muted = dark ? "text-slate-400" : "text-slate-500";
  const isAuthView = view === "login" || view === "signup";

  const title = success ? "Welcome!" : view === "login" ? "Welcome Back" : view === "signup" ? "Create Account" : view === "forgot" ? "Reset your password" : "Check your messages";
  const subtitle = success ? "Authenticating session..." : view === "login" ? "Sign in to unlock all premium AI tools & tests" : view === "signup" ? "Join CareerForge AI and forge your career path" : view === "forgot" ? "Choose where you want to receive your verification code" : `Enter the code sent by ${method === "sms" ? "SMS" : "email"}`;

  const field = (icon: React.ReactNode, type: string, placeholder: string, value: string, setter: (value: string) => void, props: Record<string, any> = {}) => (
    <div className="relative">
      <span className="absolute left-3 top-3.5 text-slate-500">{icon}</span>
      <input type={type} placeholder={placeholder} value={value} onChange={e => setter(e.target.value)} className={inputClass} {...props} />
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-md" />
      <div className={`relative w-full max-w-[420px] rounded-3xl border overflow-hidden shadow-2xl animate-[heroFloat_0.5s_ease-out] ${dark ? "bg-[#0a101f]/95 border-white/[.08] shadow-black/80" : "bg-white/95 border-slate-200/80 shadow-slate-300/40"}`}>
        <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full blur-[80px] opacity-20 bg-primary pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 rounded-full blur-[80px] opacity-20 bg-accent pointer-events-none" />
        <button onClick={onClose} aria-label="Close" className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center ${dark ? "hover:bg-white/10 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}><X size={16} /></button>

        <div className="p-8">
          <div className="text-center mb-6">
            <span className="inline-flex w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-accent items-center justify-center shadow-lg shadow-primary/30 mb-4"><Sparkles size={18} className="text-white" /></span>
            <h3 className={`text-xl font-black ${dark ? "text-white" : "text-slate-900"}`}>{title}</h3>
            <p className={`text-[12px] mt-1.5 ${muted}`}>{subtitle}</p>
          </div>

          {success ? (
            <div className="py-10 text-center flex flex-col items-center"><CheckCircle2 size={48} className="text-emerald-500 mb-3" /><p className="text-sm font-bold text-emerald-500">Successfully authenticated!</p></div>
          ) : (
            <>
              {error && <div className="flex items-center gap-2 p-3 mb-4 rounded-2xl border bg-rose-500/10 border-rose-500/20 text-rose-500 text-[12px] font-semibold"><ShieldAlert size={14} className="shrink-0" /><span>{error}</span></div>}
              {notice && <div className="flex items-center gap-2 p-3 mb-4 rounded-2xl border bg-emerald-500/10 border-emerald-500/20 text-emerald-500 text-[12px] font-semibold"><CheckCircle2 size={14} className="shrink-0" /><span>{notice}</span></div>}

              {isAuthView && (
                <form onSubmit={handleAuth} className="space-y-4">
                  {view === "signup" && field(<User size={15} />, "text", "Full Name", name, setName, { required: true })}
                  {field(<Mail size={15} />, "email", "Email Address", email, setEmail, { required: true })}
                  {view === "signup" && field(<Phone size={15} />, "tel", "Mobile Number (for SMS recovery)", phone, setPhone, { inputMode: "tel" })}
                  {field(<Lock size={15} />, "password", "Password", password, setPassword, { required: true })}
                  {view === "login" && <div className="-mt-1 text-right"><button type="button" onClick={() => { setIdentifier(email); goTo("forgot"); }} className="text-[12px] font-bold text-primary hover:underline">Forgot password?</button></div>}
                  <SubmitButton loading={loading} label={view === "login" ? "Log In" : "Create Free Account"} />
                  <p className={`text-center text-[12px] mt-4 ${muted}`}>
                    {view === "login" ? "New to CareerForge AI?" : "Already have an account?"}{" "}
                    <button type="button" onClick={() => goTo(view === "login" ? "signup" : "login")} className="font-bold text-primary hover:underline">{view === "login" ? "Sign up free" : "Log in"}</button>
                  </p>
                </form>
              )}

              {view === "forgot" && (
                <form onSubmit={requestReset} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {(["email", "sms"] as RecoveryMethod[]).map(item => (
                      <button key={item} type="button" onClick={() => { setMethod(item); setIdentifier(item === "email" ? email : phone); setError(""); }} className={`p-3 rounded-2xl border text-left transition-all ${method === item ? "border-primary bg-primary/10 text-primary" : dark ? "border-white/10 text-slate-400 hover:border-white/20" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                        {item === "email" ? <Mail size={18} /> : <MessageSquare size={18} />}
                        <span className="block text-[12px] font-bold mt-2">{item === "email" ? "Email" : "SMS"}</span>
                      </button>
                    ))}
                  </div>
                  {method === "email" ? field(<Mail size={15} />, "email", "Registered email address", identifier, setIdentifier, { required: true }) : field(<Phone size={15} />, "tel", "Registered mobile number", identifier, setIdentifier, { required: true, inputMode: "tel" })}
                  <SubmitButton loading={loading} label="Send verification code" />
                  <BackButton onClick={() => goTo("login")} />
                </form>
              )}

              {view === "reset" && (
                <form onSubmit={resetPassword} className="space-y-4">
                  {field(<KeyRound size={15} />, "text", "6-digit verification code", code, setCode, { required: true, inputMode: "numeric", maxLength: 6 })}
                  {field(<Lock size={15} />, "password", "New password", password, setPassword, { required: true })}
                  {field(<Lock size={15} />, "password", "Confirm new password", confirmPassword, setConfirmPassword, { required: true })}
                  <SubmitButton loading={loading} label="Reset password" />
                  <BackButton onClick={() => goTo("forgot")} label="Request a new code" />
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return <button type="submit" disabled={loading} className="w-full py-3.5 rounded-2xl text-white text-[13px] font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 disabled:opacity-60 transition-all flex items-center justify-center gap-2">{loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}{loading ? "Please wait..." : label}</button>;
}

function BackButton({ onClick, label = "Back to login" }: { onClick: () => void; label?: string }) {
  return <button type="button" onClick={onClick} className="w-full flex items-center justify-center gap-1.5 text-[12px] font-bold text-primary hover:underline"><ArrowLeft size={13} />{label}</button>;
}
