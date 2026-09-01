import type { RequestHandler } from "express";
import { sandboxBuildRequestSchema } from "../../shared/api";
import { createSandboxClient } from "../sandbox";

const sandboxClient = createSandboxClient();

export const handleProjectBuild: RequestHandler = async (req, res) => {
  const parsed = sandboxBuildRequestSchema.safeParse({
    ...req.body,
    projectId: req.params.projectId,
  });

  if (!parsed.success) {
    res.status(400).json({
      message: "Invalid sandbox build request.",
      issues: parsed.error.flatten(),
    });
    return;
  }

  try {
    const result = await sandboxClient.submitBuild(parsed.data);
    res.status(result.status === "failed" ? 502 : 200).json(result);
  } catch (error) {
    res.status(502).json({
      projectId: parsed.data.projectId,
      status: "failed",
      message: error instanceof Error ? error.message : "The sandbox request failed.",
    });
  }
};
