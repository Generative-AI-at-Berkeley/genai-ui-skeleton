import type { Metadata } from "next";

import "./globals.css";

import { AppShell } from "@/components/layout/app-shell";
import { APP_NAME } from "@/config/constants";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "A barebones Next.js shell with Park UI components, ready to fork",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning is scoped to this element's own attributes
    // only, not its subtree. It has to be here because the inline script
    // below deliberately sets the class and color-scheme before React
    // hydrates, which is the point: without it, a dark-mode visitor sees the
    // light theme flash for one frame. React just needs to be told this one
    // mismatch is intentional.
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Sets the theme class before first paint. React mounting too late is
            what a dark-mode user would see as a white flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
