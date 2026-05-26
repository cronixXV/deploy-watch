import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  filterPipelineRunsByDateRange,
  getPipelineFiltersFromSearchParams,
  resetPipelineFilters,
  setSearchParamValue,
  type PipelineFilters,
  useProjectPipelineRunsMetaQuery,
  useProjectPipelineRunsQuery,
} from '@/entities/pipeline';
import { useProjectQuery } from '@/entities/project';
import { useUsersQuery } from '@/entities/user';

type UsePipelineRunsParams = {
  projectId?: string;
};

export const usePipelineRuns = ({ projectId }: UsePipelineRunsParams) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => getPipelineFiltersFromSearchParams(searchParams),
    [searchParams],
  );

  const projectQuery = useProjectQuery(projectId);

  const pipelineRunsQuery = useProjectPipelineRunsQuery({
    projectId,
    status: filters.status,
    branch: filters.branch,
    authorId: filters.authorId,
    environment: filters.environment,
  });

  const pipelineRunsMetaQuery = useProjectPipelineRunsMetaQuery(projectId);

  const usersQuery = useUsersQuery();

  const isLoading =
    projectQuery.isLoading ||
    pipelineRunsQuery.isLoading ||
    usersQuery.isLoading ||
    pipelineRunsMetaQuery.isLoading;

  const isError =
    projectQuery.isError ||
    pipelineRunsQuery.isError ||
    usersQuery.isError ||
    pipelineRunsMetaQuery.isError;

  const error =
    projectQuery.error ??
    pipelineRunsQuery.error ??
    usersQuery.error ??
    pipelineRunsMetaQuery.error;

  const isFetching =
    projectQuery.isFetching ||
    pipelineRunsQuery.isFetching ||
    usersQuery.isFetching ||
    pipelineRunsMetaQuery.isFetching;

  const refresh = () => {
    projectQuery.refetch();
    pipelineRunsQuery.refetch();
    usersQuery.refetch();
    pipelineRunsMetaQuery.refetch();
  };

  const handleFilterChange = (name: keyof PipelineFilters, value: string) => {
    setSearchParams(setSearchParamValue(searchParams, name, value));
  };

  const resetFilters = () => {
    setSearchParams(resetPipelineFilters());
  };

  const branches = pipelineRunsMetaQuery.data?.branches ?? [];

  const pipelineRuns = useMemo(
    () => filterPipelineRunsByDateRange(pipelineRunsQuery.data ?? [], filters),
    [pipelineRunsQuery.data, filters],
  );

  const pipelineAuthorIds = useMemo(
    () => pipelineRunsMetaQuery.data?.authorIds ?? [],
    [pipelineRunsMetaQuery.data],
  );

  const pipelineAuthors = useMemo(
    () =>
      (usersQuery.data ?? []).filter((user) =>
        pipelineAuthorIds.includes(user.id),
      ),
    [usersQuery.data, pipelineAuthorIds],
  );

  return {
    project: projectQuery.data,
    pipelineRuns,
    users: usersQuery.data ?? [],
    pipelineAuthors,
    branches,
    filters,

    isLoading,
    isError,
    isFetching,
    error,

    refresh,
    handleFilterChange,
    resetFilters,
  };
};
