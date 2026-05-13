import { Card, Stack, Text } from '@chakra-ui/react';

import { formatDuration } from '@/shared/lib/format';

type BuildMetricsCardsProps = {
  successRate: number;
  averageBuildDuration?: number;
};

export const BuildMetricsCards = ({
  successRate,
  averageBuildDuration,
}: BuildMetricsCardsProps) => {
  return (
    <>
      <Card.Root bg="white" borderColor="gray.200" shadow="sm">
        <Card.Body>
          <Stack gap="2">
            <Text color="gray.500" fontSize="sm" fontWeight="medium">
              Build success rate
            </Text>

            <Text fontSize="3xl" fontWeight="bold">
              {successRate}%
            </Text>

            <Text color="gray.500" fontSize="sm">
              Based on completed builds
            </Text>
          </Stack>
        </Card.Body>
      </Card.Root>

      <Card.Root bg="white" borderColor="gray.200" shadow="sm">
        <Card.Body>
          <Stack gap="2">
            <Text color="gray.500" fontSize="sm" fontWeight="medium">
              Average build duration
            </Text>

            <Text fontSize="3xl" fontWeight="bold">
              {formatDuration(averageBuildDuration)}
            </Text>

            <Text color="gray.500" fontSize="sm">
              Across builds with recorded duration
            </Text>
          </Stack>
        </Card.Body>
      </Card.Root>
    </>
  );
};
