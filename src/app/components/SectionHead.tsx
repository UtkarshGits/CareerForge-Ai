import type React from "react";

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
