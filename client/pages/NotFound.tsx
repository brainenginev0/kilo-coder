import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return <div className="flex min-h-screen items-center justify-center bg-[#080c16] px-6 text-slate-200"><div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#10172a] p-8 text-center shadow-[0_24px_90px_rgba(0,0,0,0.35)]"><div className="mx-auto grid size-11 place-items-center rounded-xl bg-cyan-300 text-[#07101a]"><Sparkles className="size-5 fill-current" /></div><p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-violet-300">Codex Forge / route unavailable</p><h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.06em] text-white">404</h1><p className="mt-3 text-sm leading-relaxed text-slate-500">This workspace hasn’t been generated yet. Continue prompting to fill in this page.</p><Link to="/" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2.5 text-xs font-bold text-[#07101a] transition-colors hover:bg-cyan-200"><ArrowLeft className="size-3.5" /> Return to workspace</Link></div></div>;
};

export default NotFound;
