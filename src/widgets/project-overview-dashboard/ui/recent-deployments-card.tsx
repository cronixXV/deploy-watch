import {
  Badge,
  Box,
  Button,
  Card,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

import type { Deployment } from '@/shared/api/mocks/model/types/types';

import { getDeploymentStatusColor } from '@/entities/project';
import { formatDate, formatStatus } from '@/shared/lib/format';

type RecentDeploymentsCardProps = {
  projectId: string;
  deployments: Deployment[];
};

export const RecentDeploymentsCard = ({
  projectId,
  deployments,
}: RecentDeploymentsCardProps) => {
  return (
    <Card.Root bg="white" borderColor="gray.200" shadow="sm">
      <Card.Header>
        <HStack justify="space-between">
          <Box>
            <Text fontWeight="semibold">Recent deployments</Text>
            <Text color="gray.500" fontSize="sm">
              Latest deployment activity for this project.
            </Text>
          </Box>

          <Button size="sm" variant="ghost" asChild>
            <RouterLink to={`/projects/${projectId}/deployments`}>
              View all
            </RouterLink>
          </Button>
        </HStack>
      </Card.Header>

      <Card.Body>
        {deployments.length ? (
          <Stack gap="3">
            {deployments.map((deployment) => (
              <HStack
                key={deployment.id}
                justify="space-between"
                rounded="lg"
                borderWidth="1px"
                borderColor="gray.100"
                p="3"
              >
                <Box>
                  <Text fontSize="sm" fontWeight="medium">
                    {deployment.version}
                  </Text>

                  <Text color="gray.500" fontSize="xs">
                    {deployment.environment} · {deployment.branch} ·{' '}
                    {formatDate(deployment.startedAt)}
                  </Text>
                </Box>

                <Badge
                  colorPalette={getDeploymentStatusColor(deployment.status)}
                  variant="subtle"
                >
                  {formatStatus(deployment.status)}
                </Badge>
              </HStack>
            ))}
          </Stack>
        ) : (
          <Box py="8" textAlign="center">
            <Text color="gray.500" fontSize="sm">
              No deployments yet.
            </Text>
          </Box>
        )}
      </Card.Body>
    </Card.Root>
  );
};
