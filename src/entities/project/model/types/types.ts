export type PipelineStatusDistributionChartItem = {
  status: string;
  count: number;
};

export type DeploymentActivityByEnvironmentChartItem = {
  environment: string;
  deployments: number;
};

export type DeployFrequencyChartItem = {
  day: string;
  deployments: number;
};

export type RecentActivityItemType = 'pipeline' | 'deployment' | 'approval';

export type RecentActivityItem = {
  id: string;
  type: RecentActivityItemType;
  title: string;
  description: string;
  status: string;
  timestamp: string;
};
