import { useQuery } from '@tanstack/react-query';

import {
  getPipelineRunBuilds,
  getPipelineRunById,
  getProjectPipelineRuns,
  getProjectPipelineRunsMeta,
  type GetProjectPipelineRunsParams,
} from './pipeline-api';

import type { Build, PipelineRun } from '@/shared/api/mocks/model/types/types';

export const pipelineQueries = {
  all: ['pipeline-runs'] as const,

  lists: () => [...pipelineQueries.all, 'list'] as const,
  list: (params: GetProjectPipelineRunsParams) =>
    [...pipelineQueries.lists(), params] as const,

  details: () => [...pipelineQueries.all, 'detail'] as const,
  detail: (pipelineRunId: string) =>
    [...pipelineQueries.details(), pipelineRunId] as const,

  builds: (pipelineRunId: string) =>
    [...pipelineQueries.detail(pipelineRunId), 'builds'] as const,

  meta: (projectId: string) =>
    [...pipelineQueries.all, 'meta', projectId] as const,
};

function shouldPollPipelineRun(pipelineRun?: PipelineRun) {
  return pipelineRun?.status === 'queued' || pipelineRun?.status === 'running';
}

function shouldPollBuilds(builds?: Build[]) {
  return builds?.some(
    (build) => build.status === 'queued' || build.status === 'running',
  );
}

export function useProjectPipelineRunsQuery(
  params: GetProjectPipelineRunsParams,
) {
  return useQuery({
    queryKey: pipelineQueries.list(params),
    queryFn: () => getProjectPipelineRuns(params),
    enabled: Boolean(params.projectId),
    refetchInterval: (query) => {
      const data = query.state.data;

      const hasActivePipeline = data?.some((pipelineRun) =>
        shouldPollPipelineRun(pipelineRun),
      );

      return hasActivePipeline ? 3000 : false;
    },
  });
}

export function usePipelineRunQuery(pipelineRunId: string) {
  return useQuery({
    queryKey: pipelineQueries.detail(pipelineRunId),
    queryFn: () => getPipelineRunById(pipelineRunId),
    enabled: Boolean(pipelineRunId),
    refetchInterval: (query) => {
      const data = query.state.data;

      return shouldPollPipelineRun(data) ? 3000 : false;
    },
  });
}

export function usePipelineRunBuildsQuery(pipelineRunId: string) {
  return useQuery({
    queryKey: pipelineQueries.builds(pipelineRunId),
    queryFn: () => getPipelineRunBuilds(pipelineRunId),
    enabled: Boolean(pipelineRunId),
    refetchInterval: (query) => {
      const data = query.state.data;

      return shouldPollBuilds(data) ? 3000 : false;
    },
  });
}
export function useProjectPipelineRunsMetaQuery(projectId: string) {
  return useQuery({
    queryKey: pipelineQueries.meta(projectId),
    queryFn: () => getProjectPipelineRunsMeta(projectId),
    enabled: Boolean(projectId),
  });
}
