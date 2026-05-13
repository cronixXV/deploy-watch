import { useProjectDeploymentsQuery } from '@/entities/deployment';
import {
  usePipelineRunBuildsQuery,
  usePipelineRunQuery,
} from '@/entities/pipeline';
import {
  getRelatedDeployment,
  getUserDisplayName,
} from '@/entities/pipeline/lib/pipeline-details';
import { useUsersQuery } from '@/entities/user';

type UsePipelineDetailsParams = {
  projectId: string;
  pipelineId: string;
};

export const usePipelineDetails = ({
  projectId,
  pipelineId,
}: UsePipelineDetailsParams) => {
  const pipelineRunQuery = usePipelineRunQuery(pipelineId);
  const pipelineJobsQuery = usePipelineRunBuildsQuery(pipelineId);
  const usersQuery = useUsersQuery();

  const deploymentsQuery = useProjectDeploymentsQuery({
    projectId,
  });

  const isLoading =
    pipelineRunQuery.isLoading ||
    pipelineJobsQuery.isLoading ||
    usersQuery.isLoading ||
    deploymentsQuery.isLoading;

  const isError =
    pipelineRunQuery.isError ||
    pipelineJobsQuery.isError ||
    usersQuery.isError ||
    deploymentsQuery.isError;

  const error =
    pipelineRunQuery.error ??
    pipelineJobsQuery.error ??
    usersQuery.error ??
    deploymentsQuery.error;

  const isFetching =
    pipelineRunQuery.isFetching ||
    pipelineJobsQuery.isFetching ||
    usersQuery.isFetching ||
    deploymentsQuery.isFetching;

  const pipelineRun = pipelineRunQuery.data;

  const relatedDeployment = getRelatedDeployment({
    pipelineRun,
    deployments: deploymentsQuery.data,
  });

  const authorName = getUserDisplayName(usersQuery.data, pipelineRun?.authorId);

  const triggeredByName = getUserDisplayName(
    usersQuery.data,
    pipelineRun?.triggeredById,
  );

  const refresh = () => {
    pipelineRunQuery.refetch();
    pipelineJobsQuery.refetch();
    usersQuery.refetch();
    deploymentsQuery.refetch();
  };

  return {
    pipelineRun,
    jobs: pipelineJobsQuery.data ?? [],
    relatedDeployment,
    authorName,
    triggeredByName,
    isLoading,
    isError,
    isFetching,
    error,
    refresh,
  };
};
