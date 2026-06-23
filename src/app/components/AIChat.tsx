import { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, Plus, Trash2, Send, Sparkles, Bot, User, 
  Copy, Check, Search, Terminal, ArrowRight, GraduationCap, 
  Database, HelpCircle, FileCode, CheckCircle, X
} from "lucide-react";
import { generateAIResponse, AIResponse } from "./aiChatLogic";

interface AIChatProps {
  dark: boolean;
}

interface ChatMessage {
  role: "user" | "ai";
  text: string;
  ts: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  category: string;
  model: string;
}

const CHAT_STORAGE_KEY = "careerforge_chat_history_v2";

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Partial<ChatMessage>;
  return (
    (message.role === "user" || message.role === "ai") &&
    typeof message.text === "string" &&
    typeof message.ts === "string"
  );
}

function isChatSession(value: unknown): value is ChatSession {
  if (!value || typeof value !== "object") return false;
  const chat = value as Partial<ChatSession>;
  return (
    typeof chat.id === "string" &&
    typeof chat.title === "string" &&
    typeof chat.category === "string" &&
    typeof chat.model === "string" &&
    Array.isArray(chat.messages) &&
    chat.messages.every(isChatMessage)
  );
}

function getSavedChats(): ChatSession[] | null {
  try {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!saved) return null;

    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.every(isChatSession)) {
      return parsed;
    }

    localStorage.removeItem(CHAT_STORAGE_KEY);
    return null;
  } catch (error) {
    console.error("Error parsing chats:", error);
    try {
      localStorage.removeItem(CHAT_STORAGE_KEY);
    } catch {}
    return null;
  }
}

function persistChats(chats: ChatSession[]) {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats));
  } catch (error) {
    console.error("Unable to save chat history:", error);
  }
}

