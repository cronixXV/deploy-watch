import { Grid, Stack } from '@chakra-ui/react';

import { BuildMetricsCards } from './build-metrics-cards';
import { EnvironmentHealthCard } from './environment-health-card';
import { LatestPipelineCard } from './latest-pipeline-card';
import { OpenApprovalsCard } from './open-approvals-card';
import { ProjectOverviewHeader } from './project-overview-header';
import { RecentActivityWidget } from './recent-activity-widget';
import { RecentDeploymentsCard } from './recent-deployments-card';

import type {
  AverageBuildDurationChartItem,
  BuildStatusByDayChartItem,
  DeploymentActivityByEnvironmentChartItem,
  DeployFrequencyChartItem,
  PipelineStatusDistributionChartItem,
  RecentActivityItem,
} from '@/entities/project';
import type {
  Deployment,
  Environment,
  PipelineRun,
  Project,
} from '@/shared/api/mocks/model/types/types';

import { ProjectChartsGrid } from '@/widgets/project-charts-grid';

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
  buildStatusByDay: BuildStatusByDayChartItem[];
  averageBuildDurationByDay: AverageBuildDurationChartItem[];
  pipelineStatusDistribution: PipelineStatusDistributionChartItem[];
  deploymentActivityByEnvironment: DeploymentActivityByEnvironmentChartItem[];
  deployFrequency: DeployFrequencyChartItem[];
  recentActivityItems: RecentActivityItem[];
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
  buildStatusByDay,
  averageBuildDurationByDay,
  pipelineStatusDistribution,
  deploymentActivityByEnvironment,
  deployFrequency,
  recentActivityItems,
}: ProjectOverviewDashboardProps) => {
  return (
    <Stack gap="6">
      <ProjectOverviewHeader
        isFetching={isFetching}
        project={project}
        projectId={projectId}
        onRefresh={onRefresh}
      />

      <Grid
        as="section"
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

      <ProjectChartsGrid
        averageBuildDurationByDay={averageBuildDurationByDay}
        buildStatusByDay={buildStatusByDay}
        deploymentActivityByEnvironment={deploymentActivityByEnvironment}
        deployFrequency={deployFrequency}
        pipelineStatusDistribution={pipelineStatusDistribution}
      />

      <Grid
        as="section"
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

        <EnvironmentHealthCard
          environments={environments}
          healthyCount={healthyEnvironmentsCount}
        />

        <RecentActivityWidget items={recentActivityItems} />

        <OpenApprovalsCard count={openApprovalsCount} />
      </Grid>
    </Stack>
  );
};
