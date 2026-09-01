import type { ActivityItem, BuilderMessage, ProjectFile } from "./types";

export const projectFiles: ProjectFile[] = [
  { path: "app", content: "", language: "folder", kind: "folder" },
  {
    path: "app/page.tsx",
    language: "tsx",
    kind: "file",
    content: `export default function Page() {
  return (
    <main className="min-h-screen bg-[#0b1020] text-white">
      <h1>Ship with signal.</h1>
      <p>A calm command center for your next launch.</p>
    </main>
  )
}`,
  },
  { path: "components", content: "", language: "folder", kind: "folder" },
  {
    path: "components/MetricCard.tsx",
    language: "tsx",
    kind: "file",
    content: `export function MetricCard({ label, value }) {
  return <article><span>{label}</span><strong>{value}</strong></article>
}`,
  },
  { path: "lib", content: "", language: "folder", kind: "folder" },
  {
    path: "lib/data.ts",
    language: "ts",
    kind: "file",
    content: `export const metrics = [
  { label: "Active users", value: "24.8k" },
  { label: "Conversion", value: "8.4%" },
]`,
  },
  {
    path: "settings.json",
    language: "json",
    kind: "file",
    content: "",
  },
  {
    path: "package.json",
    language: "json",
    kind: "file",
    content: `{
  "name": "signal-launchpad",
  "scripts": { "dev": "next dev", "build": "next build" },
  "dependencies": { "next": "latest", "lucide-react": "latest" }
}`,
  },
];

export const initialMessages: BuilderMessage[] = [
  {
    id: "assistant-1",
    role: "assistant",
    time: "10:42 AM",
    content:
      "I’ve set up the launchpad foundation. It has a dark command-center layout, metric cards, and a responsive sidebar. What should we shape next?",
  },
  {
    id: "user-1",
    role: "user",
    time: "10:43 AM",
    content: "Make the activity chart feel more alive and add a gentle empty state.",
  },
  {
    id: "assistant-2",
    role: "assistant",
    time: "10:43 AM",
    content:
      "On it. I’ll tune the chart motion, add an intentional empty state, and keep the layout calm at smaller widths.",
  },
];

export const initialActivity: ActivityItem[] = [
  {
    id: "activity-1",
    title: "Created app/page.tsx",
    detail: "Scaffolded launchpad dashboard shell",
    state: "done",
    time: "10:42 AM",
  },
  {
    id: "activity-2",
    title: "Added responsive navigation",
    detail: "Sidebar collapses into a compact rail",
    state: "done",
    time: "10:42 AM",
  },
  {
    id: "activity-3",
    title: "Polishing activity chart",
    detail: "Generating component updates",
    state: "active",
  },
];

export const previewUrl = "https://preview.signal.build/launchpad";
