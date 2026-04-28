import { delay, http, HttpResponse } from 'msw';

import { deployments } from '../model/data/deployments';

import type {
  Deployment,
  DeploymentStatus,
  EnvironmentName,
} from '../model/types/types';

type RollbackRequestBody = {
  reason?: string;
};

function getSearchParam(url: URL, key: string) {
  const value = url.searchParams.get(key);

  return value && value.length > 0 ? value : null;
}

export const deploymentHandlers = [
  http.get('/projects/:projectId/deployments', async ({ params, request }) => {
    await delay(600);

    const { projectId } = params;
    const url = new URL(request.url);

    const status = getSearchParam(url, 'status') as DeploymentStatus | null;
    const environment = getSearchParam(
      url,
      'environment',
    ) as EnvironmentName | null;
    const branch = getSearchParam(url, 'branch');

    const result = deployments.filter((deployment) => {
      const matchesProject = deployment.projectId === projectId;
      const matchesStatus = status ? deployment.status === status : true;
      const matchesEnvironment = environment
        ? deployment.environment === environment
        : true;
      const matchesBranch = branch ? deployment.branch === branch : true;

      return (
        matchesProject && matchesStatus && matchesEnvironment && matchesBranch
      );
    });

    return HttpResponse.json(result);
  }),

  http.get('/deployments/:deploymentId', async ({ params }) => {
    await delay(400);

    const { deploymentId } = params;

    const deployment = deployments.find((item) => item.id === deploymentId);

    if (!deployment) {
      return HttpResponse.json(
        { message: 'Deployment not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json(deployment);
  }),

  http.post(
    '/deployments/:deploymentId/rollback',
    async ({ params, request }) => {
      await delay(800);

      const { deploymentId } = params;
      const body = (await request
        .json()
        .catch(() => ({}))) as RollbackRequestBody;

      const deployment = deployments.find((item) => item.id === deploymentId);

      if (!deployment) {
        return HttpResponse.json(
          { message: 'Deployment not found' },
          { status: 404 },
        );
      }

      if (deployment.status !== 'deployed' && deployment.status !== 'failed') {
        return HttpResponse.json(
          {
            message:
              'Rollback is available only for deployed or failed deployments',
          },
          { status: 400 },
        );
      }

      deployment.status = 'rolled_back';
      deployment.finishedAt = new Date().toISOString();

      const rollbackDeployment: Deployment = {
        id: `deployment-rollback-${Date.now()}`,
        projectId: deployment.projectId,
        environment: deployment.environment,
        status: 'deployed',
        version: `${deployment.version}-rollback`,
        commitHash: deployment.commitHash,
        branch: deployment.branch,
        requestedById: deployment.requestedById,
        approvedById: deployment.approvedById,
        startedAt: new Date().toISOString(),
        finishedAt: new Date().toISOString(),
      };

      deployments.unshift(rollbackDeployment);

      return HttpResponse.json({
        deployment,
        rollbackDeployment,
        reason: body.reason ?? null,
      });
    },
  ),
];
