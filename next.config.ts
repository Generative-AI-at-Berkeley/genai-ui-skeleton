import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js writes its own AGENTS.md and CLAUDE.md into this directory on every
  // dev run. The governance rules for this repo live in the root AGENTS.md, and
  // a second competing file is exactly the kind of confusion that doc exists to
  // prevent. Turn the generator off.
  agentRules: false,
};

export default nextConfig;
