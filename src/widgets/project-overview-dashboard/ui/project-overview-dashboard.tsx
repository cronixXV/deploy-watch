import { Grid, Stack } from '@chakra-ui/react';

import { BuildMetricsCards } from './build-metrics-cards';
import { EnvironmentHealthCard } from './environment-health-card';
import { LatestPipelineCard } from './latest-pipeline-card';
import { OpenApprovalsCard } from './open-approvals-card';
import { ProjectOverviewHeader } from './project-overview-header';
import { RecentDeploymentsCard } from './recent-deployments-card';

import type {
  Deployment,
  Environment,
  PipelineRun,
  Project,
} from '@/shared/api/mocks/model/types/types';

type ProjectOverviewDashboardProps = {
  project?: Project;
  projectId: string;
  latestPipeline?: PipelineRun;
  recentDeployments: Deployment[];
  successRate: number;
  averageBuildDuration?: number;
  environments: Environment[];
  healthyEnvironmentsCount: number;
  openApprovalsCount: number;
  isFetching: boolean;
  onRefresh: () => void;
};

export const ProjectOverviewDashboard = ({
  project,
  projectId,
  latestPipeline,
  recentDeployments,
  successRate,
  averageBuildDuration,
  environments,
  healthyEnvironmentsCount,
  openApprovalsCount,
  isFetching,
  onRefresh,
}: ProjectOverviewDashboardProps) => {
  return (
    <Stack gap="6">
      <ProjectOverviewHeader
        isFetching={isFetching}
        project={project}
        onRefresh={onRefresh}
      />

      <Grid
        gap="4"
        templateColumns={{
          base: '1fr',
          lg: 'repeat(3, minmax(0, 1fr))',
        }}
      >
        <LatestPipelineCard pipeline={latestPipeline} projectId={projectId} />

        <BuildMetricsCards
          averageBuildDuration={averageBuildDuration}
          successRate={successRate}
        />
      </Grid>

      <Grid
        gap="4"
        templateColumns={{
          base: '1fr',
          xl: '2fr 1fr',
        }}
      >
        <RecentDeploymentsCard
          deployments={recentDeployments}
          projectId={projectId}
        />

        <Stack gap="4">
          <EnvironmentHealthCard
            environments={environments}
            healthyCount={healthyEnvironmentsCount}
          />

          <OpenApprovalsCard count={openApprovalsCount} />
        </Stack>
      </Grid>
    </Stack>
  );
};
