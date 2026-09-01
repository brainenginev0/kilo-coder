import { useState } from "react";
import { Check, Code2, ExternalLink, LayoutDashboard, Maximize2, Play, RefreshCw, Terminal, Wifi } from "lucide-react";
import type { SandboxStatus } from "@shared/api";
import type { ProjectFile, Viewport } from "./types";

type PreviewTab = "preview" | "code" | "console";

interface PreviewPanelProps {
  viewport: Viewport;
  onRefresh: () => void;
  previewUrl: string;
  selectedFile?: ProjectFile;
  isRefreshing: boolean;
  activeTab: PreviewTab;
  onTabChange: (tab: PreviewTab) => void;
  sandboxStatus: SandboxStatus;
}

export function PreviewPanel({ viewport, onRefresh, previewUrl, selectedFile, isRefreshing, activeTab, onTabChange, sandboxStatus }: PreviewPanelProps) {
  const sandboxConnected = sandboxStatus === "running";
  const [previewVersion, setPreviewVersion] = useState(0);
  const tabLabel = activeTab === "preview" ? "Preview" : activeTab === "code" ? "Code" : "Console";

  function refresh() {
    setPreviewVersion((version) => version + 1);
    onRefresh();
  }

  return <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#101628]">
    <div className="flex h-11 shrink-0 items-center justify-between border-b border-white/[0.07] px-4">
      <div className="flex items-center gap-1"><PreviewTab active={activeTab === "preview"} onClick={() => onTabChange("preview")} icon={LayoutDashboard}>Preview</PreviewTab><PreviewTab active={activeTab === "code"} onClick={() => onTabChange("code")} icon={Code2}>Code</PreviewTab><PreviewTab active={activeTab === "console"} onClick={() => onTabChange("console")} icon={Terminal}>Console</PreviewTab></div>
      <div className="flex items-center gap-1.5"><span className={`hidden items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] sm:flex ${sandboxConnected ? "text-emerald-300" : "text-amber-300"}`}><span className={`size-1.5 rounded-full ${sandboxConnected ? "bg-emerald-300 shadow-[0_0_7px_#6ee7b7]" : "bg-amber-300 shadow-[0_0_7px_#fcd34d]"}`} /> {sandboxConnected ? "running" : sandboxStatus}</span><button onClick={refresh} className="grid size-7 place-items-center rounded-md text-slate-500 hover:bg-white/[0.05] hover:text-slate-200" aria-label="Refresh preview"><RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} /></button><button onClick={() => window.open(previewUrl, "_blank", "noopener,noreferrer")} className="grid size-7 place-items-center rounded-md text-slate-500 hover:bg-white/[0.05] hover:text-slate-200" aria-label="Open preview in new tab"><ExternalLink className="size-3.5" /></button></div>
    </div>

    {activeTab === "preview" && <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto bg-[radial-gradient(ellipse_at_top,rgba(96,80,182,0.11),transparent_55%)] px-4 py-6 sm:px-8 lg:py-9">
      <div className="mb-5 flex w-full max-w-[780px] items-center justify-between"><div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-600">Interactive preview</p><p className="mt-1 text-xs text-slate-400">{tabLabel} / session-{previewVersion.toString().padStart(2, "0")}</p></div><div className="flex items-center gap-2 rounded-md border border-white/[0.07] bg-white/[0.03] px-2.5 py-1.5 font-mono text-[9px] text-slate-500"><Wifi className={`size-3 ${sandboxConnected ? "text-emerald-300" : "text-amber-300"}`} /> sandbox: {sandboxConnected ? "connected" : "preview shell"}</div></div>
      <div className={`w-full overflow-hidden rounded-xl border border-white/10 bg-[#f5f7fb] shadow-[0_24px_70px_rgba(0,0,0,0.35)] transition-all ${viewport === "mobile" ? "max-w-[340px]" : viewport === "tablet" ? "max-w-[630px]" : "max-w-[780px]"}`}>
        <div className="flex h-9 items-center gap-1.5 border-b border-slate-200 bg-white px-3"><span className="size-2 rounded-full bg-rose-300" /><span className="size-2 rounded-full bg-amber-300" /><span className="size-2 rounded-full bg-emerald-300" /><div className="mx-3 flex h-5 min-w-0 flex-1 items-center rounded bg-slate-100 px-2 font-mono text-[8px] text-slate-400"><span className="truncate">{previewUrl.replace("https://", "")}</span></div><Maximize2 className="size-3 text-slate-400" /></div>
        <LaunchpadMock viewport={viewport} />
      </div>
      <p className="mt-5 flex items-center gap-1.5 font-mono text-[9px] text-slate-600"><Check className="size-3 text-emerald-300" /> Changes are reflected live in this session</p>
    </div>}

    {activeTab === "code" && <CodeView file={selectedFile} />}
    {activeTab === "console" && <ConsoleView />}
  </section>;
}

function PreviewTab({ active, onClick, icon: Icon, children }: { active: boolean; onClick: () => void; icon: typeof LayoutDashboard; children: React.ReactNode }) {
  return <button onClick={onClick} className={`inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[10px] font-semibold transition-colors ${active ? "bg-white/[0.08] text-slate-100" : "text-slate-600 hover:text-slate-300"}`}><Icon className="size-3" />{children}</button>;
}

