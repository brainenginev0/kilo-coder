import { useState } from "react";
import { ArrowUp, Bot, Check, CircleAlert, Code2, FilePlus2, Paperclip, Sparkles, WandSparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import type { ActivityItem, BuilderMessage } from "./types";

interface ChatPanelProps {
  messages: BuilderMessage[];
  activity: ActivityItem[];
  isGenerating: boolean;
  providerReady: boolean;
  onSubmit: (prompt: string) => void;
  readOnly?: boolean;
}

export function ChatPanel({ messages, activity, isGenerating, providerReady, onSubmit, readOnly = false }: ChatPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [attachmentName, setAttachmentName] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const value = prompt.trim();
    if (!value || isGenerating || readOnly) return;
    onSubmit(value);
    setPrompt("");
  }

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col border-r border-white/[0.07] bg-[#0a0f1d] lg:w-[360px] lg:flex-none xl:w-[390px]">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-white/[0.07] px-4">
        <div className="flex items-center gap-2"><span className="grid size-5 place-items-center rounded bg-violet-300/15 text-violet-200"><WandSparkles className="size-3" /></span><span className="text-[11px] font-semibold text-slate-200">Forge chat</span></div>
        <span className={`flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.13em] ${readOnly ? "text-slate-500" : providerReady ? "text-emerald-300" : "text-amber-300"}`}><span className={`size-1.5 rounded-full ${readOnly ? "bg-slate-500" : providerReady ? "bg-emerald-300 shadow-[0_0_8px_#6ee7b7]" : "bg-amber-300 shadow-[0_0_8px_#fcd34d]"}`} />{readOnly ? "Read-only" : providerReady ? "Live model" : "Demo mode"}</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 [scrollbar-color:#29334b_transparent]">
        <div className="mb-5 flex items-center gap-3"><div className="h-px flex-1 bg-white/[0.07]" /><span className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-600">Today</span><div className="h-px flex-1 bg-white/[0.07]" /></div>
        <div className="space-y-5">
          {messages.map((message) => <Message key={message.id} message={message} />)}
        </div>

        <div className="my-6 border-t border-white/[0.07] pt-4">
          <div className="mb-3 flex items-center justify-between"><span className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500"><span className="size-1.5 rounded-full bg-violet-300" /> Build activity</span><span className="font-mono text-[9px] text-slate-700">LIVE</span></div>
          <div className="space-y-3 pl-1">
            {activity.map((item, index) => <ActivityRow key={item.id} item={item} last={index === activity.length - 1} />)}
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-white/[0.07] bg-[#0b101f] p-3">
        <div className="mb-2 flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
          <Suggestion label="Add auth" onClick={() => onSubmit("Add passwordless authentication with protected routes.")} disabled={readOnly || isGenerating} />
          <Suggestion label="Connect a DB" onClick={() => onSubmit("Connect a typed Postgres database and add seed data.")} disabled={readOnly || isGenerating} />
          <Suggestion label="Write tests" onClick={() => onSubmit("Add a focused test suite for the launchpad metrics.")} disabled={readOnly || isGenerating} />
        </div>
        <form onSubmit={submit} className="rounded-xl border border-white/10 bg-[#11182a] p-2 shadow-[0_10px_35px_rgba(0,0,0,0.18)] focus-within:border-violet-300/45">
          <Textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder={readOnly ? "This invite is read-only" : "Describe a change to your app..."} className="min-h-[62px] resize-none border-0 bg-transparent px-1 py-1.5 text-xs leading-relaxed text-slate-200 shadow-none placeholder:text-slate-600 focus-visible:ring-0" disabled={isGenerating || readOnly} />
          <div className="mt-2 flex items-center justify-between"><div className="flex min-w-0 items-center gap-1"><label htmlFor="chat-attachment" className={`grid size-7 shrink-0 place-items-center rounded-md text-slate-600 transition-colors ${readOnly ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-white/[0.06] hover:text-slate-300"}`} aria-label="Attach file"><Paperclip className="size-3.5" /><input id="chat-attachment" type="file" className="sr-only" disabled={readOnly} onChange={(event) => setAttachmentName(event.target.files?.[0]?.name ?? "")} /></label><span className="max-w-[150px] truncate font-mono text-[9px] text-slate-700">{attachmentName || (readOnly ? "Owner controls this session" : "Enter to send")}</span></div><button type="submit" disabled={!prompt.trim() || isGenerating || readOnly} className="grid size-7 place-items-center rounded-md bg-cyan-300 text-[#07101a] transition-all hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"><ArrowUp className="size-4" /></button></div>
        </form>
        <p className="mt-2 text-center font-mono text-[9px] leading-relaxed text-slate-700">Codex can make mistakes. Review generated changes before shipping.</p>
      </div>
    </section>
  );
}

function Message({ message }: { message: BuilderMessage }) {
  const assistant = message.role === "assistant";
  return <article className={`flex gap-2.5 ${assistant ? "" : "flex-row-reverse"}`}>
    <div className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-md ${assistant ? "bg-violet-300/15 text-violet-200" : "bg-cyan-300/15 font-mono text-[9px] font-bold text-cyan-200"}`}>{assistant ? <Bot className="size-3.5" /> : "BR"}</div>
    <div className={`min-w-0 max-w-[88%] ${assistant ? "" : "text-right"}`}>
      <div className={`mb-1 flex items-center gap-2 ${assistant ? "" : "justify-end"}`}><span className="text-[10px] font-semibold text-slate-400">{assistant ? "Codex" : "You"}</span><span className="font-mono text-[9px] text-slate-700">{message.time}</span></div>
      <div className={`rounded-lg px-3 py-2.5 text-[11px] leading-[1.65] ${assistant ? "rounded-tl-sm border border-white/[0.07] bg-white/[0.035] text-slate-300" : "rounded-tr-sm bg-violet-300/15 text-violet-100"}`}>{message.content}{message.state === "streaming" && <span className="ml-1 inline-block h-3 w-1 animate-pulse bg-cyan-300 align-[-2px]" />}</div>
    </div>
  </article>;
}

function ActivityRow({ item, last }: { item: ActivityItem; last: boolean }) {
  const statusIcon = item.state === "done" ? <Check className="size-3" /> : item.state === "error" ? <CircleAlert className="size-3" /> : item.state === "active" ? <span className="size-2 animate-pulse rounded-full bg-cyan-300" /> : <span className="size-1.5 rounded-full bg-slate-600" />;
  return <div className="relative flex gap-2.5 pl-0.5"><div className={`relative z-10 grid size-5 shrink-0 place-items-center rounded-full ${item.state === "done" ? "bg-emerald-300/15 text-emerald-300" : item.state === "active" ? "bg-cyan-300/15 text-cyan-300" : item.state === "error" ? "bg-rose-300/15 text-rose-300" : "bg-white/[0.05] text-slate-600"}`}>{statusIcon}</div>{!last && <div className="absolute bottom-[-11px] left-[10px] top-5 w-px bg-white/[0.08]" />}<div className="min-w-0 pt-0.5"><div className={`text-[10px] font-medium ${item.state === "active" ? "text-cyan-100" : "text-slate-400"}`}>{item.title}</div><div className="mt-0.5 truncate font-mono text-[9px] text-slate-600">{item.detail}{item.time ? ` · ${item.time}` : ""}</div></div></div>;
}

function Suggestion({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return <button type="button" onClick={onClick} disabled={disabled} className="flex shrink-0 items-center gap-1.5 rounded-md border border-white/[0.07] bg-white/[0.025] px-2 py-1.5 text-[10px] text-slate-500 transition-colors hover:border-violet-300/25 hover:bg-violet-300/10 hover:text-violet-200 disabled:cursor-not-allowed disabled:opacity-40"><Sparkles className="size-3" />{label}</button>;
}
