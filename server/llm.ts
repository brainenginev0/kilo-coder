import type { ChatMessage, ChatStreamEvent } from "../shared/api";

const DEFAULT_MODEL = "gpt-4o-mini";

function completionUrl(baseUrl: string) {
  return baseUrl.endsWith("/")
    ? `${baseUrl}chat/completions`
    : `${baseUrl}/chat/completions`;
}

export async function* streamChatCompletion(
  messages: ChatMessage[],
  requestedModel?: string,
): AsyncGenerator<ChatStreamEvent> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    yield {
      type: "error",
      code: "PROVIDER_NOT_CONFIGURED",
      message:
        "Connect an OpenAI-compatible provider by setting OPENAI_API_KEY on the server.",
    };
    return;
  }

  const baseUrl = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
  const model = requestedModel ?? process.env.OPENAI_MODEL ?? DEFAULT_MODEL;
  const response = await fetch(completionUrl(baseUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    yield {
      type: "error",
      code: `PROVIDER_${response.status}`,
      message: detail || `The model provider returned HTTP ${response.status}.`,
    };
    return;
  }

  if (!response.body) {
    yield {
      type: "error",
      code: "EMPTY_PROVIDER_STREAM",
      message: "The model provider returned an empty stream.",
    };
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  yield { type: "status", status: "generating" };

  const emitSseLines = async function* (flush = false): AsyncGenerator<ChatStreamEvent> {
    if (flush && buffer.trim()) {
      buffer += "\n";
    }
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const value = line.trim();
      if (!value.startsWith("data:")) continue;
      const payload = value.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const parsed = JSON.parse(payload) as {
          choices?: Array<{ delta?: { content?: string } }>;
        };
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) yield { type: "token", delta };
      } catch {
        yield {
          type: "error",
          code: "INVALID_PROVIDER_EVENT",
          message: "The model provider returned an unreadable stream event.",
        };
      }
    }
  };

  while (true) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });
    for await (const event of emitSseLines(done)) yield event;
    if (done) break;
  }

  yield { type: "status", status: "complete" };
}
