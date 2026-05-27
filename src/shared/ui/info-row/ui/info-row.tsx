import { HStack, Text } from '@chakra-ui/react';

import type { ReactNode } from 'react';

type InfoRowProps = {
  label: ReactNode;
  children?: ReactNode;
  align?: 'center' | 'start';
  value?: string;
};

export const InfoRow = ({
  label,
  children,
  align = 'center',
  value,
}: InfoRowProps) => (
  <HStack align={align} justify="space-between">
    <Text color="gray.500" fontSize="sm">
      {label}
    </Text>

    {value ? (
      <Text fontSize="sm" fontWeight="medium">
        {value}
      </Text>
    ) : null}

    {children}
  </HStack>
);
