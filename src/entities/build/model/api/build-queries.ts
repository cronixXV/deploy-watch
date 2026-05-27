import { useQuery } from '@tanstack/react-query';

import {
  getBuildById,
  getBuildLogs,
  getProjectBuilds,
  type GetBuildLogsParams,
  type GetProjectBuildsParams,
} from './build-api';

import type { Build } from '@/shared/api/mocks/model/types/types';

import { useAppSelector } from '@/app/store/hooks';

export const buildQueries = {
  all: ['builds'] as const,

  lists: () => [...buildQueries.all, 'list'] as const,
  list: (params: GetProjectBuildsParams) =>
    [...buildQueries.lists(), params] as const,

  details: () => [...buildQueries.all, 'detail'] as const,
  detail: (buildId: string) => [...buildQueries.details(), buildId] as const,

  logs: (params: GetBuildLogsParams) =>
    [...buildQueries.detail(params.buildId), 'logs', params] as const,
};

function shouldPollBuild(build?: Build) {
  return build?.status === 'queued' || build?.status === 'running';
}

export function useProjectBuildsQuery(params: GetProjectBuildsParams) {
  return useQuery({
    queryKey: buildQueries.list(params),
    queryFn: () => getProjectBuilds(params),
    enabled: Boolean(params.projectId),
    refetchInterval: (query) => {
      const data = query.state.data;

      const hasActiveBuild = data?.some((build) => shouldPollBuild(build));

      return hasActiveBuild ? 3000 : false;
    },
  });
}

export function useBuildQuery(buildId: string) {
  const pollingInterval = useAppSelector(
    (state) => state.settings.pollingInterval,
  );

  return useQuery({
    queryKey: buildQueries.detail(buildId),
    queryFn: () => getBuildById(buildId),
    enabled: Boolean(buildId),
    refetchInterval: (query) => {
      const build = query.state.data;

      const isLiveBuild =
        build?.status === 'queued' || build?.status === 'running';

      return isLiveBuild ? pollingInterval : false;
    },
  });
}
export function useBuildLogsQuery(params: GetBuildLogsParams) {
  return useQuery({
    queryKey: buildQueries.logs(params),
    queryFn: () => getBuildLogs(params),
    enabled: Boolean(params.buildId),
    refetchInterval: 3000,
  });
}
