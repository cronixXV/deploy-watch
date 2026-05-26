import { Box, Text } from '@chakra-ui/react';

import type { ReactNode } from 'react';

type EmptyStateProps = {
  children: ReactNode;
};

export const EmptyState = ({ children }: EmptyStateProps) => (
  <Box py="8" textAlign="center">
    <Text color="gray.500" fontSize="sm">
      {children}
    </Text>
  </Box>
);
