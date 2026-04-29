import { http, HttpResponse } from 'msw';

import { mockRandomDelay, maybeMockError } from '../lib/mock-utils';
import { mockState } from '../model/mock-state';

import type {
  ApprovalRiskLevel,
  ApprovalStatus,
  EnvironmentName,
} from '../model/types/types';

type ApproveRequestBody = {
  comment?: string;
};

type RejectRequestBody = {
  reason: string;
};

function getSearchParam(url: URL, key: string) {
  const value = url.searchParams.get(key);

  return value && value.length > 0 ? value : null;
}

export const approvalHandlers = [
  http.get('/approvals', async ({ request }) => {
    await mockRandomDelay(400, 900);

    const error = maybeMockError({
      probability: 0.03,
      message: 'Failed to load approvals',
      status: 500,
    });

    if (error) {
      return error;
    }

    const url = new URL(request.url);

    const status = getSearchParam(url, 'status') as ApprovalStatus | null;
    const projectId = getSearchParam(url, 'projectId');
    const environment = getSearchParam(
      url,
      'environment',
    ) as EnvironmentName | null;
    const riskLevel = getSearchParam(
      url,
      'riskLevel',
    ) as ApprovalRiskLevel | null;

    const result = mockState.approvals.filter((approval) => {
      const matchesStatus = status ? approval.status === status : true;
      const matchesProject = projectId
        ? approval.projectId === projectId
        : true;
      const matchesEnvironment = environment
        ? approval.environment === environment
        : true;
      const matchesRiskLevel = riskLevel
        ? approval.riskLevel === riskLevel
        : true;

      return (
        matchesStatus &&
        matchesProject &&
        matchesEnvironment &&
        matchesRiskLevel
      );
    });

    return HttpResponse.json(result);
  }),

  http.get('/approvals/:approvalId', async ({ params }) => {
    await mockRandomDelay(300, 700);

    const approvalId = String(params.approvalId);

    const approval = mockState.approvals.find((item) => item.id === approvalId);

    if (!approval) {
      return HttpResponse.json(
        { message: 'Approval not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json(approval);
  }),

  http.post('/approvals/:approvalId/approve', async ({ params, request }) => {
    await mockRandomDelay(700, 1200);

    const error = maybeMockError({
      probability: 0.08,
      message: 'Approval action failed. Please try again.',
      status: 503,
    });

    if (error) {
      return error;
    }

    const approvalId = String(params.approvalId);
    const body = (await request.json().catch(() => ({}))) as ApproveRequestBody;

    const approval = mockState.approvals.find((item) => item.id === approvalId);

    if (!approval) {
      return HttpResponse.json(
        { message: 'Approval not found' },
        { status: 404 },
      );
    }

    if (approval.status !== 'pending') {
      return HttpResponse.json(
        { message: 'Only pending approvals can be approved' },
        { status: 400 },
      );
    }

    const deployment = mockState.deployments.find(
      (item) => item.id === approval.deploymentId,
    );

    if (!deployment) {
      return HttpResponse.json(
        { message: 'Related deployment not found' },
        { status: 404 },
      );
    }

    const now = new Date().toISOString();

    approval.status = 'approved';
    approval.resolvedAt = now;
    approval.resolvedById = 'user-1';

    deployment.status = 'deploying';
    deployment.approvedById = 'user-1';
    deployment.startedAt = now;

    const environment = mockState.environments.find(
      (item) =>
        item.projectId === deployment.projectId &&
        item.name === deployment.environment,
    );

    if (environment) {
      environment.status = 'deploying';
    }

    return HttpResponse.json({
      approval,
      deployment,
      comment: body.comment ?? null,
    });
  }),

  http.post('/approvals/:approvalId/reject', async ({ params, request }) => {
    await mockRandomDelay(700, 1200);

    const error = maybeMockError({
      probability: 0.08,
      message: 'Reject action failed. Please try again.',
      status: 503,
    });

    if (error) {
      return error;
    }

    const approvalId = String(params.approvalId);
    const body = (await request.json().catch(() => ({}))) as RejectRequestBody;

    const approval = mockState.approvals.find((item) => item.id === approvalId);

    if (!approval) {
      return HttpResponse.json(
        { message: 'Approval not found' },
        { status: 404 },
      );
    }

    if (approval.status !== 'pending') {
      return HttpResponse.json(
        { message: 'Only pending approvals can be rejected' },
        { status: 400 },
      );
    }

    if (!body.reason) {
      return HttpResponse.json(
        { message: 'Reject reason is required' },
        { status: 400 },
      );
    }

    const deployment = mockState.deployments.find(
      (item) => item.id === approval.deploymentId,
    );

    if (!deployment) {
      return HttpResponse.json(
        { message: 'Related deployment not found' },
        { status: 404 },
      );
    }

    const now = new Date().toISOString();

    approval.status = 'rejected';
    approval.resolvedAt = now;
    approval.resolvedById = 'user-1';
    approval.rejectReason = body.reason;

    deployment.status = 'rejected';
    deployment.finishedAt = now;

    return HttpResponse.json({
      approval,
      deployment,
    });
  }),
];
