import { settingsConfigSchema, type SettingsConfig } from "@shared/api";

export function createSettingsConfig(
  model = "gpt-4o-mini",
  baseURL = "https://api.openai.com/v1",
): SettingsConfig {
  return {
    provider: "openai-compatible",
    baseURL,
    model,
    apiKeyEnv: "OPENAI_API_KEY",
    routes: {
      claude: {
        baseURL: `${baseURL.replace(/\/$/, "")}/chat/completions`,
        model,
        apiKeyEnv: "OPENAI_API_KEY",
      },
    },
  };
}

export function serializeSettings(config: SettingsConfig) {
  return `${JSON.stringify(settingsConfigSchema.parse(config), null, 2)}\n`;
}

export function parseSettings(value: string) {
  return settingsConfigSchema.parse(JSON.parse(value)) as SettingsConfig;
}

export function buildInviteUrl(
  sessionId: string,
  previewUrl: string,
  origin = window.location.origin,
) {
  const url = new URL("/", origin);
  url.searchParams.set("session", sessionId);
  url.searchParams.set("preview", previewUrl);
  return url.toString();
}
