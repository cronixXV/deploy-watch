export { getProjects, getProjectById } from './model/api/project-api';

export {
  projectQueries,
  useProjectQuery,
  useProjectsQuery,
} from './model/api/project-queries';

export {
  getPipelineStatusColor,
  getDeploymentStatusColor,
  getHealthColor,
  getHealthLabel,
  getHealthDescription,
  getFailedBuildsCount,
  getLastPipeline,
  getLastDeployment,
  getProjectHealth,
  getEnvironmentStatusColor,
  getAverageBuildDuration,
  getBuildSuccessRate,
  getHealthyEnvironmentsCount,
  getRecentDeployments,
  getStatusColor,
  getBuildStatusColor,
} from './lib/get-info';

export type {
  BuildStatusByDayChartItem,
  AverageBuildDurationChartItem,
  PipelineStatusDistributionChartItem,
  DeploymentActivityByEnvironmentChartItem,
  DeployFrequencyChartItem,
  RecentActivityItemType,
  RecentActivityItem,
} from './model/types/types';

export {
  getBuildStatusByDayChartData,
  getAverageBuildDurationByDayChartData,
  getPipelineStatusDistributionChartData,
  getDeploymentActivityByEnvironmentChartData,
  getDeployFrequencyChartData,
  getRecentActivityItems,
} from './lib/chart-helpers';
