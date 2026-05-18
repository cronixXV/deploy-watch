import { useBuildQuery } from '@/entities/build';
import { usePipelineRunQuery, getUserDisplayName } from '@/entities/pipeline';
import { useUsersQuery } from '@/entities/user';

type UseBuildDetailsParams = {
  buildId?: string;
};

export function useBuildDetails({ buildId }: UseBuildDetailsParams) {
  const safeBuildId = buildId ?? '';

  const buildQuery = useBuildQuery(safeBuildId);

  const pipelineId = buildQuery.data?.pipelineId ?? '';

  const pipelineRunQuery = usePipelineRunQuery(pipelineId);
  const usersQuery = useUsersQuery();

  const isLoading =
    buildQuery.isLoading ||
    (Boolean(pipelineId) && pipelineRunQuery.isLoading) ||
    usersQuery.isLoading;

  const isError =
    buildQuery.isError || pipelineRunQuery.isError || usersQuery.isError;

  const error = buildQuery.error ?? pipelineRunQuery.error ?? usersQuery.error;

  const isFetching =
    buildQuery.isFetching ||
    pipelineRunQuery.isFetching ||
    usersQuery.isFetching;

  const refresh = () => {
    buildQuery.refetch();
    pipelineRunQuery.refetch();
    usersQuery.refetch();
  };

  const pipelineRun = pipelineRunQuery.data;
  const build = buildQuery.data;

  const authorName = getUserDisplayName(usersQuery.data, pipelineRun?.authorId);

  return {
    build,
    pipelineRun,
    authorName,
    isLoading,
    isError,
    isFetching,
    error,
    refresh,
  };
}
