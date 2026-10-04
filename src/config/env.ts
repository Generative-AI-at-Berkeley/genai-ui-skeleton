/**
 * The only place in this app that reads process.env.
 *
 * Server only. The browser talks to this app's own /api/engine proxy, which
 * adds the service key, so nothing here is ever bundled for the client.
 */

import "server-only";

export class MissingEnvError extends Error {
  constructor(name: string) {
    super(
      `Missing required environment variable ${name}. Copy .env.example to .env.local and fill it in.`,
    );
    this.name = "MissingEnvError";
  }
}

function requireEnv(name: string, value: string | undefined): string {
  if (!value) throw new MissingEnvError(name);
  return value;
}

export function serverEnv() {
  return {
    apiBaseUrl: requireEnv("API_BASE_URL", process.env.API_BASE_URL),
    /** Blank means the API runs without a key, which should only be true locally. */
    serviceApiKey: process.env.SERVICE_API_KEY ?? "",
  } as const;
}
