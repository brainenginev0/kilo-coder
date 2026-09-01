import { Check, ChevronDown, Cloud, Command, Monitor, MoreHorizontal, Rocket, Share2, Smartphone, Tablet, Wifi } from "lucide-react";
import type { Viewport } from "./types";

interface TopBarProps {
  viewport: Viewport;
  onViewportChange: (viewport: Viewport) => void;
  onShare: () => void;
  onDeploy: () => void;
  onMoreActions: () => void;
}

export function TopBar({ viewport, onViewportChange, onShare, onDeploy, onMoreActions }: TopBarProps) {
  return (
    <header className="flex min-h-[64px] shrink-0 items-center justify-between gap-3 border-b border-white/[0.07] bg-[#0c1121]/90 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="lg:hidden grid size-8 shrink-0 place-items-center rounded-[10px] bg-cyan-300 text-[#07101a]"><Command className="size-4" /></div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate font-display text-sm font-semibold tracking-[-0.02em] text-white">Signal launchpad</h1>
            <ChevronDown className="hidden size-3.5 text-slate-600 sm:block" />
          </div>
          <div className="mt-1 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-300"><Check className="size-3" /> Saved 2m ago</span>
            <span className="hidden text-slate-700 sm:inline">/</span>
            <span className="hidden items-center gap-1.5 sm:flex"><Cloud className="size-3" /> main</span>
          </div>
        </div>
      </div>

      <div className="hidden items-center gap-1 rounded-lg border border-white/[0.07] bg-black/10 p-1 md:flex">
        <ViewportButton active={viewport === "desktop"} label="Desktop" onClick={() => onViewportChange("desktop")}><Monitor className="size-3.5" /></ViewportButton>
        <ViewportButton active={viewport === "tablet"} label="Tablet" onClick={() => onViewportChange("tablet")}><Tablet className="size-3.5" /></ViewportButton>
        <ViewportButton active={viewport === "mobile"} label="Mobile" onClick={() => onViewportChange("mobile")}><Smartphone className="size-3.5" /></ViewportButton>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-md px-2 py-1.5 font-mono text-[10px] text-slate-400 sm:flex"><span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_#6ee7b7]" /> gpt-4o-mini</div>
        <button onClick={onShare} className="inline-flex h-8 items-center gap-2 rounded-md border border-white/10 bg-white/[0.045] px-2.5 text-[11px] font-semibold text-slate-300 transition-colors hover:border-violet-300/30 hover:bg-violet-300/10 hover:text-white sm:px-3"><Share2 className="size-3.5" /><span className="hidden sm:inline">Share</span></button>
        <button onClick={onDeploy} className="inline-flex h-8 items-center gap-2 rounded-md bg-cyan-300 px-2.5 text-[11px] font-bold text-[#07101a] shadow-[0_0_16px_rgba(103,232,249,0.14)] transition-colors hover:bg-cyan-200 sm:px-3"><Rocket className="size-3.5" /><span className="hidden sm:inline">Deploy</span></button>
        <button onClick={onMoreActions} className="grid size-8 place-items-center rounded-md text-slate-500 hover:bg-white/[0.05] hover:text-slate-200" aria-label="More actions"><MoreHorizontal className="size-4" /></button>
      </div>
    </header>
  );
}

function ViewportButton({ active, label, onClick, children }: { active: boolean; label: string; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} title={label} className={`grid size-7 place-items-center rounded-md transition-colors ${active ? "bg-white/10 text-white" : "text-slate-600 hover:text-slate-300"}`}>{children}</button>;
}
