import { http, HttpResponse } from 'msw';

import { mockRandomDelay, maybeMockError } from '../lib/mock-utils';
import { updateDeploymentStatus } from '../lib/status-transitions';
import { mockState } from '../model/mock-state';

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
    await mockRandomDelay(400, 900);

    const error = maybeMockError({
      probability: 0.03,
      message: 'Failed to load deployments',
      status: 500,
    });

    if (error) {
      return error;
    }

    const projectId = String(params.projectId);
    const url = new URL(request.url);

    const status = getSearchParam(url, 'status') as DeploymentStatus | null;
    const environment = getSearchParam(
      url,
      'environment',
    ) as EnvironmentName | null;
    const branch = getSearchParam(url, 'branch');

    mockState.deployments.forEach((deployment) => {
      updateDeploymentStatus(deployment, mockState.environments);
    });

    const result = mockState.deployments.filter((deployment) => {
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
    await mockRandomDelay(300, 700);

    const error = maybeMockError({
      probability: 0.03,
      message: 'Failed to load deployment',
      status: 500,
    });

    if (error) {
      return error;
    }

    const deploymentId = String(params.deploymentId);

    const deployment = mockState.deployments.find(
      (item) => item.id === deploymentId,
    );

    if (!deployment) {
      return HttpResponse.json(
        { message: 'Deployment not found' },
        { status: 404 },
      );
    }

    updateDeploymentStatus(deployment, mockState.environments);

    return HttpResponse.json(deployment);
  }),

  http.post(
    '/deployments/:deploymentId/rollback',
    async ({ params, request }) => {
      await mockRandomDelay(700, 1200);

      const error = maybeMockError({
        probability: 0.08,
        message: 'Rollback failed because deployment service is unavailable',
        status: 503,
      });

      if (error) {
        return error;
      }

      const deploymentId = String(params.deploymentId);
      const body = (await request
        .json()
        .catch(() => ({}))) as RollbackRequestBody;

      const deployment = mockState.deployments.find(
        (item) => item.id === deploymentId,
      );

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

      const now = new Date().toISOString();

      deployment.status = 'rolled_back';
      deployment.finishedAt = now;

      const rollbackDeployment: Deployment = {
        id: `deployment-rollback-${Date.now()}`,
        projectId: deployment.projectId,
        environment: deployment.environment,
        status: 'deploying',
        version: `${deployment.version}-rollback`,
        commitHash: deployment.commitHash,
        branch: deployment.branch,
        requestedById: deployment.requestedById,
        approvedById: deployment.approvedById,
        startedAt: now,
      };

      mockState.deployments.unshift(rollbackDeployment);

      const environment = mockState.environments.find(
        (item) =>
          item.projectId === deployment.projectId &&
          item.name === deployment.environment,
      );

      if (environment) {
        environment.status = 'deploying';
      }

      return HttpResponse.json({
        deployment,
        rollbackDeployment,
        reason: body.reason ?? null,
      });
    },
  ),
];
