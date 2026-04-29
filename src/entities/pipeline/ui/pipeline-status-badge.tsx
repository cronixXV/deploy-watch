import { Badge } from '@chakra-ui/react';

import type { PipelineStatus } from '@/shared/api/mocks/model/types/types';

type PipelineStatusBadgeProps = {
  status: PipelineStatus;
};

const statusColorPalette: Record<PipelineStatus, string> = {
  queued: 'gray',
  running: 'blue',
  success: 'green',
  failed: 'red',
  canceled: 'gray',
};

export function PipelineStatusBadge({ status }: PipelineStatusBadgeProps) {
  return (
    <Badge colorPalette={statusColorPalette[status]} variant="subtle">
      {status}
    </Badge>
  );
}
