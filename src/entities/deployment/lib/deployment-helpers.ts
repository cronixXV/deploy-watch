import type { Deployment } from '@/shared/api/mocks/model/types/types';

export type DeploymentTimelineStepStatus =
  | 'completed'
  | 'current'
  | 'pending'
  | 'failed';

export type DeploymentTimelineStep = {
  id: string;
  label: string;
  description: string;
  status: DeploymentTimelineStepStatus;
  timestamp?: string;
};

export function getDeploymentTimelineSteps(
  deployment: Deployment,
): DeploymentTimelineStep[] {
  const isFailed = deployment.status === 'failed';
  const isRejected = deployment.status === 'rejected';
  const isRolledBack = deployment.status === 'rolled_back';

  const createdStatus: DeploymentTimelineStepStatus = 'completed';

  const buildCompletedStatus: DeploymentTimelineStepStatus =
    deployment.status === 'pending' ? 'pending' : 'completed';

  const waitingApprovalStatus: DeploymentTimelineStepStatus =
    deployment.status === 'pending'
      ? 'pending'
      : deployment.status === 'waiting_approval'
        ? 'current'
        : 'completed';

  const approvedStatus: DeploymentTimelineStepStatus = isRejected
    ? 'failed'
    : deployment.status === 'pending' ||
        deployment.status === 'waiting_approval'
      ? 'pending'
      : 'completed';

  const deployingStatus: DeploymentTimelineStepStatus = isFailed
    ? 'failed'
    : deployment.status === 'deploying'
      ? 'current'
      : deployment.status === 'deployed' || isRolledBack
        ? 'completed'
        : 'pending';

  const smokeTestsStatus: DeploymentTimelineStepStatus = isFailed
    ? 'failed'
    : deployment.status === 'deployed' || isRolledBack
      ? 'completed'
      : 'pending';

  const deployedStatus: DeploymentTimelineStepStatus =
    deployment.status === 'deployed'
      ? 'completed'
      : isRolledBack
        ? 'failed'
        : isFailed
          ? 'failed'
          : 'pending';

  return [
    {
      id: 'created',
      label: 'Created',
      description: 'Deployment request was created.',
      status: createdStatus,
      timestamp: deployment.startedAt,
    },
    {
      id: 'build-completed',
      label: 'Build completed',
      description: `Build artifacts for ${deployment.version} are ready.`,
      status: buildCompletedStatus,
      timestamp: deployment.startedAt,
    },
    {
      id: 'waiting-approval',
      label: 'Waiting approval',
      description: 'Deployment is waiting for release approval.',
      status: waitingApprovalStatus,
    },
    {
      id: 'approved',
      label: isRejected ? 'Rejected' : 'Approved',
      description: isRejected
        ? 'Deployment approval was rejected.'
        : 'Deployment was approved for target environment.',
      status: approvedStatus,
    },
    {
      id: 'deploying',
      label: 'Deploying',
      description: `Deploying to ${deployment.environment}.`,
      status: deployingStatus,
      timestamp:
        deployment.status === 'deploying' ? deployment.startedAt : undefined,
    },
    {
      id: 'smoke-tests',
      label: 'Smoke tests',
      description: 'Running post-deployment smoke checks.',
      status: smokeTestsStatus,
    },
    {
      id: 'deployed',
      label: isRolledBack ? 'Rolled back' : 'Deployed',
      description: isRolledBack
        ? 'Deployment was rolled back to a previous stable version.'
        : 'Deployment completed successfully.',
      status: deployedStatus,
      timestamp: deployment.finishedAt,
    },
  ];
}
