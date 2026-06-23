import { ArrowRight, Star, TrendingUp, Brain, GraduationCap, CheckCircle, Flame, Code2, Play } from "lucide-react";

interface HeroProps {
  dark: boolean;
  onColleges: () => void;
  onInterview: () => void;
}

const BADGES = [
  { icon: "🎓", text: "100K+ Students" },
  { icon: "🏆", text: "95% Placed" },
  { icon: "⚡", text: "AI Powered" },
];

export function Hero({ dark, onColleges, onInterview }: HeroProps) {
  const bg = dark
    ? "bg-[#070c1a]"
    : "bg-gradient-to-br from-[#f5f7ff] via-[#eef1fb] to-[#f0ebff]";

  return (
    <section id="hero" className={`relative min-h-[calc(100svh-7rem)] md:min-h-[calc(100svh-4rem)] flex flex-col justify-center overflow-hidden ${bg}`}>
      {/* Ambient blobs */}
      <Blobs dark={dark} />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${dark ? "rgba(255,255,255,.04)" : "rgba(37,99,235,.07)"} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16 lg:py-24 xl:py-28">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(380px,480px)] xl:grid-cols-[minmax(0,1fr)_minmax(420px,520px)] gap-10 xl:gap-16 items-center">

          {/* ── Left copy ── */}
          <div>
            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
              {BADGES.map(b => (
                <span key={b.text}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border ${
                    dark
                      ? "bg-white/[.06] border-white/[.10] text-slate-300"
                      : "bg-white border-slate-200 text-slate-600 shadow-sm"
                  }`}
                >
                  {b.icon} {b.text}
                </span>
              ))}
            </div>

            {/* Headline */}
            <h1 className={`text-[clamp(2.15rem,10vw,2.75rem)] sm:text-[3.5rem] lg:text-[3.45rem] xl:text-[4.25rem] font-black leading-[1.06] tracking-[-0.03em] mb-5 sm:mb-6 break-words ${dark ? "text-white" : "text-foreground"}`}>
              Find Your Perfect{" "}
              <GradientText from="#2563eb" to="#06b6d4">College</GradientText>
              {" "}&amp; Crack Your{" "}
              <GradientText from="#8b5cf6" to="#ec4899">Dream Job</GradientText>
              {" "}with AI
            </h1>

            <p className={`text-[15px] sm:text-lg leading-relaxed max-w-[520px] mb-8 sm:mb-10 ${dark ? "text-slate-400" : "text-slate-600"}`}>
              AI-powered college recommendations, interview preparation, coding practice, placement roadmaps, and career guidance — all in one platform built for Indian students.
            </p>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10 sm:mb-14">
              <button
                onClick={onColleges}
                className="group flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-white text-[15px] font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                <GraduationCap size={18} />
                Explore Colleges
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={onInterview}
                className={`flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-[15px] font-bold border transition-all duration-200 hover:-translate-y-0.5 ${
                  dark
                    ? "bg-white/[.06] border-white/[.12] text-white hover:bg-white/[.10]"
                    : "bg-white border-slate-200 text-slate-800 shadow-sm hover:shadow-md"
                }`}
              >
                <Play size={16} className="text-primary" />
                Start Interview Prep
              </button>
            </div>

            {/* Social proof row */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-5">
              <Avatars dark={dark} />
              <div>
                <Stars />
                <p className={`text-[12px] mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                  4.9 / 5 from 14,200+ reviews
                </p>
              </div>
            </div>
          </div>

          {/* ── Right: Live dashboard card ── */}
          <div className="hidden lg:block relative">
            <DashboardCard dark={dark} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── Sub-components ─────────── */

function GradientText({ from, to, children }: { from: string; to: string; children: React.ReactNode }) {
  return (
    <span style={{ background: `linear-gradient(135deg, ${from}, ${to})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
      {children}
    </span>
  );
}

function Blobs({ dark }: { dark: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className={`absolute -top-56 -right-56 w-[700px] h-[700px] rounded-full blur-[128px] ${dark ? "opacity-[.18]" : "opacity-30"}`}
        style={{ background: "radial-gradient(circle, #2563eb, transparent 70%)" }} />
      <div className={`absolute -bottom-56 -left-56 w-[600px] h-[600px] rounded-full blur-[120px] ${dark ? "opacity-[.12]" : "opacity-20"}`}
        style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)" }} />
      <div className={`absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full blur-[100px] ${dark ? "opacity-[.07]" : "opacity-15"}`}
        style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }} />
    </div>
  );
}

function Avatars({ dark }: { dark: boolean }) {
  const colors = ["from-blue-400 to-cyan-400", "from-purple-400 to-pink-400", "from-green-400 to-emerald-400", "from-orange-400 to-yellow-400", "from-rose-400 to-red-400"];
  const initials = ["RS", "PA", "MK", "SG", "AV"];
  return (
    <div className="flex -space-x-2.5">
      {initials.map((ini, i) => (
        <div key={i} className={`w-9 h-9 rounded-full border-2 ${dark ? "border-[#070c1a]" : "border-white"} bg-gradient-to-br ${colors[i]} flex items-center justify-center text-white text-[10px] font-bold shadow-sm`}>
          {ini}
        </div>
      ))}
    </div>
  );
}

function Stars() {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({length:5}).map((_,i) => <Star key={i} size={12} className="fill-amber-400 text-amber-400"/>)}
    </div>
  );
}

function DashboardCard({ dark }: { dark: boolean }) {
  const card = dark
    ? "bg-[#0e1528]/90 border-white/[.09] shadow-2xl shadow-black/70"
    : "bg-white/90 border-slate-200/80 shadow-2xl shadow-slate-300/50";

  return (
    <div className="relative">
      {/* Floating AI badge */}
      <FloatCard dark={dark} top="-top-5" left="-left-10" delay={0}>
        <Brain size={16} className="text-white" />
        <div>
          <p className={`text-[11px] font-bold ${dark ? "text-white" : "text-foreground"}`}>AI Match Found</p>
          <p className={`text-[10px] ${dark ? "text-slate-400" : "text-slate-500"}`}>IIT Delhi · 98% fit</p>
        </div>
      </FloatCard>

      <FloatCard dark={dark} bottom="-bottom-4" right="-right-8" delay={0.6}>
        <TrendingUp size={16} className="text-white" />
        <div>
          <p className={`text-[11px] font-bold ${dark ? "text-white" : "text-foreground"}`}>Interview Score</p>
          <p className={`text-[10px] text-emerald-500 font-semibold`}>+24% this week</p>
        </div>
      </FloatCard>

      {/* Main card */}
      <div className={`rounded-3xl border backdrop-blur-sm ${card} p-6`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className={`text-[10px] font-semibold uppercase tracking-widest mb-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>AI Dashboard</p>
            <h3 className={`text-base font-bold ${dark ? "text-white" : "text-foreground"}`}>Career Progress</h3>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
          </span>
        </div>

        {/* Progress modules */}
        <div className="space-y-4 mb-6">
          {[
            { label: "DSA Practice",    pct: 72, g: "from-[#2563eb] to-[#06b6d4]" },
            { label: "Aptitude Tests",  pct: 58, g: "from-[#8b5cf6] to-[#ec4899]" },
            { label: "System Design",   pct: 41, g: "from-[#10b981] to-[#06b6d4]" },
            { label: "Mock Interviews", pct: 85, g: "from-[#f59e0b] to-[#ef4444]" },
          ].map(m => (
            <div key={m.label}>
              <div className="flex justify-between mb-1.5">
                <span className={`text-[12px] font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>{m.label}</span>
                <span className={`text-[12px] font-bold ${dark ? "text-white" : "text-foreground"}`}>{m.pct}%</span>
              </div>
              <div className={`h-[7px] rounded-full ${dark ? "bg-white/[.06]" : "bg-slate-100"}`}>
                <div className={`h-full rounded-full bg-gradient-to-r ${m.g} transition-all duration-1000`} style={{ width: `${m.pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {[
            { v: "14 🔥", l: "Day Streak" },
            { v: "248",   l: "Solved" },
            { v: "#142",  l: "Rank" },
          ].map(s => (
            <div key={s.l} className={`rounded-2xl p-3 text-center ${dark ? "bg-white/[.04]" : "bg-muted"}`}>
              <p className={`text-base font-black ${dark ? "text-white" : "text-foreground"}`}>{s.v}</p>
              <p className={`text-[10px] mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* Recent */}
        <div className={`pt-4 border-t ${dark ? "border-white/[.06]" : "border-border"}`}>
          <p className={`text-[10px] font-semibold uppercase tracking-widest mb-3 ${dark ? "text-slate-600" : "text-slate-400"}`}>Recent Activity</p>
          {[
            "Solved: Two Sum (Easy)",
            "Mock Interview: HR Round ✅",
            "5 new college matches found",
          ].map(a => (
            <div key={a} className="flex items-center gap-2 mb-2 last:mb-0">
              <CheckCircle size={12} className="text-emerald-500 shrink-0" />
              <span className={`text-[12px] ${dark ? "text-slate-400" : "text-slate-600"}`}>{a}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FloatCard({ dark, children, top = "", left = "", bottom = "", right = "", delay }: {
  dark: boolean; children: React.ReactNode;
  top?: string; left?: string; bottom?: string; right?: string; delay: number;
}) {
  return (
    <div
      className={`absolute z-20 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border backdrop-blur-sm shadow-lg ${
        dark ? "bg-[#0e1528]/90 border-white/[.10]" : "bg-white/90 border-slate-200"
      } ${top} ${left} ${bottom} ${right}`}
      style={{ animation: `heroFloat ${3 + delay}s ease-in-out infinite`, animationDelay: `${delay}s` }}
    >
      <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
        {children instanceof Array ? children[0] : null}
      </span>
      {children instanceof Array ? children[1] : null}
    </div>
  );
}
