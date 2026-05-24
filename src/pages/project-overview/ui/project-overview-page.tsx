import { Card, Grid, Skeleton, Stack, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useApprovalsQuery } from '@/entities/approval';
import {
  getBuildStatusByDayChartData,
  useProjectBuildsQuery,
} from '@/entities/build';
import { getAverageBuildDurationByDayChartData } from '@/entities/build';
import { useProjectDeploymentsQuery } from '@/entities/deployment';
import { useProjectEnvironmentsQuery } from '@/entities/environment';
import { useProjectPipelineRunsQuery } from '@/entities/pipeline';
import {
  getAverageBuildDuration,
  getBuildSuccessRate,
  getDeployFrequencyChartData,
  getDeploymentActivityByEnvironmentChartData,
  getHealthyEnvironmentsCount,
  getLastPipeline,
  getPipelineStatusDistributionChartData,
  getRecentActivityItems,
  getRecentDeployments,
  useProjectQuery,
} from '@/entities/project';
import { PageErrorState } from '@/shared/ui/page-error-state/ui/page-errors-state';
import { ProjectOverviewDashboard } from '@/widgets/projects';

export function ProjectOverviewPage() {
  const { projectId } = useParams();
  const safeProjectId = projectId ?? '';

  const projectQuery = useProjectQuery(safeProjectId);
  const pipelineRunsQuery = useProjectPipelineRunsQuery({
    projectId: safeProjectId,
  });
  const buildsQuery = useProjectBuildsQuery({
    projectId: safeProjectId,
  });
  const deploymentsQuery = useProjectDeploymentsQuery({
    projectId: safeProjectId,
  });
  const environmentsQuery = useProjectEnvironmentsQuery(safeProjectId);
  const approvalsQuery = useApprovalsQuery({
    projectId: safeProjectId,
    status: 'pending',
  });

  const isLoading =
    projectQuery.isLoading ||
    pipelineRunsQuery.isLoading ||
    buildsQuery.isLoading ||
    deploymentsQuery.isLoading ||
    environmentsQuery.isLoading ||
    approvalsQuery.isLoading;

  const isError =
    projectQuery.isError ||
    pipelineRunsQuery.isError ||
    buildsQuery.isError ||
    deploymentsQuery.isError ||
    environmentsQuery.isError ||
    approvalsQuery.isError;

  const error =
    projectQuery.error ??
    pipelineRunsQuery.error ??
    buildsQuery.error ??
    deploymentsQuery.error ??
    environmentsQuery.error ??
    approvalsQuery.error;

  const isFetching =
    projectQuery.isFetching ||
    pipelineRunsQuery.isFetching ||
    buildsQuery.isFetching ||
    deploymentsQuery.isFetching ||
    environmentsQuery.isFetching ||
    approvalsQuery.isFetching;

  const handleRefresh = () => {
    projectQuery.refetch();
    pipelineRunsQuery.refetch();
    buildsQuery.refetch();
    deploymentsQuery.refetch();
    environmentsQuery.refetch();
    approvalsQuery.refetch();
  };

  if (!safeProjectId) {
    return (
      <Card.Root bg="red.50" borderColor="red.200">
        <Card.Body>
          <Text color="red.700" fontWeight="semibold">
            Project id is missing.
          </Text>
        </Card.Body>
      </Card.Root>
    );
  }

  if (isLoading) {
    return (
      <Stack gap="6">
        <Stack gap="2">
          <Skeleton h="32px" w="280px" />
          <Skeleton h="18px" w="420px" />
        </Stack>

        <Grid
          gap="4"
          templateColumns={{
            base: '1fr',
            lg: 'repeat(3, minmax(0, 1fr))',
          }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton h="160px" key={index} rounded="xl" />
          ))}
        </Grid>
      </Stack>
    );
  }

  if (isError) {
    return (
      <PageErrorState
        title="Project overview"
        message="Failed to load project dashboard"
        error={error}
        isFetching={isFetching}
        onRetry={handleRefresh}
      />
    );
  }

  const latestPipeline = getLastPipeline(pipelineRunsQuery.data);
  const recentDeployments = getRecentDeployments(deploymentsQuery.data);
  const successRate = getBuildSuccessRate(buildsQuery.data);
  const averageBuildDuration = getAverageBuildDuration(buildsQuery.data);
  const healthyEnvironmentsCount = getHealthyEnvironmentsCount(
    environmentsQuery.data,
  );

  const buildStatusByDay = getBuildStatusByDayChartData(buildsQuery.data);

  const averageBuildDurationByDay = getAverageBuildDurationByDayChartData(
    buildsQuery.data,
  );

  const pipelineStatusDistribution = getPipelineStatusDistributionChartData(
    pipelineRunsQuery.data,
  );

  const deploymentActivityByEnvironment =
    getDeploymentActivityByEnvironmentChartData(deploymentsQuery.data);

  const deployFrequency = getDeployFrequencyChartData(deploymentsQuery.data);

  const recentActivityItems = getRecentActivityItems({
    pipelineRuns: pipelineRunsQuery.data,
    deployments: deploymentsQuery.data,
    approvals: approvalsQuery.data,
  });

  return (
    <ProjectOverviewDashboard
      averageBuildDuration={averageBuildDuration}
      averageBuildDurationByDay={averageBuildDurationByDay}
      buildStatusByDay={buildStatusByDay}
      deploymentActivityByEnvironment={deploymentActivityByEnvironment}
      deployFrequency={deployFrequency}
      environments={environmentsQuery.data ?? []}
      healthyEnvironmentsCount={healthyEnvironmentsCount}
      isFetching={isFetching}
      latestPipeline={latestPipeline}
      openApprovalsCount={approvalsQuery.data?.length ?? 0}
      pipelineStatusDistribution={pipelineStatusDistribution}
      project={projectQuery.data}
      projectId={safeProjectId}
      recentActivityItems={recentActivityItems}
      recentDeployments={recentDeployments}
      successRate={successRate}
      onRefresh={handleRefresh}
    />
  );
}
