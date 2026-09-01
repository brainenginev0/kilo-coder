export type ChatRole = "user" | "assistant";

export interface BuilderMessage {
  id: string;
  role: ChatRole;
  content: string;
  time: string;
  state?: "streaming" | "error";
}

export interface ProjectFile {
  path: string;
  content: string;
  language: string;
  kind: "file" | "folder";
}

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  state: "done" | "active" | "pending" | "error";
  time?: string;
}

export type Viewport = "desktop" | "tablet" | "mobile";
export type MobilePanel = "chat" | "preview" | "inspector";
