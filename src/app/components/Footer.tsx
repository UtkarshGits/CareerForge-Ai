import { useState } from "react";
import { Zap, Twitter, Linkedin, Github, Youtube, Instagram, Send, ArrowRight } from "lucide-react";

interface FooterProps { dark: boolean }

const LINKS = {
  Platform:  ["AI College Finder", "Interview Prep", "DSA Practice", "Career Roadmaps", "Mock Interviews", "Resume Builder"],
  Resources: ["DSA Cheat Sheet", "Aptitude Bank", "HR Question Bank", "System Design Guide", "Company-wise Questions", "Placement Reports"],
  Company:   ["About Us", "Blog", "Careers", "Press Kit", "Contact", "Partners"],
  Legal:     ["Privacy Policy", "Terms of Service", "Cookie Policy", "Refund Policy"],
};

export function Footer({ dark }: FooterProps) {
  const [email, setEmail] = useState("");
  const [done,  setDone]  = useState(false);

  return (
    <footer className={`pt-14 sm:pt-20 pb-8 sm:pb-10 border-t ${dark ? "bg-[#040810] border-white/[.05]" : "bg-slate-900"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-[280px_repeat(4,minmax(0,1fr))] gap-x-6 gap-y-10 lg:gap-12 pb-10 sm:pb-14 border-b border-white/[.06]">

          {/* Brand col */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Zap size={15} className="text-white" />
              </span>
              <span className="text-[15px] font-black text-white">CareerForge <span className="text-primary">AI</span></span>
            </div>

            <p className="text-slate-400 text-[13px] leading-relaxed mb-7 max-w-[240px]">
              AI-powered career platform helping students find the right college and land their dream job.
            </p>

            {/* Newsletter */}
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Newsletter</p>
            {done ? (
              <p className="text-emerald-400 text-[13px] font-semibold">✅ Subscribed! Check your inbox.</p>
            ) : (
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-white/[.06] border border-white/[.09] text-white text-[13px] placeholder:text-slate-600 outline-none focus:border-primary/40"
                />
                <button
                  onClick={() => { if (email.includes("@")) setDone(true); }}
                  className="w-10 h-10 rounded-xl bg-primary hover:bg-primary/85 flex items-center justify-center transition-colors shrink-0"
                >
                  <Send size={14} className="text-white" />
                </button>
              </div>
            )}

            {/* Socials */}
            <div className="flex gap-2.5 mt-6">
              {[
                { I: Twitter,   l: "Twitter"   },
                { I: Linkedin,  l: "LinkedIn"  },
                { I: Github,    l: "GitHub"    },
                { I: Youtube,   l: "YouTube"   },
                { I: Instagram, l: "Instagram" },
              ].map(({ I, l }) => (
                <a key={l} href="#" aria-label={l}
                  className="w-8 h-8 rounded-xl bg-white/[.06] hover:bg-white/[.12] border border-white/[.08] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <I size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {Object.entries(LINKS).map(([cat, items]) => (
            <div key={cat}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-5">{cat}</p>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-white text-[13px] transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-[12px]">© 2025 CareerForge AI · Made with ❤️ for Indian students</p>
          <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 sm:gap-6">
            {["Privacy", "Terms", "Cookies", "Sitemap"].map(l => (
              <a key={l} href="#" className="text-slate-600 hover:text-slate-400 text-[12px] transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
