import { NextResponse } from "next/server";

import { MissingEnvError, serverEnv } from "@/config/env";

/**
 * Forward a request to the API with the service key attached.
 *
 * Holding the key here, server side, is the whole point: a browser that called
 * the API directly would need the key in its bundle, where anyone can read it.
 * The body is streamed through untouched so multipart uploads survive.
 */
async function forward(request: Request, path: string[]): Promise<Response> {
  let env: ReturnType<typeof serverEnv>;
  try {
    env = serverEnv();
  } catch (error) {
    // Answer in the same `detail` shape as an API error, so the client shows
    // the sentence instead of a framework error page.
    if (error instanceof MissingEnvError) {
      return NextResponse.json({ detail: error.message }, { status: 503 });
    }
    throw error;
  }

  const url = new URL(request.url);
  const target = `${env.apiBaseUrl.replace(/\/$/, "")}/${path.join("/")}${url.search}`;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  if (env.serviceApiKey) headers.set("authorization", `Bearer ${env.serviceApiKey}`);

  try {
    const upstream = await fetch(target, {
      method: request.method,
      headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.arrayBuffer(),
    });
    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: {
        "content-type": upstream.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      {
        detail: `Could not reach the API at ${env.apiBaseUrl}. Start it, or check API_BASE_URL in .env.local.`,
      },
      { status: 502 },
    );
  }
}

type Context = { params: Promise<{ path: string[] }> };

async function handle(request: Request, context: Context) {
  return forward(request, (await context.params).path);
}

export {
  handle as DELETE,
  handle as GET,
  handle as PATCH,
  handle as POST,
  handle as PUT,
};
