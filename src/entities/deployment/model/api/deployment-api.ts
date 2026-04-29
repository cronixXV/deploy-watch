import type {
  Deployment,
  DeploymentStatus,
  EnvironmentName,
} from '@/shared/api/mocks/model/types/types';

import { apiClient } from '@/shared/api/client/client';

export type GetProjectDeploymentsParams = {
  projectId: string;
  status?: DeploymentStatus;
  environment?: EnvironmentName;
  branch?: string;
};

export type RollbackDeploymentRequest = {
  reason?: string;
};

export type RollbackDeploymentResponse = {
  deployment: Deployment;
  rollbackDeployment: Deployment;
  reason: string | null;
};

export async function getProjectDeployments({
  projectId,
  status,
  environment,
  branch,
}: GetProjectDeploymentsParams) {
  const response = await apiClient.get<Deployment[]>(
    `/projects/${projectId}/deployments`,
    {
      params: {
        status,
        environment,
        branch,
      },
    },
  );

  return response.data;
}

export async function getDeploymentById(deploymentId: string) {
  const response = await apiClient.get<Deployment>(
    `/deployments/${deploymentId}`,
  );

  return response.data;
}

export async function rollbackDeployment(
  deploymentId: string,
  request: RollbackDeploymentRequest = {},
) {
  const response = await apiClient.post<RollbackDeploymentResponse>(
    `/deployments/${deploymentId}/rollback`,
    request,
  );

  return response.data;
}
