import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getDeploymentById,
  getProjectDeployments,
  rollbackDeployment,
  type GetProjectDeploymentsParams,
  type RollbackDeploymentRequest,
} from './deployment-api';

import type { Deployment } from '@/shared/api/mocks/model/types/types';

import { environmentQueries } from '@/entities/environment';

export const deploymentQueries = {
  all: ['deployments'] as const,

  lists: () => [...deploymentQueries.all, 'list'] as const,
  list: (params: GetProjectDeploymentsParams) =>
    [...deploymentQueries.lists(), params] as const,

  details: () => [...deploymentQueries.all, 'detail'] as const,
  detail: (deploymentId: string) =>
    [...deploymentQueries.details(), deploymentId] as const,
};

function shouldPollDeployment(deployment?: Deployment) {
  return deployment?.status === 'deploying';
}

export function useProjectDeploymentsQuery(
  params: GetProjectDeploymentsParams,
) {
  return useQuery({
    queryKey: deploymentQueries.list(params),
    queryFn: () => getProjectDeployments(params),
    enabled: Boolean(params.projectId),
    refetchInterval: (query) => {
      const data = query.state.data;

      const hasActiveDeployment = data?.some((deployment) =>
        shouldPollDeployment(deployment),
      );

      return hasActiveDeployment ? 3000 : false;
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
