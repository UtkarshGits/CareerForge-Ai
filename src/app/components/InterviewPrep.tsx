import { useState } from "react";
import { Code2, Brain, Users, Layers, Play, FileText, TrendingUp, Flame } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";
import { SectionHead, Grad } from "./SectionHead";

interface InterviewPrepProps { dark: boolean }

const MODULES = [
  { id: "dsa",    Icon: Code2,    title: "DSA Practice",     desc: "Arrays · Trees · Graphs · DP",   pct: 72, solved: 324, total: 450, g: "from-[#2563eb] to-[#06b6d4]", c: "#2563eb" },
  { id: "apt",    Icon: Brain,    title: "Aptitude Tests",   desc: "Quant · Reasoning · Verbal",      pct: 58, solved: 174, total: 300, g: "from-[#8b5cf6] to-[#ec4899]", c: "#8b5cf6" },
  { id: "hr",     Icon: Users,    title: "HR Questions",     desc: "Behavioral · Situational",        pct: 85, solved: 102, total: 120, g: "from-[#10b981] to-[#06b6d4]", c: "#10b981" },
  { id: "sys",    Icon: Layers,   title: "System Design",    desc: "HLD · LLD · Architecture",        pct: 41, solved: 33,  total: 80,  g: "from-[#f59e0b] to-[#ef4444]", c: "#f59e0b" },
  { id: "mock",   Icon: Play,     title: "Mock Interviews",  desc: "AI-powered live sessions",        pct: 30, solved: 6,   total: 20,  g: "from-[#ec4899] to-[#8b5cf6]", c: "#ec4899" },
  { id: "resume", Icon: FileText, title: "Resume Builder",   desc: "ATS · AI Review · Templates",    pct: 100,solved: 1,   total: 1,   g: "from-[#06b6d4] to-[#2563eb]", c: "#06b6d4" },
];

const DSA_TOPICS = [
  { topic: "Arrays",         solved: 45, total: 60 },
  { topic: "Linked List",    solved: 28, total: 35 },
  { topic: "Trees",          solved: 31, total: 50 },
  { topic: "DP",             solved: 18, total: 45 },
  { topic: "Graphs",         solved: 12, total: 40 },
  { topic: "Sorting",        solved: 20, total: 25 },
  { topic: "Stack/Queue",    solved: 34, total: 40 },
  { topic: "Bit Manip.",     solved: 10, total: 20 },
];

const WEEK = [
  { d: "Mon", n: 8 },{ d: "Tue", n: 12 },{ d: "Wed", n: 6 },
  { d: "Thu", n: 15 },{ d: "Fri", n: 10 },{ d: "Sat", n: 18 },{ d: "Sun", n: 9 },
];

const RADAR_DATA = [
  { sub: "DSA", A: 72 },{ sub: "Aptitude", A: 58 },{ sub: "HR", A: 85 },
  { sub: "System Design", A: 41 },{ sub: "Mock", A: 30 },{ sub: "Resume", A: 100 },
];

const TT_STYLE = (dark: boolean) => ({
  background: dark ? "#0e1528" : "#fff",
  border: dark ? "1px solid rgba(255,255,255,.08)" : "1px solid #e2e8f0",
  borderRadius: "10px",
  fontSize: "12px",
  color: dark ? "#e8edf8" : "#0b0f1a",
  boxShadow: dark ? "0 8px 32px rgba(0,0,0,.5)" : "0 4px 16px rgba(0,0,0,.1)",
});

