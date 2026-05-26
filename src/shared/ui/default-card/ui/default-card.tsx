import { Box, Card, HStack, Text } from '@chakra-ui/react';

import type { ReactNode } from 'react';

type DefaultCardProps = {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  borderColor?: string;
};

export const DefaultCard = ({
  title,
  description,
  action,
  children,
  borderColor = 'gray.200',
}: DefaultCardProps) => {
  const hasHeader = title || description || action;

  return (
    <Card.Root bg="white" borderColor={borderColor} shadow="sm">
      {hasHeader && (
        <Card.Header>
          <HStack justify="space-between" align="start">
            <Box>
              {title && <Text fontWeight="semibold">{title}</Text>}

              {description && (
                <Text color="gray.500" fontSize="sm">
                  {description}
                </Text>
              )}
            </Box>

            {action}
          </HStack>
        </Card.Header>
      )}

      <Card.Body>{children}</Card.Body>
    </Card.Root>
  );
};
