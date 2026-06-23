import { useState } from "react";
import { ChevronDown, ChevronUp, ArrowRight, Clock, DollarSign } from "lucide-react";
import { SectionHead, Grad } from "./SectionHead";

interface RoadmapsProps { dark: boolean }

const ROADS = [
  {
    id: "fe", icon: "🌐", title: "Frontend Developer", pop: true,
    salary: "₹6–20 LPA", time: "6–9 months", g: "from-[#2563eb] to-[#06b6d4]", border: "#2563eb",
    skills: ["HTML/CSS", "JavaScript ES6+", "React.js", "TypeScript", "Next.js", "Tailwind CSS", "Git/GitHub", "REST APIs"],
    path: [
      { step: "HTML5 & CSS3 Foundations",    done: true },
      { step: "JavaScript ES6+ Mastery",      done: true },
      { step: "React.js & Hooks",             done: true },
      { step: "TypeScript & Type Safety",     done: false },
      { step: "Next.js & Server Components",  done: false },
      { step: "Testing (Jest, RTL) & CI/CD",  done: false },
    ],
    companies: ["Amazon", "Flipkart", "Swiggy", "Zomato", "PayTM"],
    desc: "Build the web interfaces users interact with. High demand, fast iteration cycles, visible impact.",
  },
  {
    id: "fs", icon: "⚡", title: "Full Stack Developer", pop: false,
    salary: "₹8–28 LPA", time: "10–14 months", g: "from-[#8b5cf6] to-[#2563eb]", border: "#8b5cf6",
    skills: ["React", "Node.js", "Express", "PostgreSQL", "MongoDB", "Docker", "AWS", "GraphQL"],
    path: [
      { step: "Frontend Fundamentals",             done: true },
      { step: "Node.js & Express REST APIs",       done: true },
      { step: "Databases — SQL + NoSQL",           done: false },
      { step: "Authentication & Security",         done: false },
      { step: "Docker & Cloud Deployment (AWS)",   done: false },
      { step: "System Design & Scaling",           done: false },
    ],
    companies: ["Razorpay", "Freshworks", "CRED", "PhonePe", "Meesho"],
    desc: "Own the entire product stack. Full responsibility, full creative freedom, highest versatility.",
  },
  {
    id: "da", icon: "📊", title: "Data Analyst", pop: false,
    salary: "₹5–18 LPA", time: "5–8 months", g: "from-[#10b981] to-[#06b6d4]", border: "#10b981",
    skills: ["Python", "SQL", "Excel", "Tableau", "Power BI", "Statistics", "Pandas", "NumPy"],
    path: [
      { step: "Python for Data Science",     done: true },
      { step: "SQL & Database Queries",      done: true },
      { step: "Statistical Analysis",        done: false },
      { step: "Visualization (Tableau)",     done: false },
      { step: "Machine Learning Basics",     done: false },
      { step: "Business Intelligence Tools", done: false },
    ],
    companies: ["MuSigma", "Fractal", "Deloitte", "KPMG", "Amazon"],
    desc: "Turn raw data into business decisions. Entry-friendly, analytical, high-value in every industry.",
  },
  {
    id: "ai", icon: "🤖", title: "AI / ML Engineer", pop: true,
    salary: "₹12–45 LPA", time: "12–18 months", g: "from-[#f59e0b] to-[#ef4444]", border: "#f59e0b",
    skills: ["Python", "PyTorch", "TensorFlow", "Scikit-learn", "NLP", "Computer Vision", "MLOps", "LLMs"],
    path: [
      { step: "Math — Linear Algebra & Statistics", done: true },
      { step: "Python + Scientific Libraries",       done: true },
      { step: "Classical ML Algorithms",             done: false },
      { step: "Deep Learning & Neural Nets",         done: false },
      { step: "NLP, CV & Transformers",              done: false },
      { step: "MLOps & Production Deployment",       done: false },
    ],
    companies: ["Google", "Microsoft", "NVIDIA", "Cohere", "Sarvam AI"],
    desc: "Build intelligent systems. Fastest-growing field, biggest salary jumps, frontier-level work.",
  },
  {
    id: "swe", icon: "💻", title: "Software Engineer", pop: false,
    salary: "₹6–22 LPA", time: "8–12 months", g: "from-[#06b6d4] to-[#2563eb]", border: "#06b6d4",
    skills: ["DSA", "C++/Java", "System Design", "DBMS", "OS", "Networking", "Git", "LeetCode 200+"],
    path: [
      { step: "Core Programming — C++ or Java",        done: true },
      { step: "Data Structures & Algorithms",          done: true },
      { step: "OS, DBMS, Networking Fundamentals",     done: false },
      { step: "Low-Level Design Patterns",             done: false },
      { step: "High-Level System Design",              done: false },
      { step: "Behavioral + Leadership Rounds",        done: false },
    ],
    companies: ["Microsoft", "Salesforce", "Atlassian", "Walmart Labs", "Intuit"],
    desc: "The broadest CS career path. Opens doors to FAANG, unicorns, and global product companies.",
  },
];

