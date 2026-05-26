import { Card, Grid, Stack } from '@chakra-ui/react';

import { useEnvironments } from '../model/use-environments';

import { EnvironmentCard } from './environment-card';
import { EnvironmentsHeader } from './environments-header';

import { EmptyState } from '@/shared/ui/empty-state/ui/empty-state';
import { PageErrorState } from '@/shared/ui/page-error-state/ui/page-errors-state';
import { SkeletonLoader } from '@/shared/ui/skeleton/skeleton-loader';

type EnvironmentsProps = {
  projectId?: string;
};

export const Environments = ({ projectId }: EnvironmentsProps) => {
  const {
    project,
    environments,
    users,
    isLoading,
    isError,
    isFetching,
    error,
    refresh,
  } = useEnvironments({ projectId });

  if (!projectId) {
    return (
      <PageErrorState
        title="Environments"
        message="Project route param is missing."
      />
    );
  }

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (isError) {
    return (
      <PageErrorState
        title="Environments"
        message="Failed to load environments"
        error={error}
        isFetching={isFetching}
        onRetry={refresh}
      />
    );
  }

  return (
    <Stack gap="6">
      <EnvironmentsHeader
        projectName={project?.name}
        isFetching={isFetching}
        onRefresh={refresh}
      />

      {environments.length ? (
        <Grid
          gap="4"
          templateColumns={{
            base: '1fr',
            xl: 'repeat(2, minmax(0, 1fr))',
          }}
        >
          {environments.map((environment) => (
            <EnvironmentCard
              key={environment.id}
              environment={environment}
              users={users}
            />
          ))}
        </Grid>
      ) : (
        <Card.Root bg="white" borderColor="gray.200" shadow="sm">
          <Card.Body>
            <EmptyState>
              Once environments are configured, they will appear here.
            </EmptyState>
          </Card.Body>
        </Card.Root>
      )}
    </Stack>
  );
};
