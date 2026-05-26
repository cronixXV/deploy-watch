import { useProjectEnvironmentsQuery } from '@/entities/environment';
import { useProjectQuery } from '@/entities/project';
import { useUsersQuery } from '@/entities/user';

type UseEnvironmentsParams = {
  projectId?: string;
};

export const useEnvironments = ({ projectId }: UseEnvironmentsParams) => {
  const safeProjectId = projectId ?? '';

  const projectQuery = useProjectQuery(safeProjectId);
  const environmentsQuery = useProjectEnvironmentsQuery(safeProjectId);
  const usersQuery = useUsersQuery();

  const isLoading =
    projectQuery.isLoading ||
    environmentsQuery.isLoading ||
    usersQuery.isLoading;

  const isError =
    projectQuery.isError || environmentsQuery.isError || usersQuery.isError;

  const error =
    projectQuery.error ?? environmentsQuery.error ?? usersQuery.error;

  const isFetching =
    projectQuery.isFetching ||
    environmentsQuery.isFetching ||
    usersQuery.isFetching;

  const refresh = () => {
    projectQuery.refetch();
    environmentsQuery.refetch();
    usersQuery.refetch();
  };

  return {
    project: projectQuery.data,
    environments: environmentsQuery.data ?? [],
    users: usersQuery.data ?? [],
    isLoading,
    isError,
    isFetching,
    error,
    refresh,
  };
};
