import { describe, expect, it } from "vitest";

import { parseError } from "@/lib/api-client";

describe("parseError", () => {
  it("uses a string detail as the message", () => {
    const error = parseError(JSON.stringify({ detail: "Key is wrong." }), 401, "/v1/x");
    expect(error.message).toBe("Key is wrong.");
    expect(error.status).toBe(401);
  });

  it("joins a validation list into one sentence", () => {
    const body = JSON.stringify({
      detail: [{ msg: "name is required" }, { msg: "too long" }],
    });
    expect(parseError(body, 422, "/v1/x").message).toBe("name is required. too long");
  });

  it("falls back to the raw body, then to the status", () => {
    expect(parseError("Bad gateway", 502, "/v1/x").message).toBe("Bad gateway");
    expect(parseError("", 500, "/v1/x").message).toBe(
      "Request to /v1/x failed with status 500.",
    );
  });
});
