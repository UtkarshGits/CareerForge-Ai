import { useState, useEffect } from "react";
import { Search, MapPin, Sparkles, ChevronRight, BookOpen, Lock, ShieldAlert, X, Globe, Phone, ExternalLink } from "lucide-react";

interface CollegeFinderProps {
  dark: boolean;
  isAuthenticated: boolean;
  trialSearchesLeft: number;
  onSearchIncrement: (currentCount: number) => Promise<boolean>;
  onOpenAuth: () => void;
}

const GUEST_SEARCH_LIMIT = 3;

function getGuestSearchCount() {
  try {
    const parsed = Number.parseInt(localStorage.getItem("guestSearchCount") || "0", 10);
    if (!Number.isFinite(parsed)) return 0;
    return Math.min(GUEST_SEARCH_LIMIT, Math.max(0, parsed));
  } catch {
    return 0;
  }
}

export function CollegeFinder({ 
  dark, 
  isAuthenticated, 
  trialSearchesLeft, 
  onSearchIncrement,
  onOpenAuth
}: CollegeFinderProps) {
  const [q,       setQ]       = useState("");
  const [course,  setCourse]  = useState("All Courses");
  const [loc,     setLoc]     = useState("All Locations");
  const [budget,  setBudget]  = useState("Any Budget");
  
  const [aiInput, setAiInput] = useState("");
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [limitError, setLimitError] = useState(false);

  // Dynamic database states
  const [colleges, setColleges] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<string[]>(["All Courses"]);
  const [allLocations, setAllLocations] = useState<string[]>(["All Locations"]);
  const [selectedCollege, setSelectedCollege] = useState<any | null>(null);

  // Sync limit error state on prop change
  useEffect(() => {
    if (!isAuthenticated && trialSearchesLeft <= 0) {
      setLimitError(true);
    } else {
      setLimitError(false);
    }
  }, [trialSearchesLeft, isAuthenticated]);

  // Fetch colleges from backend API
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch("/api/colleges");
        if (response.ok) {
          const data = await response.json();
          
          const mapped = data.map((c: any, idx: number) => {
            const gradients = [
              "from-[#2563eb] to-[#06b6d4]",
              "from-[#8b5cf6] to-[#ec4899]",
              "from-[#10b981] to-[#06b6d4]",
              "from-[#f59e0b] to-[#ef4444]",
              "from-[#2563eb] to-[#8b5cf6]",
              "from-[#ec4899] to-[#8b5cf6]"
            ];
            const g = gradients[idx % gradients.length];
            const icons = ["🏛️", "⚡", "🎯", "🌟", "📚", "🏅", "🤖", "🎓", "💡"];
            const icon = icons[idx % icons.length];
            const badge = c.type === "Government" ? "Govt. Elite" : "Private Elite";
            
            const primaryCourse = c.courses.includes("B.Tech CSE") ? "B.Tech CSE" : c.courses[0] || "B.Tech CS";
            
            // Format fee dynamically based on Government vs Private
            const annualFees = c.type === "Government"
              ? `₹${((idx % 5) * 0.2 + 0.5).toFixed(1)}L`
              : `₹${((idx % 5) * 0.8 + 2.0).toFixed(1)}L`;
              
            return {
              name: c.name,
              loc: `${c.city}, ${c.location}`,
              city: c.city,
              state: c.location,
              type: c.type,
              course: primaryCourse,
              courses: c.courses,
              place: Math.round(c.placementPercentage || 85),
              pkg: `₹${c.averagePackageLPA || 6.5} LPA`,
              highest: `₹${c.highestPackageLPA || 15.0} LPA`,
              fees: annualFees,
              rank: (idx % 30) + 1,
              recruiters: c.topRecruiters || ["TCS", "Infosys"],
              badge: badge,
              g: g,
              icon: icon,
              website: c.website,
              contact: c.contact,
              eligibility: c.eligibility
            };
          });

          setColleges(mapped);

          // Extract unique courses and locations for the dropdowns
          const coursesSet = new Set<string>();
          mapped.forEach((c: any) => {
            if (c.courses) {
              c.courses.forEach((crs: string) => coursesSet.add(crs));
            }
          });
          const locationsSet = new Set<string>();
          mapped.forEach((c: any) => {
            if (c.state) locationsSet.add(c.state);
          });

          setAllCourses(["All Courses", ...Array.from(coursesSet).sort()]);
          setAllLocations(["All Locations", ...Array.from(locationsSet).sort()]);
        }
      } catch (err) {
        console.error("Failed to load colleges:", err);
      }
    };
    fetchColleges();
  }, []);

  const triggerSearchCounter = async (): Promise<boolean> => {
    if (isAuthenticated) return true;
    
    const searchesDone = getGuestSearchCount();
    if (searchesDone >= GUEST_SEARCH_LIMIT) {
      setLimitError(true);
      return false;
    }

    const success = await onSearchIncrement(searchesDone);
    if (!success) {
      setLimitError(true);
    }
    return success;
  };

  const visible = colleges.filter(c =>
    (q === "" || c.name.toLowerCase().includes(q.toLowerCase()) || c.loc.toLowerCase().includes(q.toLowerCase())) &&
    (course === "All Courses" || c.courses.includes(course)) &&
    (loc    === "All Locations" || c.loc.toLowerCase().includes(loc.toLowerCase())) &&
    (budget === "Any Budget" || 
      (budget === "Under ₹1L" && parseFloat(c.fees.replace(/[^\d.]/g, '')) < 1.0) ||
      (budget === "₹1–3L" && parseFloat(c.fees.replace(/[^\d.]/g, '')) >= 1.0 && parseFloat(c.fees.replace(/[^\d.]/g, '')) <= 3.0) ||
      (budget === "₹3–6L" && parseFloat(c.fees.replace(/[^\d.]/g, '')) > 3.0)
    )
  );

  const handleTextSearchKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      await triggerSearchCounter();
    }
  };

  const handleFilterChange = async (type: string, val: string) => {
    if (type === "course") setCourse(val);
    if (type === "loc") setLoc(val);
    if (type === "budget") setBudget(val);
    
    await triggerSearchCounter();
  };

  const ask = async () => {
    if (!aiInput.trim()) return;
    
    const allowed = await triggerSearchCounter();
    if (!allowed) return;

    setLoading(true);
    setAiReply(null);
    setTimeout(() => {
      if (!isAuthenticated) {
        // Limited potential for guests
        setAiReply(
          `Based on your query: **NIT Trichy** (placement fit, avg package ₹18 LPA). [Unlock with free account to see full recommendation analysis of remaining options... ]`
        );
      } else {
        setAiReply(
          `Based on your profile, I recommend **NIT Trichy** (strong CS placement, affordable ₹1.4L fees, avg ₹18 LPA), **DTU Delhi** (Delhi-based students preferred, ₹14 LPA avg, top recruiters like Zomato & Swiggy), and **Jadavpur University** (most affordable at ₹0.8L/yr, excellent reputation, ₹12 LPA avg). Apply via JOSAA/CSAB counselling — seats fill fast in round 1!`
        );
      }
      setLoading(false);
    }, 1400);
  };

  const s = (v: string) => `px-4 py-2.5 rounded-xl text-[13px] border outline-none w-full transition-colors ${
    dark ? "bg-muted/60 border-white/[.08] text-foreground" : "bg-white border-border text-foreground shadow-sm"
  }`;

  return (
    <section id="college-finder" className={`py-14 sm:py-20 lg:py-28 relative ${dark ? "bg-[#070c1a]" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section head */}
        <SectionHead
          dark={dark}
          tag="AI College Finder"
          tagColor="text-[#06b6d4]"
          tagBg={dark ? "bg-[#06b6d4]/10 border-[#06b6d4]/20" : "bg-[#06b6d4]/8 border-[#06b6d4]/20"}
          title={<>Discover Your <Grad from="#2563eb" to="#06b6d4">Perfect College</Grad></>}
          sub="Search 500+ colleges. Filter by course, location, fees, and placement. Let AI match you instantly."
        />

        {/* Guest trial banner */}
        {!isAuthenticated && (
          <div className={`mb-8 p-4 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            limitError 
              ? "bg-rose-500/10 border-rose-500/20 text-rose-500" 
              : "bg-amber-500/10 border-amber-500/20 text-amber-500"
          }`}>
            <div className="flex items-center gap-3">
              <ShieldAlert size={20} className="shrink-0 animate-pulse" />
              <div>
                <p className="text-[13px] font-bold">
                  {limitError 
                    ? "Trial Limit Reached" 
                    : `Guest Mode Activated: ${trialSearchesLeft} trial searches left`
                  }
                </p>
                <p className={`text-[11px] ${dark ? "text-slate-400" : "text-slate-600"}`}>
                  {limitError 
                    ? "You have run out of trial searches. Sign up for a free account to unlock unlimited searches & details." 
                    : "Unauthenticated users can perform 3 trial searches and only view partial college information."
                  }
                </p>
              </div>
            </div>
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl text-[12px] font-extrabold text-white bg-primary hover:bg-primary/95 transition-all shadow-md shadow-primary/25 shrink-0"
            >
              Sign Up Free
            </button>
          </div>
        )}

        {/* AI Panel */}
        <div className={`rounded-3xl border p-6 mb-10 relative overflow-hidden ${
          dark ? "bg-gradient-to-br from-[#2563eb]/10 via-[#0e1528] to-[#8b5cf6]/10 border-[#2563eb]/20"
               : "bg-gradient-to-br from-blue-50 via-white to-purple-50 border-blue-100"
        }`}>
          {/* Limit Overlay for AI Panel */}
          {limitError && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 text-center">
              <Lock size={28} className="text-amber-500 mb-2" />
              <p className="text-white text-[14px] font-black">AI Recommender Locked</p>
              <p className="text-slate-300 text-[11px] max-w-xs mt-1 mb-3">Create your account to unlock interactive counseling advice.</p>
              <button 
                onClick={onOpenAuth} 
                className="px-4 py-2 rounded-xl text-[11px] font-bold text-white bg-primary hover:bg-primary/90"
              >
                Sign Up Free
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <span className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
              <Sparkles size={16} className="text-white" />
            </span>
            <div>
              <p className={`text-[13px] font-bold ${dark ? "text-white" : "text-foreground"}`}>AI College Recommender</p>
              <p className={`text-[12px] ${dark ? "text-slate-500" : "text-slate-400"}`}>Tell me your JEE rank, interests, and budget</p>
            </div>
          </div>
          <div className="flex gap-3">
            <input
              value={aiInput}
              onChange={e => setAiInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && ask()}
              placeholder="e.g. JEE rank 5000, CS engineering, budget ₹2L/yr, prefer Delhi or South India…"
              className={`flex-1 px-4 py-3 rounded-2xl text-[13px] border outline-none transition-all ${
                dark ? "bg-white/[.05] border-white/[.10] text-white placeholder:text-slate-600 focus:border-primary/50 focus:bg-white/[.08]"
                     : "bg-white border-slate-200 placeholder:text-slate-400 focus:border-primary/40 focus:shadow-md"
              }`}
            />
            <button
              onClick={ask}
              disabled={loading || !aiInput.trim()}
              className="px-5 py-3 rounded-2xl bg-primary text-white text-[13px] font-bold disabled:opacity-50 flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Sparkles size={14} />
              }
              {loading ? "Analyzing…" : "Ask AI"}
            </button>
          </div>
          {aiReply && (
            <div className={`mt-4 p-4 rounded-2xl text-[13px] leading-relaxed relative ${
              dark ? "bg-white/[.05] text-slate-300" : "bg-white border border-slate-100 text-slate-700"
            }`}>
              {aiReply.split("**").map((t, i) =>
                i % 2 ? <strong key={i} className={dark ? "text-white" : "text-foreground"}>{t}</strong> : t
              )}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8 relative">
          <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border ${dark ? "bg-muted/60 border-white/[.08]" : "bg-white border-border shadow-sm"}`}>
            <Search size={14} className="text-muted-foreground shrink-0" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={handleTextSearchKeyDown}
              placeholder="Search colleges (press Enter)..."
              className="bg-transparent outline-none text-[13px] w-full placeholder:text-muted-foreground"
            />
          </div>
          
          <select 
            value={course}  
            onChange={e => handleFilterChange("course", e.target.value)}  
            className={s("")}
          >
            {allCourses.map(c => <option key={c}>{c}</option>)}
          </select>
          
          <select 
            value={loc}     
            onChange={e => handleFilterChange("loc", e.target.value)}     
            className={s("")}
          >
            {allLocations.map(c => <option key={c}>{c}</option>)}
          </select>
          
          <select 
            value={budget}  
            onChange={e => handleFilterChange("budget", e.target.value)}  
            className={s("")}
          >
            {["Any Budget", "Under ₹1L", "₹1–3L", "₹3–6L"].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Count */}
        <p className={`text-[12px] font-medium mb-5 ${dark ? "text-slate-600" : "text-slate-400"}`}>
          {visible.length} college{visible.length !== 1 ? "s" : ""} found
        </p>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 relative">
          {visible.map((c, idx) => {
            const isRestricted = !isAuthenticated && idx >= 3;
            return (
              <div key={c.name} className="relative group">
                <CollegeCard c={c} dark={dark} isRestricted={isRestricted} onViewProfile={() => setSelectedCollege(c)} />
                {isRestricted && (
                  <div className="absolute inset-0 bg-slate-900/30 dark:bg-black/50 backdrop-blur-[5px] rounded-3xl z-10 flex flex-col items-center justify-center p-4 text-center">
                    <Lock size={20} className="text-white mb-2" />
                    <p className="text-white text-[12px] font-bold">Details Locked</p>
                    <p className="text-slate-200 text-[10px] max-w-[150px] leading-tight mt-0.5 mb-2.5">
                      Create a free account to unlock placement data, package details & hiring companies.
                    </p>
                    <button
                      onClick={onOpenAuth}
                      className="px-3 py-1.5 rounded-lg text-[9px] font-bold text-white bg-primary hover:bg-primary/90 transition-colors"
                    >
                      Unlock Now
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {visible.length === 0 && (
          <div className={`py-20 text-center ${dark ? "text-slate-600" : "text-slate-400"}`}>
            <BookOpen size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-[14px]">No colleges match. Try clearing filters.</p>
          </div>
        )}

        {/* Detail Modal */}
        {selectedCollege && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedCollege(null)}>
            <div className={`w-full max-w-2xl rounded-3xl border p-6 md:p-8 overflow-y-auto max-h-[90vh] shadow-2xl relative transition-all ${
              dark ? "bg-[#0e1528] border-white/[.10] text-slate-300" : "bg-white border-slate-200 text-slate-700"
            }`} onClick={(e) => e.stopPropagation()}>
              {/* Close button */}
              <button 
                onClick={() => setSelectedCollege(null)}
                className={`absolute top-4 right-4 p-2 rounded-xl transition-colors ${
                  dark ? "hover:bg-white/10 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                }`}
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedCollege.g} flex items-center justify-center text-[26px] shadow-lg shrink-0`}>
                  {selectedCollege.icon}
                </div>
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${selectedCollege.g}`}>
                    {selectedCollege.badge}
                  </span>
                  <h3 className={`text-[18px] md:text-[22px] font-black mt-1 leading-tight ${dark ? "text-white" : "text-foreground"}`}>
                    {selectedCollege.name}
                  </h3>
                  <p className="text-[12px] flex items-center gap-1 mt-1 text-slate-400 dark:text-slate-500">
                    <MapPin size={11} /> {selectedCollege.loc}
                  </p>
                </div>
              </div>

              {/* Packages and Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Placement", val: `${selectedCollege.place}%`, desc: "Hired graduates" },
                  { label: "Avg Package", val: selectedCollege.pkg, desc: "Median salary" },
                  { label: "Highest Package", val: selectedCollege.highest, desc: "Top offer" },
                  { label: "Annual Fees", val: selectedCollege.fees, desc: "Estimated tuition" }
                ].map(s => (
                  <div key={s.label} className={`rounded-2xl p-3 border ${dark ? "bg-white/[.03] border-white/[.05]" : "bg-slate-50 border-slate-100"}`}>
                    <p className={`text-[9px] font-bold uppercase tracking-wider mb-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>{s.label}</p>
                    <p className={`text-[15px] font-black ${dark ? "text-white" : "text-slate-900"}`}>{s.val}</p>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">{s.desc}</p>
                  </div>
                ))}
              </div>

              {/* Courses & Eligibility Section */}
              <div className="mb-6">
                <h4 className={`text-[13px] font-extrabold uppercase tracking-wider mb-3 ${dark ? "text-white" : "text-foreground"}`}>
                  Offered Courses & Eligibility
                </h4>
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 scrollbar-none">
                  {selectedCollege.courses.map((crs: string) => (
                    <div key={crs} className={`p-3 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-2 text-[12px] ${
                      dark ? "bg-white/[.02] border-white/[.05]" : "bg-slate-50/50 border-slate-100"
                    }`}>
                      <span className="font-bold text-primary">{crs}</span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">{selectedCollege.eligibility[crs] || "Direct Entry"}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Recruiters */}
              <div className="mb-6">
                <h4 className={`text-[13px] font-extrabold uppercase tracking-wider mb-2.5 ${dark ? "text-white" : "text-foreground"}`}>
                  Top Recruiting Companies
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCollege.recruiters.map((r: string) => (
                    <span key={r} className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${
                      dark ? "bg-white/[.04] border-white/[.06] text-slate-300" : "bg-slate-100 border-slate-200/50 text-slate-600"
                    }`}>
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact & Website Footer */}
              <div className={`pt-5 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[12px] ${
                dark ? "border-white/[.08]" : "border-slate-100"
              }`}>
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                    <Phone size={12} /> <span className="font-medium">{selectedCollege.contact}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                    <Globe size={12} /> <span className="font-medium">{selectedCollege.website.replace("https://", "")}</span>
                  </p>
                </div>
                <a 
                  href={selectedCollege.website}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl text-[12px] font-bold text-white bg-primary hover:bg-primary/95 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-1.5"
                >
                  Visit Official Website <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function CollegeCard({ c, dark, isRestricted, onViewProfile }: { c: any; dark: boolean; isRestricted: boolean; onViewProfile: () => void }) {
  return (
    <article 
      onClick={onViewProfile}
      className={`group rounded-3xl border p-5 transition-all duration-300 hover:-translate-y-1 cursor-pointer select-none ${
      dark
        ? "bg-[#0e1528] border-white/[.07] hover:border-[#2563eb]/30 hover:shadow-xl hover:shadow-[#2563eb]/10"
        : "bg-white border-slate-200/80 hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/80"
    } ${isRestricted ? "pointer-events-none" : ""}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${c.g} flex items-center justify-center text-[20px] shadow-lg`}>
            {c.icon}
          </div>
          <div>
            <h3 className={`text-[14px] font-bold ${dark ? "text-white" : "text-foreground"}`}>{c.name}</h3>
            <p className={`text-[11px] flex items-center gap-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>
              <MapPin size={10} /> {c.loc}
            </p>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${c.g}`}>{c.badge}</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { l: "Placement", v: `${c.place}%`, hi: true },
          { l: "Avg Package", v: c.pkg, hi: false },
          { l: "Annual Fees", v: c.fees, hi: false },
          { l: "NIRF Rank", v: `#${c.rank}`, hi: false },
        ].map(s => (
          <div key={s.l} className={`rounded-2xl p-3 ${dark ? "bg-white/[.04]" : "bg-muted"}`}>
            <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${dark ? "text-slate-600" : "text-slate-400"}`}>{s.l}</p>
            <p className={`text-[14px] font-black ${s.hi ? "text-emerald-500" : dark ? "text-white" : "text-foreground"}`}>{s.v}</p>
          </div>
        ))}
      </div>

      {/* Recruiters */}
      <div className="mb-4">
        <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${dark ? "text-slate-600" : "text-slate-400"}`}>Top Recruiters</p>
        <div className="flex flex-wrap gap-1.5">
          {c.recruiters.map(r => (
            <span key={r} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${dark ? "bg-white/[.06] text-slate-300" : "bg-slate-100 text-slate-600"}`}>{r}</span>
          ))}
        </div>
      </div>

      <button className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-[12px] font-bold transition-all duration-150 group-hover:bg-primary group-hover:text-white ${
        dark ? "bg-white/[.05] text-slate-400" : "bg-muted text-slate-600"
      }`}>
        View Full Profile <ChevronRight size={13} />
      </button>
    </article>
  );
}

export function SectionHead({
  dark, tag, tagColor, tagBg, title, sub
}: {
  dark: boolean; tag: string; tagColor: string; tagBg: string;
  title: React.ReactNode; sub: string;
}) {
  return (
    <div className="text-center mb-16">
      <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold border mb-5 ${tagColor} ${tagBg}`}>
        {tag}
      </span>
      <h2 className={`text-[2.4rem] sm:text-[3rem] lg:text-[3.5rem] font-black tracking-[-0.03em] leading-[1.1] mb-5 ${dark ? "text-white" : "text-foreground"}`}>
        {title}
      </h2>
      <p className={`text-[17px] leading-relaxed max-w-xl mx-auto ${dark ? "text-slate-400" : "text-slate-600"}`}>{sub}</p>
    </div>
  );
}

export function Grad({ from, to, children }: { from: string; to: string; children: React.ReactNode }) {
  return (
    <span style={{ background: `linear-gradient(135deg,${from},${to})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
      {children}
    </span>
  );
}
