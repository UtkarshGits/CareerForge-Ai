import { Star, Quote } from "lucide-react";
import { SectionHead, Grad } from "./SectionHead";

interface TestimonialsProps { dark: boolean }

const STORIES = [
  {
    name: "Rahul Sharma",    role: "SDE @ Google",           college: "IIT Delhi, B.Tech CS 2024",
    avatar: "RS", g: "from-[#2563eb] to-[#06b6d4]", pkg: "₹45 LPA",
    tags: ["Google SDE", "₹45 LPA", "3 months"],
    text: "CareerForge AI's DSA module and mock interviews helped me crack Google in 3 months. The AI recommendations were exactly what I needed — it even predicted the question types I'd face.",
  },
  {
    name: "Priya Patel",     role: "Data Analyst @ Amazon",  college: "NIT Trichy, MCA 2024",
    avatar: "PP", g: "from-[#8b5cf6] to-[#ec4899]", pkg: "₹18 LPA",
    tags: ["Amazon", "₹18 LPA", "AI College Match"],
    text: "The AI College Finder recommended NIT Trichy when I was completely lost after Class 12. The placement data was spot-on — 95% placement rate, recruiters like Goldman Sachs. Now at Amazon earning ₹18 LPA!",
  },
  {
    name: "Arjun Mehta",     role: "Full Stack @ Flipkart",  college: "VIT Vellore, B.Tech 2023",
    avatar: "AM", g: "from-[#10b981] to-[#06b6d4]", pkg: "₹14 LPA",
    tags: ["Flipkart", "₹14 LPA", "Roadmap"],
    text: "Came from a diploma background and wasn't sure about prospects. The Full Stack roadmap and HR prep module gave me the confidence to crack Flipkart's 5-round technical process.",
  },
  {
    name: "Sneha Gupta",     role: "AI Engineer @ Microsoft",college: "BITS Pilani, B.E. CS 2024",
    avatar: "SG", g: "from-[#f59e0b] to-[#ef4444]", pkg: "₹38 LPA",
    tags: ["Microsoft", "₹38 LPA", "AI/ML Track"],
    text: "The AI/ML Engineer roadmap was extraordinarily detailed — better than any paid course I tried. I followed it step by step and landed at Microsoft Research. The system design module is world-class.",
  },
  {
    name: "Vikram Singh",    role: "SDE-2 @ Paytm",          college: "DTU Delhi, MCA 2023",
    avatar: "VS", g: "from-[#06b6d4] to-[#8b5cf6]", pkg: "₹22 LPA",
    tags: ["Paytm SDE-2", "₹22 LPA", "Streak Tracking"],
    text: "Used CareerForge for both choosing DTU (perfect for my budget!) and placement prep. The 14-day streak feature kept me motivated through 6 months of grueling preparation.",
  },
  {
    name: "Anjali Reddy",    role: "SDE @ Adobe",            college: "NIT Warangal, B.Tech 2024",
    avatar: "AR", g: "from-[#2563eb] to-[#8b5cf6]", pkg: "₹24 LPA",
    tags: ["Adobe", "₹24 LPA", "Resume AI"],
    text: "The AI resume reviewer gave me specific, actionable feedback that transformed my resume from 0 callbacks to 15+ interview calls in a single week. The AI assistant is like having a personal mentor 24/7.",
  },
];

export function Testimonials({ dark }: TestimonialsProps) {
  return (
    <section id="testimonials" className={`py-16 sm:py-20 lg:py-28 ${dark ? "bg-[#070c1a]" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHead
          dark={dark}
          tag="Success Stories"
          tagColor="text-amber-500"
          tagBg={dark ? "bg-amber-500/10 border-amber-500/25" : "bg-amber-500/8 border-amber-500/20"}
          title={<>Students Who <Grad from="#f59e0b" to="#ef4444">Made It</Grad></>}
          sub="Join 100,000+ students who transformed their careers with CareerForge AI. Real people, real results."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STORIES.map(s => (
            <article
              key={s.name}
              className={`group rounded-3xl border p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                dark
                  ? "bg-[#0e1528] border-white/[.07] hover:shadow-xl hover:shadow-black/50 hover:border-white/[.12]"
                  : "bg-white border-slate-200/80 hover:shadow-xl hover:shadow-slate-200/80"
              }`}
            >
              {/* Package badge */}
              <div className="flex items-center justify-between mb-4">
                <Quote size={20} className={`${dark ? "text-primary/30" : "text-primary/20"}`} />
                <span className={`text-[11px] font-black px-2.5 py-1 rounded-full text-white bg-gradient-to-r ${s.g}`}>{s.pkg}</span>
              </div>

              {/* Quote */}
              <p className={`text-[13px] leading-relaxed flex-1 mb-5 ${dark ? "text-slate-400" : "text-slate-600"}`}>
                "{s.text}"
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {s.tags.map(t => (
                  <span key={t} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${dark ? "bg-white/[.05] border-white/[.09] text-slate-400" : "bg-muted border-border text-slate-500"}`}>{t}</span>
                ))}
              </div>

              {/* Profile footer */}
              <div className={`flex items-center gap-3 pt-4 border-t ${dark ? "border-white/[.06]" : "border-border"}`}>
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${s.g} flex items-center justify-center text-white text-[12px] font-black`}>
                  {s.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-bold truncate ${dark ? "text-white" : "text-foreground"}`}>{s.name}</p>
                  <p className={`text-[11px] truncate ${dark ? "text-slate-500" : "text-slate-400"}`}>{s.role}</p>
                  <p className={`text-[10px] truncate ${dark ? "text-slate-600" : "text-slate-400"}`}>{s.college}</p>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  {Array.from({length: 5}).map((_,i) => <Star key={i} size={10} className="fill-amber-400 text-amber-400" />)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
