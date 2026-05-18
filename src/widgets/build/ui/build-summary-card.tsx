import { Badge, Box, Card, HStack, Stack, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

import type { Build, PipelineRun } from '@/shared/api/mocks/model/types/types';

import {
  getBuildStatusColor,
  getPipelineStatusColor,
} from '@/entities/project';
import { formatDate, formatDuration, formatStatus } from '@/shared/lib/format';

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
  return (
    <Card.Root bg="white" borderColor="gray.200" shadow="sm">
      <Card.Header>
        <Box>
          <Text fontWeight="semibold">Build metadata</Text>
          <Text color="gray.500" fontSize="sm">
            Job, pipeline and commit information.
          </Text>
        </Box>
      </Card.Header>

      <Card.Body>
        <Stack gap="3">
          <HStack justify="space-between">
            <Text color="gray.500" fontSize="sm">
              Status
            </Text>

            {build?.status ? (
              <Badge
                colorPalette={getBuildStatusColor(build.status)}
                variant="subtle"
              >
                {formatStatus(build.status)}
              </Badge>
            ) : (
              <Text color="gray.500" fontSize="sm">
                —
              </Text>
            )}
          </HStack>

          <HStack justify="space-between">
            <Text color="gray.500" fontSize="sm">
              Job
            </Text>

            <Text fontSize="sm" fontWeight="medium">
              {build?.jobName ?? '—'}
            </Text>
          </HStack>

          <HStack justify="space-between">
            <Text color="gray.500" fontSize="sm">
              Pipeline
            </Text>

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
                —
              </Text>
            )}
          </HStack>

          <HStack justify="space-between">
            <Text color="gray.500" fontSize="sm">
              Pipeline status
            </Text>

            {pipelineRun?.status ? (
              <Badge
                colorPalette={getPipelineStatusColor(pipelineRun.status)}
                variant="subtle"
              >
                {formatStatus(pipelineRun.status)}
              </Badge>
            ) : (
              <Text color="gray.500" fontSize="sm">
                —
              </Text>
            )}
          </HStack>

          <HStack justify="space-between">
            <Text color="gray.500" fontSize="sm">
              Branch
            </Text>

            <Badge colorPalette="gray" variant="outline">
              {pipelineRun?.branch ?? '—'}
            </Badge>
          </HStack>

          <HStack align="start" justify="space-between">
            <Text color="gray.500" fontSize="sm">
              Commit
            </Text>

            <Box textAlign="right">
              <Text fontFamily="mono" fontSize="sm">
                {pipelineRun?.commitHash ?? '—'}
              </Text>

              <Text color="gray.500" fontSize="sm">
                {pipelineRun?.commitMessage ?? '—'}
              </Text>
            </Box>
          </HStack>

          <HStack justify="space-between">
            <Text color="gray.500" fontSize="sm">
              Author
            </Text>

            <Text fontSize="sm" fontWeight="medium">
              {authorName}
            </Text>
          </HStack>

          <HStack justify="space-between">
            <Text color="gray.500" fontSize="sm">
              Started at
            </Text>

            <Text fontSize="sm" fontWeight="medium">
              {formatDate(build?.startedAt)}
            </Text>
          </HStack>

          <HStack justify="space-between">
            <Text color="gray.500" fontSize="sm">
              Finished at
            </Text>

            <Text fontSize="sm" fontWeight="medium">
              {formatDate(build?.finishedAt)}
            </Text>
          </HStack>

          <HStack justify="space-between">
            <Text color="gray.500" fontSize="sm">
              Duration
            </Text>

            <Text fontSize="sm" fontWeight="medium">
              {formatDuration(build?.durationSec)}
            </Text>
          </HStack>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
