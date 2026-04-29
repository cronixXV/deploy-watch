import { Badge } from '@chakra-ui/react';

import type { EnvironmentStatus } from '@/shared/api/mocks/model/types/types';

type EnvironmentStatusBadgeProps = {
  status: EnvironmentStatus;
};

const statusColorPalette: Record<EnvironmentStatus, string> = {
  healthy: 'green',
  degraded: 'orange',
  down: 'red',
  deploying: 'blue',
  locked: 'gray',
};

export function EnvironmentStatusBadge({
  status,
}: EnvironmentStatusBadgeProps) {
  return (
    <Badge colorPalette={statusColorPalette[status]} variant="subtle">
      {status}
    </Badge>
  );
}
