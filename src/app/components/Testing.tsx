import { useState, useEffect } from "react";
import { Clock, ShieldCheck, ChevronRight, CheckCircle, XCircle, RefreshCw, AlertCircle, Play } from "lucide-react";
import { SectionHead, Grad } from "./SectionHead";

interface TestingProps { dark: boolean }

const TESTS = [
  {
    id: "aptitude",
    title: "Aptitude & Logical Reasoning Test",
    desc: "Quantitative problems, verbal ability, and logical puzzles. Crucial for first-round placement filters.",
    duration: 300, // 5 mins in seconds
    difficulty: "Medium",
    questions: [
      {
        id: 1,
        question: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
        options: ["120 meters", "150 meters", "180 meters", "324 meters"],
        correct: 1,
        explanation: "Speed = 60 * (5/18) m/sec = 50/3 m/sec. Length of train = Speed * Time = (50/3) * 9 = 150 meters."
      },
      {
        id: 2,
        question: "Find the odd one out in the series: 3, 5, 11, 14, 17, 21",
        options: ["11", "14", "17", "21"],
        correct: 1,
        explanation: "All numbers in the series except 14 are odd prime numbers (or odd numbers). Specifically, 14 is the only even number."
      },
      {
        id: 3,
        question: "If A is B's brother, B is C's sister, and C is D's father, how is A related to D?",
        options: ["Brother", "Uncle", "Grandfather", "Father"],
        correct: 1,
        explanation: "A is the brother of B, who is the sister of C. So A is C's brother. C is D's father. Therefore, A is D's uncle."
      },
      {
        id: 4,
        question: "A sum of money at simple interest amounts to ₹815 in 3 years and to ₹854 in 4 years. What is the sum?",
        options: ["₹650", "₹690", "₹698", "₹700"],
        correct: 2,
        explanation: "Simple Interest for 1 year = 854 - 815 = ₹39. SI for 3 years = 39 * 3 = ₹117. Principal = 815 - 117 = ₹698."
      },
      {
        id: 5,
        question: "Which number replaces the question mark: 2, 4, 12, 48, 240, ?",
        options: ["960", "1200", "1440", "1800"],
        correct: 2,
        explanation: "The pattern is multiplication by increasing numbers: 2*2=4, 4*3=12, 12*4=48, 48*5=240, 240*6=1440."
      }
    ]
  },
  {
    id: "frontend",
    title: "Front-End Development Assessment",
    desc: "Test your JavaScript logic, React lifecycle knowledge, DOM concepts, and modern CSS mechanics.",
    duration: 300,
    difficulty: "Hard",
    questions: [
      {
        id: 1,
        question: "What is the output of `console.log(typeof NaN)` in JavaScript?",
        options: ["'nan'", "'undefined'", "'number'", "'object'"],
        correct: 2,
        explanation: "In JavaScript, NaN (Not-a-Number) is classified as a numeric type, so typeof NaN evaluates to 'number'."
      },
      {
        id: 2,
        question: "Which React hook is designed specifically for performing side-effects in functional components?",
        options: ["useState", "useMemo", "useEffect", "useCallback"],
        correct: 2,
        explanation: "useEffect is the built-in React hook designated for managing side-effects, such as data fetching, subscriptions, and manual DOM manipulations."
      },
      {
        id: 3,
        question: "What does the 'flex-shrink' CSS property do in a Flexbox layout?",
        options: [
          "Sets how much a flex item will shrink relative to other items if space is limited",
          "Sets the default size of a flex item before spacing is distributed",
          "Controls the wrapping behavior of the flex container",
          "Specifies the flex item grows to fill the container"
        ],
        correct: 0,
        explanation: "flex-shrink specifies the flex shrink factor, determining how much a flex item shrinks relative to its siblings when space is scarce."
      },
      {
        id: 4,
        question: "What is the key difference between virtual DOM and real DOM updates in React?",
        options: [
          "Real DOM updates are always faster",
          "Virtual DOM batch updates and runs diffing before selectively updating the real DOM",
          "Virtual DOM is stored in the database",
          "There is no difference"
        ],
        correct: 1,
        explanation: "React's Virtual DOM performs light-weight batch updates, runs a reconciliation algorithm (diffing), and updates only the modified elements in the real DOM, optimizing performance."
      },
      {
        id: 5,
        question: "What is the purpose of the 'key' prop when rendering lists in React?",
        options: [
          "To apply unique CSS styles",
          "To bind custom click handlers",
          "To help React identify which items have changed, been added, or been removed",
          "To register items with local storage"
        ],
        correct: 2,
        explanation: "Keys help React identify items uniquely across renders, giving elements a stable identity and allowing React to reuse DOM structures rather than recreating them."
      }
    ]
  }
];

