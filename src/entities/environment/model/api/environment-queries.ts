import { useQuery } from '@tanstack/react-query';

import { getEnvironmentById, getProjectEnvironments } from './environment-api';

export const environmentQueries = {
  all: ['environments'] as const,

  lists: () => [...environmentQueries.all, 'list'] as const,
  list: (projectId: string) =>
    [...environmentQueries.lists(), projectId] as const,

  details: () => [...environmentQueries.all, 'detail'] as const,
  detail: (environmentId: string) =>
    [...environmentQueries.details(), environmentId] as const,
};

export function useProjectEnvironmentsQuery(projectId: string) {
  return useQuery({
    queryKey: environmentQueries.list(projectId),
    queryFn: () => getProjectEnvironments(projectId),
    enabled: Boolean(projectId),
    refetchInterval: 5000,
  });
}

export function useEnvironmentQuery(environmentId: string) {
  return useQuery({
    queryKey: environmentQueries.detail(environmentId),
    queryFn: () => getEnvironmentById(environmentId),
    enabled: Boolean(environmentId),
    refetchInterval: 5000,
  });
}
