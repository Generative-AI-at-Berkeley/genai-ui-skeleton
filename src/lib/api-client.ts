import { API_ROUTES, PROXY_PREFIX } from "@/config/constants";
import type { Health } from "@/types/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Pull a human sentence out of an error body. FastAPI and the proxy route both
 * put it in `detail`; a validation error sends a list of them.
 */
export function parseError(body: string, status: number, path: string): ApiError {
  try {
    const parsed = JSON.parse(body) as { detail?: unknown };
    if (typeof parsed.detail === "string") return new ApiError(parsed.detail, status);
    if (Array.isArray(parsed.detail)) {
      const messages = parsed.detail
        .map((item: unknown) =>
          item && typeof item === "object" && "msg" in item ? String(item.msg) : null,
        )
        .filter((message): message is string => message !== null);
      return new ApiError(messages.join(". "), status);
    }
  } catch {
    // Not JSON. Fall through to the raw body.
  }
  return new ApiError(body || `Request to ${path} failed with status ${status}.`, status);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${PROXY_PREFIX}${path}`, init);
  } catch {
    throw new ApiError(
      "Could not reach the web server. Check that pnpm dev is running.",
      0,
    );
  }
  if (!response.ok) {
    throw parseError(await response.text().catch(() => ""), response.status, path);
  }
  return response.json() as Promise<T>;
}

/**
 * The only module that knows the API's URL shape. Everything else calls these.
 */
export const apiClient = {
  health: () => request<Health>(API_ROUTES.health),
};
