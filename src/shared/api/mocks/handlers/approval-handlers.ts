import { delay, http, HttpResponse } from 'msw';

import { approvals } from '../model/data/approvals';
import { deployments } from '../model/data/deployments';

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
    await delay(600);

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

    const result = approvals.filter((approval) => {
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
    await delay(400);

    const { approvalId } = params;

    const approval = approvals.find((item) => item.id === approvalId);

    if (!approval) {
      return HttpResponse.json(
        { message: 'Approval not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json(approval);
  }),

  http.post('/approvals/:approvalId/approve', async ({ params, request }) => {
    await delay(800);

    const { approvalId } = params;
    const body = (await request.json().catch(() => ({}))) as ApproveRequestBody;

    const approval = approvals.find((item) => item.id === approvalId);

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

    const deployment = deployments.find(
      (item) => item.id === approval.deploymentId,
    );

    if (!deployment) {
      return HttpResponse.json(
        { message: 'Related deployment not found' },
        { status: 404 },
      );
    }

    approval.status = 'approved';
    approval.resolvedAt = new Date().toISOString();
    approval.resolvedById = 'user-1';

    deployment.status = 'deploying';
    deployment.approvedById = 'user-1';

    return HttpResponse.json({
      approval,
      deployment,
      comment: body.comment ?? null,
    });
  }),

  http.post('/approvals/:approvalId/reject', async ({ params, request }) => {
    await delay(800);

    const { approvalId } = params;
    const body = (await request.json().catch(() => ({}))) as RejectRequestBody;

    const approval = approvals.find((item) => item.id === approvalId);

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

    const deployment = deployments.find(
      (item) => item.id === approval.deploymentId,
    );

    if (!deployment) {
      return HttpResponse.json(
        { message: 'Related deployment not found' },
        { status: 404 },
      );
    }

    approval.status = 'rejected';
    approval.resolvedAt = new Date().toISOString();
    approval.resolvedById = 'user-1';
    approval.rejectReason = body.reason;

    deployment.status = 'rejected';
    deployment.finishedAt = new Date().toISOString();

    return HttpResponse.json({
      approval,
      deployment,
    });
  }),
];
