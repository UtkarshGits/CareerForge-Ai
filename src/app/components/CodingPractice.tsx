import { useState, useEffect } from "react";
import { CheckCircle, Circle, Search, Loader2, ChevronRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { SectionHead, Grad } from "./SectionHead";

interface CodingPracticeProps {
  dark: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    solvedQuestions?: number[];
  };
  token: string | null;
  onUpdateUser: (user: any) => void;
}

const MONTHLY = [
  { m: "Jan", v: 18 },{ m: "Feb", v: 25 },{ m: "Mar", v: 31 },
  { m: "Apr", v: 28 },{ m: "May", v: 45 },{ m: "Jun", v: 52 },{ m: "Jul", v: 61 },
];

const TT = (dark: boolean) => ({
  background: dark ? "#0e1528" : "#fff",
  border: dark ? "1px solid rgba(255,255,255,.08)" : "1px solid #e2e8f0",
  borderRadius: "10px", fontSize: "12px",
  color: dark ? "#e8edf8" : "#0b0f1a",
});

const diffColor = {
    Easy: "text-emerald-500 bg-emerald-500/10",
    Medium: "text-amber-500 bg-amber-500/10",
    Hard: "text-red-500 bg-red-500/10",
  };

export function CodingPractice({ dark, user, token, onUpdateUser }: CodingPracticeProps) {
  const [questionsBySet, setQuestionsBySet] = useState<Record<number, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [expandedSet, setExpandedSet] = useState(1);
  const [selectedQuestionKey, setSelectedQuestionKey] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [loadingId, setLoadingId] = useState<string | number | null>(null);

  const getQuestionKey = (question: any) => {
    if (question.id !== undefined && question.id !== null) return String(question.id);
    if (question._id !== undefined && question._id !== null) return String(question._id);
    return "";
  };

  const normalizeDescription = (question: any) =>
    question.problemStatement || question.description || question.questionStatement || question.prompt || question.title;

  const renderListItems = (items: any[]) => {
    if (!Array.isArray(items)) return null;
    return items.map((item, index) => (
      <li key={index} className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {typeof item === "string" ? item : JSON.stringify(item)}
      </li>
    ));
  };

  useEffect(() => {
    const fetchAllSets = async () => {
      setLoading(true);
      try {
        const fetched: Record<number, any[]> = {};
        for (let setNumber = 1; setNumber <= 5; setNumber += 1) {
          const res = await fetch(`/api/coding/questions?set=${setNumber}`);
          if (res.ok) {
            fetched[setNumber] = await res.json();
          } else {
            fetched[setNumber] = [];
          }
        }
        setQuestionsBySet(fetched);
        const firstQuestion = fetched[1]?.[0] || Object.values(fetched).flat()[0];
        setSelectedQuestionKey(firstQuestion ? getQuestionKey(firstQuestion) : null);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setQuestionsBySet({});
      } finally {
        setLoading(false);
      }
    };
    fetchAllSets();
  }, []);

  const solvedList = new Set((user?.solvedQuestions || []).map((id: any) => String(id)));

  const questionSets = [1, 2, 3, 4, 5].map((setNumber) => ({
    setNumber,
    questions: questionsBySet[setNumber] || [],
  }));

  const allQuestions = questionSets.flatMap((set) => set.questions);

  useEffect(() => {
    if (!selectedQuestionKey && allQuestions.length > 0) {
      setSelectedQuestionKey(getQuestionKey(allQuestions[0]));
    }
  }, [allQuestions, selectedQuestionKey]);

  const selectedQuestion = selectedQuestionKey
    ? allQuestions.find((question: any) => getQuestionKey(question) === selectedQuestionKey) || null
    : null;

  const solvedCount = allQuestions.filter((q: any) => solvedList.has(getQuestionKey(q))).length;
  const totalCount = allQuestions.length;
  const completionPercentage = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  const solvedEasy = allQuestions.filter((q: any) => q.diff === "Easy" && solvedList.has(getQuestionKey(q))).length;
  const solvedMedium = allQuestions.filter((q: any) => q.diff === "Medium" && solvedList.has(getQuestionKey(q))).length;
  const solvedHard = allQuestions.filter((q: any) => q.diff === "Hard" && solvedList.has(getQuestionKey(q))).length;

  const dynamicPieData = [
    { name: "Easy", value: solvedEasy, color: "#10b981" },
    { name: "Medium", value: solvedMedium, color: "#f59e0b" },
    { name: "Hard", value: solvedHard, color: "#ef4444" },
  ];

  const activePieData = solvedCount > 0 ? dynamicPieData : [
    { name: "No Data", value: 1, color: dark ? "rgba(255,255,255,0.05)" : "#e2e8f0" }
  ];

  const handleToggleSolved = async (questionId: number | string) => {
    if (loadingId !== null) return;
    const key = String(questionId);
    setLoadingId(key);

    const numericId = Number(key);
    const bodyId = Number.isNaN(numericId) ? key : numericId;

    try {
      const response = await fetch("/api/user/progress/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ questionId: bodyId })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          onUpdateUser(data.user);
        }
      } else {
        console.error("Failed to toggle question status");
      }
    } catch (error) {
      console.error("Error toggling question status:", error);
    } finally {
      setLoadingId(null);
    }
  };

  if (loading) {
    return (
      <section id="coding" className={`py-14 sm:py-20 lg:py-28 min-h-[70vh] flex flex-col items-center justify-center ${dark ? "bg-[#0a101f]" : "bg-muted/40"}`}>
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className={`text-sm font-semibold ${dark ? "text-slate-400" : "text-slate-600"}`}>Loading practice questions from database...</p>
      </section>
    );
  }

  return (
    <section id="coding" className={`py-14 sm:py-20 lg:py-28 ${dark ? "bg-[#0a101f]" : "bg-muted/40"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHead
          dark={dark}
          tag="Coding Practice"
          tagColor="text-[#f59e0b]"
          tagBg={dark ? "bg-[#f59e0b]/10 border-[#f59e0b]/25" : "bg-[#f59e0b]/8 border-[#f59e0b]/20"}
          title={<>Practice, Track &amp; <Grad from="#f59e0b" to="#ef4444">Conquer</Grad></>}
          sub="10,000+ problems by topic, difficulty, and company. Rich analytics. Built for placement season."
        />

        <div className="grid lg:grid-cols-[260px_1fr] gap-8">

          {/* ── Left analytics panel ── */}
          <aside className="space-y-5">

            {/* Total solved */}
            <div className={`rounded-3xl border p-5 ${dark ? "bg-[#0e1528] border-white/[.07]" : "bg-white border-slate-200/80"}`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${dark ? "text-slate-600" : "text-slate-400"}`}>Total Solved</p>
              <p className="text-[52px] font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-none mb-1">
                {solvedCount}
              </p>
              <p className={`text-[12px] mb-3 ${dark ? "text-slate-600" : "text-slate-400"}`}>of {totalCount} problems</p>
              <div className={`h-2.5 rounded-full ${dark ? "bg-white/[.05]" : "bg-slate-100"}`}>
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${completionPercentage}%` }} />
              </div>
              <p className={`text-[11px] mt-1.5 ${dark ? "text-slate-600" : "text-slate-400"}`}>{completionPercentage}% completed</p>
            </div>

            {/* Pie */}
            <div className={`rounded-3xl border p-5 ${dark ? "bg-[#0e1528] border-white/[.07]" : "bg-white border-slate-200/80"}`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${dark ? "text-slate-600" : "text-slate-400"}`}>By Difficulty</p>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={activePieData} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={70} strokeWidth={0}>
                    {activePieData.map((e: any, i: number) => <Cell key={i} fill={e.color || "#ccc"} />)}
                  </Pie>
                  <Tooltip contentStyle={TT(dark)} />
                  {solvedCount > 0 && (
                    <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: "11px", color: dark ? "#7c8dab" : "#64748b" }} />
                  )}
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly area */}
            <div className={`rounded-3xl border p-5 ${dark ? "bg-[#0e1528] border-white/[.07]" : "bg-white border-slate-200/80"}`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${dark ? "text-slate-600" : "text-slate-400"}`}>Monthly Progress</p>
              <ResponsiveContainer width="100%" height={90}>
                <AreaChart data={MONTHLY}>
                  <defs>
                    <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#2563eb" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="m" tick={{ fontSize: 10, fill: dark ? "#475569" : "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={TT(dark)} />
                  <Area type="monotone" dataKey="v" stroke="#2563eb" strokeWidth={2} fill="url(#areaG)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Quick stats */}
            {[
              { l: "🔥 Day Streak",   v: "14 days" },
              { l: "🏆 Global Rank",  v: "#1,142" },
              { l: "⚡ Acceptance %", v: solvedCount > 0 ? `${(50 + (solvedCount / totalCount) * 20).toFixed(1)}%` : "63.4%" },
            ].map(s => (
              <div key={s.l} className={`flex items-center justify-between px-4 py-3 rounded-2xl border ${dark ? "bg-[#0e1528] border-white/[.07]" : "bg-white border-slate-200/80"}`}>
                <span className={`text-[12px] ${dark ? "text-slate-400" : "text-slate-600"}`}>{s.l}</span>
                <span className={`text-[13px] font-bold ${dark ? "text-white" : "text-foreground"}`}>{s.v}</span>
              </div>
            ))}
          </aside>

          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2">
              {questionSets.map((set) => {
                const questions = set.questions;
                const isOpen = expandedSet === set.setNumber;
                return (
                  <div key={set.setNumber} className={`rounded-3xl border overflow-hidden ${dark ? "bg-[#0e1528] border-white/[.07]" : "bg-white border-slate-200/80"}`}>
                    <button
                      type="button"
                      onClick={() => setExpandedSet(isOpen ? 0 : set.setNumber)}
                      className={`w-full flex items-center justify-between px-5 py-4 text-left ${dark ? "text-slate-100" : "text-slate-900"}`}
                    >
                      <div>
                        <p className="text-sm font-semibold">Question Set-{set.setNumber}</p>
                        <p className={`mt-1 text-xs ${dark ? "text-slate-500" : "text-slate-500"}`}>{questions.length} question{questions.length !== 1 ? "s" : ""}</p>
                      </div>
                      <ChevronRight className={`transition-transform ${isOpen ? "rotate-90" : "rotate-0"} ${dark ? "text-slate-400" : "text-slate-500"}`} />
                    </button>
                    {isOpen && (
                      <div className="divide-y divide-slate-200/80 dark:divide-white/[.05]">
                        {questions.length === 0 ? (
                          <div className="px-5 py-4 text-sm text-slate-500">No questions available in this set.</div>
                        ) : (
                          questions.map((question: any) => {
                            const questionKey = getQuestionKey(question);
                            const isSolved = solvedList.has(questionKey);
                            const isSelected = selectedQuestionKey === questionKey;
                            return (
                              <button
                                key={questionKey}
                                type="button"
                                onClick={() => { setSelectedQuestionKey(questionKey); setShowHints(false); }}
                                className={`w-full text-left px-5 py-4 transition ${isSelected ? "bg-primary/10" : "hover:bg-slate-100/80 dark:hover:bg-white/[.03]"} ${dark ? "text-slate-100" : "text-slate-900"}`}
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-semibold">{question.title}</p>
                                    <p className="mt-1 text-[11px] text-slate-500">{question.topic || "General"}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${diffColor[question.diff as keyof typeof diffColor]}`}>{question.diff || "Medium"}</span>
                                    {isSolved ? <CheckCircle size={16} className="text-emerald-500" /> : <Circle size={16} className="text-slate-400" />}
                                  </div>
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className={`rounded-3xl border p-6 ${dark ? "bg-[#0e1528] border-white/[.07]" : "bg-white border-slate-200/80"}`}>
              {selectedQuestion ? (
                <>
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${dark ? "text-slate-600" : "text-slate-400"}`}>Question Details</p>
                      <h2 className={`mt-2 text-2xl font-semibold ${dark ? "text-white" : "text-slate-900"}`}>{selectedQuestion.title}</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleSolved(getQuestionKey(selectedQuestion))}
                      className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
                    >
                      {solvedList.has(getQuestionKey(selectedQuestion)) ? "Mark Unsolved" : "Mark Solved"}
                    </button>
                  </div>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div>
                      <p className={`text-sm font-semibold ${dark ? "text-slate-200" : "text-slate-900"}`}>Problem Statement</p>
                      <p className={`mt-3 text-sm leading-7 ${dark ? "text-slate-300" : "text-slate-600"}`}>{normalizeDescription(selectedQuestion)}</p>
                    </div>
                    <div className="space-y-4">
                      {selectedQuestion.topic && <div className="rounded-2xl bg-slate-100/80 px-4 py-3 text-sm text-slate-700 dark:bg-white/[.04] dark:text-slate-300">Topic: {selectedQuestion.topic}</div>}
                      {selectedQuestion.diff && (
                        <div className="rounded-2xl bg-slate-100/80 px-4 py-3 text-sm dark:bg-white/[.04] dark:text-slate-300">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${diffColor[selectedQuestion.diff as keyof typeof diffColor] || diffColor.Medium}`}>
                            {selectedQuestion.diff}
                          </span>
                        </div>
                      )}
                      <div className="rounded-2xl bg-slate-100/80 px-4 py-3 text-sm text-slate-700 dark:bg-white/[.04] dark:text-slate-300">Status: {solvedList.has(getQuestionKey(selectedQuestion)) ? "Solved" : selectedQuestion.status || "Unsolved"}</div>
                    </div>
                  </div>

                  {selectedQuestion.examples && selectedQuestion.examples.length > 0 && (
                    <div className="mt-6">
                      <p className={`text-sm font-semibold ${dark ? "text-slate-200" : "text-slate-900"}`}>Examples</p>
                      <ul className="mt-3 list-disc pl-5">{renderListItems(selectedQuestion.examples)}</ul>
                    </div>
                  )}

                  {selectedQuestion.constraints && selectedQuestion.constraints.length > 0 && (
                    <div className="mt-6">
                      <p className={`text-sm font-semibold ${dark ? "text-slate-200" : "text-slate-900"}`}>Constraints</p>
                      <ul className="mt-3 list-disc pl-5">{renderListItems(selectedQuestion.constraints)}</ul>
                    </div>
                  )}

                  {selectedQuestion.hints && selectedQuestion.hints.length > 0 && (
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => setShowHints(!showHints)}
                        className="rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-300 dark:bg-white/[.08] dark:text-slate-100"
                      >
                        {showHints ? "Hide Hints" : "Show Hints"}
                      </button>
                      {showHints && <ul className="mt-4 list-disc pl-5">{renderListItems(selectedQuestion.hints)}</ul>}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-sm text-slate-500">Select a question from the menu to view details.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
