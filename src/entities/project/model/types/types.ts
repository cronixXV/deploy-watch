export type BuildStatusByDayChartItem = {
  day: string;
  success: number;
  failed: number;
  canceled: number;
};

export type AverageBuildDurationChartItem = {
  day: string;
  averageDurationSec: number;
};

export type PipelineStatusDistributionChartItem = {
  status: string;
  count: number;
};

export type DeploymentActivityByEnvironmentChartItem = {
  environment: string;
  deployments: number;
};
