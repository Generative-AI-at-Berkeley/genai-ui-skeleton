import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusBadge } from "@/components/common/status-badge";
import { PROJECT_STATUS_LABEL, ProjectStatus } from "@/types/enums";

describe("StatusBadge", () => {
  it("renders the label for every status", () => {
    for (const status of Object.values(ProjectStatus)) {
      const { unmount } = render(<StatusBadge status={status} />);
      expect(screen.getByText(PROJECT_STATUS_LABEL[status])).toBeInTheDocument();
      unmount();
    }
  });
});
