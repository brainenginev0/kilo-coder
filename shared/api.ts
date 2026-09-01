import { z } from "zod";

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1).max(20_000),
});

export const chatRequestSchema = z.object({
  projectId: z.string().min(1).max(120),
  messages: z.array(chatMessageSchema).min(1).max(40),
  model: z.string().min(1).max(160).optional(),
});

export const fileSnapshotSchema = z.object({
  path: z.string().min(1).max(240),
  content: z.string().max(500_000),
  language: z.string().min(1).max(32),
});

export const sandboxBuildRequestSchema = z.object({
  projectId: z.string().min(1).max(120),
  files: z.array(fileSnapshotSchema).max(500),
  command: z.string().min(1).max(4_000),
});

export const settingsConfigSchema = z.object({
  provider: z.literal("openai-compatible"),
  baseURL: z.string().url(),
  model: z.string().min(1),
  apiKeyEnv: z.string().min(1),
  routes: z.object({
    claude: z.object({
      baseURL: z.string().min(1),
      model: z.string().min(1),
      apiKeyEnv: z.string().min(1),
    }),
  }),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type FileSnapshot = z.infer<typeof fileSnapshotSchema>;
export type SandboxBuildRequest = z.infer<typeof sandboxBuildRequestSchema>;
export type SettingsConfig = z.infer<typeof settingsConfigSchema>;

export type ChatStreamEvent =
  | { type: "status"; status: "queued" | "generating" | "complete" }
  | { type: "token"; delta: string }
  | { type: "tool"; name: string; detail: string }
  | { type: "error"; message: string; code?: string }
  | { type: "done" };

export type SandboxStatus =
  | "queued"
  | "generating"
  | "building"
  | "running"
  | "failed"
  | "disconnected";

export interface SandboxBuildResponse {
  projectId: string;
  status: SandboxStatus;
  previewUrl?: string;
  runId?: string;
  message?: string;
}

export interface ProjectSession {
  projectId: string;
  name: string;
  framework: string;
  runtime: string;
  status: SandboxStatus;
  previewUrl?: string;
  files: FileSnapshot[];
}

export interface DemoResponse {
  message: string;
}
