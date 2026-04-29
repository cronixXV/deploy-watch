import type {
  Build,
  Deployment,
  Environment,
  PipelineRun,
} from '../model/types/types';

const PIPELINE_MIN_RUNNING_MS = 8_000;
const PIPELINE_MAX_RUNNING_MS = 18_000;

const BUILD_MIN_RUNNING_MS = 6_000;
const BUILD_MAX_RUNNING_MS = 14_000;

const DEPLOYMENT_MIN_RUNNING_MS = 10_000;
const DEPLOYMENT_MAX_RUNNING_MS = 22_000;

function getElapsedMs(startedAt: string) {
  return Date.now() - new Date(startedAt).getTime();
}

function getStableHash(value: string) {
  return value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function getCompletionThresholdMs(id: string, minMs: number, maxMs: number) {
  const hash = getStableHash(id);
  const range = maxMs - minMs;

  return minMs + (hash % range);
}

function shouldFailById(id: string) {
  return getStableHash(id) % 5 === 0;
}

function getDurationSec(startedAt: string, finishedAt: string) {
  return Math.round(
    (new Date(finishedAt).getTime() - new Date(startedAt).getTime()) / 1000,
  );
}

export function updatePipelineRunStatus(pipelineRun: PipelineRun) {
  if (pipelineRun.status !== 'queued' && pipelineRun.status !== 'running') {
    return pipelineRun;
  }

  const elapsedMs = getElapsedMs(pipelineRun.startedAt);

  if (pipelineRun.status === 'queued' && elapsedMs >= 3_000) {
    pipelineRun.status = 'running';

    return pipelineRun;
  }

  if (pipelineRun.status !== 'running') {
    return pipelineRun;
  }

  const thresholdMs = getCompletionThresholdMs(
    pipelineRun.id,
    PIPELINE_MIN_RUNNING_MS,
    PIPELINE_MAX_RUNNING_MS,
  );

  if (elapsedMs < thresholdMs) {
    return pipelineRun;
  }

  const finishedAt = new Date().toISOString();

  pipelineRun.status = shouldFailById(pipelineRun.id) ? 'failed' : 'success';
  pipelineRun.finishedAt = finishedAt;
  pipelineRun.durationSec = getDurationSec(pipelineRun.startedAt, finishedAt);

  return pipelineRun;
}

export function updateBuildStatus(build: Build) {
  if (build.status !== 'queued' && build.status !== 'running') {
    return build;
  }

  const elapsedMs = getElapsedMs(build.startedAt);

  if (build.status === 'queued' && elapsedMs >= 2_000) {
    build.status = 'running';

    return build;
  }

  if (build.status !== 'running') {
    return build;
  }

  const thresholdMs = getCompletionThresholdMs(
    build.id,
    BUILD_MIN_RUNNING_MS,
    BUILD_MAX_RUNNING_MS,
  );

  if (elapsedMs < thresholdMs) {
    return build;
  }

  const finishedAt = new Date().toISOString();

  build.status = shouldFailById(build.id) ? 'failed' : 'success';
  build.finishedAt = finishedAt;
  build.durationSec = getDurationSec(build.startedAt, finishedAt);

  return build;
}

export function updateDeploymentStatus(
  deployment: Deployment,
  environments: Environment[],
) {
  if (deployment.status !== 'deploying') {
    return deployment;
  }

  const elapsedMs = getElapsedMs(deployment.startedAt);

  const thresholdMs = getCompletionThresholdMs(
    deployment.id,
    DEPLOYMENT_MIN_RUNNING_MS,
    DEPLOYMENT_MAX_RUNNING_MS,
  );

  if (elapsedMs < thresholdMs) {
    return deployment;
  }

  const finishedAt = new Date().toISOString();
  const failed = shouldFailById(deployment.id);

  deployment.status = failed ? 'failed' : 'deployed';
  deployment.finishedAt = finishedAt;

  const environment = environments.find(
    (item) =>
      item.projectId === deployment.projectId &&
      item.name === deployment.environment,
  );

  if (environment) {
    environment.status = failed ? 'degraded' : 'healthy';
    environment.currentVersion = deployment.version;
    environment.currentCommitHash = deployment.commitHash;
    environment.lastDeploymentAt = finishedAt;
  }

  return deployment;
}