export function AIChat({ dark }: AIChatProps) {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState("CareerForge GPT-4");
  const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : false
  );

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const syncSidebar = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsSidebarOpen(event.matches);
    };

    syncSidebar(desktopQuery);
    desktopQuery.addEventListener("change", syncSidebar);
    return () => desktopQuery.removeEventListener("change", syncSidebar);
  }, []);

  const closeSidebarOnSmallScreen = () => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      setIsSidebarOpen(false);
    }
  };

  // Load chats from localStorage
  useEffect(() => {
    const saved = getSavedChats();
    if (saved && saved.length > 0) {
      setChats(saved);
      setActiveChatId(saved[0].id);
    } else {
      // Create a default initial chat
      const initChat: ChatSession = {
        id: "chat_default",
        title: "Welcome Chat",
        model: "CareerForge GPT-4",
        category: "general",
        messages: [
          {
            role: "ai",
            text: "👋 Welcome to CareerForge AI Chat!\n\nI am your dedicated placement & training coach. I can help you with:\n1. **College Selection & Counseling** in Noida, Delhi NCR, Ghaziabad, Greater Noida, and Meerut (criteria, fees, placements, comparison).\n2. **DSA Training**: Solve LeetCode problems, explain algorithms, and debug C++/Java/Python/JS code.\n3. **SQL & Databases**: Write SQL queries, design database schemas, and debug syntax/logic errors.\n4. **Placement Prep**: ATS resume guidelines, company interview stages, and core CS subjects (OS, Networks, System Design).\n\nAsk me anything on these topics to get started!",
            ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ]
      };
      setChats([initChat]);
      setActiveChatId(initChat.id);
    }
  }, []);

  // Save chats to localStorage on change
  const saveChats = (updated: ChatSession[]) => {
    setChats(updated);
    persistChats(updated);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, activeChatId, busy]);

  const activeChat = chats.find(c => c.id === activeChatId);

  const handleNewChat = () => {
    const newId = `chat_${Date.now()}`;
    const newChat: ChatSession = {
      id: newId,
      title: "New Chat",
      model: selectedModel,
      category: "general",
      messages: []
    };
    const updated = [newChat, ...chats];
    saveChats(updated);
    setActiveChatId(newId);
    closeSidebarOnSmallScreen();
  };

  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = chats.filter(c => c.id !== id);
    saveChats(updated);
    if (activeChatId === id) {
      if (updated.length > 0) {
        setActiveChatId(updated[0].id);
      } else {
        const fallbackId = `chat_${Date.now()}`;
        const fallback: ChatSession = {
          id: fallbackId,
          title: "New Chat",
          model: selectedModel,
          category: "general",
          messages: []
        };
        saveChats([fallback]);
        setActiveChatId(fallbackId);
      }
    }
  };

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim() || busy) return;
    setInput("");
    
    // Ensure we have an active chat session, if not create one
    let currentChatId = activeChatId;
    let currentChats = [...chats];
    
    if (!activeChatId || chats.length === 0) {
      const newId = `chat_${Date.now()}`;
      currentChatId = newId;
      const newChat: ChatSession = {
        id: newId,
        title: textToSend.slice(0, 24) + (textToSend.length > 24 ? "..." : ""),
        model: selectedModel,
        category: "general",
        messages: []
      };
      currentChats = [newChat];
      setActiveChatId(newId);
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: ChatMessage = {
      role: "user",
      text: textToSend,
      ts: timeStr
    };

    // Update active chat with user message
    const updatedChats = currentChats.map(c => {
      if (c.id === currentChatId) {
        const isNewTitle = c.title === "New Chat" || c.messages.length === 0;
        return {
          ...c,
          title: isNewTitle ? textToSend.slice(0, 24) + (textToSend.length > 24 ? "..." : "") : c.title,
          messages: [...c.messages, userMsg]
        };
      }
      return c;
    });

    saveChats(updatedChats);
    setBusy(true);

    // AI thinking delay
    setTimeout(() => {
      const aiReply = generateAIResponse(textToSend);
      const aiMsg: ChatMessage = {
        role: "ai",
        text: aiReply.text,
        ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      const finalChats = updatedChats.map(c => {
        if (c.id === currentChatId) {
          return {
            ...c,
            category: aiReply.category,
            messages: [...c.messages, aiMsg]
          };
        }
        return c;
      });

      saveChats(finalChats);
      setBusy(false);
    }, 1000 + Math.random() * 600);
  };

  const copyToClipboard = (text: string, blockId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(blockId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ADVANCED MARKDOWN PARSER
  const renderMessageContent = (text: string) => {
    // 1. SPLIT BY CODE BLOCKS
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, idx) => {
      // If it is a code block
      if (part.startsWith("```")) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const lang = match ? match[1] : "code";
        const code = match ? match[2] : part.slice(3, -3);
        const blockId = `code_${idx}_${Date.now()}`;

        return (
          <div key={idx} className="my-4 rounded-xl border border-white/10 overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-white/[.07] text-[11px] font-bold text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 uppercase">
                <Terminal size={12} className="text-primary" /> {lang || "code"}
              </span>
              <button 
                onClick={() => copyToClipboard(code.trim(), blockId)}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                {copiedId === blockId ? (
                  <>
                    <Check size={12} className="text-emerald-500" />
                    <span className="text-emerald-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 bg-slate-950 text-slate-200 text-[12.5px] leading-relaxed overflow-x-auto font-mono scrollbar-thin">
              <code>{code.trim()}</code>
            </pre>
          </div>
        );
      }

      // If it's regular text, parse lists, tables, bold, and headers
      const lines = part.split("\n");
      let inTable = false;
      let tableHeaders: string[] = [];
      let tableRows: string[][] = [];

      const parsedLines = lines.map((line, lIdx) => {
        const trimmed = line.trim();

        // Detect Tables: e.g. | header1 | header2 |
        if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
          // Skip separator lines like |---|---|
          if (trimmed.includes("---")) {
            return null;
          }

          const cols = trimmed.split("|").map(c => c.trim()).filter(c => c !== "");
          if (!inTable) {
            inTable = true;
            tableHeaders = cols;
            return null;
          } else {
            tableRows.push(cols);
            return null;
          }
        }

        // If we were in a table and the line ended, output the table
        if (inTable && (!trimmed.startsWith("|") || lIdx === lines.length - 1)) {
          inTable = false;
          const currentHeaders = [...tableHeaders];
          const currentRows = [...tableRows];
          tableHeaders = [];
          tableRows = [];

          return (
            <div key={`table_${lIdx}`} className="my-4 overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
              <table className="w-full border-collapse text-left text-[12.5px]">
                <thead>
                  <tr className="bg-slate-100 dark:bg-white/[.04] border-b border-slate-200 dark:border-white/10">
                    {currentHeaders.map((h, hIdx) => (
                      <th key={hIdx} className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((row, rIdx) => (
                    <tr key={rIdx} className="border-b border-slate-100 dark:border-white/[.04] hover:bg-slate-50 dark:hover:bg-white/[.01] transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          {cell.split("**").map((seg, sIdx) => 
                            sIdx % 2 === 1 ? <strong key={sIdx} className="font-bold text-primary">{seg}</strong> : seg
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // Skip rendering line if it was accumulated into a table
        if (inTable) return null;

        // Render Headings
        if (trimmed.startsWith("### ")) {
          return <h3 key={lIdx} className="text-[15px] font-bold text-slate-800 dark:text-white mt-4 mb-2 tracking-tight flex items-center gap-1.5">{parseInlineElements(trimmed.slice(4))}</h3>;
        }
        if (trimmed.startsWith("#### ")) {
          return <h4 key={lIdx} className="text-[13.5px] font-bold text-primary dark:text-primary mt-3 mb-1">{parseInlineElements(trimmed.slice(5))}</h4>;
        }

        // Render Bullet Points
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <li key={lIdx} className="ml-5 list-disc text-[13px] leading-relaxed text-slate-600 dark:text-slate-300 my-1">
              {parseInlineElements(trimmed.slice(2))}
            </li>
          );
        }

        // Render numbered lists
        if (/^\d+\.\s/.test(trimmed)) {
          const content = trimmed.replace(/^\d+\.\s/, "");
          const num = trimmed.match(/^\d+/)?.[0];
          return (
            <div key={lIdx} className="flex gap-2 text-[13px] leading-relaxed text-slate-600 dark:text-slate-300 my-1.5">
              <span className="font-bold text-primary">{num}.</span>
              <span>{parseInlineElements(content)}</span>
            </div>
          );
        }

        // Regular line
        if (trimmed === "") return <div key={lIdx} className="h-2" />;
        return (
          <p key={lIdx} className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-300 my-1.5">
            {parseInlineElements(trimmed)}
          </p>
        );
      });

      return <div key={idx}>{parsedLines}</div>;
    });
  };

  // Helper to parse bold (**text**) and inline code (`code`)
  const parseInlineElements = (t: string) => {
    // 1. Split by inline code first
    const codeParts = t.split(/(`[^`]+`)/g);
    
    return codeParts.map((cp, cpIdx) => {
      if (cp.startsWith("`") && cp.endsWith("`")) {
        return (
          <code key={cpIdx} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[.08] text-rose-500 dark:text-rose-400 font-mono text-[11.5px]">
            {cp.slice(1, -1)}
          </code>
        );
      }
      
      // 2. Parse bold text inside normal segments
      const boldParts = cp.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((bp, bpIdx) => {
        if (bp.startsWith("**") && bp.endsWith("**")) {
          return <strong key={bpIdx} className="font-black text-slate-900 dark:text-white">{bp.slice(2, -2)}</strong>;
        }
        return bp;
      });
    });
  };

  const filteredChats = chats.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.messages.some(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const QUICK_PROMPTS = [
    {
      title: "Find Colleges",
      text: "Show BCA colleges in Noida under 1.5 Lakhs",
      icon: GraduationCap,
      color: "text-sky-500 bg-sky-500/10"
    },
    {
      title: "Compare Colleges",
      text: "Compare GL Bajaj and Galgotias University for B.Tech CSE",
      icon: ArrowRight,
      color: "text-emerald-500 bg-emerald-500/10"
    },
    {
      title: "Solve Two Sum",
      text: "Solve Two Sum problem in Javascript and explain complexity",
      icon: FileCode,
      color: "text-amber-500 bg-amber-500/10"
    },
    {
      title: "SQL Joins",
      text: "Explain different types of SQL JOINs with tables",
      icon: Database,
      color: "text-purple-500 bg-purple-500/10"
    },
    {
      title: "Debug Code",
      text: "Debug this: for(int i=0; i<=arr.size(); i++) cout << arr[i];",
      icon: Terminal,
      color: "text-rose-500 bg-rose-500/10"
    },
    {
      title: "ATS Resume",
      text: "Give me an ATS resume sections checklist and STAR format template",
      icon: Sparkles,
      color: "text-cyan-500 bg-cyan-500/10"
    }
  ];

  return (
    <div className={`h-[calc(100dvh-7rem)] md:h-[calc(100dvh-4rem)] min-w-0 flex overflow-hidden relative ${dark ? "bg-[#070c1a]" : "bg-white"}`}>
      {/* ── CHAT HISTORY SIDEBAR ── */}
      {isSidebarOpen && (
        <>
        <button
          type="button"
          aria-label="Close chat history"
          onClick={() => setIsSidebarOpen(false)}
          className="absolute inset-0 z-20 bg-slate-950/55 backdrop-blur-[1px] md:hidden"
        />
        <aside className={`absolute md:relative inset-y-0 left-0 w-[min(18rem,86vw)] md:w-64 border-r shrink-0 flex flex-col z-30 shadow-2xl md:shadow-none ${
          dark ? "bg-[#0c101f] border-white/[.08]" : "bg-slate-50 border-slate-200"
        }`}>
          {/* New Chat Button */}
          <div className="p-3 flex items-center gap-2">
            <button
              onClick={handleNewChat}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[12px] font-bold text-white bg-gradient-to-r from-primary to-accent hover:opacity-95 shadow-md shadow-primary/20 active:scale-98 transition-all"
            >
              <Plus size={14} />
              <span>New Chat</span>
            </button>
            <button
              type="button"
              aria-label="Close chat history"
              onClick={() => setIsSidebarOpen(false)}
              className={`md:hidden w-10 h-10 shrink-0 rounded-xl border flex items-center justify-center ${
                dark ? "border-white/10 text-slate-300 hover:bg-white/[.06]" : "border-slate-200 text-slate-600 hover:bg-white"
              }`}
            >
              <X size={17} />
            </button>
          </div>

          {/* Search history */}
          <div className="px-3 pb-2">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
              dark ? "bg-white/[.04] border-white/[.08]" : "bg-white border-slate-200"
            }`}>
              <Search size={13} className="text-slate-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search history…"
                className="bg-transparent border-none outline-none text-[11.5px] w-full text-slate-300 placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto px-2 space-y-1 py-2 scrollbar-thin">
            {filteredChats.map(c => {
              const active = c.id === activeChatId;
              const hasMessages = c.messages.length > 0;
              const lastMessage = hasMessages ? c.messages[c.messages.length - 1].text : "";
              
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveChatId(c.id);
                    closeSidebarOnSmallScreen();
                  }}
                  className={`w-full group text-left px-3 py-3 rounded-xl flex items-center justify-between transition-all ${
                    active 
                      ? dark ? "bg-white/[.08] text-white" : "bg-white text-slate-900 border border-slate-200/80 shadow-sm"
                      : dark ? "text-slate-400 hover:text-slate-200 hover:bg-white/[.03]" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden w-[82%]">
                    <MessageSquare size={13} className={active ? "text-primary" : "text-slate-400"} />
                    <div className="truncate">
                      <p className="text-[12px] font-semibold truncate leading-none">{c.title}</p>
                      {hasMessages && (
                        <p className={`text-[10px] mt-1 truncate ${active ? "text-slate-400" : "text-slate-500"}`}>
                          {lastMessage}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Delete button (shows on hover) */}
                  <button
                    onClick={(e) => handleDeleteChat(c.id, e)}
                    className="opacity-0 group-hover:opacity-100 hover:text-rose-500 p-0.5 rounded transition-opacity"
                    title="Delete Chat"
                  >
                    <Trash2 size={12} />
                  </button>
                </button>
              );
            })}
            
            {filteredChats.length === 0 && (
              <p className="text-center text-[11px] text-slate-500 py-8">No chats found.</p>
            )}
          </div>
        </aside>
        </>
      )}

      {/* ── MAIN CHAT PANEL ── */}
      <main className="min-w-0 flex-1 flex flex-col relative overflow-hidden">
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`absolute left-3 top-3.5 z-10 w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
            dark ? "bg-[#0e1528] border-white/15 text-slate-400 hover:text-white" : "bg-white border-slate-200 text-slate-500 hover:text-slate-900"
          }`}
          title={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
        >
          <MessageSquare size={14} />
        </button>

        {/* Header Toolbar */}
        <div className={`h-14 shrink-0 border-b flex items-center justify-between px-3 sm:px-5 pl-14 ${
          dark ? "bg-[#070c1a]/60 border-white/[.08]" : "bg-white border-slate-100 shadow-sm"
        }`}>
          {/* Model Selector */}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <select
              value={selectedModel}
              onChange={e => setSelectedModel(e.target.value)}
              className={`max-w-[190px] sm:max-w-none text-[11px] sm:text-[12px] font-bold outline-none bg-transparent ${
                dark ? "text-slate-200" : "text-slate-800"
              }`}
            >
              <option value="CareerForge GPT-4" className={dark ? "bg-[#0e1528]" : "bg-white"}>🤖 CareerForge AI Coach</option>
              <option value="College Selection DB" className={dark ? "bg-[#0e1528]" : "bg-white"}>🎓 NCR Colleges (Noida/Delhi)</option>
              <option value="DSA Coach" className={dark ? "bg-[#0e1528]" : "bg-white"}>💻 DSA Coding & Debugger</option>
              <option value="SQL Trainer" className={dark ? "bg-[#0e1528]" : "bg-white"}>📊 SQL Query solver</option>
            </select>
          </div>

          <p className="text-[10px] hidden sm:block font-bold text-slate-400 uppercase tracking-widest">
            Training &amp; Placement Engine
          </p>
        </div>

        {/* Messages List Area */}
        <div className={`flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin ${
          dark ? "bg-[#070c1a]" : "bg-[#fcfdff]"
        }`}>
          {activeChat && activeChat.messages.length === 0 ? (
            /* Welcome / Suggestion Cards Dashboard */
            <div className="max-w-2xl mx-auto pt-8 pb-12">
              <div className="text-center mb-8">
                <span className="w-12 h-12 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto shadow-lg shadow-primary/30 mb-4">
                  <Sparkles size={22} className="text-white" />
                </span>
                <h2 className={`text-2xl font-black tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>
                  What can I solve for you today?
                </h2>
                <p className={`text-[12px] mt-1.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>
                  Ask any question regarding CS subjects, code debugs, SQL syntax, or NCR college placements.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {QUICK_PROMPTS.map((p, idx) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSend(p.text)}
                      className={`text-left p-4 rounded-2xl border transition-all hover:-translate-y-0.5 active:translate-y-0 ${
                        dark 
                          ? "bg-[#0e1528]/80 border-white/[.07] hover:bg-[#121c35] hover:border-white/15" 
                          : "bg-white border-slate-200/80 hover:bg-slate-50 hover:shadow-md hover:shadow-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center ${p.color}`}>
                          <Icon size={12} />
                        </span>
                        <span className={`text-[11px] font-bold ${dark ? "text-slate-400" : "text-slate-600"}`}>
                          {p.title}
                        </span>
                      </div>
                      <p className={`text-[12px] font-semibold line-clamp-2 leading-relaxed ${
                        dark ? "text-slate-200" : "text-slate-700"
                      }`}>
                        "{p.text}"
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Active Messages rendering */
            <div className="max-w-3xl mx-auto space-y-6">
              {activeChat?.messages.map((m, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : "items-start"}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center shadow ${
                    m.role === "user" 
                      ? "bg-gradient-to-br from-[#06b6d4] to-emerald-500" 
                      : "bg-gradient-to-br from-primary to-accent"
                  }`}>
                    {m.role === "user" ? (
                      <User size={13} className="text-white" />
                    ) : (
                      <Bot size={13} className="text-white" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div className={`flex flex-col gap-1 max-w-[85%] ${m.role === "user" ? "items-end" : "items-start"}`}>
                    <div className={`px-4 py-3 rounded-2xl ${
                      m.role === "user"
                        ? "bg-primary text-white rounded-tr-sm shadow-md shadow-primary/10"
                        : dark 
                          ? "bg-white/[.05] border border-white/[.07] rounded-tl-sm" 
                          : "bg-white border border-slate-200/80 rounded-tl-sm shadow-sm"
                    }`}>
                      {m.role === "user" ? (
                        <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{m.text}</p>
                      ) : (
                        renderMessageContent(m.text)
                      )}
                    </div>
                    <span className="text-[9px] text-slate-500 px-1">{m.ts}</span>
                  </div>
                </div>
              ))}

              {/* Busy Typing Loader */}
              {busy && (
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-gradient-to-br from-primary to-accent shadow">
                    <Bot size={13} className="text-white" />
                  </div>
                  <div className={`px-4 py-3.5 rounded-2xl rounded-tl-sm flex items-center justify-center ${
                    dark ? "bg-white/[.05] border border-white/[.07]" : "bg-white border border-slate-200/80 shadow-sm"
                  }`}>
                    <div className="flex items-center gap-1">
                      {[0, 0.2, 0.4].map(d => (
                        <span 
                          key={d} 
                          className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-bounce" 
                          style={{ animationDelay: `${d}s` }} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className={`p-2.5 sm:p-4 border-t shrink-0 ${
          dark ? "bg-[#0c101f]/40 border-white/[.08]" : "bg-white border-slate-100"
        }`}>
          <div className="max-w-3xl mx-auto">
            <div className={`flex items-end gap-2 px-4 py-3 rounded-2xl border transition-colors ${
              dark
                ? "bg-white/[.04] border-white/[.08] focus-within:border-primary/40 focus-within:bg-white/[.06]"
                : "bg-slate-50 border-slate-200 focus-within:border-primary/30 focus-within:bg-white focus-within:shadow-md focus-within:shadow-slate-100"
            }`}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(input);
                  }
                }}
                rows={1}
                placeholder="Ask a question, paste code to debug, or query NCR colleges…"
                className={`flex-1 bg-transparent border-none outline-none resize-none text-[13px] py-1 max-h-32 placeholder:text-slate-500 font-medium ${
                  dark ? "text-slate-200" : "text-slate-700"
                }`}
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || busy}
                className="w-9 h-9 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-30 disabled:hover:bg-primary flex items-center justify-center transition-all shrink-0 active:scale-95 shadow-md shadow-primary/20"
              >
                <Send size={14} className="text-white" />
              </button>
            </div>

            <p className="hidden sm:block text-center text-[10px] text-slate-500 mt-2 font-semibold">
              ⚠️ Specialized Assistant: College Selection (Noida/Delhi/Meerut/Ghaziabad/Greater Noida) • DSA/Languages Code Solver &amp; Debugger • SQL &amp; Core CS Trainer.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
