import { Badge, Text } from '@chakra-ui/react';

import { formatStatus } from '@/shared/lib/format';
import { getStatusColor } from '@/shared/lib/get-color';

type StatusBadgeProps = {
  status?: string | null;
  variant?: 'subtle' | 'solid' | 'outline';
  fallback?: string;
};

export const StatusBadge = ({
  status,
  variant = 'subtle',
  fallback = '—',
}: StatusBadgeProps) => {
  if (!status) {
    return (
      <Text color="gray.500" fontSize="sm">
        {fallback}
      </Text>
    );
  }

  return (
    <Badge colorPalette={getStatusColor(status)} variant={variant}>
      {formatStatus(status)}
    </Badge>
  );
};
