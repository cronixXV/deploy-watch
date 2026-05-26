import { HStack, Text } from '@chakra-ui/react';

import type { ReactNode } from 'react';

type InfoRowProps = {
  label: ReactNode;
  children: ReactNode;
  align?: 'center' | 'start';
};

export const InfoRow = ({
  label,
  children,
  align = 'center',
}: InfoRowProps) => (
  <HStack align={align} justify="space-between">
    <Text color="gray.500" fontSize="sm">
      {label}
    </Text>

    {children}
  </HStack>
);
