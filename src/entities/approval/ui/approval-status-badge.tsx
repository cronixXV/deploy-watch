import { Badge } from '@chakra-ui/react';

import type { ApprovalStatus } from '@/shared/api/mocks/model/types/types';

type ApprovalStatusBadgeProps = {
  status: ApprovalStatus;
};

const statusColorPalette: Record<ApprovalStatus, string> = {
  pending: 'yellow',
  approved: 'green',
  rejected: 'red',
};

export function ApprovalStatusBadge({ status }: ApprovalStatusBadgeProps) {
  return (
    <Badge colorPalette={statusColorPalette[status]} variant="subtle">
      {status}
    </Badge>
  );
}
