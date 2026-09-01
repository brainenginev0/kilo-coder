import { useState } from "react";
import { Boxes, Check, ChevronDown, ChevronRight, Code2, Copy, Database, FileCode2, FileJson2, Folder, KeyRound, Settings2, ShieldCheck } from "lucide-react";
import type { ProjectFile } from "./types";

type InspectorTab = "files" | "settings";

interface InspectorPanelProps {
  files: ProjectFile[];
  selectedPath: string;
  settingsJson: string;
  activeTab: InspectorTab;
  onTabChange: (tab: InspectorTab) => void;
  onSelectFile: (path: string) => void;
  onCopySettings: () => void;
  mobile?: boolean;
}

export function InspectorPanel({ files, selectedPath, settingsJson, activeTab, onTabChange, onSelectFile, onCopySettings, mobile = false }: InspectorPanelProps) {
  return <aside className={`${mobile ? "flex w-full border-l-0" : "hidden w-[268px] border-l xl:flex"} min-h-0 shrink-0 flex-col border-white/[0.07] bg-[#0b101e]`}>
    <div className="flex h-11 shrink-0 items-center justify-between border-b border-white/[0.07] px-3"><div className="flex items-center gap-1"><button onClick={() => onTabChange("files")} className={`rounded-md px-2.5 py-1.5 text-[10px] font-semibold ${activeTab === "files" ? "bg-white/[0.08] text-white" : "text-slate-600 hover:text-slate-300"}`}>Files</button><button onClick={() => onTabChange("settings")} className={`rounded-md px-2.5 py-1.5 text-[10px] font-semibold ${activeTab === "settings" ? "bg-white/[0.08] text-white" : "text-slate-600 hover:text-slate-300"}`}>Settings</button></div><Settings2 className="size-3.5 text-slate-600" /></div>
    {activeTab === "files" ? <FilesView files={files} selectedPath={selectedPath} onSelectFile={onSelectFile} /> : <SettingsView value={settingsJson} onCopy={onCopySettings} />}
  </aside>;
}

function FilesView({ files, selectedPath, onSelectFile }: { files: ProjectFile[]; selectedPath: string; onSelectFile: (path: string) => void }) {
  return <div className="min-h-0 flex-1 overflow-y-auto p-3 [scrollbar-color:#29334b_transparent]"><div className="mb-4 rounded-lg border border-violet-300/15 bg-violet-300/[0.05] p-3"><div className="flex items-center gap-2 text-[10px] font-semibold text-violet-100"><Boxes className="size-3.5 text-violet-300" /> Next.js application</div><p className="mt-1.5 font-mono text-[9px] leading-relaxed text-slate-600">App router · TypeScript<br />Node 20 · pnpm</p></div><div className="mb-2 flex items-center justify-between px-1"><span className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-600">Project files</span><span className="font-mono text-[9px] text-slate-700">{files.filter((file) => file.kind === "file").length}</span></div><div className="space-y-0.5">{files.map((file) => <FileRow key={file.path} file={file} selected={file.path === selectedPath} onClick={() => file.kind === "file" && onSelectFile(file.path)} />)}</div><div className="mt-7 space-y-2 border-t border-white/[0.07] pt-4"><p className="px-1 font-mono text-[9px] uppercase tracking-[0.16em] text-slate-600">Runtime</p><MetaRow icon={ShieldCheck} label="Auth" value="Not configured" warning /><MetaRow icon={Database} label="Database" value="Postgres ready" /><MetaRow icon={KeyRound} label="Secrets" value="3 environment vars" /></div></div>;
}

function FileRow({ file, selected, onClick }: { file: ProjectFile; selected: boolean; onClick: () => void }) {
  const [open, setOpen] = useState(file.kind === "folder");
  const isNested = file.path.includes("/");
  if (file.kind === "folder") return <button onClick={() => setOpen((value) => !value)} className="flex w-full items-center gap-1.5 rounded-md px-1.5 py-1.5 text-left text-[10px] font-semibold text-slate-400 hover:bg-white/[0.04]"><span className="text-slate-600">{open ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}</span><Folder className="size-3.5 text-amber-300/70" />{file.path}</button>;
  const parent = file.path.split("/")[0];
  const parentOpen = parent ? true : open;
  if (!parentOpen) return null;
  return <button onClick={onClick} className={`flex w-full items-center gap-2 rounded-md py-1.5 pr-1.5 text-left text-[10px] transition-colors ${isNested ? "pl-8" : "pl-5"} ${selected ? "bg-cyan-300/10 text-cyan-100" : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-300"}`}><FileIcon path={file.path} /><span className="truncate font-mono">{file.path.split("/").pop()}</span>{selected && <span className="ml-auto size-1.5 rounded-full bg-cyan-300" />}</button>;
}

function FileIcon({ path }: { path: string }) { return path.endsWith(".json") ? <FileJson2 className="size-3.5 shrink-0 text-amber-300/70" /> : <FileCode2 className="size-3.5 shrink-0 text-violet-300/70" />; }

function SettingsView({ value, onCopy }: { value: string; onCopy: () => void }) {
  const [copied, setCopied] = useState(false);
  function copy() { onCopy(); setCopied(true); window.setTimeout(() => setCopied(false), 1600); }
  return <div className="min-h-0 flex-1 overflow-y-auto p-3"><div className="mb-3 flex items-start justify-between"><div><p className="font-mono text-[10px] font-bold text-slate-300">settings.json</p><p className="mt-1 text-[9px] leading-relaxed text-slate-600">Route Claude requests through any OpenAI-compatible model.</p></div><button onClick={copy} className="grid size-7 place-items-center rounded-md text-slate-500 hover:bg-white/[0.06] hover:text-slate-200" aria-label="Copy settings JSON">{copied ? <Check className="size-3.5 text-emerald-300" /> : <Copy className="size-3.5" />}</button></div><pre className="overflow-x-auto rounded-lg border border-white/[0.07] bg-[#080c16] p-3 font-mono text-[9px] leading-[1.75] text-violet-100/70"><code>{value}</code></pre><div className="mt-5 rounded-lg border border-amber-300/15 bg-amber-300/[0.04] p-3"><p className="flex items-center gap-2 text-[10px] font-semibold text-amber-200"><KeyRound className="size-3.5" /> Secret stays server-side</p><p className="mt-1.5 text-[9px] leading-relaxed text-slate-600">Only environment variable names are shown here. API keys never reach the browser.</p></div></div>;
}

function MetaRow({ icon: Icon, label, value, warning = false }: { icon: typeof ShieldCheck; label: string; value: string; warning?: boolean }) { return <div className="flex items-center gap-2"><Icon className={`size-3.5 ${warning ? "text-amber-300" : "text-slate-600"}`} /><span className="text-[10px] text-slate-500">{label}</span><span className={`ml-auto font-mono text-[9px] ${warning ? "text-amber-300/80" : "text-slate-600"}`}>{value}</span></div>; }
