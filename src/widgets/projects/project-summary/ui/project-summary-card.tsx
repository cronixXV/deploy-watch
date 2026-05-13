import {
  Badge,
  Box,
  Button,
  Card,
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
  getDeploymentStatusColor,
  getFailedBuildsCount,
  getHealthColor,
  getHealthDescription,
  getHealthLabel,
  getLastDeployment,
  getLastPipeline,
  getPipelineStatusColor,
  getProjectHealth,
} from '@/entities/project';
import { formatStatus, formatDate } from '@/shared/lib/format';

type ProjectSummaryCardProps = {
  project: Project;
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

  return (
    <Card.Root
      bg="white"
      borderColor={projectHealth === 'critical' ? 'red.200' : 'gray.200'}
      shadow="sm"
    >
      <Card.Body>
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
              <Box
                rounded="lg"
                borderWidth="1px"
                borderColor={`${getHealthColor(projectHealth)}.200`}
                bg={`${getHealthColor(projectHealth)}.50`}
                p="4"
              >
                <HStack justify="space-between" mb="1">
                  <Text
                    color={`${getHealthColor(projectHealth)}.700`}
                    fontSize="sm"
                    fontWeight="semibold"
                  >
                    Project health
                  </Text>

                  <Badge
                    colorPalette={getHealthColor(projectHealth)}
                    variant="solid"
                  >
                    {getHealthLabel(projectHealth)}
                  </Badge>
                </HStack>

                <Text
                  color={`${getHealthColor(projectHealth)}.700`}
                  fontSize="xs"
                >
                  {getHealthDescription(projectHealth)}
                </Text>
              </Box>

              <Stack gap="3">
                <HStack justify="space-between">
                  <Text color="gray.500" fontSize="sm">
                    Last pipeline
                  </Text>

                  <Badge
                    colorPalette={getPipelineStatusColor(lastPipeline?.status)}
                    variant="subtle"
                  >
                    {formatStatus(lastPipeline?.status)}
                  </Badge>
                </HStack>

                <HStack justify="space-between">
                  <Text color="gray.500" fontSize="sm">
                    Last deployment
                  </Text>

                  <HStack gap="2">
                    <Badge
                      colorPalette={getDeploymentStatusColor(
                        lastDeployment?.status,
                      )}
                      variant="subtle"
                    >
                      {formatStatus(lastDeployment?.status)}
                    </Badge>

                    <Text color="gray.500" fontSize="xs">
                      {formatDate(lastDeployment?.startedAt)}
                    </Text>
                  </HStack>
                </HStack>

                <HStack justify="space-between">
                  <Text color="gray.500" fontSize="sm">
                    Environments
                  </Text>

                  <Text fontSize="sm" fontWeight="medium">
                    {environmentsQuery.data?.length ?? 0}
                  </Text>
                </HStack>

                <HStack justify="space-between">
                  <Text color="gray.500" fontSize="sm">
                    Failed builds
                  </Text>

                  <Badge
                    colorPalette={failedBuildsCount > 0 ? 'red' : 'green'}
                    variant="subtle"
                  >
                    {failedBuildsCount}
                  </Badge>
                </HStack>
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
      </Card.Body>
    </Card.Root>
  );
};
