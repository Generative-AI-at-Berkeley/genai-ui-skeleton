"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { getQueryClient } from "@/lib/query-client";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Client-side providers for the whole app.
 *
 * This is a client component so the rest of the tree can stay server
 * components. Only the parts that actually use hooks need "use client".
 */
export function Providers({ children }: ProvidersProps) {
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
