"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";

/** The pattern every server-state hook follows: one key, one client call. */
export function useHealth() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: apiClient.health,
    retry: false,
  });
}
