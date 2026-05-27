import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  approveDeployment,
  getDeploymentById,
  getDeployments,
  getProjectDeployments,
  rejectDeployment,
  rollbackDeployment,
  type ApproveDeploymentParams,
  type GetProjectDeploymentsParams,
  type RejectDeploymentParams,
  type RollbackDeploymentRequest,
} from './deployment-api';

import type {
  Approval,
  Deployment,
} from '@/shared/api/mocks/model/types/types';

import { approvalQueries } from '@/entities/approval';
import { environmentQueries } from '@/entities/environment';

function removeApprovalFromCache(
  approvals: Approval[] | undefined,
  deploymentId: string,
) {
  return approvals?.filter(
    (approval) => approval.deploymentId !== deploymentId,
  );
}

export const deploymentQueries = {
  all: ['deployments'] as const,

  lists: () => [...deploymentQueries.all, 'list'] as const,
  list: (params: GetProjectDeploymentsParams) =>
    [...deploymentQueries.lists(), params] as const,

  details: () => [...deploymentQueries.all, 'detail'] as const,
  detail: (deploymentId: string) =>
    [...deploymentQueries.details(), deploymentId] as const,

  allList: () => [...deploymentQueries.all, 'all-list'] as const,
};

function shouldPollDeployment(deployment?: Deployment) {
  return deployment?.status === 'deploying';
}

export function useProjectDeploymentsQuery(
  params: GetProjectDeploymentsParams,
) {
  return useQuery<Deployment[]>({
    queryKey: deploymentQueries.list(params),
    queryFn: () => getProjectDeployments(params),
    enabled: Boolean(params.projectId),
    refetchInterval: (query) => {
      const deployments = query.state.data;

      if (!Array.isArray(deployments)) {
        return false;
      }

      return deployments.some(shouldPollDeployment) ? 3000 : false;
    },
  });
}

export function useDeploymentQuery(deploymentId: string) {
  return useQuery({
    queryKey: deploymentQueries.detail(deploymentId),
    queryFn: () => getDeploymentById(deploymentId),
    enabled: Boolean(deploymentId),
    refetchInterval: (query) => {
      const data = query.state.data;

      return shouldPollDeployment(data) ? 3000 : false;
    },
  });
}

type UseRollbackDeploymentMutationParams = {
  projectId?: string;
};

export function useRollbackDeploymentMutation(
  params: UseRollbackDeploymentMutationParams = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      deploymentId,
      request,
    }: {
      deploymentId: string;
      request?: RollbackDeploymentRequest;
    }) => rollbackDeployment(deploymentId, request),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: deploymentQueries.all,
        }),
        queryClient.invalidateQueries({
          queryKey: environmentQueries.all,
        }),
      ]);

      if (params.projectId) {
        await queryClient.invalidateQueries({
          queryKey: environmentQueries.list(params.projectId),
        });
      }
    },
  });
}

export function useDeploymentsQuery() {
  return useQuery({
    queryKey: deploymentQueries.allList(),
    queryFn: getDeployments,
  });
}

export function useApproveDeploymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ApproveDeploymentParams) => approveDeployment(params),

    onMutate: async ({ deploymentId }) => {
      await queryClient.cancelQueries({
        queryKey: approvalQueries.lists(),
      });

      const previousApprovalsQueries = queryClient.getQueriesData<Approval[]>({
        queryKey: approvalQueries.lists(),
      });

      queryClient.setQueriesData<Approval[]>(
        {
          queryKey: approvalQueries.lists(),
        },
        (oldApprovals) => removeApprovalFromCache(oldApprovals, deploymentId),
      );

      return {
        previousApprovalsQueries,
      };
    },

    onError: (_error, _variables, context) => {
      context?.previousApprovalsQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

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
    },
  });
}

export function useRejectDeploymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: RejectDeploymentParams) => rejectDeployment(params),

    onMutate: async ({ deploymentId }) => {
      await queryClient.cancelQueries({
        queryKey: approvalQueries.lists(),
      });

      const previousApprovalsQueries = queryClient.getQueriesData<Approval[]>({
        queryKey: approvalQueries.lists(),
      });

      queryClient.setQueriesData<Approval[]>(
        {
          queryKey: approvalQueries.lists(),
        },
        (oldApprovals) => removeApprovalFromCache(oldApprovals, deploymentId),
      );

      return {
        previousApprovalsQueries,
      };
    },

    onError: (_error, _variables, context) => {
      context?.previousApprovalsQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: approvalQueries.all,
        }),
        queryClient.invalidateQueries({
          queryKey: deploymentQueries.all,
        }),
      ]);
    },
  });
}
