import { useQuery } from '@tanstack/react-query';

import { getProjectById, getProjects } from './project-api';

export const projectQueries = {
  all: ['projects'] as const,

  lists: () => [...projectQueries.all, 'list'] as const,
  list: () => [...projectQueries.lists()] as const,

  details: () => [...projectQueries.all, 'detail'] as const,
  detail: (projectId: string) =>
    [...projectQueries.details(), projectId] as const,
};

export function useProjectsQuery() {
  return useQuery({
    queryKey: projectQueries.list(),
    queryFn: getProjects,
  });
}

export function useProjectQuery(projectId: string) {
  return useQuery({
    queryKey: projectQueries.detail(projectId),
    queryFn: () => getProjectById(projectId),
    enabled: Boolean(projectId),
  });
}
