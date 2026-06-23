import { useEffect, useRef, useState } from "react";
import { Users, Building2, BookOpen, TrendingUp, ArrowRight } from "lucide-react";

interface StatsProps { dark: boolean }

function useCounter(target: number, dur = 2400, started = false) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setN(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, dur, started]);
  return n;
}

function formatN(n: number, target: number): string {
  if (target >= 100000) return `${Math.floor(n / 1000)}K`;
  if (target >= 1000)   return `${Math.floor(n / 1000)}K+`;
  return `${n}`;
}

const STATS = [
  { icon: Users,     target: 100000, suffix: "+", label: "Students Enrolled",       sub: "Across India & globally",         g: "from-[#2563eb] to-[#06b6d4]" },
  { icon: Building2, target: 500,    suffix: "+", label: "Partner Colleges",        sub: "NITs, IITs, IIITs, Private & more", g: "from-[#8b5cf6] to-[#ec4899]" },
  { icon: BookOpen,  target: 10000,  suffix: "+", label: "Interview Questions",     sub: "DSA · Aptitude · HR · System Design",g: "from-[#06b6d4] to-[#2563eb]" },
  { icon: TrendingUp,target: 95,     suffix: "%", label: "Placement Success Rate",  sub: "Students placed in top companies", g: "from-[#10b981] to-[#06b6d4]" },
];

function StatTile({ s, dark, started }: { s: typeof STATS[0]; dark: boolean; started: boolean }) {
  const { icon: Icon, target, suffix, label, sub, g } = s;
  const n = useCounter(target, 2400, started);
  return (
    <div className={`group rounded-3xl border p-7 text-center transition-all duration-300 hover:-translate-y-1 ${
      dark
        ? "bg-[#0e1528] border-white/[.07] hover:border-primary/25 hover:shadow-xl hover:shadow-black/50"
        : "bg-white border-slate-200/80 hover:shadow-2xl hover:shadow-slate-200/60"
    }`}>
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${g} flex items-center justify-center mx-auto mb-5 shadow-xl`}>
        <Icon size={26} className="text-white" />
      </div>
      <p className={`text-[3rem] sm:text-[3.5rem] font-black leading-none mb-2 bg-gradient-to-r ${g} bg-clip-text text-transparent`}>
        {formatN(n, target)}{suffix}
      </p>
      <p className={`text-[15px] font-bold mb-1.5 ${dark ? "text-white" : "text-foreground"}`}>{label}</p>
      <p className={`text-[12px] ${dark ? "text-slate-600" : "text-slate-400"}`}>{sub}</p>
    </div>
  );
}

export function Stats({ dark }: StatsProps) {
  const ref = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStarted(true); },
      { threshold: 0.25 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const bg = dark
    ? "bg-gradient-to-br from-[#070c1a] via-[#0a101f] to-[#070c1a]"
    : "bg-gradient-to-br from-[#f5f7ff] via-white to-[#f0ebff]";

  return (
    <section ref={ref} id="stats" className={`py-16 sm:py-20 lg:py-28 relative overflow-hidden ${bg}`}>
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-0 right-1/4 w-96 h-96 rounded-full blur-[120px] ${dark ? "opacity-[.10]" : "opacity-25"}`}
          style={{ background: "radial-gradient(circle,#2563eb,transparent 70%)" }} />
        <div className={`absolute bottom-0 left-1/4 w-80 h-80 rounded-full blur-[100px] ${dark ? "opacity-[.08]" : "opacity-20"}`}
          style={{ background: "radial-gradient(circle,#8b5cf6,transparent 70%)" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className={`text-[clamp(2rem,9vw,2.4rem)] sm:text-[3rem] lg:text-[3.5rem] font-black tracking-[-0.03em] leading-[1.1] mb-5 ${dark ? "text-white" : "text-foreground"}`}>
            Numbers That{" "}
            <span style={{ background: "linear-gradient(135deg,#2563eb,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Speak
            </span>
          </h2>
          <p className={`text-[17px] max-w-lg mx-auto ${dark ? "text-slate-400" : "text-slate-600"}`}>
            Trusted by students across India to find the right college and land dream jobs.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10 sm:mb-16">
          {STATS.map(s => <StatTile key={s.label} s={s} dark={dark} started={started} />)}
        </div>

        {/* CTA banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#8b5cf6] p-10 sm:p-14 text-center">
          {/* Noise overlay */}
          <div className="absolute inset-0 opacity-[.04]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }}
          />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 text-white text-[11px] font-bold mb-5 border border-white/20">
              🚀 Join 100,000+ Students
            </span>
            <h3 className="text-[2rem] sm:text-[2.5rem] font-black text-white mb-4 tracking-tight">
              Ready to Transform<br className="hidden sm:block" /> Your Career?
            </h3>
            <p className="text-white/75 text-[15px] mb-8 max-w-lg mx-auto">
              Get AI-powered college recommendations, interview prep, and career guidance — completely free to start.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#2563eb] text-[14px] font-black rounded-2xl hover:bg-white/95 transition-colors shadow-2xl hover:-translate-y-0.5">
                Get Started Free <ArrowRight size={16} />
              </button>
              <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/25 text-white text-[14px] font-bold rounded-2xl hover:bg-white/20 transition-colors hover:-translate-y-0.5">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