function LaunchpadMock({ viewport }: { viewport: Viewport }) {
  const compact = viewport === "mobile";
  return <div className="min-h-[430px] bg-[#f7f8fc] p-4 font-sans text-slate-900 sm:min-h-[520px] sm:p-6">
    <div className="mx-auto max-w-[650px]">
      <div className="mb-7 flex items-center justify-between"><div className="flex items-center gap-2.5"><div className="grid size-7 place-items-center rounded-lg bg-[#6256d8] text-[10px] font-bold text-white">S</div><span className="text-[11px] font-bold tracking-[-0.02em]">signal / launchpad</span></div><div className="flex items-center gap-2"><div className="hidden size-5 rounded-full bg-slate-200 sm:block" /><button className="rounded-md bg-slate-900 px-2.5 py-1.5 text-[9px] font-semibold text-white">Share report</button></div></div>
      <div className="mb-6"><p className="mb-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#6256d8]">Monday, October 14</p><h2 className="text-2xl font-bold tracking-[-0.05em] sm:text-3xl">Good morning, Brianna.</h2><p className="mt-2 text-[11px] text-slate-500">Here’s the signal across your product this week.</p></div>
      <div className={`mb-5 grid gap-2.5 ${compact ? "grid-cols-1" : "grid-cols-3"}`}><Metric label="Active users" value="24.8k" change="+12.4%" /><Metric label="Conversion" value="8.4%" change="+2.1%" /><Metric label="Revenue" value="$48.2k" change="+18.7%" /></div>
      <div className="grid gap-3 md:grid-cols-[1.35fr_1fr]"><div className="rounded-xl border border-slate-200 bg-white p-4"><div className="mb-5 flex items-center justify-between"><div><p className="text-[11px] font-bold">Activity overview</p><p className="mt-1 text-[9px] text-slate-400">Last 7 days</p></div><span className="rounded bg-[#6256d8]/10 px-2 py-1 text-[9px] font-semibold text-[#6256d8]">This week</span></div><div className="flex h-28 items-end gap-2 sm:h-36 sm:gap-3">{[38, 52, 45, 70, 58, 82, 67, 93, 76, 88, 71, 98].map((height, index) => <div key={index} className={`flex-1 rounded-t-sm ${index === 7 || index === 11 ? "bg-[#6256d8]" : "bg-[#d9d5fa]"}`} style={{ height: `${height}%` }} />)}</div><div className="mt-3 flex justify-between font-mono text-[8px] text-slate-400"><span>MON</span><span>WED</span><span>FRI</span><span>SUN</span></div></div><div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-[11px] font-bold">Quick actions</p><div className="mt-4 space-y-2">{["Review weekly report", "Invite your team", "Connect a source"].map((action, index) => <button key={action} className="flex w-full items-center gap-2 rounded-lg border border-slate-100 p-2.5 text-left text-[9px] font-semibold text-slate-600"><span className={`grid size-5 place-items-center rounded-md ${index === 0 ? "bg-amber-100 text-amber-600" : index === 1 ? "bg-emerald-100 text-emerald-600" : "bg-violet-100 text-violet-600"}`}><Play className="size-2.5 fill-current" /></span>{action}<span className="ml-auto text-slate-300">→</span></button>)}</div></div></div>
    </div>
  </div>;
}

function Metric({ label, value, change }: { label: string; value: string; change: string }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-3.5"><p className="text-[9px] text-slate-400">{label}</p><div className="mt-2 flex items-end justify-between gap-2"><strong className="text-lg tracking-[-0.04em]">{value}</strong><span className="mb-0.5 text-[8px] font-bold text-emerald-500">{change}</span></div></div>;
}

function CodeView({ file }: { file?: ProjectFile }) {
  return <div className="min-h-0 flex-1 overflow-auto bg-[#0a0f1d] p-4 sm:p-7"><div className="mx-auto max-w-3xl overflow-hidden rounded-lg border border-white/[0.07] bg-[#0d1424]"><div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2.5"><span className="font-mono text-[10px] text-slate-400">{file?.path ?? "Select a file to inspect"}</span><Code2 className="size-3.5 text-violet-300" /></div><pre className="overflow-auto p-5 font-mono text-[11px] leading-[1.8] text-slate-400"><code>{file?.content ?? "Choose a file from the inspector to view its source."}</code></pre></div></div>;
}

function ConsoleView() {
  return <div className="min-h-0 flex-1 overflow-auto bg-[#080c16] p-4 font-mono text-[10px] leading-[2] sm:p-7"><div className="mx-auto max-w-3xl"><p className="text-slate-600">10:43:07 <span className="text-emerald-300">INFO</span> sandbox session connected</p><p className="text-slate-600">10:43:08 <span className="text-violet-300">BUILD</span> compiling app/page.tsx</p><p className="text-slate-600">10:43:09 <span className="text-violet-300">BUILD</span> compiled 14 modules in 842ms</p><p className="text-slate-600">10:43:10 <span className="text-cyan-300">READY</span> preview available at /launchpad</p><p className="mt-4 text-emerald-300/80">$ waiting for the next instruction<span className="ml-1 inline-block h-3 w-1 animate-pulse bg-cyan-300 align-[-2px]" /></p></div></div>;
}