export function Roadmaps({ dark }: RoadmapsProps) {
  const [open, setOpen] = useState<string | null>("fe");

  return (
    <section id="roadmaps" className={`py-14 sm:py-20 lg:py-28 ${dark ? "bg-[#070c1a]" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHead
          dark={dark}
          tag="Career Roadmaps"
          tagColor="text-[#10b981]"
          tagBg={dark ? "bg-[#10b981]/10 border-[#10b981]/25" : "bg-[#10b981]/8 border-[#10b981]/20"}
          title={<>Step-by-Step <Grad from="#10b981" to="#06b6d4">Learning Paths</Grad></>}
          sub="Curated roadmaps for every tech career. Know exactly what to learn, in what order, and how long it takes."
        />

        <div className="space-y-4">
          {ROADS.map(r => {
            const isOpen = open === r.id;
            return (
              <div
                key={r.id}
                className={`rounded-3xl border overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? dark ? "bg-[#0e1528] shadow-xl shadow-black/40" : "bg-white shadow-xl shadow-slate-200/80"
                    : dark ? "bg-[#0e1528]/50 hover:bg-[#0e1528]" : "bg-white/70 hover:bg-white"
                }`}
                style={{ borderColor: isOpen ? r.border + "40" : dark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.09)" }}
              >
                {/* Header row */}
                <button
                  onClick={() => setOpen(isOpen ? null : r.id)}
                  className="w-full flex items-center gap-4 p-5 text-left"
                >
                  <span className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${r.g} flex items-center justify-center text-xl shrink-0 shadow-lg`}>{r.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-0.5">
                      <h3 className={`text-[15px] font-bold ${dark ? "text-white" : "text-foreground"}`}>{r.title}</h3>
                      {r.pop && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">🔥 Popular</span>}
                    </div>
                    <div className="flex items-center gap-5">
                      <span className={`flex items-center gap-1 text-[12px] ${dark ? "text-slate-500" : "text-slate-400"}`}><Clock size={11} /> {r.time}</span>
                      <span className="text-[12px] font-bold text-emerald-500">{r.salary}</span>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${dark ? "bg-white/[.06] text-slate-400" : "bg-muted text-slate-500"}`}>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {/* Expanded body */}
                {isOpen && (
                  <div className="px-5 pb-6">
                    {/* Desc */}
                    <p className={`text-[13px] leading-relaxed mb-5 pl-16 ${dark ? "text-slate-400" : "text-slate-600"}`}>{r.desc}</p>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Skills */}
                      <div>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${dark ? "text-slate-600" : "text-slate-400"}`}>Key Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {r.skills.map(s => (
                            <span key={s} className={`text-[12px] font-medium px-3 py-1 rounded-xl border ${
                              dark ? "bg-white/[.05] border-white/[.09] text-slate-300" : "bg-muted border-border text-slate-700"
                            }`}>{s}</span>
                          ))}
                        </div>

                        <p className={`text-[10px] font-bold uppercase tracking-widest mt-5 mb-3 ${dark ? "text-slate-600" : "text-slate-400"}`}>Hiring Companies</p>
                        <div className="flex flex-wrap gap-2">
                          {r.companies.map(c => (
                            <span key={c} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r ${r.g} text-white`}>{c}</span>
                          ))}
                        </div>
                      </div>

                      {/* Steps */}
                      <div>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${dark ? "text-slate-600" : "text-slate-400"}`}>Learning Path</p>
                        <div className="relative pl-5">
                          {/* Vertical line */}
                          <div className={`absolute left-2 top-3 bottom-3 w-px ${dark ? "bg-white/[.08]" : "bg-slate-200"}`} />
                          {r.path.map((step, i) => (
                            <div key={step.step} className="flex items-start gap-3 mb-3 last:mb-0 relative">
                              <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center text-[8px] font-bold absolute -left-[18px] top-0.5 ${
                                step.done ? "bg-[#10b981] border-[#10b981] text-white" : dark ? "border-white/20 bg-[#0e1528]" : "border-slate-300 bg-white"
                              }`}>
                                {step.done ? "✓" : ""}
                              </div>
                              <div className={`ml-1 text-[12px] ${step.done ? (dark ? "text-slate-500 line-through" : "text-slate-400 line-through") : (dark ? "text-slate-300" : "text-slate-700")}`}>
                                <span className={`text-[10px] font-bold mr-2 ${dark ? "text-slate-600" : "text-slate-400"}`}>{i+1}.</span>{step.step}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button className={`mt-6 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[13px] font-bold text-white bg-gradient-to-r ${r.g} hover:opacity-90 transition-opacity shadow-lg`}>
                      Start This Roadmap <ArrowRight size={15} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
