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
} from './lib/get-info';

export type {
  BuildStatusByDayChartItem,
  AverageBuildDurationChartItem,
  PipelineStatusDistributionChartItem,
  DeploymentActivityByEnvironmentChartItem,
} from './model/types/types';

export {
  getBuildStatusByDayChartData,
  getAverageBuildDurationByDayChartData,
  getPipelineStatusDistributionChartData,
  getDeploymentActivityByEnvironmentChartData,
} from './lib/chart-helpers';
