import type {
  Build,
  Deployment,
  Environment,
  PipelineRun,
  Project,
  ProjectHealth,
} from '@/shared/api/mocks/model/types/types';

function toArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : [];
}

export function getLastPipeline(pipelineRuns?: PipelineRun[]) {
  return toArray<PipelineRun>(pipelineRuns).toSorted(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  )[0];
}

export function getLastDeployment(deployments?: Deployment[]) {
  return toArray<Deployment>(deployments).toSorted(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  )[0];
}

export function getRecentDeployments(deployments?: Deployment[], limit = 5) {
  return toArray<Deployment>(deployments)
    .toSorted(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
    )
    .slice(0, limit);
}

export function getFailedBuildsCount(builds?: unknown) {
  return toArray<Build>(builds).length;
}

export function getBuildSuccessRate(builds?: Build[]) {
  const safeBuilds = toArray<Build>(builds);

  if (!safeBuilds.length) {
    return 0;
  }

  const completedBuilds = safeBuilds.filter((build) =>
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

export function getAverageBuildDuration(builds?: unknown) {
  const buildsWithDuration = toArray<Build>(builds).filter(
    (build) => typeof build.durationSec === 'number',
  );

  if (!buildsWithDuration.length) {
    return undefined;
  }

  const total = buildsWithDuration.reduce(
    (acc, build) => acc + (build.durationSec ?? 0),
    0,
  );

  return Math.round(total / buildsWithDuration.length);
}

export function getHealthyEnvironmentsCount(environments?: unknown) {
  return toArray<Environment>(environments).filter(
    (environment) => environment.status === 'healthy',
  ).length;
}

export function getProjectHealth(params: {
  lastPipeline?: PipelineRun;
  lastDeployment?: Deployment;
  environments?: Environment[];
  failedBuildsCount: number;
}): ProjectHealth {
  const { lastPipeline, lastDeployment, environments, failedBuildsCount } =
    params;

  const safeEnvironments = toArray<Environment>(environments);

  const hasDownEnvironment = safeEnvironments.some(
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

  const hasDegradedEnvironment = safeEnvironments.some(
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

export function getProjectNameById(projects: unknown, projectId: string) {
  const safeProjects = toArray<Project>(projects);

  return (
    safeProjects.find((project) => project.id === projectId)?.name ?? projectId
  );
}
