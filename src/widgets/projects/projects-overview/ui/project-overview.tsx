import { Grid, Skeleton, Stack } from '@chakra-ui/react';

import { ProjectOverviewDashboard } from '../../project-overview-dashboard/ui/project-overview-dashboard';
import { useProjectOverview } from '../model/use-project-overview';

import { PageErrorState } from '@/shared/ui/page-error-state/ui/page-errors-state';

type ProjectOverviewProps = {
  projectId?: string;
};

export const ProjectOverview = ({ projectId }: ProjectOverviewProps) => {
  const {
    project,
    environments,
    latestPipeline,
    recentDeployments,
    successRate,
    averageBuildDuration,
    healthyEnvironmentsCount,
    buildStatusByDay,
    averageBuildDurationByDay,
    pipelineStatusDistribution,
    deploymentActivityByEnvironment,
    deployFrequency,
    recentActivityItems,
    openApprovalsCount,
    isLoading,
    isError,
    isFetching,
    error,
    refresh,
  } = useProjectOverview({ projectId });

  if (!projectId) {
    return (
      <PageErrorState
        title="Project overview"
        message="Project route param is missing."
      />
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
        onRetry={refresh}
      />
    );
  }

  return (
    <ProjectOverviewDashboard
      averageBuildDuration={averageBuildDuration}
      averageBuildDurationByDay={averageBuildDurationByDay}
      buildStatusByDay={buildStatusByDay}
      deploymentActivityByEnvironment={deploymentActivityByEnvironment}
      deployFrequency={deployFrequency}
      environments={environments}
      healthyEnvironmentsCount={healthyEnvironmentsCount}
      isFetching={isFetching}
      latestPipeline={latestPipeline}
      openApprovalsCount={openApprovalsCount}
      pipelineStatusDistribution={pipelineStatusDistribution}
      project={project}
      projectId={projectId}
      recentActivityItems={recentActivityItems}
      recentDeployments={recentDeployments}
      successRate={successRate}
      onRefresh={refresh}
    />
  );
};
