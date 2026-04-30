import type {
  AverageBuildDurationChartItem,
  BuildStatusByDayChartItem,
  DeployFrequencyChartItem,
  DeploymentActivityByEnvironmentChartItem,
  PipelineStatusDistributionChartItem,
  RecentActivityItem,
} from '../model/types/types';
import type {
  Approval,
  Build,
  Deployment,
  PipelineRun,
} from '@/shared/api/mocks/model/types/types';

import { getDayKey } from '@/shared/lib/format';

export function getBuildStatusByDayChartData(
  builds?: Build[],
): BuildStatusByDayChartItem[] {
  if (!builds?.length) {
    return [];
  }

  const result = new Map<string, BuildStatusByDayChartItem>();

  builds.forEach((build) => {
    const day = getDayKey(build.startedAt);

    const current = result.get(day) ?? {
      day,
      success: 0,
      failed: 0,
      canceled: 0,
    };

    if (build.status === 'success') {
      current.success += 1;
    }

    if (build.status === 'failed') {
      current.failed += 1;
    }

    if (build.status === 'canceled') {
      current.canceled += 1;
    }

    result.set(day, current);
  });

  return Array.from(result.values());
}

export function getAverageBuildDurationByDayChartData(
  builds?: Build[],
): AverageBuildDurationChartItem[] {
  if (!builds?.length) {
    return [];
  }

  const grouped = new Map<
    string,
    {
      totalDurationSec: number;
      count: number;
    }
  >();

  builds.forEach((build) => {
    if (typeof build.durationSec !== 'number') {
      return;
    }

    const day = getDayKey(build.startedAt);

    const current = grouped.get(day) ?? {
      totalDurationSec: 0,
      count: 0,
    };

    current.totalDurationSec += build.durationSec;
    current.count += 1;

    grouped.set(day, current);
  });

  return Array.from(grouped.entries()).map(([day, value]) => ({
    day,
    averageDurationSec: Math.round(value.totalDurationSec / value.count),
  }));
}

export function getPipelineStatusDistributionChartData(
  pipelineRuns?: PipelineRun[],
): PipelineStatusDistributionChartItem[] {
  if (!pipelineRuns?.length) {
    return [];
  }

  const result = new Map<string, number>();

  pipelineRuns.forEach((pipelineRun) => {
    const current = result.get(pipelineRun.status) ?? 0;

    result.set(pipelineRun.status, current + 1);
  });

  return Array.from(result.entries()).map(([status, count]) => ({
    status,
    count,
  }));
}

export function getDeploymentActivityByEnvironmentChartData(
  deployments?: Deployment[],
): DeploymentActivityByEnvironmentChartItem[] {
  if (!deployments?.length) {
    return [];
  }

  const result = new Map<string, number>();

  deployments.forEach((deployment) => {
    const current = result.get(deployment.environment) ?? 0;

    result.set(deployment.environment, current + 1);
  });

  return Array.from(result.entries()).map(
    ([environment, deploymentsCount]) => ({
      environment,
      deployments: deploymentsCount,
    }),
  );
}

export function getDeployFrequencyChartData(
  deployments?: Deployment[],
): DeployFrequencyChartItem[] {
  if (!deployments?.length) {
    return [];
  }

  const result = new Map<string, DeployFrequencyChartItem>();

  deployments.forEach((deployment) => {
    const day = getDayKey(deployment.startedAt);

    const current = result.get(day) ?? {
      day,
      deployments: 0,
    };

    current.deployments += 1;

    result.set(day, current);
  });

  return Array.from(result.values());
}

export function getRecentActivityItems(params: {
  pipelineRuns?: PipelineRun[];
  deployments?: Deployment[];
  approvals?: Approval[];
  limit?: number;
}): RecentActivityItem[] {
  const { pipelineRuns, deployments, approvals, limit = 8 } = params;

  const pipelineItems: RecentActivityItem[] =
    pipelineRuns?.map((pipelineRun) => ({
      id: pipelineRun.id,
      type: 'pipeline',
      title: `Pipeline ${pipelineRun.status}`,
      description: `${pipelineRun.branch} · ${pipelineRun.commitHash} · ${pipelineRun.commitMessage}`,
      status: pipelineRun.status,
      timestamp: pipelineRun.finishedAt ?? pipelineRun.startedAt,
    })) ?? [];

  const deploymentItems: RecentActivityItem[] =
    deployments?.map((deployment) => ({
      id: deployment.id,
      type: 'deployment',
      title: `Deployment ${deployment.status}`,
      description: `${deployment.environment} · ${deployment.version} · ${deployment.branch}`,
      status: deployment.status,
      timestamp: deployment.finishedAt ?? deployment.startedAt,
    })) ?? [];

  const approvalItems: RecentActivityItem[] =
    approvals?.map((approval) => ({
      id: approval.id,
      type: 'approval',
      title: `Approval ${approval.status}`,
      description: `${approval.environment} · risk: ${approval.riskLevel}`,
      status: approval.status,
      timestamp: approval.resolvedAt ?? approval.createdAt,
    })) ?? [];

  return [...pipelineItems, ...deploymentItems, ...approvalItems]
    .toSorted(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .slice(0, limit);
}
