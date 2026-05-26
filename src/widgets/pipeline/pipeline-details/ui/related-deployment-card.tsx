import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

import type { Deployment } from '@/shared/api/mocks/model/types/types';

import { formatDate, formatStatus } from '@/shared/lib/format';
import { DefaultCard } from '@/shared/ui/default-card/ui/default-card';
import { EmptyState } from '@/shared/ui/empty-state/ui/empty-state';
import { InfoRow } from '@/shared/ui/info-row/ui/info-row';
import { StatusBadge } from '@/shared/ui/status-badge/ui/status-badge';

type RelatedDeploymentCardProps = {
  projectId: string;
  deployment?: Deployment | null;
};

export const RelatedDeploymentCard = ({
  projectId,
  deployment,
}: RelatedDeploymentCardProps) => (
  <DefaultCard
    title="Related deployment"
    description="Deployment connected to this commit."
  >
    {deployment ? (
      <Stack gap="4">
        <InfoRow
          label={
            <Box>
              <Text fontWeight="medium" color="gray.900">
                {deployment.version}
              </Text>

              <Text color="gray.500" fontSize="sm">
                {formatStatus(deployment.environment)}
              </Text>
            </Box>
          }
        >
          <StatusBadge status={deployment.status} />
        </InfoRow>

        <Stack gap="2">
          <InfoRow label="Branch">
            <Text fontSize="sm" fontWeight="medium">
              {deployment.branch}
            </Text>
          </InfoRow>

          <InfoRow label="Started">
            <Text fontSize="sm" fontWeight="medium">
              {formatDate(deployment.startedAt)}
            </Text>
          </InfoRow>

          <InfoRow label="Finished">
            <Text fontSize="sm" fontWeight="medium">
              {formatDate(deployment.finishedAt)}
            </Text>
          </InfoRow>
        </Stack>

        <Button size="sm" variant="outline" asChild>
          <RouterLink to={`/projects/${projectId}/deployments`}>
            View deployments
            <ArrowRight size={16} />
          </RouterLink>
        </Button>
      </Stack>
    ) : (
      <EmptyState>No related deployment found.</EmptyState>
    )}
  </DefaultCard>
);
