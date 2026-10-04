import { Badge } from "@/components/ui";
import { PROJECT_STATUS_LABEL, ProjectStatus } from "@/types/enums";

/** Each palette here needs its bucket in theme/colors/, or the badge renders unstyled. */
const PALETTE_BY_STATUS: Record<ProjectStatus, "green" | "red" | "gray" | "blue"> = {
  [ProjectStatus.ACTIVE]: "blue",
  [ProjectStatus.AT_RISK]: "red",
  [ProjectStatus.PAUSED]: "gray",
  [ProjectStatus.SHIPPED]: "green",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Badge size="sm" variant="subtle" colorPalette={PALETTE_BY_STATUS[status]}>
      {PROJECT_STATUS_LABEL[status]}
    </Badge>
  );
}
