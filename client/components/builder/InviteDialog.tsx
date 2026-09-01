import { useState } from "react";
import { Check, Copy, Link2, QrCode, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface InviteDialogProps {
  open: boolean;
  inviteUrl: string;
  onOpenChange: (open: boolean) => void;
}

export function InviteDialog({ open, inviteUrl, onOpenChange }: InviteDialogProps) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  async function copyInvite() {
    if (!navigator.clipboard) {
      setCopyFailed(true);
      return false;
    }

    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopyFailed(false);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
      return true;
    } catch {
      setCopyFailed(true);
      return false;
    }
  }

  async function shareInvite() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Join my Codex Forge session", text: "Preview this app with me", url: inviteUrl });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setCopyFailed(true);
      }
      return;
    }
    await copyInvite();
  }

  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-w-sm border-white/10 bg-[#10172a] text-slate-100 shadow-[0_24px_100px_rgba(0,0,0,0.5)]"><DialogHeader><DialogTitle className="flex items-center gap-2 font-display text-base"><span className="grid size-7 place-items-center rounded-lg bg-violet-300/15 text-violet-200"><QrCode className="size-4" /></span>Invite to this session</DialogTitle><DialogDescription className="text-left text-xs leading-relaxed text-slate-500">Share a read-only preview link while you build. This local invite expires with the current session.</DialogDescription></DialogHeader><div className="mx-auto my-3 rounded-xl bg-white p-4"><QRCodeSVG value={inviteUrl} size={180} bgColor="#ffffff" fgColor="#111827" includeMargin /></div><div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-black/15 p-2"><Link2 className="ml-1 size-3.5 shrink-0 text-slate-600" /><span className="min-w-0 flex-1 truncate font-mono text-[9px] text-slate-500">{inviteUrl}</span><button onClick={() => void copyInvite()} className="grid size-7 shrink-0 place-items-center rounded-md text-slate-400 hover:bg-white/[0.07] hover:text-white" aria-label="Copy invite link">{copied ? <Check className="size-3.5 text-emerald-300" /> : <Copy className="size-3.5" />}</button></div>{copyFailed && <p className="mt-2 text-[10px] text-rose-300">Clipboard and sharing are unavailable in this browser.</p>}<div className="mt-1 flex gap-2"><Button onClick={shareInvite} className="h-9 flex-1 bg-cyan-300 text-xs font-bold text-[#07101a] hover:bg-cyan-200"><Share2 className="size-3.5" />{navigator.share ? "Share invite" : copied ? "Copied" : "Copy invite"}</Button><Button onClick={() => onOpenChange(false)} variant="outline" className="h-9 border-white/10 bg-transparent text-xs text-slate-400 hover:bg-white/[0.06] hover:text-white">Done</Button></div></DialogContent></Dialog>;
}
