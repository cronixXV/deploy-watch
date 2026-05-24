import type {
  Build,
  Deployment,
  Environment,
  PipelineRun,
  ProjectHealth,
} from '@/shared/api/mocks/model/types/types';

export function getLastPipeline(pipelineRuns?: PipelineRun[]) {
  return pipelineRuns?.toSorted(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  )[0];
}

export function getLastDeployment(deployments?: Deployment[]) {
  return deployments?.toSorted(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  )[0];
}

export function getRecentDeployments(deployments?: Deployment[], limit = 5) {
  return (
    deployments
      ?.toSorted(
        (a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
      )
      .slice(0, limit) ?? []
  );
}

export function getFailedBuildsCount(builds?: Build[]) {
  return builds?.length ?? 0;
}

export function getBuildSuccessRate(builds?: Build[]) {
  if (!builds?.length) {
    return 0;
  }

  const completedBuilds = builds.filter((build) =>
    ['success', 'failed', 'canceled'].includes(build.status),
  );

  if (!completedBuilds.length) {
    return 0;
  }

  const successfulBuilds = completedBuilds.filter(
    (build) => build.status === 'success',
  );

  return Math.round((successfulBuilds.length / completedBuilds.length) * 100);
}

export function getAverageBuildDuration(builds?: Build[]) {
  const buildsWithDuration =
    builds?.filter((build) => typeof build.durationSec === 'number') ?? [];

  if (!buildsWithDuration.length) {
    return undefined;
  }

  const total = buildsWithDuration.reduce(
    (acc, build) => acc + (build.durationSec ?? 0),
    0,
  );

  return Math.round(total / buildsWithDuration.length);
}

export function getHealthyEnvironmentsCount(environments?: Environment[]) {
  return (
    environments?.filter((environment) => environment.status === 'healthy')
      .length ?? 0
  );
}

export function getProjectHealth(params: {
  lastPipeline?: PipelineRun;
  lastDeployment?: Deployment;
  environments?: Environment[];
  failedBuildsCount: number;
}): ProjectHealth {
  const { lastPipeline, lastDeployment, environments, failedBuildsCount } =
    params;

  const hasDownEnvironment = environments?.some(
    (environment) => environment.status === 'down',
  );

  if (lastPipeline?.status === 'failed' || hasDownEnvironment) {
    return 'critical';
  }

  const hasActivePipeline =
    lastPipeline?.status === 'running' || lastPipeline?.status === 'queued';

  const hasActiveDeployment = lastDeployment?.status === 'deploying';

  if (hasActivePipeline || hasActiveDeployment) {
    return 'running';
  }

  const hasDegradedEnvironment = environments?.some(
    (environment) => environment.status === 'degraded',
  );

  const hasDeploymentIssue =
    lastDeployment?.status === 'failed' ||
    lastDeployment?.status === 'waiting_approval';

  if (failedBuildsCount > 0 || hasDegradedEnvironment || hasDeploymentIssue) {
    return 'warning';
  }

  return 'healthy';
}
