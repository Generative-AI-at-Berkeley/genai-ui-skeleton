import { redirect } from "next/navigation";

import { LANDING_ROUTE } from "@/config/nav";

/**
 * The landing route is derived from the nav, not written twice. Reordering
 * the sidebar moves this with it.
 */
export default function RootPage() {
  redirect(LANDING_ROUTE);
}
