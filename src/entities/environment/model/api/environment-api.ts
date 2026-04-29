import type { Environment } from '@/shared/api/mocks/model/types/types';

import { apiClient } from '@/shared/api/client/client';

export async function getProjectEnvironments(projectId: string) {
  const response = await apiClient.get<Environment[]>(
    `/projects/${projectId}/environments`,
  );

  return response.data;
}

export async function getEnvironmentById(environmentId: string) {
  const response = await apiClient.get<Environment>(
    `/environments/${environmentId}`,
  );

  return response.data;
}
