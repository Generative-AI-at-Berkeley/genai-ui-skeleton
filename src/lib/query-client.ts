import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from "@tanstack/react-query";

/**
 * How long fetched data is considered fresh. Recruiting data changes on the
 * order of minutes, not milliseconds, so a short stale time avoids refetching
 * on every tab focus while still keeping the list current.
 */
const STALE_TIME_MS = 60 * 1000;

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME_MS,
        retry: 1,
      },
      dehydrate: {
        // Include still-pending queries when serializing server state, so a
        // query started during server render can finish on the client rather
        // than being thrown away and refetched.
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * One QueryClient per server request, one shared instance in the browser.
 *
 * On the server a shared client would leak one user's data into another user's
 * request. In the browser a new client on every render would throw away the
 * cache, so it has to be created once and reused.
 */
export function getQueryClient(): QueryClient {
  if (isServer) {
    return makeQueryClient();
  }
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
