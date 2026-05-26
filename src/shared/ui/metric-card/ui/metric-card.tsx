import { Stack, Text } from '@chakra-ui/react';

import { DefaultCard } from '../../default-card/ui/default-card';

import type { ReactNode } from 'react';

type MetricCardProps = {
  label: ReactNode;
  value: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
};

export const MetricCard = ({
  label,
  value,
  description,
  action,
  children,
}: MetricCardProps) => (
  <DefaultCard>
    <Stack gap="3">
      <Text color="gray.500" fontSize="sm" fontWeight="medium">
        {label}
      </Text>

      <Text fontSize="3xl" fontWeight="bold">
        {value}
      </Text>

      {description && (
        <Text color="gray.500" fontSize="sm">
          {description}
        </Text>
      )}

      {children}

      {action}
    </Stack>
  </DefaultCard>
);
