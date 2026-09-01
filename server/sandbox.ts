import type {
  SandboxBuildRequest,
  SandboxBuildResponse,
} from "../shared/api";

export interface SandboxClient {
  submitBuild(request: SandboxBuildRequest): Promise<SandboxBuildResponse>;
}

class HttpSandboxClient implements SandboxClient {
  constructor(
    private readonly baseUrl: string,
    private readonly token?: string,
  ) {}

  async submitBuild(request: SandboxBuildRequest): Promise<SandboxBuildResponse> {
    const response = await fetch(`${this.baseUrl.replace(/\/$/, "")}/build`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(detail || `Sandbox runner returned HTTP ${response.status}.`);
    }

    return (await response.json()) as SandboxBuildResponse;
  }
}

class DisconnectedSandboxClient implements SandboxClient {
  async submitBuild(request: SandboxBuildRequest): Promise<SandboxBuildResponse> {
    return {
      projectId: request.projectId,
      status: "disconnected",
      message:
        "Connect an isolated sandbox runner with SANDBOX_BASE_URL to run generated code.",
    };
  }
}

export function createSandboxClient(): SandboxClient {
  const baseUrl = process.env.SANDBOX_BASE_URL;
  return baseUrl
    ? new HttpSandboxClient(baseUrl, process.env.SANDBOX_TOKEN)
    : new DisconnectedSandboxClient();
}
