import { useState } from "react";
import { 
  Trophy, BookOpen, Flame, Award, ChevronRight, CheckCircle2, 
  TrendingUp, Activity, Play, Star, Calendar, Sparkles 
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from "recharts";

interface UserDashboardProps {
  dark: boolean;
  user: {
    name: string;
    email: string;
  };
}

const WEEKLY_HOURS = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 4.0 },
  { day: "Wed", hours: 3.5 },
  { day: "Thu", hours: 5.5 },
  { day: "Fri", hours: 6.0 },
  { day: "Sat", hours: 4.5 },
  { day: "Sun", hours: 3.0 },
];

export function UserDashboard({ dark, user }: UserDashboardProps) {
  // Support interactive progress stages: 30, 50, 85, 95
  const [progress, setProgress] = useState<number>(30);

  const getMilestoneMessage = (pct: number) => {
    switch (pct) {
      case 30:
        return {
          title: "🎉 Well done! You completed 30% of your journey!",
          sub: "Great start! You've grasped basic DSA arrays, strings, and SQL filters. Keep building the momentum to achieve your goals!",
          color: "border-sky-500/30 bg-sky-500/10 text-sky-400 dark:text-sky-300",
          badge: "Novice Climber"
        };
      case 50:
        return {
          title: "🚀 Awesome! You are halfway there! 50% of your journey completed.",
          sub: "Halfway mark achieved! You are doing amazing. Dynamic programming basics, SQL joins, and resume formatting are mastered. Keep pushing forward!",
          color: "border-amber-500/30 bg-amber-500/10 text-amber-500 dark:text-amber-400",
          badge: "Rising Scholar"
        };
      case 85:
        return {
          title: "🔥 Incredible! You have completed 85% of your journey.",
          sub: "Superb work! You are now placement-ready. Graph structures, subqueries, and mock interviews are fully checked. Top MNCs are waiting for you!",
          color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
          badge: "Placement Ready"
        };
      case 95:
        return {
          title: "🌟 Outstanding! 95% completed! You are in the elite tier.",
          sub: "Phenomenal! You are in the top 1% of candidates. Hard tree problems, system design, and advanced SQL transactions are done. You are ready to crack FAANG!",
          color: "border-purple-500/30 bg-purple-500/10 text-purple-500 dark:text-purple-400",
          badge: "Elite Master"
        };
      default:
        return {
          title: "📊 Keep moving forward!",
          sub: "Continue completing classes, mock tests, and coding challenges to track your placement success.",
          color: "border-primary/20 bg-primary/10 text-primary",
          badge: "Aspiring Candidate"
        };
    }
  };

  const currentMilestone = getMilestoneMessage(progress);

  const SUBJECTS = [
    { name: "DSA Practice", solved: "148 / 200", status: "In Progress", pct: progress >= 85 ? 88 : progress >= 50 ? 55 : 32, color: "from-blue-500 to-cyan-500" },
    { name: "SQL & Databases", solved: "45 / 50", status: progress >= 50 ? "Mastered" : "In Progress", pct: progress >= 95 ? 95 : progress >= 85 ? 85 : progress >= 50 ? 65 : 40, color: "from-purple-500 to-indigo-500" },
    { name: "Core CS (OS/CN)", solved: "18 / 20", status: progress >= 85 ? "Mastered" : "In Progress", pct: progress >= 85 ? 90 : progress >= 50 ? 50 : 25, color: "from-emerald-500 to-teal-500" },
    { name: "Mock Interviews", solved: "8 / 10", status: progress >= 95 ? "Mastered" : "In Progress", pct: progress >= 95 ? 95 : progress >= 85 ? 80 : progress >= 50 ? 45 : 20, color: "from-orange-500 to-red-500" }
  ];

  const chartTheme = (dark: boolean) => ({
    background: dark ? "#0e1528" : "#fff",
    border: dark ? "1px solid rgba(255,255,255,.08)" : "1px solid #e2e8f0",
    borderRadius: "14px",
    fontSize: "11px",
    color: dark ? "#e8edf8" : "#0b0f1a",
  });

  return (
    <section className={`py-12 px-4 sm:px-6 max-w-7xl mx-auto w-full ${dark ? "bg-[#070c1a]" : "bg-[#fcfdff]"}`}>
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 ${
            dark ? "bg-primary/10 text-primary border border-primary/20" : "bg-primary/5 text-primary border border-primary/10"
          }`}>
            <Sparkles size={11} /> Student Dashboard
          </span>
          <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>
            Welcome back, <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{user.name}</span>! 👋
          </h2>
          <p className={`text-[12px] mt-1 ${dark ? "text-slate-400" : "text-slate-500"}`}>
            Here is your preparation score and study path progress for the placement season.
          </p>
        </div>

        {/* Calendar / Streak */}
        <div className="flex gap-2.5">
          <div className={`px-4 py-3 rounded-2xl border flex items-center gap-3 ${
            dark ? "bg-[#0e1528] border-white/[.07]" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <Flame size={18} className="text-orange-500 animate-pulse fill-orange-500" />
            <div>
              <p className={`text-[13px] font-black leading-none ${dark ? "text-white" : "text-slate-800"}`}>14 Days</p>
              <p className={`text-[9px] mt-1 font-bold ${dark ? "text-slate-500" : "text-slate-400"}`}>Daily Streak</p>
            </div>
          </div>
          <div className={`px-4 py-3 rounded-2xl border flex items-center gap-3 ${
            dark ? "bg-[#0e1528] border-white/[.07]" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <Calendar size={18} className="text-primary" />
            <div>
              <p className={`text-[13px] font-black leading-none ${dark ? "text-white" : "text-slate-800"}`}>2026 Season</p>
              <p className={`text-[9px] mt-1 font-bold ${dark ? "text-slate-500" : "text-slate-400"}`}>Active Campaign</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── MILESTONE BANNER SECTION ── */}
      <div className={`rounded-3xl border p-6 mb-8 relative overflow-hidden transition-all duration-300 ${
        dark ? "bg-gradient-to-br from-[#0e1528] to-[#070c1a] border-white/[.07]" : "bg-gradient-to-br from-white to-slate-50/50 border-slate-200/80 shadow-md shadow-slate-100/50"
      }`}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="grid lg:grid-cols-[1fr_260px] gap-8 items-center">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider ${currentMilestone.color} border`}>
                🎯 {currentMilestone.badge}
              </span>
              <span className={`text-[11px] font-bold ${dark ? "text-slate-500" : "text-slate-400"}`}>
                Interactive Progress Stage
              </span>
            </div>

            <h3 className={`text-lg sm:text-xl font-black leading-snug mb-2 ${dark ? "text-white" : "text-slate-900"}`}>
              {currentMilestone.title}
            </h3>
            <p className={`text-[12.5px] leading-relaxed mb-6 max-w-2xl ${dark ? "text-slate-400" : "text-slate-600"}`}>
              {currentMilestone.sub}
            </p>

            {/* Giant Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-extrabold ${dark ? "text-slate-500" : "text-slate-400"}`}>OVERALL PREPARATION PROGRESS</span>
                <span className="text-[14px] font-black text-primary">{progress}% Completed</span>
              </div>
              <div className={`h-3.5 rounded-full p-0.5 overflow-hidden ${dark ? "bg-white/[.04] border border-white/[.06]" : "bg-slate-100 border border-slate-200/50"}`}>
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-purple-500 transition-all duration-700 relative"
                  style={{ width: `${progress}%` }}
                >
                  <span className="absolute inset-y-0 right-2 w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Progress Toggles */}
          <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
            dark ? "bg-white/[.02] border-white/[.06]" : "bg-slate-50 border-slate-200/60"
          }`}>
            <p className={`text-[10px] font-bold uppercase tracking-wider text-center mb-3 ${dark ? "text-slate-500" : "text-slate-400"}`}>
              Simulate Progress Stages
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[30, 50, 85, 95].map(stage => (
                <button
                  key={stage}
                  onClick={() => setProgress(stage)}
                  className={`py-2 rounded-xl text-[12px] font-extrabold transition-all ${
                    progress === stage
                      ? "bg-primary text-white shadow-md shadow-primary/25 scale-105"
                      : dark
                        ? "bg-white/[.04] text-slate-400 hover:bg-white/[.08] hover:text-white"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {stage}%
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── CHARTS & ANALYTICS GRID ── */}
      <div className="grid lg:grid-cols-[1fr_400px] gap-8 mb-8">
        {/* Weekly Study Hours (Bar Chart) */}
        <div className={`rounded-3xl border p-6 ${
          dark ? "bg-[#0e1528] border-white/[.07]" : "bg-white border-slate-200/80 shadow-sm"
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${dark ? "text-slate-500" : "text-slate-400"}`}>Improvement Analytics</p>
              <h4 className={`text-base font-bold ${dark ? "text-white" : "text-slate-800"}`}>Weekly Study Hours</h4>
            </div>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold ${
              dark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"
            }`}>
              <TrendingUp size={12} />
              <span>+18% Effort</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={WEEKLY_HOURS}>
              <XAxis dataKey="day" stroke={dark ? "#475569" : "#94a3b8"} fontSize={10} axisLine={false} tickLine={false} />
              <YAxis stroke={dark ? "#475569" : "#94a3b8"} fontSize={10} axisLine={false} tickLine={false} width={25} />
              <Tooltip contentStyle={chartTheme(dark)} cursor={{ fill: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }} />
              <Bar dataKey="hours" radius={[8, 8, 0, 0]}>
                {WEEKLY_HOURS.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === 4 ? "url(#primaryG)" : dark ? "rgba(37,99,235,0.4)" : "rgba(37,99,235,0.2)"} 
                  />
                ))}
              </Bar>
              <defs>
                <linearGradient id="primaryG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={1} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.8} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Topics Improvement Checklist */}
        <div className={`rounded-3xl border p-6 flex flex-col justify-between ${
          dark ? "bg-[#0e1528] border-white/[.07]" : "bg-white border-slate-200/80 shadow-sm"
        }`}>
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>Subject Progress</p>
            <h4 className={`text-base font-bold mb-5 ${dark ? "text-white" : "text-slate-800"}`}>Topic Breakdown</h4>
          </div>

          <div className="space-y-4">
            {SUBJECTS.map(sub => (
              <div key={sub.name} className="group">
                <div className="flex justify-between mb-1.5">
                  <span className={`text-[12.5px] font-semibold ${dark ? "text-slate-300" : "text-slate-700"}`}>
                    {sub.name}
                  </span>
                  <span className={`text-[11.5px] font-extrabold ${dark ? "text-slate-400" : "text-slate-500"}`}>
                    {sub.solved} ({sub.pct}%)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`flex-1 h-2 rounded-full ${dark ? "bg-white/[.04]" : "bg-slate-100"}`}>
                    <div className={`h-full rounded-full bg-gradient-to-r ${sub.color} transition-all duration-500`} style={{ width: `${sub.pct}%` }} />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    sub.status === "Mastered"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : dark ? "bg-white/[.04] text-slate-500" : "bg-slate-100 text-slate-400"
                  }`}>
                    {sub.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RECOMMENDED CLASSES & QUICK LINKS ── */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Recommended Placement Classes */}
        <div className={`rounded-3xl border p-6 ${
          dark ? "bg-[#0e1528]/80 border-white/[.07]" : "bg-white border-slate-200/80 shadow-sm"
        }`}>
          <h4 className={`text-base font-bold mb-4 flex items-center gap-2 ${dark ? "text-white" : "text-slate-900"}`}>
            <BookOpen size={16} className="text-primary" /> Recommended Training Classes
          </h4>
          <div className="space-y-3">
            {[
              { t: "Dynamic Programming: Knapsack Algorithms", duration: "1h 45m", tutor: "Striver DSA", tag: "Hard" },
              { t: "SQL Subqueries & Window Functions Mastery", duration: "1h 20m", tutor: "DB Engine Class", tag: "Medium" },
              { t: "FAANG Resume Writing & STAR Story Prep", duration: "45m", tutor: "HR Coach Amit", tag: "Easy" }
            ].map((cl, i) => (
              <div key={i} className={`p-3.5 rounded-2xl border flex items-center justify-between gap-4 transition-all hover:translate-x-1 ${
                dark ? "bg-[#070c1a]/60 border-white/[.05] hover:border-white/10" : "bg-slate-50 border-slate-100 hover:bg-slate-100/50"
              }`}>
                <div>
                  <p className={`text-[12.5px] font-bold line-clamp-1 ${dark ? "text-slate-200" : "text-slate-800"}`}>{cl.t}</p>
                  <p className={`text-[10px] mt-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                    {cl.tutor} · {cl.duration}
                  </p>
                </div>
                <button className="w-8 h-8 rounded-xl bg-primary hover:bg-primary/95 flex items-center justify-center shrink-0 shadow-sm text-white">
                  <Play size={12} fill="white" className="ml-0.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Placement Links */}
        <div className={`rounded-3xl border p-6 ${
          dark ? "bg-[#0e1528]/80 border-white/[.07]" : "bg-white border-slate-200/80 shadow-sm"
        }`}>
          <h4 className={`text-base font-bold mb-4 flex items-center gap-2 ${dark ? "text-white" : "text-slate-900"}`}>
            <Trophy size={16} className="text-accent" /> Placement Operations &amp; Prep
          </h4>
          <div className="space-y-3">
            {[
              { label: "Search & Compare Delhi NCR Colleges", desc: "Compare fees, courses, placements", action: "Search", link: "college-finder" },
              { label: "Review Resume ATS Format Checklist", desc: "Validate STAR formatting criteria", action: "Resume", link: "ai-chat" },
              { label: "Solve DSA Coding Problems & Tests", desc: "Access 10,000+ custom challenges", action: "Solve", link: "coding" },
            ].map((lnk, i) => (
              <div key={i} className={`p-3.5 rounded-2xl border flex items-center justify-between gap-4 transition-all hover:translate-x-1 ${
                dark ? "bg-[#070c1a]/60 border-white/[.05] hover:border-white/10" : "bg-slate-50 border-slate-100 hover:bg-slate-100/50"
              }`}>
                <div>
                  <p className={`text-[12.5px] font-bold ${dark ? "text-slate-200" : "text-slate-800"}`}>{lnk.label}</p>
                  <p className={`text-[10px] mt-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>{lnk.desc}</p>
                </div>
                <button
                  onClick={() => {
                    const event = new CustomEvent("changeView", { detail: lnk.link });
                    window.dispatchEvent(event);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-0.5 shrink-0 ${
                    dark ? "bg-white/[.05] text-slate-300 hover:bg-white/[.10]" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"
                  }`}
                >
                  Go <ChevronRight size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
