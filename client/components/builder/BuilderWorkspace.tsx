import { useMemo, useState } from "react";
import { Files, MessageSquare, MonitorPlay, PanelLeft, Rocket, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ChatStreamEvent, FileSnapshot, SandboxStatus } from "@shared/api";
import { buildInviteUrl, createSettingsConfig, serializeSettings } from "@/lib/settings";
import { ChatPanel } from "./ChatPanel";
import { initialActivity, initialMessages, previewUrl as seededPreviewUrl, projectFiles } from "./mock-data";
import { InspectorPanel } from "./InspectorPanel";
import { InviteDialog } from "./InviteDialog";
import { PreviewPanel } from "./PreviewPanel";
import { ProjectRail } from "./ProjectRail";
import { TopBar } from "./TopBar";
import type { ActivityItem, BuilderMessage, MobilePanel, ProjectFile, Viewport } from "./types";

type PreviewTab = "preview" | "code" | "console";
type InspectorTab = "files" | "settings";

export function BuilderWorkspace() {
  const { toast } = useToast();
  const settingsJson = useMemo(() => serializeSettings(createSettingsConfig()), []);
  const [files, setFiles] = useState<ProjectFile[]>(() => projectFiles.map((file) => file.path === "settings.json" ? { ...file, content: settingsJson } : file));
  const [messages, setMessages] = useState<BuilderMessage[]>(initialMessages);
  const [activity, setActivity] = useState<ActivityItem[]>(initialActivity);
  const [selectedPath, setSelectedPath] = useState("app/page.tsx");
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [previewTab, setPreviewTab] = useState<PreviewTab>("preview");
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("files");
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("chat");
  const [isGenerating, setIsGenerating] = useState(false);
  const [providerReady, setProviderReady] = useState(false);
  const [sandboxStatus, setSandboxStatus] = useState<SandboxStatus>("disconnected");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const selectedFile = files.find((file) => file.path === selectedPath);
  const inviteUrl = buildInviteUrl("launchpad-session", seededPreviewUrl);

  function addActivity(item: ActivityItem) {
    setActivity((current) => [...current, item]);
  }

  async function submitPrompt(prompt: string) {
    if (isGenerating) return;
    const userMessage: BuilderMessage = { id: crypto.randomUUID(), role: "user", time: now(), content: prompt };
    const assistantId = crypto.randomUUID();
    const assistantMessage: BuilderMessage = { id: assistantId, role: "assistant", time: now(), content: "", state: "streaming" };
    const requestMessages = [...messages, userMessage].map(({ role, content }) => ({ role, content }));
    setMessages((current) => [...current, userMessage, assistantMessage]);
    setIsGenerating(true);
    setMobilePanel("chat");
    setActivity((current) => current.map((item) => item.state === "active" ? { ...item, state: "done", time: now() } : item));
    addActivity({ id: crypto.randomUUID(), title: "Reading your instruction", detail: prompt.slice(0, 52), state: "active" });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: "signal-launchpad", messages: requestMessages, model: "gpt-4o-mini" }),
      });
      if (!response.ok || !response.body) {
        const errorBody = await response.json().catch(() => null) as { message?: string } | null;
        throw new Error(errorBody?.message ?? "The chat request could not start.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let hadError = false;
      while (true) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as ChatStreamEvent;
          if (event.type === "status" && event.status === "generating") setProviderReady(true);
          if (event.type === "token") {
            setProviderReady(true);
            setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, content: message.content + event.delta } : message));
          }
          if (event.type === "error") {
            hadError = true;
            setProviderReady(false);
            setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, content: event.message, state: "error" } : message));
            toast({ title: event.code === "PROVIDER_NOT_CONFIGURED" ? "Connect a model provider" : "Codex could not respond", description: event.message, variant: "destructive" });
          }
        }
        if (done) break;
      }
      setMessages((current) => current.map((message) => message.id === assistantId && !hadError ? { ...message, content: message.content || "I’m ready for the next change.", state: undefined } : message));
      setActivity((current) => current.map((item) => item.state === "active" ? { ...item, state: hadError ? "error" : "done", detail: hadError ? "Provider needs configuration" : "Assistant response complete", time: now() } : item));
    } catch (error) {
      const message = error instanceof Error ? error.message : "The chat request failed.";
      setMessages((current) => current.map((item) => item.id === assistantId ? { ...item, content: message, state: "error" } : item));
      setActivity((current) => current.map((item) => item.state === "active" ? { ...item, state: "error", detail: "Request failed", time: now() } : item));
      toast({ title: "Could not reach Codex", description: message, variant: "destructive" });
    } finally {
      setIsGenerating(false);
      void requestSandboxBuild();
    }
  }

  async function requestSandboxBuild() {
    const snapshot: FileSnapshot[] = files.filter((file) => file.kind === "file").map(({ path, content, language }) => ({ path, content, language }));
    setSandboxStatus("building");
    try {
      const response = await fetch("/api/projects/signal-launchpad/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: snapshot, command: "pnpm build" }),
      });
      const result = await response.json() as { status?: SandboxStatus; message?: string };
      const status = result.status ?? "failed";
      setSandboxStatus(status);
      if (status === "disconnected") {
        toast({ title: "Sandbox runner not connected", description: result.message });
      }
    } catch (error) {
      setSandboxStatus("failed");
      toast({ title: "Preview build failed", description: error instanceof Error ? error.message : "The isolated runner could not be reached.", variant: "destructive" });
    }
  }

  function handleNewProject() {
    setMessages([{ id: crypto.randomUUID(), role: "assistant", time: now(), content: "New workspace ready. Describe the full-stack app you want to build, and I’ll map the first slice." }]);
    setActivity([]);
    setSelectedPath("app/page.tsx");
    toast({ title: "Fresh workspace created", description: "Your current launchpad remains available in Versions." });
  }

  function handleCopySettings() {
    void navigator.clipboard?.writeText(settingsJson);
    toast({ title: "settings.json copied", description: "The provider-neutral Claude route is ready to paste." });
  }

  function handleDeploy() {
    toast({ title: "Deployment checklist ready", description: "Connect a repository or sandbox runner to enable deploy from this workspace." });
  }

  function handleRefresh() {
    setIsRefreshing(true);
    window.setTimeout(() => setIsRefreshing(false), 650);
  }

  return <div className="min-h-screen bg-[#080c16] text-slate-200 selection:bg-cyan-300/30 selection:text-cyan-50">
    <div className="flex h-screen min-h-[640px] overflow-hidden bg-[linear-gradient(135deg,#080c16_0%,#0d1322_58%,#11152a_100%)]">
      <ProjectRail onNewProject={handleNewProject} />
      <main className="flex min-w-0 flex-1 flex-col">
        <TopBar viewport={viewport} onViewportChange={setViewport} onShare={() => setInviteOpen(true)} onDeploy={handleDeploy} />
        <div className="hidden min-h-0 flex-1 lg:flex">
          <ChatPanel messages={messages} activity={activity} isGenerating={isGenerating} providerReady={providerReady} onSubmit={submitPrompt} />
          <PreviewPanel viewport={viewport} onRefresh={handleRefresh} previewUrl={seededPreviewUrl} selectedFile={selectedFile} isRefreshing={isRefreshing} activeTab={previewTab} onTabChange={setPreviewTab} sandboxStatus={sandboxStatus} />
          <InspectorPanel files={files} selectedPath={selectedPath} settingsJson={settingsJson} activeTab={inspectorTab} onTabChange={setInspectorTab} onSelectFile={(path) => { setSelectedPath(path); setPreviewTab("code"); }} onCopySettings={handleCopySettings} />
        </div>
        <div className="flex min-h-0 flex-1 lg:hidden">
          {mobilePanel === "chat" && <ChatPanel messages={messages} activity={activity} isGenerating={isGenerating} providerReady={providerReady} onSubmit={submitPrompt} />}
          {mobilePanel === "preview" && <PreviewPanel viewport={viewport} onRefresh={handleRefresh} previewUrl={seededPreviewUrl} selectedFile={selectedFile} isRefreshing={isRefreshing} activeTab={previewTab} onTabChange={setPreviewTab} sandboxStatus={sandboxStatus} />}
          {mobilePanel === "inspector" && <MobileInspector files={files} selectedPath={selectedPath} settingsJson={settingsJson} activeTab={inspectorTab} onTabChange={setInspectorTab} onSelectFile={(path) => { setSelectedPath(path); setPreviewTab("code"); setMobilePanel("preview"); }} onCopySettings={handleCopySettings} mobile />}
        </div>
        <MobileNav active={mobilePanel} onChange={setMobilePanel} />
      </main>
    </div>
    <InviteDialog open={inviteOpen} inviteUrl={inviteUrl} onOpenChange={setInviteOpen} />
  </div>;
}

function MobileInspector(props: React.ComponentProps<typeof InspectorPanel>) {
  return <div className="flex min-h-0 flex-1 flex-col">{props.activeTab === "files" ? <InspectorPanel {...props} /> : <InspectorPanel {...props} />}</div>;
}

function MobileNav({ active, onChange }: { active: MobilePanel; onChange: (panel: MobilePanel) => void }) {
  return <nav className="flex h-12 shrink-0 items-center justify-around border-t border-white/[0.08] bg-[#090d1a] px-4 lg:hidden"><MobileNavButton active={active === "chat"} onClick={() => onChange("chat")} icon={MessageSquare} label="Chat" /><MobileNavButton active={active === "preview"} onClick={() => onChange("preview")} icon={MonitorPlay} label="Preview" /><MobileNavButton active={active === "inspector"} onClick={() => onChange("inspector")} icon={Files} label="Files" /></nav>;
}

function MobileNavButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: typeof PanelLeft; label: string }) {
  return <button onClick={onClick} className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[10px] font-semibold ${active ? "bg-violet-300/15 text-violet-100" : "text-slate-600"}`}><Icon className="size-3.5" />{label}</button>;
}

function now() {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date());
}
