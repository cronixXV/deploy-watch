import {
  Badge,
  Box,
  Button,
  HStack,
  Skeleton,
  Stack,
  Text,
} from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

import type { Project } from '@/shared/api/mocks/model/types/types';

import { useProjectBuildsQuery } from '@/entities/build';
import { useProjectDeploymentsQuery } from '@/entities/deployment';
import { useProjectEnvironmentsQuery } from '@/entities/environment';
import { useProjectPipelineRunsQuery } from '@/entities/pipeline';
import {
  getFailedBuildsCount,
  getLastDeployment,
  getLastPipeline,
  getProjectHealth,
} from '@/entities/project';
import { formatDate } from '@/shared/lib/format';
import { getStatusColor } from '@/shared/lib/get-color';
import { DefaultCard } from '@/shared/ui/default-card/ui/default-card';
import { InfoRow } from '@/shared/ui/info-row/ui/info-row';
import { StatusBadge } from '@/shared/ui/status-badge/ui/status-badge';

type ProjectSummaryCardProps = {
  project: Project;
};

type ProjectHealthBlockProps = {
  health: string;
};

const ProjectHealthBlock = ({ health }: ProjectHealthBlockProps) => {
  const color = getStatusColor(health);

  return (
    <Box
      rounded="lg"
      borderWidth="1px"
      borderColor={`${color}.200`}
      bg={`${color}.50`}
      p="4"
    >
      <HStack justify="space-between" mb="1">
        <Text color={`${color}.700`} fontSize="sm" fontWeight="semibold">
          Project health
        </Text>

        <Badge colorPalette={color} variant="solid">
          {health}
        </Badge>
      </HStack>

      <Text color={`${color}.700`} fontSize="xs">
        {health}
      </Text>
    </Box>
  );
};

export const ProjectSummaryCard = ({ project }: ProjectSummaryCardProps) => {
  const pipelineRunsQuery = useProjectPipelineRunsQuery({
    projectId: project.id,
  });

  const deploymentsQuery = useProjectDeploymentsQuery({
    projectId: project.id,
  });

  const environmentsQuery = useProjectEnvironmentsQuery(project.id);

  const failedBuildsQuery = useProjectBuildsQuery({
    projectId: project.id,
    status: 'failed',
  });

  const lastPipeline = getLastPipeline(pipelineRunsQuery.data);
  const lastDeployment = getLastDeployment(deploymentsQuery.data);
  const failedBuildsCount = getFailedBuildsCount(failedBuildsQuery.data);

  const projectHealth = getProjectHealth({
    lastPipeline,
    lastDeployment,
    environments: environmentsQuery.data,
    failedBuildsCount,
  });
  const isSummaryLoading =
    pipelineRunsQuery.isLoading ||
    deploymentsQuery.isLoading ||
    environmentsQuery.isLoading ||
    failedBuildsQuery.isLoading;

  const environmentsCount = Array.isArray(environmentsQuery.data)
    ? environmentsQuery.data.length
    : 0;
  return (
    <DefaultCard
      borderColor={projectHealth === 'critical' ? 'red.200' : 'gray.200'}
    >
      <Stack gap="5">
        <HStack align="start" justify="space-between">
          <Box>
            <Text fontSize="lg" fontWeight="semibold">
              {project.name}
            </Text>

            <Text color="gray.500" fontSize="sm">
              {project.repository}
            </Text>
          </Box>

          <Badge colorPalette="gray" variant="subtle">
            {project.defaultBranch}
          </Badge>
        </HStack>

        {isSummaryLoading ? (
          <Stack gap="3">
            <Skeleton h="18px" />
            <Skeleton h="18px" />
            <Skeleton h="18px" />
            <Skeleton h="18px" />
          </Stack>
        ) : (
          <Stack gap="4">
            <ProjectHealthBlock health={projectHealth} />

            <Stack gap="3">
              <InfoRow label="Last pipeline">
                <StatusBadge status={lastPipeline?.status} />
              </InfoRow>

              <InfoRow label="Last deployment">
                <HStack gap="2">
                  <StatusBadge status={lastDeployment?.status} />

                  <Text color="gray.500" fontSize="xs">
                    {formatDate(lastDeployment?.startedAt)}
                  </Text>
                </HStack>
              </InfoRow>

              <InfoRow label="Environments">
                <Text fontSize="sm" fontWeight="medium">
                  {environmentsCount}
                </Text>
              </InfoRow>

              <InfoRow label="Failed builds">
                <Badge
                  colorPalette={failedBuildsCount > 0 ? 'red' : 'green'}
                  variant="subtle"
                >
                  {failedBuildsCount}
                </Badge>
              </InfoRow>
            </Stack>
          </Stack>
        )}

        <HStack justify="flex-end">
          <Button colorPalette="teal" size="sm" variant="ghost" asChild>
            <RouterLink to={`/projects/${project.id}`}>
              Open project
              <ArrowRight size={16} />
            </RouterLink>
          </Button>
        </HStack>
      </Stack>
    </DefaultCard>
  );
};
