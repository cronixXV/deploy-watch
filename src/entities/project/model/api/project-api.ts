import type { Project } from '@/shared/api/mocks/model/types/types';

import { apiClient } from '@/shared/api/client/client';

export async function getProjects() {
  const response = await apiClient.get<Project[]>('/projects');

  return response.data;
}

export async function getProjectById(projectId: string) {
  const response = await apiClient.get<Project>(`/projects/${projectId}`);

  return response.data;
}
