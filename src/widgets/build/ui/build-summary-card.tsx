import { Badge, Box, Stack, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

import type { Build, PipelineRun } from '@/shared/api/mocks/model/types/types';

import { formatDate, formatDuration } from '@/shared/lib/format';
import { DefaultCard } from '@/shared/ui/default-card/ui/default-card';
import { InfoRow } from '@/shared/ui/info-row/ui/info-row';
import { StatusBadge } from '@/shared/ui/status-badge/ui/status-badge';

type BuildSummaryCardProps = {
  projectId: string;
  build?: Build;
  pipelineRun?: PipelineRun;
  authorName: string;
};

export const BuildSummaryCard = ({
  projectId,
  build,
  pipelineRun,
  authorName,
}: BuildSummaryCardProps) => {
  const fallbackValue = '—';

  return (
    <DefaultCard
      title="Build metadata"
      description="Job, pipeline and commit information."
    >
      <Stack gap="3">
        <InfoRow label="Status">
          <StatusBadge status={build?.status} />
        </InfoRow>

        <InfoRow label="Job">
          <Text fontSize="sm" fontWeight="medium">
            {build?.jobName ?? fallbackValue}
          </Text>
        </InfoRow>

        <InfoRow label="Pipeline">
          {pipelineRun ? (
            <Text color="teal.600" fontSize="sm" fontWeight="medium" asChild>
              <RouterLink
                to={`/projects/${projectId}/pipelines/${pipelineRun.id}`}
              >
                {pipelineRun.id}
              </RouterLink>
            </Text>
          ) : (
            <Text color="gray.500" fontSize="sm">
              {fallbackValue}
            </Text>
          )}
        </InfoRow>

        <InfoRow label="Pipeline status">
          <StatusBadge status={pipelineRun?.status} />
        </InfoRow>

        <InfoRow label="Branch">
          {pipelineRun?.branch ? (
            <Badge colorPalette="gray" variant="outline">
              {pipelineRun.branch}
            </Badge>
          ) : (
            <Text color="gray.500" fontSize="sm">
              {fallbackValue}
            </Text>
          )}
        </InfoRow>

        <InfoRow label="Commit" align="start">
          <Box textAlign="right">
            <Text fontFamily="mono" fontSize="sm">
              {pipelineRun?.commitHash ?? fallbackValue}
            </Text>

            <Text color="gray.500" fontSize="sm">
              {pipelineRun?.commitMessage ?? fallbackValue}
            </Text>
          </Box>
        </InfoRow>

        <InfoRow label="Author">
          <Text fontSize="sm" fontWeight="medium">
            {authorName || fallbackValue}
          </Text>
        </InfoRow>

        <InfoRow label="Started at">
          <Text fontSize="sm" fontWeight="medium">
            {formatDate(build?.startedAt)}
          </Text>
        </InfoRow>

        <InfoRow label="Finished at">
          <Text fontSize="sm" fontWeight="medium">
            {formatDate(build?.finishedAt)}
          </Text>
        </InfoRow>

        <InfoRow label="Duration">
          <Text fontSize="sm" fontWeight="medium">
            {formatDuration(build?.durationSec)}
          </Text>
        </InfoRow>
      </Stack>
    </DefaultCard>
  );
};
