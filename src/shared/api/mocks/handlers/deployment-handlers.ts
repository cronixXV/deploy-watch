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

type RejectDeploymentRequestBody = {
  reason?: string;
};

function getSearchParam(url: URL, key: string) {
  const value = url.searchParams.get(key);

  return value && value.length > 0 ? value : null;
}

export const deploymentHandlers = [
  http.post(
    '/deployments/:deploymentId/reject',
    async ({ params, request }) => {
      await mockRandomDelay(500, 1000);

      const { deploymentId } = params;
      const body = (await request.json()) as RejectDeploymentRequestBody;

      if (!body.reason?.trim()) {
        return HttpResponse.json(
          { message: 'Reject reason is required' },
          { status: 400 },
        );
      }

      const deployment = mockState.deployments.find(
        (item) => item.id === deploymentId,
      );

      if (!deployment) {
        return HttpResponse.json(
          { message: 'Deployment not found' },
          { status: 404 },
        );
      }

      if (deployment.status !== 'waiting_approval') {
        return HttpResponse.json(
          { message: 'Only deployments waiting for approval can be rejected' },
          { status: 400 },
        );
      }

      deployment.status = 'rejected';
      deployment.finishedAt = new Date().toISOString();

      const approval = mockState.approvals.find(
        (item) =>
          item.deploymentId === deploymentId && item.status === 'pending',
      );

      if (approval) {
        approval.status = 'rejected';
        approval.resolvedAt = new Date().toISOString();
        approval.resolvedById = 'user-1';
        approval.rejectReason = body.reason.trim();
      }

      return HttpResponse.json(deployment);
    },
  ),
  http.post('/deployments/:deploymentId/approve', async ({ params }) => {
    await mockRandomDelay(500, 1000);

    const { deploymentId } = params;

    const deployment = mockState.deployments.find(
      (item) => item.id === deploymentId,
    );

    if (!deployment) {
      return HttpResponse.json(
        { message: 'Deployment not found' },
        { status: 404 },
      );
    }

    if (deployment.status !== 'waiting_approval') {
      return HttpResponse.json(
        { message: 'Only deployments waiting for approval can be approved' },
        { status: 400 },
      );
    }

    deployment.status = 'deploying';
    deployment.startedAt = new Date().toISOString();

    const approval = mockState.approvals.find(
      (item) => item.deploymentId === deploymentId && item.status === 'pending',
    );

    if (approval) {
      approval.status = 'approved';
      approval.resolvedAt = new Date().toISOString();
      approval.resolvedById = 'user-1';
    }

    return HttpResponse.json(deployment);
  }),

  http.get('/deployments', async () => {
    await mockRandomDelay(300, 700);

    return HttpResponse.json(mockState.deployments);
  }),

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