export function InterviewPrep({ dark }: InterviewPrepProps) {
  const [active, setActive] = useState("dsa");
  const mod = MODULES.find(m => m.id === active)!;

  return (
    <section id="interview-prep" className={`py-14 sm:py-20 lg:py-28 ${dark ? "bg-[#0a101f]" : "bg-muted/40"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <SectionHead
          dark={dark}
          tag="Interview Prep Platform"
          tagColor="text-[#8b5cf6]"
          tagBg={dark ? "bg-[#8b5cf6]/10 border-[#8b5cf6]/25" : "bg-[#8b5cf6]/8 border-[#8b5cf6]/20"}
          title={<>Master Every <Grad from="#8b5cf6" to="#ec4899">Interview Round</Grad></>}
          sub="Structured modules for DSA, aptitude, HR, and system design. Real-time analytics to track your growth."
        />

        <div className="grid lg:grid-cols-[300px_1fr] gap-8">

          {/* ── Module selector ── */}
          <aside className="space-y-2.5">
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${dark ? "text-slate-600" : "text-slate-400"}`}>Modules</p>
            {MODULES.map(m => {
              const on = m.id === active;
              const { Icon } = m;
              return (
                <button
                  key={m.id}
                  onClick={() => setActive(m.id)}
                  className={`w-full flex items-center gap-3.5 p-4 rounded-2xl border text-left transition-all duration-150 ${
                    on
                      ? dark
                        ? "bg-[#0e1528] border-primary/30 shadow-lg shadow-primary/10"
                        : "bg-white border-primary/20 shadow-lg shadow-primary/10"
                      : dark
                        ? "bg-transparent border-white/[.06] hover:bg-[#0e1528]/60"
                        : "bg-white/60 border-transparent hover:bg-white hover:border-slate-200"
                  }`}
                >
                  <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.g} flex items-center justify-center shrink-0 shadow-md`}>
                    <Icon size={17} className="text-white" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] font-bold ${dark ? "text-white" : "text-foreground"}`}>{m.title}</p>
                    <p className={`text-[11px] truncate ${dark ? "text-slate-500" : "text-slate-400"}`}>{m.desc}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[12px] font-black" style={{ color: m.c }}>{m.pct}%</p>
                    <div className={`w-14 h-1.5 rounded-full mt-1 ${dark ? "bg-white/[.06]" : "bg-slate-100"}`}>
                      <div className="h-full rounded-full" style={{ width: `${m.pct}%`, background: m.c }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </aside>

          {/* ── Dashboard ── */}
          <div className="space-y-5">

            {/* KPI row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { l: "Day Streak",   v: "14", suf: "🔥", s: "Personal best!", color: "text-orange-400" },
                { l: "Total Solved", v: "639",suf: "",    s: "All time",       color: "text-primary" },
                { l: "This Week",    v: "78", suf: "",    s: "+12 vs last week",color: "text-emerald-500" },
                { l: "AI Score",     v: "87", suf: "/100",s: "+5 pts gained",  color: "text-accent" },
              ].map(k => (
                <div key={k.l} className={`rounded-2xl p-4 border ${dark ? "bg-[#0e1528] border-white/[.07]" : "bg-white border-slate-200/80"}`}>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${dark ? "text-slate-600" : "text-slate-400"}`}>{k.l}</p>
                  <p className={`text-[22px] font-black ${dark ? "text-white" : "text-foreground"}`}>{k.v}<span className={`text-base ${k.color}`}>{k.suf}</span></p>
                  <p className={`text-[11px] mt-0.5 font-medium ${k.color}`}>{k.s}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-5">

              {/* DSA topic bars */}
              <div className={`rounded-3xl border p-5 ${dark ? "bg-[#0e1528] border-white/[.07]" : "bg-white border-slate-200/80"}`}>
                <p className={`text-[12px] font-bold uppercase tracking-wider mb-5 ${dark ? "text-slate-500" : "text-slate-400"}`}>DSA Topic Breakdown</p>
                <div className="space-y-3.5">
                  {DSA_TOPICS.map(t => (
                    <div key={t.topic}>
                      <div className="flex justify-between mb-1.5">
                        <span className={`text-[12px] font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>{t.topic}</span>
                        <span className={`text-[11px] font-semibold ${dark ? "text-slate-400" : "text-slate-500"}`}>{t.solved}/{t.total}</span>
                      </div>
                      <div className={`h-[6px] rounded-full ${dark ? "bg-white/[.05]" : "bg-slate-100"}`}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${(t.solved / t.total) * 100}%`,
                            background: `hsl(${220 + (t.solved / t.total) * 120}, 80%, 60%)`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radar chart */}
              <div className={`rounded-3xl border p-5 ${dark ? "bg-[#0e1528] border-white/[.07]" : "bg-white border-slate-200/80"}`}>
                <p className={`text-[12px] font-bold uppercase tracking-wider mb-3 ${dark ? "text-slate-500" : "text-slate-400"}`}>Skill Radar</p>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={RADAR_DATA}>
                    <PolarGrid stroke={dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.06)"} />
                    <PolarAngleAxis dataKey="sub" tick={{ fontSize: 10, fill: dark ? "#7c8dab" : "#94a3b8" }} />
                    <Radar dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.18} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weekly activity chart */}
            <div className={`rounded-3xl border p-5 ${dark ? "bg-[#0e1528] border-white/[.07]" : "bg-white border-slate-200/80"}`}>
              <div className="flex items-center justify-between mb-5">
                <p className={`text-[12px] font-bold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Weekly Activity — Problems Solved</p>
                <span className={`text-[11px] font-semibold text-emerald-500`}>78 this week 📈</span>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={WEEK} barSize={28}>
                  <XAxis dataKey="d" tick={{ fontSize: 11, fill: dark ? "#475569" : "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={TT_STYLE(dark)} cursor={{ fill: dark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.03)" }} />
                  <Bar dataKey="n" name="Solved" radius={[6,6,0,0]}
                    fill="url(#barGrad)"
                  />
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Next recommended */}
            <div className={`rounded-3xl border p-5 flex items-center justify-between gap-4 ${
              dark ? "bg-gradient-to-r from-primary/10 via-[#0e1528] to-accent/10 border-primary/20"
                   : "bg-gradient-to-r from-blue-50 via-white to-purple-50 border-blue-100"
            }`}>
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${dark ? "text-slate-600" : "text-slate-400"}`}>AI Recommended · Next Up</p>
                <h4 className={`text-base font-bold mb-1 ${dark ? "text-white" : "text-foreground"}`}>Two Pointers Technique</h4>
                <p className={`text-[12px] ${dark ? "text-slate-500" : "text-slate-400"}`}>12 problems · ~2 hrs · Medium difficulty · Google favorite</p>
              </div>
              <button className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-[12px] font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/30">
                <Play size={13} /> Start Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
