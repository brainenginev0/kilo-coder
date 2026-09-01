import { describe, expect, it } from "vitest";
import {
  buildInviteUrl,
  createSettingsConfig,
  parseSettings,
  serializeSettings,
} from "./settings";

describe("settings utilities", () => {
  it("serializes a stable OpenAI-compatible Claude route", () => {
    const serialized = serializeSettings(
      createSettingsConfig("openai/gpt-4o", "https://gateway.example/v1"),
    );

    expect(serialized).toContain('"provider": "openai-compatible"');
    expect(serialized).toContain('"model": "openai/gpt-4o"');
    expect(parseSettings(serialized).routes.claude.baseURL).toBe(
      "https://gateway.example/v1/chat/completions",
    );
  });

  it("builds a shareable session URL", () => {
    expect(
      buildInviteUrl("launchpad-42", "https://preview.example/app", "https://forge.example"),
    ).toBe(
      "https://forge.example/?session=launchpad-42&preview=https%3A%2F%2Fpreview.example%2Fapp",
    );
  });
});
