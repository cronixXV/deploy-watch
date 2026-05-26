import { Badge, Box, Button, HStack, Stack, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

import type { Deployment } from '@/shared/api/mocks/model/types/types';

import { formatDate, formatStatus } from '@/shared/lib/format';
import { getStatusColor } from '@/shared/lib/get-color';
import { DefaultCard } from '@/shared/ui/default-card/ui/default-card';
import { EmptyState } from '@/shared/ui/empty-state/ui/empty-state';

type RecentDeploymentsCardProps = {
  projectId: string;
  deployments: Deployment[];
};

export const RecentDeploymentsCard = ({
  projectId,
  deployments,
}: RecentDeploymentsCardProps) => (
  <DefaultCard
    title="Recent deployments"
    description="Latest deployment activity for this project."
    action={
      <Button size="sm" variant="ghost" asChild>
        <RouterLink to={`/projects/${projectId}/deployments`}>
          View all
        </RouterLink>
      </Button>
    }
  >
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
              colorPalette={getStatusColor(deployment.status)}
              variant="subtle"
            >
              {formatStatus(deployment.status)}
            </Badge>
          </HStack>
        ))}
      </Stack>
    ) : (
      <EmptyState>No deployments yet.</EmptyState>
    )}
  </DefaultCard>
);
