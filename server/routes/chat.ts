import type { RequestHandler } from "express";
import { chatRequestSchema } from "../../shared/api";
import { streamChatCompletion } from "../llm";

export const handleChat: RequestHandler = async (req, res) => {
  const parsed = chatRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Invalid chat request.",
      issues: parsed.error.flatten(),
    });
    return;
  }

  res.status(200);
  res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  try {
    for await (const event of streamChatCompletion(
      parsed.data.messages,
      parsed.data.model,
    )) {
      res.write(`${JSON.stringify(event)}\n`);
    }
    res.end();
  } catch (error) {
    res.write(
      `${JSON.stringify({
        type: "error",
        code: "PROVIDER_REQUEST_FAILED",
        message: error instanceof Error ? error.message : "The model request failed.",
      })}\n`,
    );
    res.end();
  }
};
