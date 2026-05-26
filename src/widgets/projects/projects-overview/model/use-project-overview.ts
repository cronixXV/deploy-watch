import { useApprovalsQuery } from '@/entities/approval';
import {
  getAverageBuildDurationByDayChartData,
  getBuildStatusByDayChartData,
  useProjectBuildsQuery,
} from '@/entities/build';
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

type UseProjectOverviewParams = {
  projectId?: string;
};

export const useProjectOverview = ({ projectId }: UseProjectOverviewParams) => {
  const projectQuery = useProjectQuery(projectId);

  const pipelineRunsQuery = useProjectPipelineRunsQuery({
    projectId,
  });

  const buildsQuery = useProjectBuildsQuery({
    projectId,
  });

  const deploymentsQuery = useProjectDeploymentsQuery({
    projectId,
  });

  const environmentsQuery = useProjectEnvironmentsQuery(projectId);

  const approvalsQuery = useApprovalsQuery({
    projectId,
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

  const refresh = () => {
    projectQuery.refetch();
    pipelineRunsQuery.refetch();
    buildsQuery.refetch();
    deploymentsQuery.refetch();
    environmentsQuery.refetch();
    approvalsQuery.refetch();
  };

  const pipelineRuns = pipelineRunsQuery.data ?? [];
  const builds = buildsQuery.data ?? [];
  const deployments = deploymentsQuery.data ?? [];
  const environments = environmentsQuery.data ?? [];
  const approvals = approvalsQuery.data ?? [];

  const latestPipeline = getLastPipeline(pipelineRuns);
  const recentDeployments = getRecentDeployments(deployments);
  const successRate = getBuildSuccessRate(builds);
  const averageBuildDuration = getAverageBuildDuration(builds);
  const healthyEnvironmentsCount = getHealthyEnvironmentsCount(environments);

  const buildStatusByDay = getBuildStatusByDayChartData(builds);

  const averageBuildDurationByDay =
    getAverageBuildDurationByDayChartData(builds);

  const pipelineStatusDistribution =
    getPipelineStatusDistributionChartData(pipelineRuns);

  const deploymentActivityByEnvironment =
    getDeploymentActivityByEnvironmentChartData(deployments);

  const deployFrequency = getDeployFrequencyChartData(deployments);

  const recentActivityItems = getRecentActivityItems({
    pipelineRuns,
    deployments,
    approvals,
  });

  return {
    project: projectQuery.data,
    projectId,
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
    openApprovalsCount: approvals.length,

    isLoading,
    isError,
    isFetching,
    error,

    refresh,
  };
};
