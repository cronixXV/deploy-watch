import type {
  Deployment,
  PipelineRun,
  User,
} from '@/shared/api/mocks/model/types/types';

export function getUserById(users: User[] | undefined, userId?: string) {
  if (!userId) {
    return undefined;
  }

  return users?.find((user) => user.id === userId);
}

export function getUserDisplayName(users: User[] | undefined, userId?: string) {
  return getUserById(users, userId)?.name ?? userId ?? 'Unknown user';
}

export function getRelatedDeployment(params: {
  pipelineRun?: PipelineRun;
  deployments?: Deployment[];
}) {
  const { pipelineRun, deployments } = params;

  if (!pipelineRun || !deployments?.length) {
    return undefined;
  }

  return deployments.find((deployment) => {
    const sameCommit = deployment.commitHash === pipelineRun.commitHash;
    const sameEnvironment = pipelineRun.environment
      ? deployment.environment === pipelineRun.environment
      : true;

    return sameCommit && sameEnvironment;
  });
}
