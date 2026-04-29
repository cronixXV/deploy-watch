import { Badge } from '@chakra-ui/react';

import type { DeploymentStatus } from '@/shared/api/mocks/model/types/types';

type DeploymentStatusBadgeProps = {
  status: DeploymentStatus;
};

const statusColorPalette: Record<DeploymentStatus, string> = {
  pending: 'gray',
  waiting_approval: 'yellow',
  deploying: 'blue',
  deployed: 'green',
  failed: 'red',
  rolled_back: 'purple',
  rejected: 'red',
};

export function DeploymentStatusBadge({ status }: DeploymentStatusBadgeProps) {
  return (
    <Badge colorPalette={statusColorPalette[status]} variant="subtle">
      {status.replaceAll('_', ' ')}
    </Badge>
  );
}
