import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  approveApproval,
  getApprovalById,
  getApprovals,
  rejectApproval,
  type ApproveApprovalRequest,
  type GetApprovalsParams,
  type RejectApprovalRequest,
} from './approval-api';

import { deploymentQueries } from '@/entities/deployment';
import { environmentQueries } from '@/entities/environment';

export const approvalQueries = {
  all: ['approvals'] as const,

  lists: () => [...approvalQueries.all, 'list'] as const,
  list: (params: GetApprovalsParams = {}) =>
    [...approvalQueries.lists(), params] as const,

  details: () => [...approvalQueries.all, 'detail'] as const,
  detail: (approvalId: string) =>
    [...approvalQueries.details(), approvalId] as const,
};

export function useApprovalsQuery(params: GetApprovalsParams = {}) {
  return useQuery({
    queryKey: approvalQueries.list(params),
    queryFn: () => getApprovals(params),
  });
}

export function useApprovalQuery(approvalId: string) {
  return useQuery({
    queryKey: approvalQueries.detail(approvalId),
    queryFn: () => getApprovalById(approvalId),
    enabled: Boolean(approvalId),
  });
}

type UseApprovalMutationParams = {
  projectId?: string;
};

export function useApproveApprovalMutation(
  params: UseApprovalMutationParams = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      approvalId,
      request,
    }: {
      approvalId: string;
      request?: ApproveApprovalRequest;
    }) => approveApproval(approvalId, request),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: approvalQueries.all,
        }),
        queryClient.invalidateQueries({
          queryKey: deploymentQueries.all,
        }),
        queryClient.invalidateQueries({
          queryKey: environmentQueries.all,
        }),
      ]);

      if (params.projectId) {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: deploymentQueries.lists(),
          }),
          queryClient.invalidateQueries({
            queryKey: environmentQueries.list(params.projectId),
          }),
        ]);
      }
    },
  });
}

export function useRejectApprovalMutation(
  params: UseApprovalMutationParams = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      approvalId,
      request,
    }: {
      approvalId: string;
      request: RejectApprovalRequest;
    }) => rejectApproval(approvalId, request),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: approvalQueries.all,
        }),
        queryClient.invalidateQueries({
          queryKey: deploymentQueries.all,
        }),
        queryClient.invalidateQueries({
          queryKey: environmentQueries.all,
        }),
      ]);

      if (params.projectId) {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: deploymentQueries.lists(),
          }),
          queryClient.invalidateQueries({
            queryKey: environmentQueries.list(params.projectId),
          }),
        ]);
      }
    },
  });
}
