import type {
  Approval,
  ApprovalRiskLevel,
  ApprovalStatus,
  Deployment,
  EnvironmentName,
} from '@/shared/api/mocks/model/types/types';

import { apiClient } from '@/shared/api/client/client';

export type GetApprovalsParams = {
  status?: ApprovalStatus;
  projectId?: string;
  environment?: EnvironmentName;
  riskLevel?: ApprovalRiskLevel;
};

export type ApproveApprovalRequest = {
  comment?: string;
};

export type RejectApprovalRequest = {
  reason: string;
};

export type ApprovalActionResponse = {
  approval: Approval;
  deployment: Deployment;
};

export type ApproveApprovalResponse = ApprovalActionResponse & {
  comment: string | null;
};

export async function getApprovals(params: GetApprovalsParams = {}) {
  const response = await apiClient.get<Approval[]>('/approvals', {
    params,
  });

  return response.data;
}

export async function getApprovalById(approvalId: string) {
  const response = await apiClient.get<Approval>(`/approvals/${approvalId}`);

  return response.data;
}

export async function approveApproval(
  approvalId: string,
  request: ApproveApprovalRequest = {},
) {
  const response = await apiClient.post<ApproveApprovalResponse>(
    `/approvals/${approvalId}/approve`,
    request,
  );

  return response.data;
}

export async function rejectApproval(
  approvalId: string,
  request: RejectApprovalRequest,
) {
  const response = await apiClient.post<ApprovalActionResponse>(
    `/approvals/${approvalId}/reject`,
    request,
  );

  return response.data;
}
