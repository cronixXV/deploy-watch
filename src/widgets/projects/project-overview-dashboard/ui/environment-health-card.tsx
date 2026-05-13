import { Badge, Card, HStack, Stack, Text } from '@chakra-ui/react';

import type { Environment } from '@/shared/api/mocks/model/types/types';

import { getEnvironmentStatusColor } from '@/entities/project';
import { formatStatus } from '@/shared/lib/format';

type EnvironmentHealthCardProps = {
  environments: Environment[];
  healthyCount: number;
};

export const EnvironmentHealthCard = ({
  environments,
  healthyCount,
}: EnvironmentHealthCardProps) => {
  return (
    <Card.Root bg="white" borderColor="gray.200" shadow="sm">
      <Card.Body>
        <Stack gap="3">
          <Text color="gray.500" fontSize="sm" fontWeight="medium">
            Environment health
          </Text>

          <Text fontSize="3xl" fontWeight="bold">
            {healthyCount}/{environments.length}
          </Text>

          <Text color="gray.500" fontSize="sm">
            Healthy environments
          </Text>

          <Stack gap="2">
            {environments.map((environment) => (
              <HStack key={environment.id} justify="space-between">
                <Text fontSize="sm">{environment.name}</Text>

                <Badge
                  colorPalette={getEnvironmentStatusColor(environment.status)}
                  variant="subtle"
                >
                  {formatStatus(environment.status)}
                </Badge>
              </HStack>
            ))}
          </Stack>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
