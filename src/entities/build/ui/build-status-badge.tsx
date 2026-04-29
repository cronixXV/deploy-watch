import { Badge } from '@chakra-ui/react';

import type { BuildStatus } from '@/shared/api/mocks/model/types/types';

type BuildStatusBadgeProps = {
  status: BuildStatus;
};

const statusColorPalette: Record<BuildStatus, string> = {
  queued: 'gray',
  running: 'blue',
  success: 'green',
  failed: 'red',
  canceled: 'gray',
};

export function BuildStatusBadge({ status }: BuildStatusBadgeProps) {
  return (
    <Badge colorPalette={statusColorPalette[status]} variant="subtle">
      {status}
    </Badge>
  );
}
