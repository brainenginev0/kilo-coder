import {
  Activity,
  Box,
  ChevronDown,
  CircleHelp,
  FileCode2,
  FolderGit2,
  GitBranch,
  Layers3,
  Plus,
  Settings2,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectRailProps {
  onNewProject: () => void;
}

const recentFiles = ["app/page.tsx", "components/MetricCard.tsx", "settings.json"];

export function ProjectRail({ onNewProject }: ProjectRailProps) {
  return (
    <aside className="hidden h-full w-[230px] shrink-0 flex-col border-r border-white/[0.07] bg-[#090d1a] lg:flex">
      <div className="flex h-[72px] items-center gap-3 border-b border-white/[0.07] px-5">
        <div className="grid size-8 place-items-center rounded-[10px] bg-cyan-300 text-[#07101a] shadow-[0_0_24px_rgba(103,232,249,0.3)]">
          <Sparkles className="size-4 fill-current" />
        </div>
        <div>
          <p className="font-display text-[15px] font-bold tracking-[-0.02em] text-white">codex forge</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">build / ship / repeat</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <button className="mb-5 flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.045] px-3 py-2.5 text-left transition-colors hover:bg-white/[0.08]">
          <span className="flex items-center gap-2.5">
            <span className="grid size-6 place-items-center rounded-md bg-violet-400/15 font-mono text-[10px] font-bold text-violet-200">SL</span>
            <span>
              <span className="block text-xs font-semibold text-slate-200">Signal launchpad</span>
              <span className="mt-0.5 block font-mono text-[9px] text-slate-500">Personal workspace</span>
            </span>
          </span>
          <ChevronDown className="size-3.5 text-slate-500" />
        </button>

        <Button onClick={onNewProject} className="mb-6 h-9 w-full justify-start rounded-lg border border-cyan-300/20 bg-cyan-300 px-3 text-xs font-bold text-[#07101a] shadow-[0_0_18px_rgba(103,232,249,0.12)] hover:bg-cyan-200">
          <Plus className="size-4" />
          New project
          <span className="ml-auto font-mono text-[10px] text-[#14404a]">⌘ N</span>
        </Button>

        <RailSection label="Workspace">
          <RailItem icon={Layers3} label="Overview" active />
          <RailItem icon={Activity} label="Activity" trailing="3" />
          <RailItem icon={GitBranch} label="Versions" />
        </RailSection>

        <RailSection label="Recent files" className="mt-7">
          {recentFiles.map((file) => (
            <button key={file} className="group flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-[11px] text-slate-500 transition-colors hover:bg-white/[0.04] hover:text-slate-300">
              <FileCode2 className="size-3.5 text-slate-600 group-hover:text-cyan-300" />
              <span className="truncate font-mono">{file}</span>
            </button>
          ))}
        </RailSection>
      </div>

      <div className="space-y-3 border-t border-white/[0.07] p-3">
        <div className="rounded-lg border border-amber-300/15 bg-amber-300/[0.04] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-200"><span className="size-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#fcd34d]" /> Environment</span>
            <span className="font-mono text-[9px] text-amber-300/70">SHELL</span>
          </div>
          <p className="font-mono text-[10px] leading-relaxed text-slate-500">Node 20 · Next 14<br />Connect runner to execute</p>
        </div>
        <div className="flex items-center gap-1">
          <button className="grid size-8 place-items-center rounded-md text-slate-500 transition-colors hover:bg-white/[0.05] hover:text-slate-200" aria-label="Project settings"><Settings2 className="size-4" /></button>
          <button className="grid size-8 place-items-center rounded-md text-slate-500 transition-colors hover:bg-white/[0.05] hover:text-slate-200" aria-label="Help"><CircleHelp className="size-4" /></button>
          <div className="ml-auto grid size-7 place-items-center rounded-full border border-violet-300/20 bg-violet-300/10 font-mono text-[9px] font-bold text-violet-200">BR</div>
        </div>
      </div>
    </aside>
  );
}

function RailSection({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <section className={className}><p className="mb-2 px-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">{label}</p>{children}</section>;
}

function RailItem({ icon: Icon, label, active = false, trailing }: { icon: typeof Box; label: string; active?: boolean; trailing?: string }) {
  return <button className={`group flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-xs transition-colors ${active ? "bg-violet-300/10 text-violet-100" : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-300"}`}>
    <Icon className={`size-3.5 ${active ? "text-violet-300" : "text-slate-600 group-hover:text-slate-400"}`} />
    <span>{label}</span>
    {trailing && <span className="ml-auto rounded bg-violet-300/15 px-1.5 py-0.5 font-mono text-[9px] text-violet-200">{trailing}</span>}
  </button>;
}
