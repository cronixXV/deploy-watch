import { Grid } from '@chakra-ui/react';

import type {
  AverageBuildDurationChartItem,
  BuildStatusByDayChartItem,
  DeploymentActivityByEnvironmentChartItem,
  PipelineStatusDistributionChartItem,
} from '@/entities/project';

import {
  AverageBuildDurationChart,
  BuildStatusByDayChart,
  DeploymentActivityByEnvironmentChart,
  PipelineStatusDistributionChart,
} from '@/widgets/charts';

type ProjectChartsGridProps = {
  buildStatusByDay: BuildStatusByDayChartItem[];
  averageBuildDurationByDay: AverageBuildDurationChartItem[];
  pipelineStatusDistribution: PipelineStatusDistributionChartItem[];
  deploymentActivityByEnvironment: DeploymentActivityByEnvironmentChartItem[];
};

export const ProjectChartsGrid = ({
  buildStatusByDay,
  averageBuildDurationByDay,
  pipelineStatusDistribution,
  deploymentActivityByEnvironment,
}: ProjectChartsGridProps) => {
  return (
    <Grid
      gap="4"
      templateColumns={{
        base: '1fr',
        xl: 'repeat(2, minmax(0, 1fr))',
      }}
    >
      <BuildStatusByDayChart data={buildStatusByDay} />

      <AverageBuildDurationChart data={averageBuildDurationByDay} />

      <PipelineStatusDistributionChart data={pipelineStatusDistribution} />

      <DeploymentActivityByEnvironmentChart
        data={deploymentActivityByEnvironment}
      />
    </Grid>
  );
};
