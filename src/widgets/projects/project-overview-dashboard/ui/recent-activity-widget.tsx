import { Badge, Box, Card, HStack, Stack, Text } from '@chakra-ui/react';

import { getActivityIcon, getStatusIcon } from '../lib/helpers';

import { type RecentActivityItem } from '@/entities/project';
import { formatDate, formatStatus } from '@/shared/lib/format';
import { getStatusColor } from '@/shared/lib/get-color';

type RecentActivityWidgetProps = {
  items: RecentActivityItem[];
};

export function RecentActivityWidget({ items }: RecentActivityWidgetProps) {
  return (
    <Card.Root bg="white" borderColor="gray.200" shadow="sm">
      <Card.Header>
        <Box>
          <Text fontWeight="semibold">Recent activity</Text>
          <Text color="gray.500" fontSize="sm">
            Latest pipeline, deployment and approval events.
          </Text>
        </Box>
      </Card.Header>

      <Card.Body>
        {items.length ? (
          <Stack gap="3">
            {items.map((item) => {
              const color = getStatusColor(item.status);

              return (
                <HStack
                  key={`${item.type}-${item.id}`}
                  align="start"
                  gap="3"
                  rounded="lg"
                  borderWidth="1px"
                  borderColor="gray.100"
                  p="3"
                >
                  <Box
                    display="grid"
                    placeItems="center"
                    boxSize="8"
                    rounded="full"
                    bg={`${color}.50`}
                    color={`${color}.600`}
                    flexShrink={0}
                  >
                    {getActivityIcon(item)}
                  </Box>

                  <Box flex="1" minW="0">
                    <HStack justify="space-between" align="start" gap="3">
                      <Box minW="0">
                        <Text fontSize="sm" fontWeight="medium">
                          {item.title}
                        </Text>

                        <Text color="gray.500" fontSize="xs" lineClamp={1}>
                          {item.description}
                        </Text>
                      </Box>

                      <Badge
                        colorPalette={color}
                        variant="subtle"
                        flexShrink={0}
                      >
                        <HStack gap="1">
                          {getStatusIcon(item.status)}
                          <Text as="span">{formatStatus(item.status)}</Text>
                        </HStack>
                      </Badge>
                    </HStack>

                    <Text color="gray.400" fontSize="xs" mt="1">
                      {formatDate(item.timestamp)}
                    </Text>
                  </Box>
                </HStack>
              );
            })}
          </Stack>
        ) : (
          <Box py="8" textAlign="center">
            <Text color="gray.500" fontSize="sm">
              No recent activity yet.
            </Text>
          </Box>
        )}
      </Card.Body>
    </Card.Root>
  );
}