export function Testing({ dark }: TestingProps) {
  const [activeTest, setActiveTest] = useState<typeof TESTS[0] | null>(null);
  const [dailyTest, setDailyTest] = useState<typeof TESTS[0] | null>(null);
  const [dailyFetchError, setDailyFetchError] = useState<string | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const loadDailyTest = async () => {
      try {
        const res = await fetch("/api/testing/daily");
        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          throw new Error(payload.message || "Unable to load daily challenge");
        }
        const testData = await res.json();
        setDailyTest(testData);
      } catch (error: any) {
        console.error("Daily testing load failed:", error);
        setDailyFetchError(error?.message || "Unable to load daily challenge");
      }
    };

    loadDailyTest();
  }, []);

  // Timer effect
  useEffect(() => {
    if (!activeTest || isFinished) return;

    setTimeLeft(activeTest.duration);
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinish(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTest, isFinished]);

  const handleStart = (test: typeof TESTS[0]) => {
    setActiveTest(test);
    setCurrentIdx(0);
    setAnswers({});
    setIsFinished(false);
  };

  const handleSelectOption = (qId: number, optIdx: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleFinish = (auto = false) => {
    if (auto) alert("Time's up! Your answers are being submitted.");
    setIsFinished(true);
  };

  const handleRestart = () => {
    setActiveTest(null);
    setIsFinished(false);
    setAnswers({});
    setCurrentIdx(0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const getScore = () => {
    if (!activeTest) return { correct: 0, total: 0, pct: 0 };
    let correct = 0;
    activeTest.questions.forEach((q) => {
      if (answers[q.id] === q.correct) correct++;
    });
    return {
      correct,
      total: activeTest.questions.length,
      pct: Math.round((correct / activeTest.questions.length) * 100),
    };
  };

  const getAIFeedback = (pct: number) => {
    if (pct === 100) return "Master class! You have full command over this material. Next up: challenge yourself with coding practice or deep system design topics.";
    if (pct >= 80) return "Excellent work! Solid concepts and analytical thinking. Focus on timing and double-checking tricky edge cases to achieve perfection.";
    if (pct >= 60) return "Good attempt, but there are a few conceptual gaps. We recommend reviewing the detailed explanations and trying related practice problems.";
    return "Requires improvement. Take time to study the fundamental definitions, work through basic concepts step-by-step, and re-attempt the quiz.";
  };

  // Render Start/Selection Screen
  if (!activeTest) {
    return (
      <section id="testing" className={`py-14 sm:py-20 lg:py-28 ${dark ? "bg-[#0a101f]" : "bg-muted/40"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHead
            dark={dark}
            tag="AI Testing Center"
            tagColor="text-[#10b981]"
            tagBg={dark ? "bg-[#10b981]/10 border-[#10b981]/25" : "bg-[#10b981]/8 border-[#10b981]/20"}
            title={<>Validate Your Skills with <Grad from="#10b981" to="#3b82f6">Live Assessments</Grad></>}
            sub="Simulate actual placement tests. Timed quizzes, detailed reasoning, and instant diagnostics to score your readiness."
          />

          <div className="space-y-4 max-w-4xl mx-auto">
            {dailyFetchError ? (
              <div className={`rounded-3xl border p-5 ${dark ? "bg-[#0e1528] border-red-500/20" : "bg-red-50 border-red-200"}`}>
                <p className={`text-[12px] ${dark ? "text-red-300" : "text-red-700"}`}>
                  Daily coding challenge could not be loaded: {dailyFetchError}
                </p>
              </div>
            ) : null}

            <div className="grid md:grid-cols-2 gap-6">
              {[...(dailyTest ? [dailyTest] : []), ...TESTS].map((test) => (
                <div
                  key={test.id}
                  className={`rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                    dark
                      ? "bg-[#0e1528] border-white/[.07] hover:border-[#10b981]/30 hover:shadow-xl hover:shadow-[#10b981]/10"
                      : "bg-white border-slate-200/80 hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/80"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4 gap-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        test.difficulty === "Hard"
                          ? "text-red-500 bg-red-500/10"
                          : test.difficulty === "Medium"
                            ? "text-amber-500 bg-amber-500/10"
                            : "text-emerald-500 bg-emerald-500/10"
                      }`}>
                        {test.difficulty}
                      </span>
                      {test.id === "daily-coding-challenge" ? (
                        <span className="text-[10px] uppercase tracking-widest font-semibold text-sky-500 bg-sky-500/10 px-2 py-1 rounded-full">
                          Daily Challenge
                        </span>
                      ) : null}
                      <span className={`text-[11px] flex items-center gap-1 font-semibold ${dark ? "text-slate-500" : "text-slate-400"}`}>
                        <Clock size={12} /> {test.duration / 60} mins
                      </span>
                    </div>
                    <h3 className={`text-base font-bold mb-2 ${dark ? "text-white" : "text-slate-900"}`}>{test.title}</h3>
                    <p className={`text-[12px] leading-relaxed mb-6 ${dark ? "text-slate-400" : "text-slate-600"}`}>{test.desc}</p>
                  </div>

                  <button
                    onClick={() => handleStart(test)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-[12px] font-bold text-white bg-primary hover:bg-primary/95 transition-all shadow-md shadow-primary/20"
                  >
                    <Play size={13} /> Start Assessment
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Render Test-Taking Screen
  if (activeTest && !isFinished) {
    const q = activeTest.questions[currentIdx];
    return (
      <section className={`py-12 sm:py-20 lg:py-28 min-h-screen ${dark ? "bg-[#070c1a]" : "bg-white"}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4 mb-6 border-slate-200/50 dark:border-white/[.07]">
            <div>
              <p className={`text-[11px] font-bold uppercase tracking-widest ${dark ? "text-slate-500" : "text-slate-400"}`}>
                Live Assessment
              </p>
              <h3 className={`text-base font-bold ${dark ? "text-white" : "text-slate-900"}`}>{activeTest.title}</h3>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border ${
              timeLeft < 60 
                ? "bg-red-500/10 border-red-500/20 text-red-500 animate-pulse" 
                : dark 
                  ? "bg-white/[.04] border-white/[.08] text-slate-300" 
                  : "bg-slate-50 border-slate-200 text-slate-700"
            }`}>
              <Clock size={14} />
              <span className="text-[13px] font-black">{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-[180px_1fr] gap-6">
            {/* Sidebar Question Nav */}
            <aside className="space-y-4">
              <p className={`text-[10px] font-bold uppercase tracking-widest ${dark ? "text-slate-600" : "text-slate-400"}`}>
                Questions
              </p>
              <div className="grid grid-cols-5 md:grid-cols-3 gap-2">
                {activeTest.questions.map((question, i) => {
                  const answered = answers[question.id] !== undefined;
                  const active = i === currentIdx;
                  return (
                    <button
                      key={question.id}
                      onClick={() => setCurrentIdx(i)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-black border transition-all ${
                        active
                          ? "bg-primary border-primary text-white"
                          : answered
                            ? dark
                              ? "bg-primary/20 border-primary/30 text-primary"
                              : "bg-primary/10 border-primary/20 text-primary"
                            : dark
                              ? "bg-transparent border-white/[.08] text-slate-500 hover:border-white/20"
                              : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Question Panel */}
            <div className="space-y-6">
              <div className={`p-4 sm:p-6 rounded-3xl border ${dark ? "bg-[#0e1528] border-white/[.07]" : "bg-white border-slate-200/80 shadow-sm"}`}>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${dark ? "bg-white/[.05] text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                  Question {currentIdx + 1} of {activeTest.questions.length}
                </span>
                <p className={`text-[15px] font-bold mt-4 leading-relaxed ${dark ? "text-white" : "text-slate-900"}`}>
                  {q.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {q.options.map((opt, idx) => {
                  const selected = answers[q.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(q.id, idx)}
                      className={`w-full flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl border text-left transition-all ${
                        selected
                          ? "bg-primary/10 border-primary text-primary"
                          : dark
                            ? "bg-[#0e1528] border-white/[.06] text-slate-300 hover:bg-white/[.03]"
                            : "bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold border transition-colors ${
                        selected
                          ? "bg-primary border-primary text-white"
                          : dark
                            ? "border-white/10 text-slate-500"
                            : "border-slate-300 text-slate-400"
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-[13px] font-semibold">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Actions */}
              <div className="flex flex-wrap justify-between items-center gap-3 pt-4 border-t border-slate-200/50 dark:border-white/[.07]">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(prev => prev - 1)}
                  className={`px-4 py-2.5 rounded-xl text-[12px] font-bold border disabled:opacity-30 ${
                    dark ? "border-white/10 text-slate-400 hover:text-white" : "border-slate-200 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Previous
                </button>
                {currentIdx < activeTest.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(prev => prev + 1)}
                    className="px-5 py-2.5 rounded-xl text-[12px] font-bold text-white bg-primary hover:bg-primary/95 flex items-center gap-1"
                  >
                    Next Question <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleFinish(false)}
                    className="px-6 py-2.5 rounded-xl text-[12px] font-black text-white bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/20"
                  >
                    Submit Assessment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Render Score/Results Screen
  const score = getScore();
  const feedback = getAIFeedback(score.pct);

  return (
    <section className={`py-12 sm:py-20 lg:py-28 min-h-screen ${dark ? "bg-[#070c1a]" : "bg-white"}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Results head */}
        <div className="text-center mb-10">
          <span className="inline-flex w-12 h-12 rounded-2xl bg-emerald-500/10 items-center justify-center text-emerald-500 mb-4">
            <ShieldCheck size={24} />
          </span>
          <h2 className={`text-2xl font-black ${dark ? "text-white" : "text-slate-900"}`}>Assessment Complete</h2>
          <p className={`text-[12px] mt-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>
            Here is your diagnostic breakdown and AI generated feedback report.
          </p>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid md:grid-cols-[240px_1fr] gap-6 mb-8">
          
          {/* Score Card */}
          <div className={`rounded-3xl border p-6 text-center flex flex-col justify-center items-center ${
            dark ? "bg-[#0e1528] border-white/[.07]" : "bg-white border-slate-200/80 shadow-sm"
          }`}>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${dark ? "text-slate-500" : "text-slate-400"}`}>
              Your Score
            </p>
            <div className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center mb-4 ${
              score.pct >= 80 ? "border-emerald-500 text-emerald-500" : score.pct >= 50 ? "border-amber-500 text-amber-500" : "border-red-500 text-red-500"
            }`}>
              <span className="text-2xl font-black">{score.pct}%</span>
            </div>
            <p className={`text-[13px] font-bold ${dark ? "text-white" : "text-slate-800"}`}>
              {score.correct} / {score.total} Correct
            </p>
          </div>

          {/* AI Report Card */}
          <div className={`rounded-3xl border p-6 flex flex-col justify-between ${
            dark 
              ? "bg-gradient-to-br from-primary/10 via-[#0e1528] to-accent/10 border-primary/20" 
              : "bg-gradient-to-br from-blue-50 via-white to-purple-50 border-blue-100"
          }`}>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-[10px] text-white">🤖</span>
                <p className={`text-[11px] font-bold uppercase tracking-wider ${dark ? "text-white" : "text-slate-800"}`}>
                  AI Diagnostic Report
                </p>
              </div>
              <p className={`text-[13px] leading-relaxed font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>
                {feedback}
              </p>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleRestart()}
                className={`flex-1 py-3 rounded-xl text-[12px] font-bold border transition-colors ${
                  dark ? "border-white/10 text-slate-300 hover:bg-white/[.05]" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                All Assessments
              </button>
              <button
                onClick={() => handleStart(activeTest)}
                className="flex-1 py-3 rounded-xl text-[12px] font-bold text-white bg-primary hover:bg-primary/95 flex items-center justify-center gap-1.5 shadow-md shadow-primary/25"
              >
                <RefreshCw size={12} /> Retake Test
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Explanations */}
        <div className="space-y-4">
          <p className={`text-[11px] font-bold uppercase tracking-widest ${dark ? "text-slate-600" : "text-slate-400"}`}>
            Question Explanations
          </p>

          {activeTest.questions.map((question, i) => {
            const chosen = answers[question.id];
            const isCorrect = chosen === question.correct;
            return (
              <div
                key={question.id}
                className={`p-5 rounded-2xl border ${
                  dark ? "bg-[#0e1528] border-white/[.06]" : "bg-white border-slate-200/80 shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className={`text-[13px] font-bold leading-relaxed ${dark ? "text-white" : "text-slate-900"}`}>
                    <span className={`text-[11px] font-black mr-2 ${dark ? "text-slate-600" : "text-slate-400"}`}>
                      Q{i + 1}.
                    </span>
                    {question.question}
                  </h4>
                  <span className="shrink-0 mt-0.5">
                    {isCorrect ? (
                      <CheckCircle size={16} className="text-emerald-500" />
                    ) : (
                      <XCircle size={16} className="text-red-500" />
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className={`p-2.5 rounded-xl text-[11px] ${
                    isCorrect 
                      ? dark ? "bg-emerald-500/5 text-emerald-400" : "bg-emerald-50 text-emerald-700" 
                      : dark ? "bg-red-500/5 text-red-400" : "bg-red-50 text-red-700"
                  }`}>
                    <span className="font-extrabold uppercase block mb-0.5 text-[9px]">Your Answer</span>
                    {chosen !== undefined ? question.options[chosen] : "Not Answered"}
                  </div>
                  <div className={`p-2.5 rounded-xl text-[11px] ${
                    dark ? "bg-emerald-500/5 text-emerald-400" : "bg-emerald-50 text-emerald-700"
                  }`}>
                    <span className="font-extrabold uppercase block mb-0.5 text-[9px]">Correct Answer</span>
                    {question.options[question.correct]}
                  </div>
                </div>

                <div className="mt-4 flex gap-2.5 items-start">
                  <AlertCircle size={14} className="text-primary shrink-0 mt-0.5" />
                  <p className={`text-[11px] leading-relaxed ${dark ? "text-slate-400" : "text-slate-500"}`}>
                    <span className="font-extrabold text-primary mr-1">Explanation:</span>
                    {question.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
